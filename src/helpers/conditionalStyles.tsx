export const longNameStyle = (nameLength) => {

  if (nameLength > 16) {
    return {
      fontSize: 12,
    }
  }
  return {}
}
