const { Usuario } = require('../models');

const checaSaldo = async (usuario) => {
    const operacoes = (await Usuario.aggregate([
        { $match: { cpf: usuario.cpf } },
        {
            $unwind: {
                path: '$moedas',
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $project: {
                'moedas.quantidade': 1,
                'moedas.codigo': 1,
            }
        },
        {
            $lookup: {
                from: 'cotacaos',
                localField: 'moeda.codigo',
                foreignField: 'moeda',
                as: 'cotacoes'
            }
        },
        {
            $project: {
                quantidade: '$moedas.quantidade',
                codigo: '$moedas.codigo',
                cotacao: {
                    $first: {
                        $sortArray: { input: '$cotacoes', sortBy: { data: -1 } }
                    }
                }
            }
        },
        {
            $project: {
                totalBrl: {
                    $multiply: ['$quantidade', { $ifNull: [ '$cotacao.valor', 1 ] }],
                },
                codigo: 1,
            }
        }
    ]));

    return operacoes.reduce((acc, operacao) => acc + operacao.totalBrl, 0);
}

module.exports = checaSaldo;