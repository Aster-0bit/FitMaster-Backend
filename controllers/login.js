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
        secure: true,
        maxAge: 4 * 24 * 60 * 60 * 1000,
        sameSite: 'strict'
      }

      // Enviar el token de refresco en la respusta de la petición
      return res.status(200).json({ token: accessToken })

    }catch(err) {
      res.status(500).json({ error: "Internal Server Error. Please try again later"})
    }
  }

  // Esta función se encarga de refrescar los tokens de acceso
  refreshToken = async (req, res)  => {
    // Obtener el token de refresco de la cookie
    const { refreshToken } = req.cookies

    console.log(refreshToken)
    // Comprobar que el token de refresco exista
    if(!refreshToken) {
      return res.status(401).json({"message": "Something went wrong"})
    }

    // Verificar el token de refresco
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)

      // Generar un nuevo token de acceso
      const accessToken = jwt.sign({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
      }, process.env.SECRET, { expiresIn: '3h'})

      // Enviar el token de acceso en la respusta de la petición
      return res.status(200).json({ token: accessToken })

    }catch(err) {
      
      return res.status(401).json({"message": "Invalid session. Please log in again"})
    }

  }
}
