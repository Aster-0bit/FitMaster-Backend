import { Router } from 'express'
import { ExerciseController } from '../controllers/exercises.js'
import { verifyToken } from '../middlewares/jwt.js'

export const createExerciseRouter = ({ exerciseModel }) => {
  const exerciseRouter = Router()

  const exerciseController = new ExerciseController({ exerciseModel })

  exerciseRouter.get('/', exerciseController.getAllExercises)
  exerciseRouter.get('/:exerciseId', verifyToken, exerciseController.getExerciseById)
  exerciseRouter.get('/role/:role', verifyToken, exerciseController.getExerciseByRole)

  exerciseRouter.post('/', verifyToken, exerciseController.createExercise)
  exerciseRouter.put('/:exerciseId', verifyToken, exerciseController.updateExercise)
  exerciseRouter.delete('/:exerciseId/day/:dayId', verifyToken, exerciseController.deleteExerciseFromDay)
  exerciseRouter.delete('/:exerciseId', verifyToken, exerciseController.deleteExerciseFromAllDays)

  return exerciseRouter
}