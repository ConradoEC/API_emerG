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
// connectionMongoDB()
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


const { GridFSBucket } = require('mongodb')
var gfs

mongoose.connect(`mongodb+srv://emerG:emerG2022@emerg.mlrb30g.mongodb.net/?retryWrites=true&w=majority&appName=emerG`)
    .then(async() => 
    {
        console.log('Banco conectado')
        const db = await mongoose.connection.db
        // Essa parte é a configuração do GridFS, que seria uma ferramenta que vai fragmentar o arquivo em pequenas partes para que ele possa ser armazenado. O nome dado para ele foi 'uploads'
        gfs = await new GridFSBucket(db, {bucketName: 'uploads'})
        // const collections = await db.listCollections().toArray()
    })    
    .catch((error) =>
    {
        console.log('Não foi possível conectar por causa do erro ---> ' + error)
    })


// const data = new Date()
// const time = String(data.getTime())

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
    const allInformations = await newInformationModel.find({idUsuario: req.body[0].user_id})
    .then((allInformations) =>
    {
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
    const newlikeOrFollow = await newLikeFollowerModel.create({
        type: req.body.type,
        idUser: req.body.idUser,
        nameUser: req.body.nameUser,
        recentQuant: req.body.recentQuant,
        idOng: req.body.idOng
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
})

routes.delete('/deleteInfo:id', async(req, res) => 
{
    var indexCounter = 0
    var bigId = await req.params.id
    someIds = await bigId.split('_')
    await someIds.pop()
    console.log(someIds)

    someIds.forEach(async(item) => 
    {
        console.log(item)
        indexCounter = indexCounter + 1
        console.log(indexCounter)

        if(someIds.indexOf(item) % 2 == 0)
        {
            // console.log(someIds.indexOf(item))
            // console.log(item)
            console.log(indexCounter)
            const deleteInfo = await newInformationModel.deleteOne({id_post: item, typeInfo: someIds[indexCounter]})
            .then(() => 
            {
                // console.log('Deletado')
                // console.log(deleteInfo)
            })
            .catch(() => 
            {
                console.log('Não deletado')
            })
        }

        // if(item == 'following')
        // {
        //     console.log('Este é o item: ' + item)
        // }
        // else if(item == 'liked')
        // {
        //     console.log('Este é o item: ' + item)
        // }
        // else if(item == 'saved')
        // {
        //     console.log('Este é o item: ' + item)
        // }
        // else
        // {
        //     console.log('Este é o item: ' + item)

        //     const deleteInfo = await newInformationModel.deleteOne({id_post: item, typeInfo: someIds[someIds.indexOf(item) + 1]})
        //     .then(() => 
        //     {
        //         console.log('Deletado')
        //         // console.log(deleteInfo)
        //     })
        //     .catch(() => 
        //     {
        //         console.log('Não deletado')
        //     })
        // }
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