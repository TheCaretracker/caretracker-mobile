import yup from '@/yup/yup'
import { useState } from 'react'

interface CreateAccountValidationProps {
  schema: yup.Schema
  values: any
}

export const createAccountValidation = ({
  schema,
  values,
}: CreateAccountValidationProps) => {
  const [errors, setErrors] = useState({})

  const validateForm = (field: string = undefined) => {
    try {
      schema.validateSync(values, { abortEarly: false })
    } catch (err) {
      const errors = {}
      err.inner.forEach((error) => {
        errors[error.path] = error.message
      })

      if (field) {
        setErrors((previous) => {
          if (errors[field]) {
            return {
              ...previous,
              [field]: errors[field],
            }
          } else {
            const newObject = Object.keys(previous).reduce((acc, curr) => {
              if (curr !== field) {
                return { ...acc, [curr]: previous[curr] }
              } else {
                return acc
              }
            }, {})

            return newObject
          }
        })
      } else {
        setErrors(errors)
      }
      return false
    }

    // clear errors
    setErrors({})
    return true
  }

  const handleBlur = (field: string) => () => {
    validateForm(field)
  }

  return { validateForm, handleBlur, errors }
}
