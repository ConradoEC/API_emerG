const express = require('express')
const app = express()
const routes = require('./routes/routes')
const PORT = 3000
const cors = require('cors')
// app.use(cors({
//     "Access-Control-Allow-Origin": "*",
//     "Content-type": "application/json"
// }))

app.use(cors({
    origin: '*',
    credentials: true,
    AccessControlAllowOrigin: '*',
}))
app.use(express.json())
app.use(routes)

app.listen(3000, () =>
{
    console.log('Working')
})