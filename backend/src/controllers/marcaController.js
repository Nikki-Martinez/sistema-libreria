const pool = require('../database/conexion')

const obtenerMarcas = async (req, res) => {
  try {
    const [marcas] = await pool.query('SELECT * FROM marcas')
    res.json(marcas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearMarca = async (req, res) => {
  const { marca } = req.body
  try {
    const [result] = await pool.query('INSERT INTO marcas (marca) VALUES (?)', [marca])
    res.status(201).json({ id: result.insertId, mensaje: 'Marca creada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { obtenerMarcas, crearMarca }