import z from 'zod'

const userSchema = z.object({
  name: z.string({
    invalid_type_error: 'User name must be a string',
    required_error: 'User name is requires'
  }),
  email: z.string().email({
    message: 'Invalid email address'
  }),
  password: z.string().min(4),

})

export function validateUser (input) {
  return userSchema.safeParse(input)
}