const express = require('express');

const {usuarios} = require('./usuarios');

const router  = require('./controladores/rotas');

const app = express();

app.use(express.json())

app.use(router)

app.listen(3000, () => {
    console.log("rodando na porta 3000")
})


