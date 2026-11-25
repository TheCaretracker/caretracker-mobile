import { userExists } from '@/requests/userRequests'
import { requiredMessage } from '@/utils/validation'
import Yup from '@/yup/yup'

export const createAccountSchema = Yup.object({
  email: Yup.string().required(requiredMessage('Email')).emailRegex(),
  password: Yup.string().required(requiredMessage('Password')),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please enter password again!'),
})

export const personalInformationSchema = Yup.object({
  fullName: Yup.string().required(requiredMessage('Full Name')),
  phoneNumber: Yup.string().required(requiredMessage('Phone Number')),
})

export const locationSchema = Yup.object({
  address: Yup.object({
    city: Yup.string().required(requiredMessage('City')),
    state: Yup.string().required(requiredMessage('State')),
  }),
})
