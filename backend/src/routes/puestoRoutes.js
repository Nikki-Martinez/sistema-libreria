const express = require('express')
const router = express.Router()
const { obtenerPuestos } = require('../controllers/puestoController')

router.get('/', obtenerPuestos)

module.exports = router

