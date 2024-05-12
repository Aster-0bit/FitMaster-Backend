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


export class ExerciseModel {
  static async getAllExercises() {
    const [exercises] = await pool.query(
      'SELECT exercise_id, name, role, description, muscle_group_id FROM Exercises'
    )

    return exercises
  }

  static async createExercise ({ input }) {
    const {
      exercise_id,
      user_id,
      reps,
      sets,
      weight,
      rest,
      duration,
      intensity
      
    } = input

    console.log(input)
    try {
      const [result] = await pool.query(
        'INSERT INTO ExercisesConfigurations ( exercise_id, user_id, reps, sets, weight, rest, duration, intensity ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [exercise_id, user_id, reps, sets, weight, rest, duration, intensity]
      )
      return { message: 'Custom Exercise created successfully' };
    }catch (err) {
      throw { message: "Error creating Exercise"}
    }
  }

  

  static async getExerciseById({ id }) {

    try {
      const [exercise] = await pool.query(
        `SELECT reps, sets, weight, rest, duration, intensity 
        FROM ExercisesConfigurations 
        WHERE exerciseP_id = ?;`
        ,[id])
  
      if (exercise.length === 0) return null
  
      return exercise[0]
    }catch (err) {
      return { message: "Error getting Exercise"}
    }
  }

  static async updateExerciseById({ input }) {
    const {
      reps,
      sets,
      weight,
      rest,
      duration,
      intensity,
      exerciseP_id,
      user_id
      
    } = input

    try {
      const [exercise] = await pool.query(`
      UPDATE ExercisesConfigurations
      SET 
        reps = COALESCE(?, reps),
        sets = COALESCE(?, sets),
        weight = COALESCE(?, weight),
        rest = COALESCE(?, rest),
        duration = COALESCE(?, duration),
        intensity = COALESCE(?, intensity)
      WHERE exerciseP_id = ? AND
      user_id = ?;
      `, [reps, sets, weight, rest, duration, intensity, exerciseP_id, user_id])

      return { message: "Exercise updated successfully"}
    }catch (err) {
      console.error(err)
      return { message: "Error updating Exercise"}
    }
  }

  static async deleteExerciseFromDay({ exerciseP_id, day_id, user_id }) {
    try {
      const [result] = await pool.query(
        'DELETE FROM ExercisesConfigurationsDays WHERE exerciseP_id = ? AND day_id = ? AND user_id = ?;',
        [exerciseP_id, day_id, user_id]
      )
      return { message: "Exercise deleted from specific day successfully" }
    } catch (err) {
      console.error(err)
      return { message: "Error deleting Exercise from day" }
    }
  }

  static async deleteExerciseFromAllDays({ exerciseP_id, user_id }) {
    try {
      await pool.query('START TRANSACTION')
      await pool.query(
        'DELETE FROM ExercisesConfigurationsDays WHERE exerciseP_id = ? AND user_id = ?;',
        [exerciseP_id, user_id]
      )
      await pool.query(
        'DELETE FROM ExercisesConfigurations WHERE exerciseP_id = ? AND user_id = ?;',
        [exerciseP_id, user_id]
      )
      await pool.query('COMMIT')
      return { message: "Exercise deleted from all days successfully" }
    } catch (err) {
      console.error(err)
      await pool.query('ROLLBACK')
      return { message: "Error deleting Exercise from all days" }
    }
  }

}