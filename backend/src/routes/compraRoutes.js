const express = require('express')
const router = express.Router()
const { obtenerCompras, obtenerCompra, crearCompra } = require('../controllers/compraController')

router.get('/', obtenerCompras)
router.get('/:id', obtenerCompra)
router.post('/', crearCompra)

module.exports = router