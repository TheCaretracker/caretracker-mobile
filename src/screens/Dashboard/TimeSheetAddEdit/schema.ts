import { requiredMessage } from '@/utils/validation'
import Yup from '@/yup/yup'

export const timesheetAddSchema = Yup.object({
  date: Yup.string().required(requiredMessage('Date')),
  clockIn: Yup.string().required(requiredMessage('Clock In')).timeFormat(),
  clockOut: Yup.string()
    .required(requiredMessage('Clock Out'))
    .timeFormat()
    .isAfterTime('clockIn', 'Clock In Time'),
})
