module.exports = {
    criaUsuario: require('./cria-usuario'),
    logaUsuario: require('./loga-usuario'),
    checaSaldo: require('./checa-saldo'),
    analisaCotacoes: require('./analisa-cotacoes').analisaCotacoes,
    analisaCotacoesNoBanco: require('./analisa-cotacoes').analisaCotacoesNoBanco,
    buscaCotacoesOnline: require('./busca-cotacoes').buscaCotacoesOnline,
    buscaCotacoesNoBanco: require('./busca-cotacoes').buscaCotacoesNoBanco,
};