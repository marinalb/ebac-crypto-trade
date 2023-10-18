const { Top } = require('../models');
const { analisaCotacoesNoBanco } = require('../services');
const { logger } = require('../utils');

const analiseWorker = async (_job, done) => {
    try {

        logger.info(`Search for currency... Attempt ${_job.attemptsMade + 1}/${_job.opts.attempts}`);

        const analisa = await analisaCotacoesNoBanco();
        logger.info('Currency return succesfully');

        await Top.insertMany(analisa);

        logger.info('Added!');

        done();
    } catch (err) {
        logger.error(`Error on Job ${err.message}`);
        done(err);
    }
};

module.exports = analiseWorker;
