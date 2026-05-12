const express = require('express')
const router = express.Router()
const { obtenerMarcas, crearMarca } = require('../controllers/marcaController')

router.get('/', obtenerMarcas)
router.post('/', crearMarca)

module.exports = router