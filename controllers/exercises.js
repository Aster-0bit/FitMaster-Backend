import { validateExercise, validatePartialExercise } from '../schemas/exercises.js'

export class ExerciseController {
  constructor({ exerciseModel }) {
    this.exerciseModel = exerciseModel
  }

  getAllExercises = async (req, res) => {
    const exercises = await this.exerciseModel.getAllExercises()
    res.json(exercises)
  }

  getExerciseById = async (req, res) => {
    const exercise = await this.exerciseModel.getExerciseById({exerciseP_id: req.params.exerciseId, user_id: req.user.id})
    if (!exercise) {
      return res.status(404).json({"message": "12Exercise not found"})
    }
    res.json(exercise)
  }

  createExercise = async (req, res) => {
    const result = validateExercise({...req.body, user_id: req.user.id})

    if(!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    try {
      console.log(req.user)
      console.log(req.user.id)
      const newExercise = await this.exerciseModel.createExercise({ input: {...result.data, user_id: req.user.id} })
      res.json(newExercise)
    }catch(err){
      console.error("Error creating exercise:", e);
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }

  updateExercise = async (req, res) => {
    const result = validatePartialExercise(req.body)

    if(!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    try {
      const updatedExercise = await this.exerciseModel.updateExerciseById({ input:{...result.data, exerciseP_id: req.params.exerciseId, user_id: req.user.id}  })
      res.json(updatedExercise)
    }catch(err){
      console.error("Error updating exercise:", e);
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }

  deleteExerciseFromDay = async (req, res) => {
    try {
      const deletedExercise = await this.exerciseModel.deleteExerciseFromDay({ exerciseP_id: req.params.exerciseId, day_id: req.params.dayId, user_id: req.user.id})
      res.json(deletedExercise)
    }catch(err){
      console.error("Error deleting exercise:", e);
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }

  deleteExerciseFromAllDays = async (req, res) => {
    try {
      const deletedExercise = await this.exerciseModel.deleteExerciseFromAllDays({ exerciseP_id: req.params.exerciseId, user_id: req.user.id})
      res.json(deletedExercise)
    }catch(err){
      console.error("Error deleting exercise:", e);
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }

  getExerciseByRole = async (req, res) => {
    const exercises = await this.exerciseModel.getExerciseByRole({role_id: req.params.role, user_id: req.user.id})
    if (exercises.error) {
      return res.status(404).json({"message": "Exercise not found"})
    }
    res.json(exercises)
  }

  getRecentExercises = async (req, res) => {
    const exercises = await this.exerciseModel.getRecentExercises({user_id: req.user.id})
    if (!exercises) {
      return res.status(404).json({"message": " Aquí Exercise not found"})
    }
    console.log('Estos son:' + exercises)
    res.json(exercises)
  }

  createExerciseWithDays = async (req, res) => {
    const result = validateExercise({ ...req.body, user_id: req.user.id })

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const newExercise = await this.exerciseModel.createExerciseWithDays({ input: { ...result.data, user_id: req.user.id } })
      res.status(201).json(newExercise)
    } catch (err) {
      console.error("Error creating exercise with days:", err)
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }

  getRoutineForAllDays = async (req, res) => {
    try {
      const routine = await this.exerciseModel.getRoutineForAllDays({ user_id: req.user.id });
      res.json(routine);
    } catch (err) {
      console.error('Error getting routine for all days:', err);
      res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }
  };

  getExercisesByMuscleGroup = async (req, res) => {
    const exercises = await this.exerciseModel.getExercisesByMuscleGroup({ user_id: req.user.id, muscle_group_id: req.params.muscleGroupId });
    if (exercises.error) {
      return res.status(404).json({ "error": "Exercises not found" });
    }
    res.json(exercises);
  }

  setFavourite = async (req, res) => {
    const results = await this.exerciseModel.setFavourite({ user_id: req.user.id, exerciseP_id: req.params.exerciseId })
      
    if (!results) {
      return res.status(404).json({ "message": "cant add favourite" });
    }

    return res.status(201).json({"message": "Favourite added succesfully"})
  }

  deleteFavourite = async (req, res) => {
    const results = await this.exerciseModel.deleteFavourite({ user_id: req.user.id, exerciseP_id: req.params.exerciseId})

    if(!results) {
      return res.status(404).json({ "message": "can't delete favourite" });
    }
    
    return res.status(201).json({"message": "Favourite deleted successfully"})
  }

  getFavourites = async (req, res) => {
    const exercises = await this.exerciseModel.getFavourites({ user_id: req.user.id })
    if (!exercises) {
      return res.status(404).json({ "message": "Exercises not found" });
    }
    res.json(exercises);
  }

  setExerciseToDay = async (req, res) => {
    const results = await this.exerciseModel.setExerciseToDay({ input: { user_id: req.user.id, exerciseP_id: req.params.exerciseId, day_id: req.params.dayId} })
    console.log('hola')
    if (!results) {
      return res.status(404).json({ "message": "cant add exercise to day" });
    }

    return res.status(201).json({"message": "Exercise history added succesfully"})
  }

  setExerciseHistory = async (req, res) => {
    console.log('************************' + JSON.stringify(req.body, null, 2) + '************************' )
    const results = await this.exerciseModel.setHistoryExercise( { ...req.body, user_id: req.user.id })

    console.log({...req.body, user_id: req.user.id })

    console.log(results)
    if (!results) {
      return res.status(404).json({ "message": "cant add exercise to day" });
    }

    return res.status(201).json({"message": "Exercise1213 added succesfully", "results": results})
  }

  getExercisesByIntensity = async (req, res) => {
    const exercises = await this.exerciseModel.getExercisesByIntensity({ user_id: req.user.id, intensity: req.params.intensity });
    
    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ "message": "Exercises not found" });
    }
    res.json(exercises);
  }

  getExerciseHistory = async (req, res) => {
    const exercises = await this.exerciseModel.getHistoryExercises({ user_id: req.user.id })
    if (!exercises) {
      return res.status(404).json({ "message": "Exercises not found" });
    }
    res.json(exercises);
  }
}
