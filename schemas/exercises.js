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
  }).min(0, { message: "Repetitions must be at least 0" }).optional(),
  sets: z.number({
    invalid_type_error: 'Sets must be a number',
    required_error: 'Sets are required'
  }).min(0, { message: "Sets must be at least 0" }).optional(),
  weight: z.number({
    invalid_type_error: 'Weight must be a number'
  }).optional(),
  duration: z.number({
    invalid_type_error: 'Duration must be a number'
  }).optional(),
  intensity: z.enum(['Alta', 'Media', 'Baja', ""]).optional(),
  rest: z.number({
    invalid_type_error: 'Rest must be a number',
    required_error: 'Rest is required'
  }).optional(),
  note: z.string().optional(),
  days: z.array(z.number({
    invalid_type_error: 'Day ID must be a number'
  })).min(1, { message: 'At least one day is required' }) // Agregado el campo days
});

export function validateExercise(input) {
  return exerciseSchema.safeParse(input);
}

export function validatePartialExercise(input) {
  return exerciseSchema.partial().safeParse(input);
}
