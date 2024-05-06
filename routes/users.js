import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  usersRouter.get('/', userController.getAll)
  usersRouter.post('/', userController.create)

  return usersRouter
}