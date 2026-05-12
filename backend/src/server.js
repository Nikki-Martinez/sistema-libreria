const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Importar rutas
const productoRoutes = require('./routes/productoRoutes')
const categoriaRoutes = require('./routes/categoriaRoutes')
const marcaRoutes = require('./routes/marcaRoutes')
const clienteRoutes = require('./routes/clienteRoutes')
const empleadoRoutes = require('./routes/empleadoRoutes')
const ventaRoutes = require('./routes/ventaRoutes')
const compraRoutes = require('./routes/compraRoutes')
const proveedorRoutes = require('./routes/proveedorRoutes')
const puestoRoutes = require('./routes/puestoRoutes')
const app = express()

app.use(cors())
app.use(express.json())

// Usar rutas
app.use('/api/productos', productoRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/marcas', marcaRoutes)
app.use('/api/clientes', clienteRoutes)
app.use('/api/empleados', empleadoRoutes)
app.use('/api/ventas', ventaRoutes)
app.use('/api/compras', compraRoutes)
app.use('/api/proveedores', proveedorRoutes)
app.use('/api/puestos', puestoRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})


