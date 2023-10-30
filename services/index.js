module.exports = {
    criaUsuario: require('./cria-usuario'),
    logaUsuario: require('./loga-usuario'),
    checaSaldo: require('./checa-saldo'),
    trocaMoedas: require('./troca-moedas'),
    geraPnl: require('./gera-pnl'),
    sacaCrypto: require('./saca-crypto'),
    analisaCotacoes: require('./analisa-cotacoes').analisaCotacoes,
    analisaCotacoesNoBanco: require('./analisa-cotacoes').analisaCotacoesNoBanco,
    buscaCotacoesOnline: require('./busca-cotacoes').buscaCotacoesOnline,
    buscaCotacoesNoBanco: require('./busca-cotacoes').buscaCotacoesNoBanco,
};