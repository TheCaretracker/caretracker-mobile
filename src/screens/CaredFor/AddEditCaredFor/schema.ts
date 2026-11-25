import { requiredMessage } from '@/utils/validation'
import Yup from '@/yup/yup'

export const caredForSchema = Yup.object({
  fullName: Yup.string().required(requiredMessage('Full Name')),
  birthday: Yup.date().required(requiredMessage('Birth Date')),
})

export const medicationSchema = Yup.object({
  name: Yup.string().required(requiredMessage('Medication name')),
  dose: Yup.string().required(requiredMessage('Dose')),
  time: Yup.string().required(requiredMessage('Time')).timeFormat(),
})

export const allergySchema = Yup.object({
  name: Yup.string().required(requiredMessage('Type')),
  severity: Yup.string().required(requiredMessage('Severity')),
})

export const feedingTimeSchema = Yup.object({
  period: Yup.string().required(requiredMessage('Period')),
  time: Yup.string().required(requiredMessage('Time')).timeFormat(),
})

export const napTimeSchema = Yup.object({
  period: Yup.string().required(requiredMessage('Period')),
  startTime: Yup.string().required(requiredMessage('Start Time')).timeFormat(),
  endTime: Yup.string()
    .required(requiredMessage('End Time'))
    .timeFormat()
    .isAfterTime('startTime', 'Start Time'),
})

export const activitySchema = Yup.object({
  name: Yup.string().required(requiredMessage('Name')),
  location: Yup.string().nullable(),
  startTime: Yup.string().required(requiredMessage('Start Time')).timeFormat(),
  endTime: Yup.string()
    .required(requiredMessage('End Time'))
    .timeFormat()
    .isAfterTime('startTime', 'Start Time'),
})
