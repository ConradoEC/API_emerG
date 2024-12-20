const express = require('express')
const path = require('path')
const crypto = require('crypto')
const routes = express.Router()
const mysql = require('mysql2')
const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
const mongodb = require('mongodb')
const Grid = require('gridfs-stream')


// O multer-gridfs-storage recebe o arquivo e o passa para o GridFS.
// O GridFS divide o arquivo em chunks menores e armazena cada chunk na coleção fs.chunks
// const GridFsStorage = require('multer-gridfs-storage').GridFsStorage
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage
const {connectionMongoDB} = require('../bd_access/connectionMongoDB.js')
const { GridFSBucket } = require('mongodb')
var gfs
async function initialize() {
    gfs = await connectionMongoDB()
}

initialize()

routes.use(express.json())
// REVER ESSE VAR
var id_combine

const newMarkerModel = require('../bd_access/bd_models/newMarkers.js')
const newPostModel = require('../bd_access/bd_models/newPost.js')
const newReportModel = require('../bd_access/bd_models/newReport.js')
const newInformationModel = require('../bd_access/bd_models/newInformations.js')
const newOngModel = require('../bd_access/bd_models/newOngs.js')
const newUserModel = require('../bd_access/bd_models/newUsers.js')
const novoNichosModel = require('../bd_access/bd_models/novosNichos.js')
const newCityModel = require('../bd_access/bd_models/newCity.js')
const newVolunteerModel = require('../bd_access/bd_models/newVolunteer.js')
const newLikeFollowerModel = require('../bd_access/bd_models/newLikesFollowers.js')
const newMetaModel = require('../bd_access/bd_models/newMeta.js')
const newCategoryDonateModel = require('../bd_access/bd_models/newCategoryDonate.js')
const newDoadorModel = require('../bd_access/bd_models/doadores.js')
const newChatModel = require('../bd_access/bd_models/newChat.js')


async function quantDoa(content) {
    try{
        await newDoadorModel.create({
            idDoador: content.idDoador,
            idOng: content.idOng,
            quantDoada: content.quantDoada
        })
        const thatDonate = await newMetaModel.find({idOng: content.idOng})
        await newMetaModel.findByIdAndUpdate({_id: thatDonate[0]._id}, {quantDoa: (Number(content.quantDoada) + Number(thatDonate[0].quantDoa))})
        console.log("Deu tudo certo")
    }
    catch (erro) {
        console.log("Não foi possível fazer a conexão por conta do erro: " + erro)
        process.exit()
    }
}

// Estamos configurando o multer. Ele é o responsável por tratar o arquivo. Aqui estamos indicando que esse arquivo será armazenado em um banco de dados remoto (através da URL) e que o nome que esse arquivo receberá será o seu nome normal + a data de envio do arquivo e também definimos que o Bucket (GridFS) a ser utilizado é o 'uploads'
const multerConfig = new GridFsStorage({
    url: 'mongodb+srv://emerG:emerG2022@emerg.mlrb30g.mongodb.net/?retryWrites=true&w=majority&appName=emerG',
    file: (req, file) => ({
        bucketName: 'uploads',
        filename: `${id_combine}_${file.originalname.split('.')[1]}`,
        metadata: {
            originalName: file.originalname
        }
    })
})


// Estamos falando que a variável 'upload' vai receber o multer porém com a configuração que fizemos anteriormente
const upload = multer({ storage: multerConfig })

routes.get('/', (req, res) => 
{
    res.send('Ola')
})

routes.get('/markersFlood', async(req, res) => 
{
    const allMarkers = await newMarkerModel.find({})
    .then((allMarkers) => 
    {
        res.send(allMarkers)
    })
    .catch((error) => 
    {
        res.send('Não foi possível encontras os marcadores por causa do erro: ' + error)
    })
})

routes.get('/ongs', async(req, res) => 
{
    const allOngs = await newOngModel.find({})
    .then((allOngs) => 
    {
        console.log("Tudo certo")
        res.send(allOngs)
    })
    .catch((error) => 
    {
        console.log('Este é o erro ------------ ' + error)
    })
})

