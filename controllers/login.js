import { validatePartialUser } from '../schemas/users.js'

export class LoginController {
  constructor({ userModel }) {
    this.userModel = userModel
  }
  // Función para crear usuarios
  create = async (req, res) => {
    // Validación del body de la petición
    const result = validateUser(req.body)

    if(!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    try {
      // Creación del nuevo usuario haciendo uso de la función del modelo
      const newUser = await this.userModel.create({ input: result.data })
      // Responde con el estado 201, y con el reultado de la función del modelo
      res.status(201).json(newUser);
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
  }

  findOne = async (req, res) => {

    const { accesToken, refreshToken } = req.tokens

    res.cookie('token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict' ,
      maxAge: 4 * 24 * 60 * 60 * 1000
    })

    res.json({
      token: accesToken
    })
  }
}