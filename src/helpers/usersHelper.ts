import { camelToSnake } from '@/utils/case'

export const formatUserDataToAPI = (values) => {
  const addressesAttr = { addressesAttributes: [{ ...values.address }] }
  const phoneNumberAttr = {
    phoneNumbersAttributes: [{ phoneNumber: values.phoneNumber }],
  }
  const subscriptionsAttr = {
    subscriptionsAttributes: values.subscriptions_attributes
  }
  const data = { ...values, ...addressesAttr, ...phoneNumberAttr, ...subscriptionsAttr }
  let formattedData = camelToSnake(data)

  if (values.avatar && values.avatar.data) {
    formattedData = { ...formattedData, avatar: values.avatar?.data }
  }

  return formattedData
}
