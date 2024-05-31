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
      intensity,
      note
      
    } = input

    
    try {
      const [result] = await pool.query(
        'INSERT INTO ExercisesConfigurations ( exercise_id, user_id, reps, sets, weight, rest, duration, intensity, note ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [exercise_id, user_id, reps, sets, weight, rest, duration, intensity, note]
      )

      return { message: 'Custom Exercise created successfully', id: result.insertId };
    }catch (err) {
      throw { message: "Error creating Exercise"}
    }
  }

  static async setHistoryExercise ({ exercise_id, exerciseP_id, user_id, reps, sets, weight, rest, duration, intensity, note }) {
    try {

  
      let exerciseIdToInsert = exercise_id;
  
      console.log('Estoo' + reps, sets, weight, rest, duration, intensity, note)
      // Si exerciseP_id está definido, obtener exercise_id asociado
      if (exerciseP_id !== undefined) {
        const [exerciseIdResult] = await pool.query(
          'SELECT exercise_id FROM ExercisesConfigurations WHERE exerciseP_id = ?',
          [exerciseP_id]
        );
  
        if (exerciseIdResult.length === 0) {
          return { message: "No se encontró el exercise_id para el exerciseP_id proporcionado" };
        }
  
        exerciseIdToInsert = exerciseIdResult[0].exercise_id;
        console.log('Si: ' + exerciseIdToInsert)
      }
  
      // Insertar en ExercisesHistory usando el exercise_id obtenido o proporcionado
      const [result] = await pool.query(
        'INSERT INTO ExercisesHistory (user_id, exercise_id, reps, sets, weight, rest, duration, intensity, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [user_id, exerciseIdToInsert, reps, sets, weight, rest, duration, intensity, note]
      );
  
      return { message: "Exercise added to history successfully" };
    } catch (err) {
      console.log(err);
      return { message: "Error setting Exercise", err };
    }
  }
  

  static async getHistoryExercises ({ user_id }) {
    try {
      const [exercises] = await pool.query(
        `SELECT E.name, EH.exercise_id, reps, sets, weight, rest, duration, intensity, note, EH.created_at 
        FROM ExercisesHistory EH
        JOIN Exercises E ON E.exercise_id = EH.exercise_id
        WHERE user_id = ?;`,
        [user_id]
      )

      return exercises
    }catch (err) {
      console.error(err)
      return { message: "Error getting Exercise1414", err}
    }
  }

  static async getExerciseById({ exerciseP_id, user_id  }) {

    try {
      const [exercise] = await pool.query(
        `SELECT E.name, exerciseP_id, reps, sets, weight, rest, duration, intensity, note 
        FROM ExercisesConfigurations AS EC
        JOIN Exercises E ON EC.exercise_id = E.exercise_id 
        WHERE exerciseP_id = ?
        AND user_id = ?;`
        ,[exerciseP_id, user_id])
  
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
      note,
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
        intensity = COALESCE(?, intensity),
        note = COALESCE(?, note)
      WHERE exerciseP_id = ? AND
      user_id = ?;
      `, [reps, sets, weight, rest, duration, intensity, note, exerciseP_id, user_id])

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

  static async getExerciseByRole ({ role_id, user_id }) {
    try{
      const query = `
        SELECT EC.exerciseP_id, E.name, EC.note, EC.reps, EC.sets, EC.weight, EC.rest, EC.duration, EC.intensity
        FROM ExercisesConfigurations EC
        JOIN Exercises E ON EC.exercise_id = E.exercise_id
        WHERE EC.user_id = ? AND E.role = ?;
      `
      const[exercises] = await pool.query(query, [user_id, role_id])
      if(exercises.length === 0){
        return { error: "No exercises found"}
      }
      return exercises
    }catch (err) {
      console.error(err)
      return { message: "Error getting Exercise"}
    }
  }

  static async getExercisesByIntensity ({ user_id, intensity }) {
    try{
      const query = `
        SELECT EC.exerciseP_id, E.name, EC.note, EC.reps, EC.sets, EC.weight, EC.rest, EC.duration, EC.intensity
        FROM ExercisesConfigurations EC
        JOIN Exercises E ON EC.exercise_id = E.exercise_id
        WHERE EC.user_id = ? AND EC.intensity = ?;
      `
      const[exercises] = await pool.query(query, [user_id, intensity])
      console.log(exercises)
    }catch (err) {
      console.error(err)
      return { message: "Error getting Exercise"}
    }
  }

  static async getRecentExercises ({ user_id }) {
    try{
      const query = `
      SELECT 
      EC.exerciseP_id, 
      E.name,
      E.role, 
      EC.reps, 
      EC.sets, 
      EC.weight, 
      EC.rest, 
      EC.duration,
      EC.note, 
      EC.intensity
      FROM 
          ExercisesConfigurations EC
      JOIN 
          Exercises E ON EC.exercise_id = E.exercise_id
      WHERE 
          EC.user_id = ? AND
          EC.exerciseP_id IN (
              SELECT MIN(subEC.exerciseP_id)
              FROM ExercisesConfigurations subEC
              WHERE subEC.user_id = EC.user_id
              GROUP BY subEC.exercise_id
          )
      ORDER BY 
          EC.exerciseP_id DESC
      LIMIT 10;  
      `
      const[exercises] = await pool.query(query, [user_id, user_id])
      console.log(exercises)
      return exercises
    }catch (err) {
      console.error(err)
      return { message: "qError getting Exercise"}
    }
  }

  static async getExercisesByMuscleGroup({ user_id, muscle_group_id }) {
    try {
      const query = `
      SELECT 
      EC.exerciseP_id, 
      E.name,
      E.role, 
      EC.reps, 
      EC.sets, 
      EC.weight, 
      EC.rest, 
      EC.duration,
      EC.note, 
      EC.intensity
      FROM 
          ExercisesConfigurations EC
      JOIN 
          Exercises E ON EC.exercise_id = E.exercise_id
      WHERE 
          EC.user_id = ? AND 
          E.muscle_group_id = ? AND
          EC.exerciseP_id IN (
              SELECT MIN(subEC.exerciseP_id)
              FROM ExercisesConfigurations subEC
              WHERE subEC.user_id = EC.user_id
              GROUP BY subEC.exercise_id
      );
  
      `
      const [exercises] = await pool.query(query, [user_id, muscle_group_id])
      if(exercises.length === 0){ 
        return { error: "No exercises found"}
      }
      return exercises
    } catch (err) {
      console.error(err)
      return { message: "Error getting Exercise"}
    }
  }

  static async setFavourite({ user_id, exerciseP_id }) {
    try{
      const query = `
        INSERT INTO Favourites (user_id, exerciseP_id)
        VALUES (?, ?)
      `
      const[results] = await pool.query(query, [user_id, exerciseP_id])
      return results
    }catch (err) {
      console.log(err)
    }
  }

  static async deleteFavourite({ user_id, exerciseP_id}) {
    try {
      const query = `
        DELETE 
        FROM Favourites 
        WHERE user_id = ? AND
        exerciseP_id = ? 
      `

      const[results] = await pool.query(query, [user_id, exerciseP_id])
    }catch (err) {
      console.log(err)
    }
  }

  static async getFavourites({ user_id }) {
    try{
      const query = `
        SELECT EC.exerciseP_id, E.name, EC.note, EC.reps, EC.sets, EC.weight, EC.rest, EC.duration, EC.intensity
        FROM ExercisesConfigurations EC
        JOIN Exercises E ON EC.exercise_id = E.exercise_id
        JOIN Favourites F ON EC.exerciseP_id = F.exerciseP_id
        WHERE EC.user_id = ?;
      `
      const[results] = await pool.query(query, [user_id])
      console.log('hola: ' + results)
      return results
    }catch (err) {
      console.log(err)
    }
  }

  static async setExerciseToDay({ input }) {
    
    try {
      const {
        exerciseP_id,
        day_id,
        user_id
      } = input
      console.log(input)
      const [results] = await pool.query(
        'INSERT INTO ExercisesConfigurationsDays (exerciseP_id, day_id, user_id) VALUES (?, ?, ?);',
        [exerciseP_id, day_id, user_id]
      )
      return { message: 'Exercise added to day successfully' };
    }catch (err) {
      console.log(err)
    }
  }
}