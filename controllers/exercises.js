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
    const exercise = await this.exerciseModel.getExerciseById({id: req.params.exerciseId})
    if (!exercise) {
      return res.status(404).json({"message": "Exercise not found"})
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

}
