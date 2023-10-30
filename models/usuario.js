const { Schema } = require('mongoose');
const { cpf } = require('cpf-cnpj-validator'); 

const MoedasSchema = new Schema ({
    quantidade: {
        type: Number,
        required: true,
    },
    codigo: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
    }
});

const SaqueSchema = new Schema({
    valor: {
        type: Number,
        required: true,
        min: 1,
    },
    data: {
        type: Date,
        required: true,
    }
});

const DepositoSchema = new Schema ({
    valor: {
        type: Number,
        required: true,
        min: 100,
    },
    data: {
        type: Date,
        required: true,
    },
    cancelado: {
        type: Boolean,
        required: false,
    },
});

const UsuarioSchema = new Schema ({
    nome: {
        type: String,
        required: true,
        min: 4,
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v){
                return cpf.isValid(v);
            },
            message: props => `${props.value} cpf not valid`,

        }
    },
    email: {
        type: String,
        required: true,
        min: 4,
        unique: true,
        validate: {
            validator: function(v) {
                return v.match('@');
            },
            message: props => `${props.value} not a valid email`,
        },
    },
    senha: {
        type: String,
        required: true,
        select: false,
    },
    depositos: [DepositoSchema],
    saques: [SaqueSchema],
    moedas: [MoedasSchema],
    
});

module.exports = UsuarioSchema;