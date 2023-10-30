const mongoose = require('mongoose');

const UsuarioSchema = require('./usuario');
const CotacaoSchema = require('./cotacao');
const TopSchema = require('./top');
const CorretoraSchema = require('./corretora');
const RelatorioSchema = require('./relatorio');

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Cotacao = mongoose.model('Cotacao', CotacaoSchema);
const Top = mongoose.model('Top', TopSchema);
const Corretora = mongoose.model('Corretora', CorretoraSchema);
const Relatorio = mongoose.model('Relatorio', RelatorioSchema);

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
  connect,
  Usuario,
  Cotacao,
  Top,
  Corretora,
  Relatorio,
}
