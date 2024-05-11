import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

    console.log(input)
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        'INSERT INTO Users ( name, email, password ) VALUES (?, ?, ?);',
        [name, email, hashedPassword]
      )
      const userId = result.insertId;  
      return { message: 'User created successfully' };
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
      const [results] = await pool.query(
        'SELECT * FROM Users WHERE email = ?;',[email]
      )

      const user = results[0]
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)
      
      if(!passwordCorrect) {
        return { error: 'Invalid email or password' }
      }

      const token = jwt.sign({
        userId: results[0].user_id,
        email: results[0].email
      }, process.env.SECRET, {expiresIn: '3h'})

      return { message: 'Successful login', id: user.user_id, name: user.name, email: user.email}

    }catch (e) {
      throw e
    }
  }

  static async getUserById({ id }) {
    const [user] = await pool.query('SELECT name, email FROM Users WHERE user_id = ?;',[id])

    if (user.length === 0) return null

    return user[0]
  }

  static async getFavoritesById({ id }) {
    const [favourites] = await pool.query('SELECT exerciseP_id FROM Favourites WHERE user_id = ?;',[id])

    if (favourites.length === 0) return null

    return favourites[0]
  }

  static async getRoutine({day_id, user_id}) {

    const query = `
        SELECT 
            EC.reps, 
            EC.sets, 
            EC.weight, 
            EC.rest, 
            EC.duration, 
            EC.intensity, 
            E.name AS exercise_name
        FROM 
            ExercisesConfigurations EC
        JOIN 
            ExercisesConfigurationsDays ECD ON EC.exerciseP_id = ECD.exerciseP_id
        JOIN 
            Exercises E ON EC.exercise_id = E.exercise_id
        WHERE 
            ECD.day_id = ? AND 
            ECD.user_id = ?
    `;
    try {
      const [routine] = await pool.query(query,[day_id, user_id])
      console.log('Rutina \n:' + routine[0])
      return routine[0]

    }catch(err) {
      console.error('Error getting the routine')
      throw err
    }
  }

}