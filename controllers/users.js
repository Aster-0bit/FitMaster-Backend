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

    const newUser = await this.userModel.create({ input: result.data })

    if(newUser.error) {
      return res.status(400).json({ error: newUser.error })
    }
    
    res.status(201).json(newUser)
  }
}