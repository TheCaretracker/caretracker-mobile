export const requiredMessage = (fieldName: string) =>
  `${fieldName} is a required field`

export const testTime = (value) => {
  const parts = value.split(' ')

  if (parts.length !== 2) {
    return 'Invalid time format'
  }

  const timePattern = /^(0[1-9]|1[0-2]):[0-5][0-9]$/

  if (!timePattern.test(parts[0])) {
    return 'Invalid time format'
  }

  if (parts[1] !== 'AM' && parts[1] !== 'PM') {
    return 'Need to select AM or PM period'
  }

  return 'Valid time format'
}
