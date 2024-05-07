import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})


export class UserModel {
  static async getAll() {
    const [users] = await pool.query(
      'SELECT * FROM Users'
    )

    return users
  }

  static async create ({ input }) {
    const {
      name,
      email,
      password
    } = input

    try {
      const [result] = await pool.query(
        'INSERT INTO Users ( name, email, password ) VALUES (?, ?, ?);',
        [name, email, password]
      )
      const userId = result.insertId;  
      return { userId, message: 'User created successfully' };
    }catch (e) {
      throw e
    }
  }

}