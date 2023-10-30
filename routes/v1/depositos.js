const express = require('express');

const { Usuario } = require('../../models');

const { logger } = require('../../utils');
const { checaSaldo } = require('../../services');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        sucesso: true,
        depositos: req.user.depositos,
    });
});

router.post('/', async (req, res) => {
    const usuario = req.user;

    try {
        const valor = req.body.valor;
        usuario.depositos.push({ valor: valor, data: new Date() });

        const saldoEmMoedas = usuario.moedas.find(m => m.codigo === 'BRL');
        if (saldoEmMoedas) {
            saldoEmMoedas.quantidade += valor;
        } else {
            usuario.moedas.push({ codigo: 'BRL', quantidade: valor});
        }
        await usuario.save();

        res.json({
            sucesso: true,
            saldo: await checaSaldo(usuario),
            depositos: usuario.depositos,
        });
    } catch (e) {
        logger.error(`Error on deposit ${e.message} `);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

//cancela deposito;
router.patch('/:id', async (req, res) => {
    const usuario = req.user;

    try {
        await Usuario.updateOne(
            { _id: usuario._id, 'depositos._id': req.params.id },
            { $set: { 'depositos.$.cancelado': true } },
            { usuario: usuario.save() }
        );

        res.json({
            sucesso: true,
            depositos: usuario.depositos,
        });
    } catch (e) {
        logger.error(`Error on CANCEL deposit ${e.message} `);

        res.status(422).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

//delete deposito
router.delete('/:id', async (req, res) => {
    const usuario = req.user;
    try {
        usuario.depositos.pull({ _id: req.params.id });
        await usuario.save();

        res.json({
            sucesso: true,
            depositos: usuario.depositos,
        });
    } catch (e) {
        logger.error(`Error on delete deposit ${e.message} `);
        res.status(404).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;