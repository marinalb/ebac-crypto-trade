const axios = require('axios');
const { Top } = require('../models')

const analisaCotacoes = async () => {
    const url = `${process.env.COIN_MARKETCAP_URL}/v2/cryptocurrency/quotes/latest`;


    const { data } = await axios.get(url, {
        params: {
            symbol: 'BTC,ETH,BNB,XRP,ADA,SOL,LEO,USDT,DOGE,TON,MATIC',
            convert: 'BRL'
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COIN_MARKETCAP_KEY
        }
    })

    const info = Object.values(data.data);

    return info.map(([top]) => ({
        moeda: top.symbol,
        variacao: top.quote.BRL.percent_change_24h,
        data: top.last_updated,
    }));
};

const analisaCotacoesNoBanco = async () => {
    return await Top.aggregate([
        { "$sort": { "data": -1 } },
        {
            "$group": {
                "_id": { "moeda": "$moeda" },
                "data": { "$first": "$data" },
                "moeda": { "$first": "$moeda" },
                "variacao": { "$first": "$variacao" },
            }
        },
        { "$unset": "_id" }
    ])
};

module.exports = {
    analisaCotacoes,
    analisaCotacoesNoBanco,
};