import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

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
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        'INSERT INTO Users ( name, email, password ) VALUES (?, ?, ?);',
        [name, email, hashedPassword]
      )
      const userId = result.insertId;  
      return { userId, message: 'User created successfully' };
    }catch (e) {
      throw e
    }
  }

  static async findOne({ input }) {
    const {
      email,
      password
    } = input

    try {
      const [user] = await pool.query(
        'SELECT * FROM Users WHERE email = ?;',[email]
      )

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)
      
      if(!passwordCorrect) {
        response.status(401).json({
          error: 'Invalid email or password'
        })
      }

      response.send({
        email: user.email,
        name: user.name
      })

    }catch (e) {
      throw e
    }
  }

}