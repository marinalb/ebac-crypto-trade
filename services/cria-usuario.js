const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

const criaUsuario = async(usuario) => {
    if(!usuario.senha){
        throw new Error('PASS is MANDATORY');
    }
    if (usuario.senha.lenght <= 4) {
        throw new Error('PASS WIHT MIN OF 5 CHARACTERS');''
    }

    const hashSenha = await bcrypt.hash(usuario.senha, 10);

    usuario.senha = hashSenha;
    const { senha, ...usuarioSalvo } = (await Usuario.create(usuario))._doc;

    return usuarioSalvo;
};

module.exports = criaUsuario;