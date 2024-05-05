// import { validateUser, validatePartialUser } from '../schemas/users.js'

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
  }
  getAll = async (req, res) => {
    const users = await this.userModel.getAll()
    res.json(users)
  }
}