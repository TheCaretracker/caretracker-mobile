import { Button, InputField, OTPInput, RoleSelect } from '@/components'
import { useCreateAccountContext } from '@/contexts/CreateAccountContext'
import { LinkingContext } from '@/contexts/LinkingContext'
import CreateAccountLayout from '@/layouts/CreateAccountLayout'
import { showInvite } from '@/requests/inviteRequests'
import { userExists } from '@/requests/userRequests'
import Colors from '@/utils/colors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import type { Purchase } from 'expo-iap'

import { createAccountValidation } from './helper'
import { createAccountSchema } from './schema'
import SubscribeModal from './SubscribeModal'

const CreateAccount = ({ navigation }: any) => {
  const [showModal, setShowModal] = useState(false)
  const [inviteConfirmed, setInviteConfirmed] = useState(false)

  const { values, handleChange, setFieldValue, purchase } =
    useCreateAccountContext()

  const { wasInvited } = useContext(LinkingContext)

  const { errors, handleBlur, validateForm } = createAccountValidation({
    schema: createAccountSchema,
    values,
  })

  /**
   * expo-iap@6.x dùng `purchaseToken` thống nhất:
   *
   * Android:
   * - purchaseToken là token dùng để verify Google Play
   *   (trước đây: purchaseTokenAndroid).
   *
   * iOS:
   * - purchaseToken là JWS giao dịch StoreKit 2 dùng để verify App Store
   *   (cùng giá trị expo-iap@2.x trả về trong transactionReceipt).
   */
  const getPurchaseReceipt = useCallback(
    (iapPurchase: Purchase): string | undefined => {
      return iapPurchase.purchaseToken ?? undefined
    },
    []
  )

  /**
   * Xác định store dựa trên `purchase.store` thay vì Platform.OS.
   */
  const getPurchasePlatform = useCallback(
    (iapPurchase: Purchase): 'apple' | 'google' => {
      return iapPurchase.store === 'google' ? 'google' : 'apple'
    },
    []
  )

  const fetchInvite = useCallback(async (): Promise<void> => {
    try {
      const { data } = await showInvite(values.inviteCode)

      if (!data.success) {
        Alert.alert('Invalid invite', 'The invite code could not be confirmed.')
        return
      }

      setInviteConfirmed(true)

      if (data.invite?.email) {
        await setFieldValue('email', data.invite.email)
      }

      if (data.invite?.fullName) {
        await setFieldValue('fullName', data.invite.fullName)
      }

      if (data.invite?.phoneNumber) {
        await setFieldValue('phoneNumber', data.invite.phoneNumber)
      }
    } catch (error) {
      console.error('Fetch invite error:', error)

      Alert.alert('Invite error', 'Unable to confirm the invite code.')
    }
  }, [setFieldValue, values.inviteCode])

  useEffect(() => {
    if (wasInvited && values.inviteCode) {
      void fetchInvite()
    }
  }, [fetchInvite, values.inviteCode, wasInvited])

  const applyPurchaseReceipt = useCallback(
    async (iapPurchase: Purchase): Promise<boolean> => {
      const receipt = getPurchaseReceipt(iapPurchase)

      if (!receipt) {
        Alert.alert(
          'Subscription Error',
          'The subscription receipt is unavailable.'
        )

        return false
      }

      await setFieldValue('subscriptions_attributes', [
        {
          subscriptionReceipt: receipt,
          platform: getPurchasePlatform(iapPurchase),
        },
      ])

      return true
    },
    [getPurchasePlatform, getPurchaseReceipt, setFieldValue]
  )

  /**
   * Đồng bộ receipt khi purchase trong Context thay đổi,
   * ví dụ sau khi mua hoặc restore.
   */
  useEffect(() => {
    if (purchase) {
      void applyPurchaseReceipt(purchase)
    }
  }, [applyPurchaseReceipt, purchase])

  const handleValidation = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false
    }

    try {
      const { data } = await userExists(values.email)

      if (data.exists) {
        Alert.alert(
          'User already exists',
          'An account with this email already exists.'
        )

        return false
      }

      return true
    } catch (error) {
      console.error('Check existing user error:', error)

      Alert.alert('Error', 'Unable to check the email address.')

      return false
    }
  }

  const handleSubmit = async (): Promise<void> => {
    const isValid = await handleValidation()

    if (!isValid) {
      return
    }

    if (values.type === 'Caregiver') {
      navigation.navigate('PersonalInformation')
      return
    }

    setShowModal(true)
  }

  const handleSubscribed = async (
    completedPurchase?: Purchase
  ): Promise<void> => {
    /*
     * Ưu tiên giao dịch vừa nhận trực tiếp từ modal.
     * Nếu đã có purchase trong Context thì dùng lại.
     */
    const selectedPurchase = completedPurchase ?? purchase

    if (!selectedPurchase) {
      Alert.alert('Subscription Error', 'No completed subscription was found.')

      return
    }

    const receiptApplied = await applyPurchaseReceipt(selectedPurchase)

    if (!receiptApplied) {
      return
    }

    setShowModal(false)

    navigation.navigate('PersonalInformation')
  }

  const renderButton = () => {
    if (values.type === 'Caregiver' && !inviteConfirmed) {
      return (
        <Button
          disabled={!values.inviteCode}
          text="Confirm Invite"
          onPress={() => {
            void fetchInvite()
          }}
        />
      )
    }

    return (
      <Button
        text={values.type === 'Caregiver' ? 'Continue' : 'Continue & subscribe'}
        disabled={!values.type}
        onPress={() => {
          void handleSubmit()
        }}
      />
    )
  }

  const renderCredentialsForm = () => {
    if (!values.type) {
      return null
    }

    if (values.type === 'Caregiver' && !inviteConfirmed) {
      return (
        <>
          <Text
            style={{
              color: Colors.DarkBlue,
              fontSize: 14,
              fontFamily: 'Outfit-Regular',
            }}
          >
            Please confirm the invite code sent by your employer
          </Text>

          <OTPInput
            value={values.inviteCode}
            setValue={(value) => {
              void setFieldValue('inviteCode', value)
            }}
            numOfDigits={6}
          />
        </>
      )
    }

    return (
      <View
        style={{
          flexDirection: 'column',
          gap: 22,
          alignItems: 'center',
        }}
      >
        <InputField
          placeholder="Email"
          value={values.email}
          inputType="email"
          keyboardType="email-address"
          onChangeText={handleChange('email')}
          error={errors.email}
          onBlur={handleBlur('email')}
        />

        <InputField
          placeholder="Password"
          inputType="password"
          value={values.password}
          onChangeText={handleChange('password')}
          error={errors.password}
          onBlur={handleBlur('password')}
          textContentType="oneTimeCode"
        />

        <InputField
          placeholder="Confirm password"
          inputType="password"
          value={values.passwordConfirmation}
          onChangeText={handleChange('passwordConfirmation')}
          error={errors.passwordConfirmation}
          onBlur={handleBlur('passwordConfirmation')}
          textContentType="oneTimeCode"
        />
      </View>
    )
  }

  return (
    <CreateAccountLayout
      title="Create Account"
      navigation={navigation}
      button={renderButton()}
    >
      <Text
        style={{
          color: '#375064',
          fontSize: 14,
          fontFamily: 'Outfit-Regular',
        }}
      >
        Please tell us a bit about yourself.
      </Text>

      <View style={{ marginTop: 32 }}>
        <Text
          style={{
            color: '#375064',
            fontSize: 16,
            fontFamily: 'Outfit-SemiBold',
          }}
        >
          I am an:
        </Text>
      </View>

      <RoleSelect
        roles={[
          {
            name: 'Employer',
            value: 'Guardian',
          },
          {
            name: 'Employee',
            value: 'Caregiver',
          },
        ]}
        value={values.type}
        onChangeValue={handleChange('type')}
      />

      {renderCredentialsForm()}

      <SubscribeModal
        isVisible={showModal}
        setModalVisible={setShowModal}
        purchase={purchase}
        onSubscribe={handleSubscribed}
      />
    </CreateAccountLayout>
  )
}

export default CreateAccount
