import { requiredMessage } from '@/utils/validation'
import Yup from '@/yup/yup'

export const newEmployeeSchema = Yup.object({
  fullName: Yup.string().required(requiredMessage('Full Name')),
  email: Yup.string().required(requiredMessage('Email')).email(),
  phoneNumber: Yup.string().required(requiredMessage('Phone Number')),
})
