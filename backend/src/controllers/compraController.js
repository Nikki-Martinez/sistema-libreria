const pool = require('../database/conexion')

const obtenerCompras = async (req, res) => {
  try {
    const [compras] = await pool.query(`
      SELECT c.*, p.nombre AS proveedor_nombre
      FROM compras c
      LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
      ORDER BY c.fecha_ingreso DESC
    `)
    res.json(compras)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const obtenerCompra = async (req, res) => {
  try {
    const [compra] = await pool.query(`
      SELECT c.*, p.nombre AS proveedor_nombre
      FROM compras c
      LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
      WHERE c.id_compra = ?
    `, [req.params.id])

    if (compra.length === 0) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' })
    }

    const [detalle] = await pool.query(`
      SELECT cd.*, p.producto
      FROM compras_detalle cd
      JOIN productos p ON cd.id_producto = p.id_producto
      WHERE cd.id_compra = ?
    `, [req.params.id])

    res.json({ compra: compra[0], detalle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearCompra = async (req, res) => {
  const { id_proveedor, items } = req.body
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    let total = 0

    for (const item of items) {
      total += item.cantidad * item.precio_costo_unitario
    }

    const [resultCompra] = await connection.query(
      'INSERT INTO compras (id_proveedor, total, fecha_orden) VALUES (?, ?, CURDATE())',
      [id_proveedor, total]
    )

    const id_compra = resultCompra.insertId

    for (const item of items) {
      await connection.query(
        'INSERT INTO compras_detalle (id_compra, id_producto, cantidad, precio_costo_unitario) VALUES (?, ?, ?, ?)',
        [id_compra, item.id_producto, item.cantidad, item.precio_costo_unitario]
      )

      await connection.query(
        'UPDATE productos SET existencia = existencia + ?, precio_costo = ? WHERE id_producto = ?',
        [item.cantidad, item.precio_costo_unitario, item.id_producto]
      )
    }

    await connection.commit()
    res.status(201).json({ id: id_compra, total, mensaje: 'Compra creada' })

  } catch (error) {
    await connection.rollback()
    res.status(400).json({ error: error.message })
  } finally {
    connection.release()
  }
}

module.exports = { obtenerCompras, obtenerCompra, crearCompra }