const { Schema } = require('mongoose');

const TopSchema = new Schema({
    data: {
        type: Date,
        required: true,
    },
    variacao: {
        type: Object,
        required: true
    },
    topGainers: {
        type: Object,
        required: true
    },
    topLoosers: {
        type: Object,
        required: true
    },
});

module.exports = TopSchema;