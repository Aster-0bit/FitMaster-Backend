import { Router } from 'express'
import { UserController } from '../controllers/users.js'
import { LoginController } from '../controllers/login.js'

export const createUserRouter = ({ userModel }) => {
  const usersRouter = Router()
  const loginRouter = Router()

  const userController = new UserController({ userModel })
  const loginController = new LoginController({ userModel })

  usersRouter.get('/', userController.getAll)
  usersRouter.post('/', userController.create)
  loginRouter.post('/login', loginController.findOne)
  
  return usersRouter
}