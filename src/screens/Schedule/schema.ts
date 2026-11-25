import { requiredMessage } from '@/utils/validation'
import Yup from '@/yup/yup'

export const timeOffRequestSchema = Yup.object({
  startDate: Yup.string().required(requiredMessage('Date')),
  startTime: Yup.string().required(requiredMessage('Start Time')).timeFormat(),
  endTime: Yup.string()
    .required(requiredMessage('End Time'))
    .timeFormat()
    .isAfterTime('startTime', 'Start Time'),
  remindMe: Yup.bool(),
})
