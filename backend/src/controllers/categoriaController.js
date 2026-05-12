const pool = require('../database/conexion')

const obtenerCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.query('SELECT * FROM categorias')
    res.json(categorias)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearCategoria = async (req, res) => {
  const { nombre } = req.body
  try {
    const [result] = await pool.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre])
    res.status(201).json({ id: result.insertId, mensaje: 'Categoría creada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { obtenerCategorias, crearCategoria }