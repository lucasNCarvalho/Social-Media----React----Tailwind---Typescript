import * as z from "zod"

export const SignupValidation = z.object({
  name: z.string().min(2, { message: 'Seu nome precisa ter ao menos 2 caracteres' }),
  userName: z.string().min(2, { message: 'Seu nome de usuário precisa ter ao menos 2 caracteres' }),
  email: z.string().email(),
  password: z.string().min(5, { message: 'A senha precisa ter no minimo 8 caracteres.' })
})


export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(5, { message: 'A senha precisa ter no minimo 8 caracteres.' })
})

export const PostValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string()
})
