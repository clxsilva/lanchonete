/**
 * Modelo de dados (coleção)
 * Lanches
 */

// importação da biblioteca
const { model, Schema } = require('mongoose')

// criação da estrutura de dados ("coleção") que será usada no banco
const lancheSchema = new Schema({
    nomeLanche: {
        type: String,
        unique: true,
        index: true
    },
    descLanche: {
        type: String
    },
    precoLanche: {
        type: String
    },
    imgLanche: {
        type: String
    }
}, {versionKey: false})

// importação do modelo de dados
// obs: Lanches será o nome da coleção (mongodb -> clientes)
module.exports = model('Lanches', lancheSchema)