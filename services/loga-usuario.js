const  jsonWebToken  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario } = require("../models");

const logaUsuario = async(email, senha) => {
    if(!senha || !email) {
        throw new Error ('PASS/EMAIL ARE MANDATORY');
    }

    const usuario = await Usuario.findOne({email: email}).select('senha');

    if(!usuario) {
        throw new Error('USUARIO NOT FOUND');
    }

    if (!await bcrypt.compare(senha, usuario.senha)) {
        throw new Error('INVALID PASS');
    }

    return jsonWebToken.sign({id: usuario._id}, process.env.JWT_SECRET_KEY);
};

module.exports = logaUsuario;