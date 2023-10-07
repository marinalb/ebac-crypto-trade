const express = require('express');

const { buscaCotacoesNoBanco } = require('../../services');
const { logger } = require('../../utils');

const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const cotacoes = await buscaCotacoesNoBanco();

        res.json({
            sucesso: true,
            cotacoes,
        });
    } catch (e) {
        logger.error(`Error on currency ${e.message}`);

        res.status(500).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;