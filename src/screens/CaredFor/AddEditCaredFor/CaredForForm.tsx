import React, { useContext, useEffect, useState } from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Toast from 'react-native-toast-message'
import Colors from '@/utils/colors'
import { styles } from './Styles'
import { BackButtonHeader, InputField, Button } from '@/components'
import {
  MedicationIcon,
  ActivitiesIcon,
  AllergyIcon,
  FeedingIcon,
  NapIcon,
} from '@/assets/icons/icon'
import CaredForDetailCardEdit from '@/components/Card/CaredForDetailCardEdit'
import DatePicker from '@/components/DatePicker/DatePicker'
import {
  CaredForFormContext,
  Content,
} from '@/contexts/CaredForForm/CaredForFormContext'
import AssociationModal from './AssociationModal'
import CaredForAvatar from '@/components/CaredFor/CaredForAvatar'
import ToastNotification from '@/components/Toast/ToastNotification'
import { showCaredFor } from '@/requests/caredForRequests'

export const CaredForForm = ({ route, navigation }: any) => {
  const {
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
    openModal,
    validateForm,
    errors,
    isEditing,
  } = useContext(CaredForFormContext)

  const handleSave = async () => {
    await validateForm()

    if (!values.birthday || !values.fullName) {
      return
    }

    handleSubmit()
    Toast.show({ type: 'save', text1: 'Progress saved!' })
    setTimeout(() => navigation.goBack(), 2350)
  }

  return (
    <>
      <View style={styles.container}>
        <BackButtonHeader
          header={isEditing ? 'Edit Cared For' : 'New Cared For'}
          navigation={navigation}
        />
        <ScrollView>
          <View style={styles.cardBody}>
            <TouchableOpacity
              onPress={() => {
                openModal({ content: Content.Avatar })
              }}
            >
              <View style={styles.avatar}>
                {values.avatar != null || values.avatarId != null ? (
                  <>
                    <View style={{ height: 100, width: 100 }}>
                      <CaredForAvatar
                        avatar={
                          values.avatarId != null
                            ? values.avatarId
                            : values.avatar
                        }
                      />
                    </View>
                    <View style={styles.editAvatarWrapper}>
                      <LinearGradient
                        colors={Colors.BlackLinear}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.linearGradientStyle}
                      >
                        <Text style={styles.editText}>EDIT</Text>
                      </LinearGradient>
                    </View>
                  </>
                ) : (
                  <Text style={styles.avatarText}>TAP TO ADD AN AVATAR</Text>
                )}
              </View>
            </TouchableOpacity>
            <InputField
              placeholder="Full name"
              inputType="text"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              error={errors.fullName}
            />
            <DatePicker
              value={values.birthday}
              setFieldValue={(value) => setFieldValue('birthday', value)}
              error={errors.birthday}
              placeholder="Birth Date"
            />
            <View style={styles.divider} />
            <CaredForDetailCardEdit
              items={values.medications}
              title="Medications"
              contentId={Content.Medications}
              openModal={openModal}
              hasSeparator
              icon={MedicationIcon}
            />

            <View style={styles.divider} />
            <CaredForDetailCardEdit
              items={values.allergies}
              title="Allergies"
              type="threeColumn"
              contentId={Content.Allergies}
              openModal={openModal}
              icon={AllergyIcon}
            />
            <View style={styles.divider} />
            <CaredForDetailCardEdit
              items={values.feedingTimes}
              title="Feeding time"
              type="threeColumn"
              contentId={Content.FeedingTimes}
              openModal={openModal}
              icon={FeedingIcon}
            />

            <View style={styles.divider} />
            <CaredForDetailCardEdit
              items={values.napTimes}
              title="Nap time"
              type="fourColumn"
              contentId={Content.NapTimes}
              openModal={openModal}
              icon={NapIcon}
            />

            <View style={styles.divider} />
            <CaredForDetailCardEdit
              items={values.activities}
              title="Activities"
              hasSeparator
              openModal={openModal}
              contentId={Content.Activities}
              icon={ActivitiesIcon}
            />
          </View>
        </ScrollView>
        <Button
          text="Save"
          buttonStyle={styles.buttonSave}
          onPress={handleSave}
        />
        <ToastNotification position="bottom" bottomOffset={82} />
      </View>
      <AssociationModal />
    </>
  )
}

export default CaredForForm
