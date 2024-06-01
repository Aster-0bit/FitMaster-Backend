import { Router } from 'express'
import { ExerciseController } from '../controllers/exercises.js'
import { verifyToken } from '../middlewares/jwt.js'

export const createExerciseRouter = ({ exerciseModel }) => {
  const exerciseRouter = Router()

  const exerciseController = new ExerciseController({ exerciseModel })


  exerciseRouter.post('/add/history', verifyToken, exerciseController.setExerciseHistory)
  exerciseRouter.get('/', exerciseController.getAllExercises)
  exerciseRouter.get('/role/:role', verifyToken, exerciseController.getExerciseByRole)
  exerciseRouter.get('/recent', verifyToken, exerciseController.getRecentExercises)
  exerciseRouter.get('/muscle-group/:muscleGroupId', verifyToken, exerciseController.getExercisesByMuscleGroup)
  exerciseRouter.get('/favourite', verifyToken, exerciseController.getFavourites)
  exerciseRouter.get('/history', verifyToken, exerciseController.getExerciseHistory)
  exerciseRouter.get('/:exerciseId', verifyToken, exerciseController.getExerciseById)
  exerciseRouter.get('/intensity/:intesity', verifyToken, exerciseController.getExercisesByIntensity)

  exerciseRouter.post('/id/:exerciseId/day/:dayId', verifyToken, exerciseController.setExerciseToDay)
  exerciseRouter.post('/favourite/:exerciseId', verifyToken, exerciseController.setFavourite)
  exerciseRouter.delete('/favourite/:exerciseId', verifyToken, exerciseController.deleteFavourite)
  exerciseRouter.post('/', verifyToken, exerciseController.createExercise)
  exerciseRouter.put('/:exerciseId', verifyToken, exerciseController.updateExercise)
  exerciseRouter.delete('/:exerciseId/day/:dayId', verifyToken, exerciseController.deleteExerciseFromDay)
  exerciseRouter.delete('/:exerciseId', verifyToken, exerciseController.deleteExerciseFromAllDays)
  exerciseRouter.post('/exercises-with-days', verifyToken, exerciseController.createExerciseWithDays);
  exerciseRouter.get('/routine/all', verifyToken, exerciseController.getRoutineForAllDays);
  return exerciseRouter
}