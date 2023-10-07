const { Cotacao } = require('../models');
const { buscaCotacoesOnline } = require('../services');
const { logger } = require('../utils');

const cotacoesWorker = async (_job, done) => {
    try {

        logger.info(`Search for currency... Attempt ${_job.attemptsMade + 1}/${_job.opts.attempts}`);

        const cotacoes = await buscaCotacoesOnline();
        logger.info('Currency return succesfully');

        await Cotacao.insertMany(cotacoes);

        logger.info('Added!');

        done();
    } catch (err) {
        logger.error(`Error on Job ${err.message}`);
        done(err);
    }
};

module.exports = cotacoesWorker;
