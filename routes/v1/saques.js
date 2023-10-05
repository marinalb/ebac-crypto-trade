const express = require('express');

const { logger } = require('../../utils');
const { checaSaldo } = require('../../services');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        sucesso: true,
        saques: req.user.saques,
    });
});

router.post('/', async (req, res) => {
    const usuario = req.user;

    try {
        const valor = req.body.valor;
        const saldo = await checaSaldo(usuario);

        if (saldo < valor) {
            throw new Error('Not enought money.');
        }

        usuario.saques.push({ valor: valor, data: new Date() });
        await usuario.save();
        res.json({
            sucesso: true,
            saldo: saldo - valor,
            saques: usuario.saques,
        })
    } catch (e) {
        logger.error(`Error ${e.message}`)
        
        res.status(422).json({
            sucesso: false,
            erro: e.message,
        })
    }
})
module.exports  = router;