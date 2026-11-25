import { WeekDay } from '@/types/weekDay'
import { requiredMessage } from '@/utils/validation'
import Yup from '@/yup/yup'
import moment from 'moment'

export const recurringEventSchema = Yup.object({
  startDate: Yup.string().when(['$isEditing'], ([isEditing], dateSchema) => {
    if (isEditing) {
      return dateSchema.required(requiredMessage('Start Date'))
    } else {
      return dateSchema.required(requiredMessage('Date'))
    }
  }),
  startTime: Yup.string().required(requiredMessage('Start Time')).timeFormat(),
  endTime: Yup.string()
    .required(requiredMessage('End Time'))
    .timeFormat()
    .test(
      'is-greater',
      'End time must be greater than start time',
      function (value) {
        const { startTime } = this.parent
        return moment(value).isAfter(moment(startTime))
      }
    ),
  endDate: Yup.string(),
  repeat: Yup.string().oneOf(
    ['onetime', 'daily', 'weekly', 'monthly', 'custom'],
    'Invalid Repeat value'
  ),
  customRepeat: Yup.array()
    .of(Yup.mixed().oneOf<WeekDay>(Object.values(WeekDay) as WeekDay[]))
    .when(['repeat'], {
      is: (repeat: string) => repeat === 'custom',
      then: (schema) =>
        schema
          .min(1, "Frequency can't be blank")
          .required("Frequency can't be blank"),
    }),
})
