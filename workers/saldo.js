const { Corretora } = require('../models');
const { CNPJ, RESERVA_MINIMA } = require('../constants');
const { logger } = require('../utils');

const saldoWorker = async (job, done) => {
   
   try {
    logger.info(`Checking balance... Attempt ${_job.attemptsMade + 1}/${_job.opts.attempts}`);

    const corretora = await Corretora.findOne({
            cnpj: CNPJ,
    });

    if (corretora.caixa < RESERVA_MINIMA) {
        corretora.caixa += RESERVA_MINIMA;
    }

    await corretora.save();
    logger.info('Updated!');
    done();
    } catch (err) {
        logger.error(`Error on Job ${err.message}`);
        done(err);
    }
};

module.exports = saldoWorker;