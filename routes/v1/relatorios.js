const express = require('express');
const { logger } = require('../../utils');

const router = express.Router();

router.get('/pnl', async(req, res) => {
    try {
        const pnl = await geraPnl(req.user);

        res.json({
            sucesso: true,
            pnl: pnl,
        });
    } catch (e) {
        logger.error(`Error on reports ${e.message}`);

        res.status(500).json({
            sucesso: false,
            erro: e.message,
        });
    }
});

module.exports = router;