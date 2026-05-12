const pool = require('../database/conexion')

const obtenerEmpleados = async (req, res) => {
  try {
    const [empleados] = await pool.query(`
      SELECT e.*, p.puesto 
      FROM empleados e 
      LEFT JOIN puestos p ON e.id_puesto = p.id_puesto
    `)
    res.json(empleados)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const obtenerEmpleado = async (req, res) => {
  try {
    const [empleado] = await pool.query(`
      SELECT e.*, p.puesto 
      FROM empleados e 
      LEFT JOIN puestos p ON e.id_puesto = p.id_puesto
      WHERE e.id_empleado = ?
    `, [req.params.id])
    if (empleado.length === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' })
    }
    res.json(empleado[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearEmpleado = async (req, res) => {
  const { nombre, apellido, dpi, direccion, telefono, fecha_ingreso, id_puesto } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO empleados (nombre, apellido, dpi, direccion, telefono, fecha_ingreso, id_puesto) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, dpi, direccion, telefono, fecha_ingreso, id_puesto]
    )
    res.status(201).json({ id: result.insertId, mensaje: 'Empleado creado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const actualizarEmpleado = async (req, res) => {
  const { nombre, apellido, dpi, direccion, telefono, fecha_ingreso, id_puesto } = req.body
  try {
    await pool.query(
      'UPDATE empleados SET nombre = ?, apellido = ?, dpi = ?, direccion = ?, telefono = ?, fecha_ingreso = ?, id_puesto = ? WHERE id_empleado = ?',
      [nombre, apellido, dpi, direccion, telefono, fecha_ingreso, id_puesto, req.params.id]
    )
    res.json({ mensaje: 'Empleado actualizado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { obtenerEmpleados, obtenerEmpleado, crearEmpleado, actualizarEmpleado }