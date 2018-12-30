type ApiErrorArgs = {
  error: string
  message: string
  needAuth?: boolean
}

export class ApiError extends Error {
  error: string
  needAuth: boolean | undefined

  constructor({ error, message, needAuth }: ApiErrorArgs) {
    super(message)
    this.error = error
    this.needAuth = needAuth
    Error.captureStackTrace(this, ApiError)
  }
}
