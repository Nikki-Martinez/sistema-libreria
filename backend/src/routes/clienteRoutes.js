const express = require('express')
const router = express.Router()
const { obtenerClientes, obtenerCliente, crearCliente, actualizarCliente } = require('../controllers/clienteController')

router.get('/', obtenerClientes)
router.get('/:id', obtenerCliente)
router.post('/', crearCliente)
router.put('/:id', actualizarCliente)

module.exports = router