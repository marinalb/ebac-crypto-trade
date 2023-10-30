const { Usuario } = require("../models");
const { checaSaldo } = require("../services");
const { logger } = require('../utils');

const relatorioWorker = async (_, done) => {
    try {
        logger.info('Buscando todos os usuarios da base...');

        let temMaisUsuarios = true;
        let skip = 0;

        while (temMaisUsuarios) {
            const usuarios = await Usuario.find().skip(skip).limit(10);

            if(!usuarios.length) {
                temMaisUsuarios = false;
            }

            for (const usuario of usuarios) {
                logger.info(`Report to ${usuario._id}`);

                await Relatorio.create({
                    usuarioId: usuario._id,
                    date: new Date(),
                    saldo: await checaSaldo(usuario),
                });
            }
            skip += 10;
        }
        logger.info('Success!!');
        done();
    } catch (err) {
        logger.error(`Error on processing`);
        done(err);
    }
};

module.exports = relatorioWorker;