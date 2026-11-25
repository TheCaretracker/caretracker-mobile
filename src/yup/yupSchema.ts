import * as Yup from 'yup'

declare module 'yup' {
  interface StringSchema extends Yup.StringSchema {
    timeFormat(): StringSchema
    isAfterTime(otherField: string, otherFieldName: string): StringSchema
  }
}
