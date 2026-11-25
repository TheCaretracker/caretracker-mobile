export const camelToSnake = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item))
  }

  const snakeObj: any = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (match) => `_${match.toLowerCase()}`
      )
      snakeObj[snakeKey] = camelToSnake(obj[key])
    }
  }

  return snakeObj
}
