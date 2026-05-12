const pool = require('../database/conexion')

const obtenerClientes = async (req, res) => {
  try {
    const [clientes] = await pool.query('SELECT * FROM clientes')
    res.json(clientes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const obtenerCliente = async (req, res) => {
  try {
    const [cliente] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [req.params.id])
    if (cliente.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' })
    }
    res.json(cliente[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearCliente = async (req, res) => {
  const { nombres, apellidos, nit, genero, telefono, correo_electronico } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO clientes (nombres, apellidos, nit, genero, telefono, correo_electronico) VALUES (?, ?, ?, ?, ?, ?)',
      [nombres, apellidos, nit, genero, telefono, correo_electronico]
    )
    res.status(201).json({ id: result.insertId, mensaje: 'Cliente creado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const actualizarCliente = async (req, res) => {
  const { nombres, apellidos, nit, genero, telefono, correo_electronico } = req.body
  try {
    await pool.query(
      'UPDATE clientes SET nombres = ?, apellidos = ?, nit = ?, genero = ?, telefono = ?, correo_electronico = ? WHERE id_cliente = ?',
      [nombres, apellidos, nit, genero, telefono, correo_electronico, req.params.id]
    )
    res.json({ mensaje: 'Cliente actualizado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { obtenerClientes, obtenerCliente, crearCliente, actualizarCliente }