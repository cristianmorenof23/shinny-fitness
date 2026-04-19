import 'dotenv/config'
import bcrypt from 'bcryptjs'
import * as mariadb from 'mariadb'

function printUsage() {
  console.log(
    'Uso: npm run seed:admin -- <email> <password> [nombre]\n' +
      'Ejemplo: npm run seed:admin -- admin@shiny-fitness.com MiClave123 "Shiny Admin"'
  )
}

const [, , emailArg, passwordArg, ...nameParts] = process.argv

if (!emailArg || !passwordArg) {
  printUsage()
  process.exit(1)
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL no esta configurada.')
  process.exit(1)
}

const adminName = nameParts.join(' ').trim() || 'Administrador'
const connectionString = databaseUrl.replace(/^mysql:\/\//, 'mariadb://')

async function main() {
  const pool = mariadb.createPool(connectionString)
  let connection

  try {
    connection = await pool.getConnection()

    const existingRows = await connection.query(
      'SELECT id FROM `User` WHERE email = ? LIMIT 1',
      [emailArg.toLowerCase()]
    )

    const existingUser = Array.isArray(existingRows)
      ? existingRows.find((row) => row?.id)
      : null

    const hashedPassword = await bcrypt.hash(passwordArg, 10)

    if (existingUser) {
      await connection.query(
        'UPDATE `User` SET name = ?, password = ?, role = ? WHERE id = ?',
        [adminName, hashedPassword, 'ADMIN', existingUser.id]
      )

      console.log(`Admin actualizado: ${emailArg.toLowerCase()}`)
      return
    }

    const idRows = await connection.query('SELECT UUID() AS id')
    const generatedId = Array.isArray(idRows)
      ? idRows.find((row) => row?.id)?.id
      : null

    if (!generatedId) {
      throw new Error('No se pudo generar un id para el admin.')
    }

    await connection.query(
      'INSERT INTO `User` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?, NOW(3), NOW(3))',
      [generatedId, adminName, emailArg.toLowerCase(), hashedPassword, 'ADMIN']
    )

    console.log(`Admin creado: ${emailArg.toLowerCase()}`)
  } finally {
    if (connection) {
      connection.release()
    }

    await pool.end()
  }
}

main().catch((error) => {
  console.error('No pudimos crear el admin:')
  console.error(error)
  process.exit(1)
})
