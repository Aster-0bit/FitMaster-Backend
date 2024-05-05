import mysql from 'mysql2/promise'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
}

const connection = await mysql.createConnection(config)

export class UserModel {
  static async getAll() {
    const [users] = await connection.query(
      'SELECT * FROM Users'
    )

    return users
  }
}