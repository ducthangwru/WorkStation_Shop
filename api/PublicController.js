//Đây là file chứa các API
const express = require('express')
const Router = express.Router()

Router.get('/test', (req, res) => {
    
    res.send({hihi : "hihi"})

})

module.exports = Router