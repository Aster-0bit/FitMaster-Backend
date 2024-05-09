import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Something went wrong' });
  }

  const token = req.headers.authorization.split(' ')[1]

  if(!token) {
    return res.status(401).json({message: 'Something went wrong'})
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    console.log(decoded)
    req.user = { id: decoded.userId }
    next()
  }catch(e) {
    return res.status(401).json({ message: 'Invalid session. Please log in again. '})
  }
}
