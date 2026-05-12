const pool = require('../database/conexion')

// GET /api/productos
const obtenerProductos = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT p.*, m.marca, GROUP_CONCAT(c.nombre) AS categorias
      FROM productos p
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN producto_categoria pc ON p.id_producto = pc.id_producto
      LEFT JOIN categorias c ON pc.id_categoria = c.id_categoria
      WHERE p.activo = 1
      GROUP BY p.id_producto
    `)
    res.json(productos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/productos/:id
const obtenerProducto = async (req, res) => {
  try {
    const [producto] = await pool.query(
      'SELECT * FROM productos WHERE id_producto = ?',
      [req.params.id]
    )
    if (producto.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }
    res.json(producto[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/productos
const crearProducto = async (req, res) => {
  const { producto, id_marca, descripcion, precio_costo, precio_venta, existencia } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO productos (producto, id_marca, descripcion, precio_costo, precio_venta, existencia) VALUES (?, ?, ?, ?, ?, ?)',
      [producto, id_marca, descripcion, precio_costo, precio_venta, existencia]
    )
    res.status(201).json({ id: result.insertId, mensaje: 'Producto creado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { obtenerProductos, obtenerProducto, crearProducto }