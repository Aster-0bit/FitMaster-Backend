import { validateUser } from '../schemas/users.js'

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  getAll = async (req, res) => {
    const gusers = await this.userModel.getAll()
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

  getUserByID = async (req, res) => {
    const userId = req.user.id

    try{
      const user = await this.userModel.getUserByID({ id: userId })
      if (!user) {
        return res.status(404).json({"message": "Invalid session, pleasy try again later."})
      }
      res.json(user)
    }catch(e){
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }
}