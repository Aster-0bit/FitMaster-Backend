import { Router } from 'express'
import { UserController } from '../controllers/users.js'
import { verifyToken } from '../middlewares/jwt.js'

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  usersRouter.get('/users', userController.getAll)
  usersRouter.post('/', userController.create)
  usersRouter.get('/', verifyToken, userController.getUserByID)
  usersRouter.get('/favourites', verifyToken, userController.getFavoritesById)
  
  return usersRouter
}