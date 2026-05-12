const express = require('express')
const router = express.Router()
const { obtenerProductos, obtenerProducto, crearProducto } = require('../controllers/productoController')

router.get('/', obtenerProductos)
router.get('/:id', obtenerProducto)
router.post('/', crearProducto)

module.exports = router