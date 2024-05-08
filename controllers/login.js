import { validatePartialUser } from '../schemas/users.js'

export class LoginController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  getAll = async (req, res) => {
    const users = await this.userModel.getAll()
    res.json(users)
  }

  create = async (req, res) => {
    const result = validateUser(req.body)

    if(!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    try {
      const newUser = await this.userModel.create({ input: result.data })

      res.status(201).json(newUser);
    } catch (e) {
      if (e.message.includes("ER_DUP_ENTRY")) {
        return res.status(409).json({ error: "Email already exists." });
      } else {
          res.status(500).json({ error: "Internal Server Error. Please try again later." });
      }
    }
  }

  findOne = async (req, res) => {
    const result = validatePartialUser(req.body)

    if(!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    const loginUser = await this.userModel.findOne({ input: result.data })

    res.status(200).json(loginUser)
  }
}