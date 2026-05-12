const pool = require('../database/conexion')

const obtenerProveedores = async (req, res) => {
  try {
    const [proveedores] = await pool.query('SELECT * FROM proveedores')
    res.json(proveedores)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearProveedor = async (req, res) => {
  const { nombre, nit, telefono, correo } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO proveedores (nombre, nit, telefono, correo) VALUES (?, ?, ?, ?)',
      [nombre, nit, telefono, correo]
    )
    res.status(201).json({ id: result.insertId, mensaje: 'Proveedor creado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { obtenerProveedores, crearProveedor }