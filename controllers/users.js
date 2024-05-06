import { validateUser} from '../schemas/users.js'

export class UserController {
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
}