import { formatUserDataToAPI } from '@/helpers/usersHelper'
import { useFormik, type FormikProps } from 'formik'
import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react'
import { Alert } from 'react-native'
import { finishTransaction, type Purchase } from 'expo-iap'

import { navigate } from '../helpers/RootNavigation'
import { createUser } from '../requests/userRequests'
import { LinkingContext } from './LinkingContext'

const SUBSCRIPTION_ID = 'employer_subscription'

type CreateAccountFormValues = Record<string, any>

export type CreateAccountContextProps = Pick<
  FormikProps<CreateAccountFormValues>,
  'values' | 'handleSubmit' | 'handleChange' | 'setFieldValue' | 'isSubmitting'
> & {
  purchase: Purchase | null
  setPurchase: Dispatch<SetStateAction<Purchase | null>>
}

export const CreateAccountContext =
  createContext<CreateAccountContextProps | null>(null)

export const useCreateAccountContext = (): CreateAccountContextProps => {
  const context = useContext(CreateAccountContext)

  if (!context) {
    throw new Error(
      'useCreateAccountContext must be used inside CreateAccountProvider'
    )
  }

  return context
}

/**
 * expo-iap@6.x: SKU nằm ở `productId` (`id` giờ là transaction/order id).
 * Android đôi lúc trả danh sách SKU trong `ids`.
 */
const getPurchaseProductId = (purchase: Purchase): string | undefined => {
  if (purchase.store === 'google') {
    return purchase.ids?.[0] ?? purchase.productId
  }

  return purchase.productId
}

/**
 * expo-iap@6.x dùng `purchaseToken` thống nhất cho cả 2 nền tảng:
 *
 * Android:
 * - purchaseToken là token Google Play (trước đây: purchaseTokenAndroid)
 *
 * iOS:
 * - purchaseToken là JWS của giao dịch StoreKit 2 — đúng giá trị mà
 *   expo-iap@2.x trả về trong transactionReceipt
 */
const getPurchaseReceipt = (purchase: Purchase): string | undefined => {
  return purchase.purchaseToken ?? undefined
}
export const CreateAccountProvider = ({
  children,
}: PropsWithChildren): React.JSX.Element => {
  const { inviteCode } = useContext(LinkingContext)

  const [purchase, setPurchase] = useState<Purchase | null>(null)

  const handleCreate = async (
    formValues: CreateAccountFormValues
  ): Promise<void> => {
    const isGuardian = formValues.type === 'Guardian'

    if (isGuardian) {
      if (!purchase) {
        Alert.alert(
          'Subscription required',
          'You must subscribe to create an Employer account.'
        )
        return
      }

      const productId = getPurchaseProductId(purchase)
      const receipt = getPurchaseReceipt(purchase)

      if (!receipt) {
        Alert.alert(
          'Subscription Error',
          'The subscription receipt is unavailable.'
        )
        return
      }

      if (productId !== SUBSCRIPTION_ID) {
        Alert.alert(
          'Subscription Error',
          'The selected subscription is invalid.'
        )
        return
      }

      /*
       * Đảm bảo receipt/token mới nhất được gửi lên backend.
       */
      formValues.subscriptions_attributes = [
        {
          subscriptionReceipt: receipt,
          platform: purchase.store === 'google' ? 'google' : 'apple',
        },
      ]
    }

    try {
      const formattedData = formatUserDataToAPI(formValues)

      const { data } = await createUser(formattedData)

      if (!data.success) {
        Alert.alert(
          'Create Account Error',
          data.message || 'Unable to create your account.'
        )
        return
      }

      /*
       * Chỉ finish giao dịch sau khi backend xử lý thành công.
       */
      if (isGuardian && purchase) {
        try {
          await finishTransaction({
            purchase,
            isConsumable: false,
          })
        } catch (finishError) {
          console.error('Finish subscription transaction error:', finishError)

          Alert.alert(
            'Account created',
            'Your account was created, but the subscription could not be finalized. Please sign in and restore your purchase.',
            [
              {
                text: 'OK',
                onPress: () => navigate('Login'),
              },
            ]
          )

          return
        }
      }

      Alert.alert(
        'Success',
        'User created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigate('Login'),
            style: 'default',
          },
        ],
        {
          onDismiss: () => navigate('Login'),
          cancelable: true,
        }
      )
    } catch (error) {
      console.error('Create account error:', error)

      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create your account. Please try again.'

      Alert.alert('Create Account Error', message)
    }
  }

  const { values, handleSubmit, handleChange, setFieldValue, isSubmitting } =
    useFormik<CreateAccountFormValues>({
      initialValues: {
        inviteCode,
      },
      onSubmit: handleCreate,
      enableReinitialize: true,
    })

  return (
    <CreateAccountContext.Provider
      value={{
        values,
        handleSubmit,
        handleChange,
        setFieldValue,
        isSubmitting,
        purchase,
        setPurchase,
      }}
    >
      {children}
    </CreateAccountContext.Provider>
  )
}
