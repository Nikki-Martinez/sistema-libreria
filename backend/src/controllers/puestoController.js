const pool = require('../database/conexion')

const obtenerPuestos = async (req, res) => {
  try {
    const [puestos] = await pool.query('SELECT * FROM puestos')
    res.json(puestos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { obtenerPuestos }