// importação do módulo de conecção (database.js)
const { trusted } = require('mongoose')
const { conectar, desconectar } = require('./database.js')

// importação do modelo de dados de lanches
const lancheModel = require('./src/models/lanches.js')

// importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')

// CRUD Create (função para adicionar um novo lanche (ou qualquer outro objeto))
const criarLanche = async (nomeLan, descLan, precoLan, imgLan) => {
    try {
        const novoLanche = new lancheModel(
            {
                nomeLanche: nomeLan,
                descLanche: descLan,
                precoLanche: precoLan,
                imgLanche: imgLan
            }
        )
        // a linha abaixo salva os dados do lanche no banco
        await novoLanche.save()
        console.log("Lanche catalogado com sucesso.")
    } catch (error) {
        // tratamento de exceções específicas
        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}

// CRUD Read - Função parea listar todos os lanches cadastrados
const listarLanches = async () => {
    try {
        // a linha abaixo lista todos os lanches cadastrados
        const lanches = await lancheModel.find().sort(
            {
                nomeLanche: 1
            }
        )
        console.log(lanches)
    } catch (error) {
        console.log(error)
    }
}

// CRUD Read - Função para buscar um lanche especifico
const buscarLanche = async (nome) => {
    try {
        // find() buscar
        // nomeLanches: new RegExp(nome) filtro pelo nome
        // 'i' insensitive (ignorar letras maiúsculas ou minúsculas)
        const lanche = await lancheModel.find(
            {
                nomeLanche: new RegExp(nome, 'i')
            }
        )
        // calcular a similaridade entre os nomes retornnados e o nome pesquisado
        const nomesLanches = lanche.map(lanche => lanche.nomeLanche)
        // validação (se não existir o lanche pesquisado)
        if (nomesLanches.length === 0) {
            console.log("Lanche não catalogado")
        } else {
            const match = stringSimilarity.findBestMatch(nome, nomesLanches)

            // lanche com melhor similaridade
            const melhorLanche = lanche.find(lanche => lanche.nomeLanche === match.bestMatch.target)
            //formatação da data 
            const lancheFormatado = {
                nomeLanche: melhorLanche.nomeLanche,
                descLanche: melhorLanche.descLanche,
                precoLanche: melhorLanche.precoLanche,
                imgLanche: melhorLanche.imgLanche
            }
            console.log(lancheFormatado)
        }

    } catch (error) {
        console.log(error)
    }
}

// Crud Update - Função para alterar os dados de um lanche
// ATENÇÃo !!! Obrigatoriamente o update precisa ser feito com base no ID do lanche
const atualizarLanche = async (id, nomeLan, descLan, precoLan, imgLan) => {
    try {
        const lanche = await lancheModel.findByIdAndUpdate(
            id,
            {
                nomeLanche: nomeLan,
                descLanche: descLan,
                precoLanche: precoLan,
                imgLanche: imgLan
            },
            {
                new: true,
                runValidators: true
            }
        )
        // validação (retorno do banco)
        if (!lanche) {
            console.log("Lanche não encontrado")
        }
    } catch (error) {
        console.log(error)
    }
}

// CRUD Delete - Função para excluir um lanche
// ATENÇÃO !!! Obrigatoriamente a exclusão é feita pelo ID
const deletarLanche = async (id) => {
    try {
        // a linha abaixo exclui o lanche do banco de dados
        const lanche = await lancheModel.findByIdAndDelete(id)
        // validação
        if (!lanche) {
            console.log("Lanche não encontrado")
        } else {
            console.log("Lanche deletado")
        }
    } catch (error) {
        console.log(error)
    }
}

// execução da aplicação
const app = async () => {
    await conectar()

    // CRUD - Create
    //await criarLanche("Giga Mac", "2 hamburguer, tomate, alface, queijo e cebola", "34,99", "Imagem Ilutrastiva:")

    // CRUD - Read (Exemplo 1 - listar lanche)
    //await listarLanches()

    // CRUD - Read (Exemplo 2 - buscar lanche pelo nome)
    //await buscarLanche("Giga Mac")

    // CRUD - Update
    //await atualizarLanche("67be697fc58a72ac6bcac57e", "Giga Mac", "3 hamburguer, tomate, alface, queijo e cebola", "38,99", "Imagem Ilutrastiva:")

    //await buscarLanche("Giga Mac")

    //await deletarLanche("67be697fc58a72ac6bcac57e")

    await desconectar()
}

console.clear()
app()