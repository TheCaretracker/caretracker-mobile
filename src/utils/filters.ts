export const countFilters = (filters) =>
  Object.values(filters).reduce((acc, value) => {
    acc += value.length
    return acc
  }, 0)
