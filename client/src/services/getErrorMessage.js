// Turns an axios error into a readable message, understanding ASP.NET's
// ProblemDetails / ValidationProblemDetails response shapes
function getErrorMessage(error) {
  if (!error.response) return 'Cannot reach the server. Check your connection.'

  const { status, data } = error.response

  // ValidationProblemDetails: { errors: { FirstName: ['...'] } }
  if (data?.errors) {
    const messages = Object.values(data.errors).flat()
    if (messages.length > 0) return messages.join(' ')
  }
  if (typeof data === 'string' && data) return data
  if (data?.detail) return data.detail
  if (data?.title) return data.title

  if (status === 404) return 'This person no longer exists.'
  if (status >= 500) return 'Something went wrong on the server.'
  return `Request failed (${status}).`
}

export default getErrorMessage
