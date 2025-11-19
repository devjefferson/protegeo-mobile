export type TUser = {
  id: string
  name: string
  email: string
}

export type TAuthSession = {
  token: string
  user: TUser
}
