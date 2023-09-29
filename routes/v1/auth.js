const express = require('express');
const { logger } = require('../../utils');
const { logaUsuario } = require('../../services');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const jwt = await logaUsuario(email, senha);

        res.status(200).json({
            sucesso: true,
            jwt: jwt,
        });
    } catch (e) {
        logger.error(`Error Authentication ${e.message}`);

        res.status(401).json({
            sucesso: false,
            erro: 'Email/pass invalid',
        })

    }
});

module.exports = router;