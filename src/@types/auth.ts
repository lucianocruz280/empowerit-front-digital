export type SignInCredential = {
  email: string
  password: string
}

export type SignInResponse = {
  token: string
  user: {
    uid?: string
    name: string
    authority: string[]
    avatar: string
    email: string
  }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
  uid?: string
  name: string
  email: string
  password: string
  position: 'left' | 'right'
  sponsor: string
  sponsor_id: string
  subscription_expires_at?: Date
  action?: string
  rank?: string
  presenter1: string
  presenter2?: string | null
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  password: string
}

export type UserDoc = {
  left: string
  right: string
  id: string
  position: 'left' | 'right'
  avatar: string
  is_admin: boolean
  name?: string
  email?: string
  sponsor?: string
  subscription_expires_at?: {
    seconds: number
  }
  rank?: string
}
