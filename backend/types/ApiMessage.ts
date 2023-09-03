export type response = {
  message: string,
  success: boolean,
  loginRequired?: boolean,
  data?: Record<string, unknown>
}