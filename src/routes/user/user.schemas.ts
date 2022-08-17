import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
  email: z
    .string({
      required_error: "Το email είναι απαραίτητο",
      invalid_type_error: "Το πεδίο πρέπει να είναι email",
    })
    .trim()
    .email({ message: 'Το πεδίο πρέπει να είναι email' }),
  password: z
    .string({
      required_error: 'Ο κωδικός είναι απαραίτητος',
      invalid_type_error: ''
    })
    .trim()
    .min(8, 'Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες')
    .regex(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]'), 'Ο κωδικός πρέπει να περιέχει ένα σύμβολο και ένα κεφαλαίο γράμμα'),
};

// Create user schema
const createUser = z.object({
  ...userCore,
  confirmationPassword: z
    .string({
      required_error: 'Η επιβεβαίωση του κωδικού είναι απαραίτητη'
    }),
  agreement: z
    .boolean({
      required_error: 'Πρέπει να αποδεχτείτε τους όρους χρήσης για να εγγραφείτε στο ηλεκτρονικό μας κατάστημα',
    })
}).refine(form => form.password === form.confirmationPassword, 'Οι κωδικοί δεν ταιριάζουν')

// Create user response
const createUserResponse = z.object({
  id: z.string(),
  jwt: z.string()
})

// Login user

// Login user response


// Update password

// Update password response


// Get user data

// Get user data response 


// Request reset jwt

// Request reset jwt response


// Request reset password token

// Request reset password token response


// Reset password 

// Reset password response



const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const createUserResponseSchema = z.object({
  ...userCore,
  id: z.number(),
  message: z.string(),
  // created_at: z.date()
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type ICreateUserInput = z.infer<typeof createUserSchema>;

export type ILoginInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
});