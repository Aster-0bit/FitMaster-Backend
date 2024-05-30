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

  static async updateUser({ input }) {
    const {
      name,
      id
    } = input

    try {
      console.log('name: ' + name + ' user_id: ' + id)
      const [result] = await pool.query(
        'UPDATE Users SET name = ? WHERE user_id = ?;',[name, id]
      )
      return { message: 'User updated successfully' , user: {"name": name, } }
    }catch (err) {
      return { error: "Error updating User"}
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

      return { message: 'Successful login', id: user.user_id, name: user.name, email: user.email}

    }catch (e) {
      throw e
    }
  }

  static async findByEmail({ email }) {
    try {
      const [results] = await pool.query(
        'SELECT user_id, name, email FROM Users WHERE email = ?;',[email]
      )

      return results[0]
    }catch (err) {
      return { message: "Error getting User"}
    }
  }

  static async resetPassword({ input }) {
    const {
      id,
      password
    } = input

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        'UPDATE Users SET password = ? WHERE user_id = ?;',
        [hashedPassword, id]
      )
      return { message: 'Password updated successfully' };
    }catch (err) {
      return { message: "Error updating password"}
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
        Ex.name AS Exercise_Name,
        ExC.note AS Note,
        ExC.exerciseP_id AS ExerciseP_id,
        ExC.reps AS Repetitions,
        ExC.sets AS Sets,
        ExC.weight AS Weight,
        ExC.rest AS Rest,
        ExC.duration AS Duration,
        ExC.intensity AS Intensity,
        D.name AS Day_Name,
        IF(Fav.exerciseP_id IS NOT NULL, TRUE, FALSE) AS Is_Favorite
    FROM 
        ExercisesConfigurationsDays ExCD
    LEFT JOIN 
        ExercisesConfigurations ExC ON ExCD.exerciseP_id = ExC.exerciseP_id
    LEFT JOIN 
        Exercises Ex ON ExC.exercise_id = Ex.exercise_id
    LEFT JOIN 
        Days D ON ExCD.day_id = D.day_id
    LEFT JOIN 
        Favourites Fav ON ExCD.exerciseP_id = Fav.exerciseP_id AND Fav.user_id = ?
    WHERE 
        ExCD.user_id = ? AND
        ExCD.day_id = ?;
    `;
    try {
      const [routine] = await pool.query(query,[ user_id, user_id, day_id] )
      console.log('Rutina \n:' + routine)
      return routine

    }catch(err) {
      console.log(err)
      console.error('Error getting the routine')
      throw err
    }
  }

}