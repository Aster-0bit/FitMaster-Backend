import { Router } from 'express'
import { LoginController } from '../controllers/login.js'
import { authMiddleware } from '../middlewares/jwt.js'

export const createLoginRouter = ({ userModel }) => {
  const loginRouter = Router()

  const loginController = new LoginController({ userModel })

  loginRouter.post('/', authMiddleware, loginController.findOne)
  
  return loginRouter
}