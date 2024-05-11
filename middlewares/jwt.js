import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.js'
import { validatePartialUser } from '../schemas/users.js'

export const verifyToken = async (req, res, next) => {

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Something went wrong' });
  }

  const token = req.headers.authorization.split(' ')[1]
  console.log("Token: " + token)
  if(!token) {
    return res.status(401).json({message: 'Something went wrong'})
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    console.log("decoded Token" + decoded.userId)
    req.user = { id: decoded.userId }
    next()
  }catch(e) {
    return res.status(401).json({ message: 'Invalid session. Please log in again. '})
  }
}

export const authMiddleware = async (req, res, next) => {

  const result = validatePartialUser(req.body)

  if(!result.success) {
    return res.status(400).json({error: JSON.parse(result.error.message)})
  }

  try {
    const user = await this.userModel.findOne({ input: result.data })
    
    if(!user.id) {
      return res.status(400).json({error: "Something went wrong"})
    }

    const accessToken = jwt.sign({
      userId: user.user_id,
      name: user.name,
      email: user.email
    }, process.env.SECRET, {expiresIn: '3h'})

    const refreshToken = jwt.sign({
      userId: user.user_id,
      name: user.name,
      email: user.email
    }, process.env.REFRESH_SECRET, {expiresIn: '3h'})

    req.tokens = { accessToken: accessToken, refreshToken: refreshToken}
    next()

  }catch(e) {
    return res.status(401).json({ message: 'Invalid session. Please log in again. '})
  }

  
}