import { z } from 'zod'

export const loginSchema = z.object({
  serverUrl: z.string().url('올바른 URL 형식이어야 합니다.'),
  username: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
