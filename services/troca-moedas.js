const { CNPJ, TAXA_DE_TROCA } = require('../constants');
const { Cotacao, Corretora } = require('../models');

const buscaCotacao = async(cotacaoId) => {
    const cotacao = await Cotacao.findOne({
        _id: cotacaoId,
        data: {
            $gte: new Date((new Date()).valueOf() - 6000 * 15),
        }
    });
    if (!cotacao) {
        throw new Error('Invalid currency');
    }

    return cotacao;
};

const trocaMoedas = async (usuario, cotacaoId, quantidade, operacao) => {
    if (!quantidade || !operacao) {
        throw new Error ('you should inform the right ammount');

    }

    //exist?
    const cotacaoValida = await buscaCotacao(cotacaoId);

    //can we pay?
    const reaisNecessarios = (cotacaoValida.valor * quantidade);
    const corretora = await Corretora.findOne({ cnpj: CNPJ });
    if (corretora.caixa < reaisNecessarios) {
        throw new Error ('Value too BIG');
    }

    //does the user have money?
    const moedaEmReais = usuario.moedas.find(m => m.codigo === 'BRL');
    const moedaEmCrypto = usuario.moedas.find(m => m.codigo === cotacaoValida.moeda);
    const taxaCorretora = TAXA_DE_TROCA * quantidade;

    if (operacao === 'compra') {
        if (!moedaEmReais || moedaEmReais.quantidade < reaisNecessarios){
            throw new Error ('YOU HAVE NO MONEY');
        }
        if (moedaEmCrypto) {
            moedaEmCrypto.quantidade += (quantidade - taxaCorretora);
    } else {
        usuario.moeda.push({
            codigo: cotacaoValida.moeda,
            quantidade: quantidade - taxaCorretora,
            });
        }
    } else {
        if (!moedaEmCrypto || moedaEmCrypto.quantidade < quantidade) {
            throw new Error ('YOU HAVE NO MONEY')
        }

        moedaEmReais.quantidade += (reaisNecessarios - taxaCorretora * cotacaoValida.valor);
        moedaEmCrypto.quantidade -= quantidade;
    }

    await usuario.save();

    corretora.caixa +=taxaCorretora * cotacaoValida.valor;
    await corretora.save();

    return usuario.moedas;

};

module.exports = trocaMoedas;