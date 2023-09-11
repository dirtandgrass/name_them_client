export type response = {
  message: string,
  success: boolean,
  loginRequired?: boolean,
  data?: any,
  error?: number
}