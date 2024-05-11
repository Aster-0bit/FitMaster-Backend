import { Router } from 'express'
import { LoginController } from '../controllers/login.js'

export const createLoginRouter = ({ userModel }) => {
  const loginRouter = Router()

  const loginController = new LoginController({ userModel })

  loginRouter.post('/', loginController.findOne)
  loginRouter.post('/refresh', loginController.refreshToken)
  
  return loginRouter
}