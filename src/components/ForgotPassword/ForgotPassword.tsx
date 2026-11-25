import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  Image,
  ModalProps,
  Modal,
  Alert,
} from 'react-native'
import EnterEmail from './EnterEmail'
import EnterCode from './EnterCode'
import ResetPassword from './ResetPassword'
import { Formik, FormikContext } from 'formik'
import { resetPassword } from '@/requests/passwordRequests'
import BottomSheetModal from '../Modals/BottomSheetModal'
import { camelToSnake } from '@/utils/case'

interface IForgotPasswordProps {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  setIsLoading: any
}

export interface ForgotPasswordForm {
  code?: string
  email?: string
  newPassword?: string
  passwordConfirmation?: string
}

const ForgotPassword = ({
  isVisible,
  setIsVisible,
  setIsLoading,
}: IForgotPasswordProps) => {
  const [phase, setPhase] = useState<number>(0)

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true)
      const formattedValues = camelToSnake(values)
      const { data } = await resetPassword(formattedValues)
      if (data.success) {
        setIsLoading(false, {
          success: true,
          message: 'You can now Sign in using your new password',
        })
      }
      setIsVisible(false)
    } catch {
      setIsLoading(false)
    }
  }
  const next = () => setPhase(phase + 1)

  const handleModalPhase = () =>
    [<EnterEmail next={next} />, <EnterCode next={next} />, <ResetPassword />][
      phase
    ]

  return (
    <View>
      <BottomSheetModal
        isVisible={isVisible}
        setModalVisible={setIsVisible}
        onModalWillShow={() => setPhase(0)}
      >
        <Formik<ForgotPasswordForm>
          initialValues={{}}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <View style={{ marginBottom: 20 }}>{handleModalPhase()}</View>
        </Formik>
      </BottomSheetModal>
    </View>
  )
}

export default ForgotPassword
