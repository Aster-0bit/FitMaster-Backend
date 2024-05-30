import z from 'zod';

const exerciseSchema = z.object({
  user_id: z.number({
    required_error: 'User ID is required'
  }).int({ message: 'User ID must be an integer' }),
  exercise_id: z.number({
    required_error: 'Exercise ID is required'
  }).int({ message: 'Exercise ID must be an integer' }),
  reps: z.number({
    invalid_type_error: 'Repetitions must be a number',
    required_error: 'Repetitions are required'
  }).min(0, { message: "Repetitions must be at least 1" }).optional(),
  sets: z.number({
    invalid_type_error: 'Sets must be a number',
    required_error: 'Sets are required'
  }).min(0, { message: "Sets must be at least 1" }).optional(),
  weight: z.number({
    invalid_type_error: 'Weight must be a number'
  }).optional(),
  duration: z.number({
    invalid_type_error: 'Duration must be a number'
  }).optional(),
  intensity: z.enum(['Alta', 'Media', 'Baja', ""]).optional(),
  rest: z.number({
    invalid_type_error: 'Rest must be a number',
    required_error: 'Rest are required'
  }).min(0, { message: "Rest must be at least 1" }).optional(),
  note: z.string().optional()
});

export function validateExercise(input) {
  return exerciseSchema.safeParse(input);
}

export function validatePartialExercise(input) {
  return exerciseSchema.partial().safeParse(input);
}
