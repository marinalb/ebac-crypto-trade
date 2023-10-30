const Queue = require('bull');

const cotacoesWorker = require('./cotacoes');
const analiseWorker = require('./analisa');
const saldoWorker = require('./saldo');
const relatoriosWorker = require('./relatorios');

const cotacoesQueue = new Queue('busca-cotacoes', process.env.REDIS_URL);
const analisaQueue = new Queue('analisa-cotacoes', process.env.REDIS_URL);
const aumentaSaldoQueue = new Queue('aumenta-saldo', process.env.REDIS_URL);
const relatoriosQueue = new Queue('relatorios', process.env.REDIS_URL);


cotacoesQueue.process(cotacoesWorker);
analisaQueue.process(analiseWorker);
aumentaSaldoQueue.process(saldoWorker);
relatoriosQueue.process(relatoriosWorker);

const agendaTarefas = async () => {
    const cotacoesAgendadas = await cotacoesQueue.getRepeatableJobs();
    const analisesAgendadas = await analisaQueue.getRepeatableJobs();

    for (const jobDeBusca of cotacoesAgendadas) {
        await cotacoesQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    cotacoesQueue.add({},
        {
            repeat: { cron: '0/15 * * * *' },
            attempts: 3,
            backoff: 5000,
        }
    );

    for (const jobDeBusca of analisesAgendadas) {
        await analisaQueue.removeRepeatableByKey(jobDeBusca.key);
    }

    analisaQueue.add({},
        {
            repeat: { cron: '0/15 * * * 5' },
            attempts: 1,
            backoff: 5000,
        }
    );

    aumentaSaldoQueue.add({},
        {
            repeat: { cron: '0 0 * * *'},
            attempts: 3,
            backoff: 5000,
        }  
    );

    relatoriosQueue.add({},
        {
            repeat: { cron: '0 0 * * *'},
            attempts: 3,
            backoff: 5000,
        }  
    );
};

module.exports = { agendaTarefas };