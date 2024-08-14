const express = require('express')
const routes = express.Router()
const mysql = require('mysql2')
const mongoose = require('mongoose')
const connectionMongoDB = require('../bd_access/connectionMongoDB.js')
routes.use(express.json())

connectionMongoDB()

const newMarkerModel = require('../bd_access/bd_models/newMarkers.js')
const newPostModel = require('../bd_access/bd_models/newPost.js')
const newReportModel = require('../bd_access/bd_models/newReport.js')
const newInformationModel = require('../bd_access/bd_models/newInformations.js')
const newOngModel = require('../bd_access/bd_models/newOngs.js')

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

routes.post('/createMarker', async(req, res) =>
{
    const newMarker = await newMarkerModel.create(
    {
        address: req.body.address,
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
    const newOng = await newOngModel.create({
        ong_name: req.body.ong_name,
        ong_description: req.body.ong_description,
        ong_cnpj: req.body.ong_cnpj,
        ong_email: req.body.ong_email,
        ong_phone: req.body.ong_phone,
        ong_address: req.body.ong_address,
        ong_cep: req.body.ong_cep,
        ong_logo: req.body.ong_logo,
        ong_checked: false,
        ong_icon: req.body.ong_icon,
        ong_niche: req.body.ong_niche,
        ong_stars: 0,
        ong_city: req.body.ong_city,
        ong_lat: req.body.ong_lat,
        ong_lng: req.body.ong_lng
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

    createAll.forEach(async(item) => 
    {
        const newPost = await newPostModel.create({
            post_id_ong: item.post_id_ong,
            post_ong_name: 'Erick',
            post_ong_email: 'erick@gmail.com',
            post_ong_logo: '11111',
            post_image: item.post_image,
            post_documents: '11111',
            post_description: item.post_description,
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
    })
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

module.exports = routes