routes.get('/reports', (req, res) => 
{
    
})

routes.post('/informations', async(req, res) =>
{
    const allInformations = await newInformationModel.find({idUsuario: req.body.user_id})
    .then((allInformations) =>
    {
        console.log(allInformations)
        res.send(allInformations)
    })
    .catch((error) => 
    {
        res.send('Não foi possível carregar')
    })
})

routes.get('/posts', async(req, res) =>
{
    const allPosts = await newPostModel.find({})
    .then((allPosts) => 
    {
        // console.log('Informações resgatadas')
        res.send(allPosts)
    })
    .catch((error) => 
    {
        console.log(error)
        res.send('Não foi possível adquirir as informações desejadas')
    })
})

routes.get('/archieves', async(req, res) => 
{
    const files = await gfs.find().toArray()
    .then((files) => {
            res.json(files)
    })
    .catch((error) => {
            console.log(error)
    })
})

routes.get('/users', async(req, res) => {
    const allUsers = await newUserModel.find({})
    .then((allUsers) => {
        console.log(allUsers)
        res.send(allUsers)
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.get('/downloadArchieve/:filename', (req, res) => {
    // O que é uma Stream? - É uma sequência de dados que pode ser lida ou escrita. São usados para manipular dados, como arquivos e dados de rede.
    gfs.openDownloadStreamByName(req.params.filename)
    // O método "pipe" é usado para direcionar a saída de um stream (de leitura) para outro stream (de escrita). Ele basicamente conecta o output de um stream diretamente com o input de outro.
    // Nesse exemplo, o pipe está sendo utilizado para indicar que o "res" (resposta HTTP) receberá a stream de leitura para poder mostrar para o usuário, então o "res" é a stream de escrita
    .pipe(res)
    .on('error', (err) => {
        res.send(err)
    })
    //   console.log(`O arquivo ${req.params.filename} foi carregado`)
})

routes.post('/login', async(req, res) => {
    var ongResponse = 'vazio'

    const thisOng = await newOngModel.find({ong_password: req.body.senha, ong_email: req.body.email})
    .then((response) => {
        if(response != [] && response != '') {
            ongResponse = response
            res.send(response)
        }
    })
    .catch((error) => {
        console.log(error)
    })

    if(ongResponse == 'vazio') {
        const thisUser = await newUserModel.find({email: req.body.email, senha: req.body.senha})
        .then(async(response) => {
        console.log(response)
            if(response != [] && response != '') {
                res.send(response)
            }
            else {
                if(req.body.idUser != undefined) {
                    const thatOng = await newOngModel.findById(req.body.idUser)
                    .then((response) => {
                        console.log(response)
                        res.send(response)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                }
                else {
                    res.send('Usuário não encontrado')
                }
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

})

routes.post('/volunteers', async(req, res) => {
    const allVolunteers = newVolunteerModel.find({ongId: req.body.idUser})
    .then((response) => {
        res.send(response)
        console.log(response)
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.post('/thisChat', async (req, res) => {
    const thisChat = await newChatModel.find({remetente: req.body.remetente, destinatario: req.body.destinatario})
    .then((response) => {
        res.send(response)
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.post('/myLikeFollower', (req, res) => {
    console.log(req.body.idUser)
    console.log(req.body.idOng)
    const myLikeFollower = newLikeFollowerModel.find({idUser: req.body.idUser, idOng: req.body.idOng})
    .then((response) => {
        console.log(response)
        res.send(response)
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.get('/nichos', async(req, res) => {
    const allFilters = {}

    const allNiches = await novoNichosModel.find({})
    .then((allNiches) => {
        console.log(allNiches)
        allFilters['nichos'] = allNiches
        console.log("Nichos recuperados")
    })
    .catch((error) => {
        console.log(error)
        res.send("Não foi possível recuperar os nichos.")
    })

    const allCities = await newCityModel.find({})
    .then((allCities) => {
        allFilters['cidades'] = allCities
        console.log("Cidades recuperadas")
        console.log(allFilters)
        res.send(allFilters)
    })
    .catch((error) => {
        console.log(error)
        res.send("Não foi possível recuperar as cidades.")
    })  
})

routes.post('/myMeta', async(req, res) => {
    const thatMeta = []
    const fakeMeta = []
    const myMeta = await newMetaModel.find({idOng: req.body.idOng})
    .then((response) => {
        console.log(response)
        thatMeta.push(response)
        thatMeta.push(fakeMeta)
        res.send(response)
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.post('/doadoresSim', async(req, res) => {
    const alldoadores = []

    const doadoresSim = await newDoadorModel.find({idOng: req.body.idOng})
    .then((response) => {
        console.log(response)
        response.forEach(async(item) => {
            const thisDoador = await newUserModel.findById(item.idDoador)
        })
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.get('/allCategoriesDonate', (req, res) => {
    const allCategoriesDonate = newCategoryDonateModel.find({})
    .then((response) => {
        res.send(response)
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.post('/allMyLikesFollowersStars', async(req, res) => {
    const totalInfo = []
    const allMyLikesFollowersStars = await newLikeFollowerModel.find({idOng: req.body.idOng})
    .then((response) => {
        totalInfo.push(response)
        console.log(response)
    })
    .catch((error) => {
        console.log(error)
    })

    const allMyFollowing = await newLikeFollowerModel.find({idUser: req.body.idOng})
    .then(async(response) => {
        await totalInfo.push(response)
        console.log(response)
        res.send(totalInfo)
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.post('/createMarker', async(req, res) =>
{
    const newMarker = await newMarkerModel.create(
    {
        address: req.body.address,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPhone: req.body.userPhone,
        name: req.body.name,
        floodLevel: req.body.floodLevel,
        lat: req.body.lat,
        lng: req.body.lng
    })
    .then(() => 
    {
        console.log('Marcador criado')
        res.send('Marcador criado')
    })
    .catch((error) =>
    {
        console.log('Erro ----------- ' + error)
    })

    // res.status(200).send('Marcador criado')
})

routes.post('/createOngs', async(req, res) => 
{
    crypto.randomBytes(12, async(err, buf) => {
        id_combine = buf.toString('hex')

        const realNicho = req.body[0].nicho.split('*')

        const newOng = await newOngModel.create({
            ong_cnpj: req.body[0].cnpj,
            ong_name: req.body[0].nome,
            ong_email: req.body[0].email,
            ong_phone: req.body[0].telefone,
            ong_password: req.body[0].senha,
            ong_address: req.body[0].endereco,
            ong_cep: req.body[0].cep,
            ong_city: req.body[0].cidade,
            ong_logo: `https://api-emer-g.vercel.app/downloadArchieve/${id_combine}_png`,
            ong_description: req.body[0].descricao,
            ong_checked: false,
            ong_niche: realNicho[0],
            ong_stars: 0,
            ong_likes: 0,
            ong_followers: 0,
            ong_lat: req.body[0].lat,
            ong_lng: req.body[0].lng
        })
        .then(async(response) => {
            res.send("Sua organização foi cadastrada com sucesso")
            console.log("Ong cadastrada")

            if(realNicho[1] == 'new') {
                const novoNicho = await novoNichosModel.create({
                    nicho: realNicho[0]
                })
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                })
            }

            const thatCity = await newCityModel.find({
                city: req.body[0].cidade
            })
            .then(async(thatCity) => {
                console.log(thatCity)
                if(thatCity.length == 0) {
                    console.log('saporra funcionou')
                    const newCity = await newCityModel.create({
                        city: req.body[0].cidade
                    })
                    .then((response) => {
                        console.log(response)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                }
            })
            .catch((error) =>{ 
                console.log(error)
            })
        })
        .catch((error) => {
            console.log(error)
        })
    })

})

routes.post('/createReport', async(req, res) => 
{
    const newReport = await newReportModel.create({
        report_idUsuario: '123456789',
        report_id_post: req.body.report_id_post,
        report_id_ong: req.body.report_id_ong,
        report_theme: req.body.report_theme,
        report_description: req.body.report_description
    })
    .then(() => 
    {
        console.log('Enviado')
        res.send('Denúncia enviada')
    })
    .catch((error) => 
    {
        console.log('O erro foi: ' + error)
    })
})

routes.post('/createPost', async(req, res) => 
{
    var createAll = await req.body
    console.log(req.body)

     crypto.randomBytes(12, async(err, buf) => {
        id_combine = await buf.toString('hex')

        if(createAll[0].post_fileName != '') {
            const newPost = await newPostModel.create({
                post_id_ong: createAll[0].post_id_ong,
                post_ong_name: createAll[0].post_ong_name,
                post_ong_email: createAll[0].post_email,
                post_ong_logo: createAll[0].post_logo,
                post_image: `https://api-emer-g.vercel.app/downloadArchieve/${id_combine}_png`,
                post_documents: `https://api-emer-g.vercel.app/downloadArchieve/${id_combine}_pdf`,
                post_documentsName: createAll[0].post_fileName,
                post_description: createAll[0].post_description,
            })
            .then((response) =>
            {
                console.log('Tudo certo')
                res.send('tudo certo')
            })
            .catch((error) => 
            {
                console.log('O erro foi: ' + error)
            })
        }
        else {
            const newPost = await newPostModel.create({
                post_id_ong: createAll[0].post_id_ong,
                post_ong_name: createAll[0].post_ong_name,
                post_ong_email: createAll[0].post_email,
                post_ong_logo: createAll[0].post_logo,
                post_image: `https://api-emer-g.vercel.app/downloadArchieve/${id_combine}_png`,
                post_documents: ``,
                post_documentsName: '',
                post_description: createAll[0].post_description,
            })
            .then((response) =>
            {
                console.log('Tudo certo')
                res.send('tudo certo')
            })
            .catch((error) => 
            {
                console.log('O erro foi: ' + error)
            })
        }
    })
})

routes.post('/uploadFile', upload.array('files'), async(req, res) => 
{
    // Se eu tivesse que fazer o upload de apenas um arquivo, daria pra usar o "upload.single('files')" sem precisar do "gfs" e manipular streams, porém, nesse caso podemos ter mais de um arquivo, então precisamos fazer um forEach para poder armazenar todos.
    // res.status(200).send('Arquivo Armazenado')
    console.log(req.files)
    if(!req.files)
    {
        // res.send('Nenhum arquivo encontrado')
        console.log('Nenhum arquivo encontrado')
    }
    else
    {
        res.status(200).send('Arquivos armazenados');
    }


    // res.send(res.status())
    // tenho um servidor que é responsável por fazer o upload de arquivos e armazená-los em um banco de dados MongoDB, estou utilizando multer e gridfs também. Seguindo essa situação que eu citei, como eu posso fazer o uploads de vários arquivos de uma vez?
})

routes.post('/keepInformations', async(req, res) =>
{    
    var contentCreateInfo = {
        type: 'follower',
        idUser: req.body.idUsuario,
        recentQuant: 0,
    }

    if(req.body.typeInfo == 'following') {
        try{
            const thisUser = await newUserModel.find({_id: req.body.idUsuario})
            console.log(thisUser)

            if(thisUser.length == 0) {
                const thisOngBecauseNoUser = await newOngModel.find({_id: req.body.idUsuario})
                contentCreateInfo.nameUser = thisOngBecauseNoUser[0].ong_name
            }
            else {
                contentCreateInfo.nameUser = thisUser[0].nome
            }
            
            const thisPost = await newPostModel.find({_id: req.body.id_post})
            const thisOng = await newOngModel.find({_id: thisPost[0].post_id_ong})
            contentCreateInfo.idOng = thisOng[0]._id
            contentCreateInfo.nameOng = thisOng[0].ong_name

            await newLikeFollowerModel.create(contentCreateInfo)
            await newOngModel.findByIdAndUpdate({_id: thisOng[0]._id}, {ong_followers: (thisOng[0].ong_followers + 1)})
        }
        catch (error) {
            console.log("Ocorreu um erro: " + error)
            process.exit()
        }
    }

    const keepInformations = await newInformationModel.create({
        typeInfo: req.body.typeInfo,
        id_post: req.body.id_post,
        idUsuario: req.body.idUsuario,
        actived: req.body.actived
    })
    .then((response) => 
    {
        console.log('response: ' + response)
    })
    .catch((error) => 
    {
        console.log('O erro foi: ' + error)
    })

    res.status(200).send('Informações armazenadas')
})

routes.post('/newUser', async(req, res) => 
{
    crypto.randomBytes(12, async(err, buf) => {
        id_combine = buf.toString('hex')

        console.log(req.body[0])
        const newUser = await newUserModel.create({
            cpf: req.body[0].cpf,
            nome: req.body[0].nome,
            email: req.body[0].email,
            telefone: req.body[0].telefone,
            senha: req.body[0].senha,
            endereco: req.body[0].endereco,
            cep: req.body[0].cep,
            cidade: req.body[0].cidade,
            foto:  `https://api-emer-g.vercel.app/downloadArchieve/${id_combine}_png`,
            descricao: req.body[0].descricao,
        })
        .then((response) => {
            res.send('Usuário criado com sucesso')
            console.log("Usuário criado")
        })
        .catch((error) => {
            console.log(error)
        })   
    })
})

routes.post('/newVolunteer', async(req, res) => {
    const newVolunteer = await newVolunteerModel.create({
        function: req.body.function,
        requests: req.body.requests,
        description: req.body.description,
        ongId: req.body.ongId,
        idVolunteer: req.body.idVolunteer
    })
    .then((response) => {
        res.send('Vaga de voluntário criada com sucesso')
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.post('/likeOrFollow', async(req, res) => {
    if(req.body.type == 'star') {
        const deleteThisStar = await newLikeFollowerModel.deleteOne({type: 'star', idUser: req.body.idUser, idOng: req.body.idOng})
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const newlikeOrFollow = await newLikeFollowerModel.create({
        type: req.body.type,
        idUser: req.body.idUser,
        nameUser: req.body.nameUser,
        recentQuant: req.body.recentQuant,
        idOng: req.body.idOng,
        nameOng: req.body.nameOng
    })
    .then((response) => {
        console.log(response)
        res.send("Informação armazenada")
    })
    .catch((error) => {
        console.log(error)
    })

    if(req.body.type == 'like') {
        const updateOngLike = await newOngModel.findByIdAndUpdate({_id: req.body.idOng}, {ong_likes: req.body.recentQuant})
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    else if(req.body.type == 'follower') {
        const updateOngFollower = await newOngModel.findByIdAndUpdate({_id: req.body.idOng}, {ong_followers: req.body.recentQuant})
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    else if(req.body.type == 'star') {
        const allStarThatOng = await newLikeFollowerModel.find({type: 'star', idOng: req.body.idOng})
        .then(async(response) => {
            var somaStars = 0
            response.forEach((item) => {
                somaStars = somaStars + item.recentQuant
            })
            const updateStarOng = await newOngModel.findByIdAndUpdate({_id: req.body.idOng}, {ong_stars: (somaStars/response.length).toFixed(0)})
        })
        .catch((error) => {
            console.log(error)
        })
    }
})

routes.post('/newMeta', async(req, res) => {

    const nameMeta = req.body.nomeItem.split('__')

    const newMeta = await newMetaModel.create({
        idOng: req.body.idOng,
        nomeItem: nameMeta[0],
        quant: req.body.quant,
        quantDoa: 0,
    })
    .then((response) => {
        console.log(response)
        res.send('Meta criada')
    })
    .catch((error) => {
        console.log(error)
    })


    if(nameMeta[1] == 'new') {
        const newCategoryDonate = await newCategoryDonateModel.create({
            nameCategory: nameMeta[0]
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }
})

routes.post('/doador', async(req, res) => {
    // const doador = await newDoadorModel.create({
    //     idDoador: req.body.idDoador,
    //     idOng: req.body.idOng,
    //     quantDoada: req.body.quantDoada
    // })
    // .then((response) => {
    //     const thatDonate = newMetaModel.findById({_id: req.body.idOng})
    //     .then((response) => {
    //         console.log(response)
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })
    //     const updateDoacoes = newMetaModel.findByIdAndUpdate({_id: req.body.idOng}, {quantDoa: })
    //     res.send('Foi')
    // })
    // .catch((error) => {
    //     console.log(error)
    // })

    await quantDoa(req.body)
    res.send("Deu tudo certo")
})

routes.post('/newChat', async(req, res) => {
    try {
        const thatChat = await newChatModel.find({remetente: req.body.remetente, destinatario: req.body.destinatario})
        
        if(thatChat != [] && thatChat != '') {
            var thatThing = thatChat[0].mensagens[0]
            thatThing.push(req.body.mensagens[0])
            console.log(thatThing)
            await newChatModel.findByIdAndUpdate({_id: thatChat[0]._id}, {mensagens: thatThing})
        }
        else {
            await newChatModel.create({
                remetente: req.body.remetente,
                destinatario: req.body.destinatario,
                mensagens: req.body.mensagens
            })
        }

        res.send('Deu certo')
    }   
    catch (error) {
        console.log(error)
        res.send('Erro')
    }

})

routes.delete('/deleteInfo:id', async(req, res) => 
{
    var indexCounter = 0
    var bigId = await req.params.id
    someIds = await bigId.split('_')
    // await someIds.pop()
    console.log(someIds)

    someIds.forEach(async(item) => 
    {
        indexCounter = indexCounter + 1

        if(someIds.indexOf(item) % 3 == 0)
        {
            if(someIds[indexCounter] == 'following') {
                try {
                    const thisInfo = await newInformationModel.find({id_post: item, typeInfo: someIds[indexCounter], idUsuario: someIds[indexCounter + 1]})
                    const thisPost = await newPostModel.find({_id: thisInfo[0].id_post})
                    const thisOngId = await newOngModel.find({_id: thisPost[0].post_id_ong})
                    const thatLikeFollow = await newLikeFollowerModel.find({idUser: someIds[indexCounter - 1], idOng: thisPost[0].post_id_ong, type: 'follower'})

                    await newLikeFollowerModel.deleteOne({idUser: someIds[indexCounter - 1], idOng: thisPost[0].post_id_ong, type: 'follower'})
                    await newInformationModel.deleteOne({id_post: item, typeInfo: someIds[indexCounter - 2], idUsuario: someIds[indexCounter - 1]})
                    await newOngModel.findByIdAndUpdate({_id: thisOngId[0]._id}, {ong_followers: (thisOngId[0].ong_followers - 1)})
                    res.send('Informação deletada com sucesso.')
                }
                catch (error) {
                    console.log('Ocorreu um erro: ' + error)
                    res.send('Ocorreu um erro: ' + error)
                }
            }
            else {
                const deleteInfo = await newInformationModel.deleteOne({id_post: item, typeInfo: someIds[indexCounter]})
                .then((response) => {
                    res.send('Informação deletada com sucesso.')
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
    })
})

routes.delete('/deleteVolunteer:id', async(req, res) => {
    const deleteVolunteer = await newVolunteerModel.deleteOne({idVolunteer: req.params.id})
    .then((response) => {
        res.send(response)
    })
    .catch((error) => {
        res.send(error)
    })
})

module.exports = routes