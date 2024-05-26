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
    if (!exercises) {
      return res.status(404).json({"message": "1Exercise not found"})
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

  getExercisesByMuscleGroup = async (req, res) => {
    const exercises = await this.exerciseModel.getExercisesByMuscleGroup({ user_id: req.user.id, muscle_group_id: req.params.muscleGroupId });
    if (!exercises) {
      return res.status(404).json({ "message": "3Exercises not found" });
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
}
