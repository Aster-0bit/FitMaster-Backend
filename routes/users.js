import { Router } from 'express'
import { UserController } from '../controllers/users.js'
import { verifyToken } from '../middlewares/jwt.js'

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  usersRouter.get('/users', userController.getAll)
  usersRouter.post('/', userController.create)
  usersRouter.put('/update', verifyToken, userController.updateUser)
  usersRouter.get('/', verifyToken, userController.getUserByID)

  usersRouter.get('/favourites', verifyToken, userController.getFavoritesById)
  usersRouter.get('/routine/:day', verifyToken, userController.getRoutineByDay)
  usersRouter.post('/forgot-password', userController.forgotPassword)
  usersRouter.post('/reset-password/:token', userController.resetPassword)
  return usersRouter
}