import { CaredForData } from '@/types/caredFor'
import { camelToSnake } from '@/utils/case'

export const formatCaredForFormToApi = (values: CaredForData) => {
  const attributesValues = Object.keys(values).reduce((acc, key) => {
    const value = values[key]
    if (Array.isArray(value)) {
      return { ...acc, [`${key}Attributes`]: value }
    }
    return { ...acc, [key]: value }
  }, {})

  console.log(attributesValues)

  return camelToSnake(attributesValues)
}
