const express = require('express')
const router = express.Router()
const { obtenerVentas, obtenerVenta, crearVenta } = require('../controllers/ventaController')

router.get('/', obtenerVentas)
router.get('/:id', obtenerVenta)
router.post('/', crearVenta)

module.exports = router