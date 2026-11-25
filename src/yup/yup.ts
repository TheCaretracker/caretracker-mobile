import moment from 'moment'
import * as yup from 'yup'

yup.addMethod(yup.string, 'timeFormat', function () {
  return this.test('timeFormat', function (value) {
    // if undefined or null, let other rules take care of it
    if (value == null) return true

    // Check if the value is a valid Moment.js string
    const date = moment(value)

    // Check if the parsed date is valid
    if (!date.isValid()) {
      return this.createError({ message: 'Invalid date format' })
    }

    // Check if the parsed time is in AM/PM format
    if (date.format('a') !== 'am' && date.format('a') !== 'pm') {
      return this.createError({ message: 'You need to select AM/PM period' })
    }

    return true
  })
})

yup.addMethod(
  yup.string,
  'isAfterTime',
  function (otherField: string, otherFieldName: string) {
    return this.test('isAfterTime', function (value, context) {
      const otherFieldValue = context.parent[otherField]
      const otherTime = moment(otherFieldValue)
      const timeValue = moment(value)

      if (!timeValue.isAfter(otherTime)) {
        return this.createError({
          message: `Should be after ${otherFieldName}`,
        })
      }

      return true
    })
  }
)

yup.addMethod(yup.string, 'emailRegex', function (field) {
  return this.test('emailRegex', function (value) {
    if (value == null || value === '') {
      return true
    }
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!regex.test(value)) {
      return this.createError({ message: 'Invalid email format' })
    }

    return true
  })
})

export default yup
