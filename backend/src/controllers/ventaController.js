const pool = require('../database/conexion')

const obtenerVentas = async (req, res) => {
  try {
    const [ventas] = await pool.query(`
      SELECT v.*, c.nombres AS cliente_nombres, c.apellidos AS cliente_apellidos,
             e.nombre AS empleado_nombre, e.apellido AS empleado_apellido
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
      ORDER BY v.fecha_ingreso DESC
    `)
    res.json(ventas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const obtenerVenta = async (req, res) => {
  try {
    const [venta] = await pool.query(`
      SELECT v.*, c.nombres AS cliente_nombres, c.apellidos AS cliente_apellidos,
             e.nombre AS empleado_nombre, e.apellido AS empleado_apellido
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
      WHERE v.id_venta = ?
    `, [req.params.id])

    if (venta.length === 0) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' })
    }

    const [detalle] = await pool.query(`
      SELECT vd.*, p.producto
      FROM ventas_detalle vd
      JOIN productos p ON vd.id_producto = p.id_producto
      WHERE vd.id_venta = ?
    `, [req.params.id])

    res.json({ venta: venta[0], detalle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearVenta = async (req, res) => {
  const { id_cliente, id_empleado, metodo_pago, items } = req.body
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    let total = 0

    // Calcular total y validar stock
    for (const item of items) {
      const [producto] = await connection.query(
        'SELECT existencia, precio_venta FROM productos WHERE id_producto = ? FOR UPDATE',
        [item.id_producto]
      )

      if (producto.length === 0) {
        throw new Error(`Producto ${item.id_producto} no existe`)
      }

      if (producto[0].existencia < item.cantidad) {
        throw new Error(`Stock insuficiente para ${item.id_producto}`)
      }

      total += item.cantidad * producto[0].precio_venta
    }

    // Insertar venta
    const [resultVenta] = await connection.query(
      'INSERT INTO ventas (id_cliente, id_empleado, total, metodo_pago, fecha_factura) VALUES (?, ?, ?, ?, CURDATE())',
      [id_cliente || null, id_empleado, total, metodo_pago]
    )

    const id_venta = resultVenta.insertId

    // Insertar detalle y actualizar stock
    for (const item of items) {
      const [producto] = await connection.query(
        'SELECT precio_venta FROM productos WHERE id_producto = ?',
        [item.id_producto]
      )

      await connection.query(
        'INSERT INTO ventas_detalle (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_venta, item.id_producto, item.cantidad, producto[0].precio_venta]
      )

      await connection.query(
        'UPDATE productos SET existencia = existencia - ? WHERE id_producto = ?',
        [item.cantidad, item.id_producto]
      )
    }

    await connection.commit()
    res.status(201).json({ id: id_venta, total, mensaje: 'Venta creada' })

  } catch (error) {
    await connection.rollback()
    res.status(400).json({ error: error.message })
  } finally {
    connection.release()
  }
}

module.exports = { obtenerVentas, obtenerVenta, crearVenta }