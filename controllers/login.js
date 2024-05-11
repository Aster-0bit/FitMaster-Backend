import { validatePartialUser } from '../schemas/users.js'
import jwt from 'jsonwebtoken';

export class LoginController {
  constructor({ userModel }) {
    this.userModel = userModel
  }
  // Esta función se encarga de hacer login y devolver tokens de acceso y refreso
  findOne = async (req, res) => {
    // Validación del body de la petición
    const result = validatePartialUser(req.body)

    // Comprobar que la validación sea satisfactoria
    if(!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    try {
      // Hacer uso de la función del modelo para recuperar información del usuario
      const user = await this.userModel.findOne({ input: result.data })

      // Comprobar que el usuario contenga el id
      if(!user.id) {
        return res.status(400).json({error: "Something went wrong"})
      }

      // Generar tokens de acceso y refresco
      const accessToken = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name
      }, process.env.SECRET, { expiresIn: '3h' })

      const refreshToken = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name
      }, process.env.REFRESH_SECRET, { expiresIn: '4d' })

      // Enviar un token de refresco en una cookie HttpOnly
      res.cookie('refreshToken', refreshToken), {
        httpOnly: true,
        secure: false,
        maxAge: 4 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
      }

      // Enviar el token de refresco en la respusta de la petición
      return res.status(200).json({ token: accessToken })

    }catch(err) {
      res.status(500).json({ error: "Internal Server Error. Please try again later"})
    }
  }

  refreshToken = async (req, res)  => {
    const { token } = req.cookies

    if(!token) {
      return res.status(401).json({"message": "Something went wrong"})
    }

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET)

      const accessToken = jwt.sign({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      }, process.env.SECRET, { expiresIn: '3h'})

      return res.status(200).json({ token: accessToken })

    }catch(err) {
      return res.status(401).json({"message": "Invalid session. Please log in again"})
    }

  }
}