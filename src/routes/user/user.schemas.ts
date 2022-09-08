import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const userCore = {
  email: z
    .string({
      required_error: "Το email είναι απαραίτητο",
      invalid_type_error: "Το πεδίο πρέπει να είναι email",
    })
    .trim()
    .email({ message: 'Το πεδίο πρέπει να είναι email' }),
  username: z.string({ required_error: 'Το username ειναι απαραίτητο' }),
  password: z
    .string({
      required_error: 'Ο κωδικός είναι απαραίτητος',
      invalid_type_error: ''
    })
    .trim()
    .min(8, 'Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες')
    .regex(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]'), 'Ο κωδικός πρέπει να περιέχει ένα σύμβολο και ένα κεφαλαίο γράμμα'),
}

const registerRequest = z.object({
  ...userCore,
  confirmPassword: z
    .string({
      required_error: 'Η επιβεβαίωση του κωδικού είναι απαραίτητη'
    }),
  aggreement: z
    .boolean({
      required_error: 'Πρέπει να αποδεχτείτε τους όρους χρήσης για να εγγραφείτε στον ιστότοπό μας',
    })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Οι κωδικοί δεν ταιριάζουν',
})

const registerResponse = z.object({
  jwt: z.string(),
  message: z.string()
})

const signInRequest = z.object({ ...userCore })

const signInResponse = z.object({
  jwt: z.string()
})

const getUserDataRequest = z.object({
  id: z.number()
})

const getUserDataResponse = z.object({
  username: z.string(),
  email: userCore.email,
  image: z.string().optional(),
  roles: z.string().array()
})

const updateUserDataResponse = z.object({
  username: z.string().optional(),
  image: z.string().optional(),
})

// Passwords

const updatePasswordRequest = z.object({
  password: userCore.password,
  confirmPassword: z
    .string({
      required_error: 'Η επιβεβαίωση του κωδικού είναι απαραίτητη'
    }),
}).refine(form => form.password === form.confirmPassword, {
  message: 'Οι κωδικοί δεν ταιριάζουν',
  path: ['confirmPassword']
})

const updatePasswordResponse = z.object({
  jwt: z.string()
})

const resetPasswordTokenRequest = z.object({
  email: userCore.email
})

const resetPasswordTokenResponse = z.object({})

const resetPasswordRequest = z.object({
  reset_token: z.string({
    required_error: 'Το token είναι απαραίτητο για την επαναφορά του κωδικού'
  }),
  password: userCore.password,
  confirmPassword: z
    .string({
      required_error: 'Η επιβεβαίωση του κωδικού είναι απαραίτητη'
    }),
}).refine(form => form.password === form.confirmPassword, 'Οι κωδικοί δεν ταιριάζουν')

const resetPasswordResponse = z.object({})

export type IRegisterRequest = z.infer<typeof registerRequest>

export type IRegisterResponse = z.infer<typeof registerResponse>

export type ISignInRequest = z.infer<typeof signInRequest>

export type ISignInResponse = z.infer<typeof signInResponse>

export type IUpdatePasswordRequest = z.infer<typeof updatePasswordRequest>

export type IUpdatePasswordResponse = z.infer<typeof updatePasswordResponse>

export type IResetPasswordRequest = z.infer<typeof resetPasswordRequest>

export type IResetPasswordResponse = z.infer<typeof resetPasswordResponse>

export type IResetPasswordTokenRequest = z.infer<typeof resetPasswordTokenRequest>

export type IResetPasswordTokenResponse = z.infer<typeof resetPasswordTokenResponse>

export type IGetUserDataRequest = z.infer<typeof getUserDataRequest>

export type IGetUserDataResponse = z.infer<typeof getUserDataResponse>

export type IUpdateUserDataResponse = z.infer<typeof updateUserDataResponse>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  registerRequest,
  registerResponse,
  signInRequest,
  signInResponse,
  updatePasswordRequest,
  updatePasswordResponse,
  resetPasswordRequest,
  resetPasswordResponse,
  resetPasswordTokenRequest,
  resetPasswordTokenResponse,
  getUserDataRequest,
  getUserDataResponse,
  updateUserDataResponse
})