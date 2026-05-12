const express = require('express')
const router = express.Router()
const { obtenerEmpleados, obtenerEmpleado, crearEmpleado, actualizarEmpleado } = require('../controllers/empleadoController')

router.get('/', obtenerEmpleados)
router.get('/:id', obtenerEmpleado)
router.post('/', crearEmpleado)
router.put('/:id', actualizarEmpleado)

module.exports = router