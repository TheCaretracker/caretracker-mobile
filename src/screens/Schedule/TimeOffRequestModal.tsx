import { Button, CustomSelect, InputField } from '@/components'
import BottomSheetModal from '@/components/Modals/BottomSheetModal'
import { useFormik } from 'formik'
import moment from 'moment'
import { Dispatch, SetStateAction, useState } from 'react'
import { Alert, Switch, Text } from 'react-native'

import { styled } from 'styled-components/native'
import InputAddon from '@/components/InputField/InputAddon'
import { Dropdown } from 'react-native-element-dropdown'
import Toggle from '@/components/Toggle/Toggle'
import TimeInput from '@/components/InputField/TimeInput'
import { createSchedule } from '@/requests/scheduleRequests'
import { timeOffRequestSchema } from './schema'
import { Schedule } from '@/types/schedule'
import DatePicker from '@/components/DatePicker/DatePicker'

interface TimeOffRequest {
  startDate?: string
  startTime?: string
  endTime?: string
  remindMe?: boolean
}

interface TimeOffRequestProps {
  modalOpen: boolean
  setModalOpen: Dispatch<SetStateAction<boolean>>
  onCreateRequest: (newSchedule: Schedule) => void
}

const TimeOffRequestModal = ({
  modalOpen,
  setModalOpen,
  onCreateRequest,
  day,
}) => {
  const handleSubmitTimeOffRequest = async (values) => {
    const { data } = await createSchedule({
      start_date: values.startDate,
      start_time: values.startTime,
      end_time: values.endTime,
    })

    if (data.success) {
      onCreateRequest(data.schedule)
      Alert.alert(
        'Success',
        'Time Off successfully requested',
        [{ text: 'OK', onPress: () => setModalOpen(false) }],
        { onDismiss: () => setModalOpen(false) }
      )
    }
  }

  const { values, setFieldValue, errors, handleSubmit } =
    useFormik<TimeOffRequest>({
      initialValues: { startDate: day },
      onSubmit: handleSubmitTimeOffRequest,
      validationSchema: timeOffRequestSchema,
      validateOnChange: false,
      enableReinitialize: true,
    })
  return (
    <BottomSheetModal
      title="Time Off Request"
      isVisible={modalOpen}
      setModalVisible={setModalOpen}
    >
      <DatePicker
        value={values.startDate}
        setFieldValue={(value) => setFieldValue('startDate', value)}
        error={errors.startDate}
      />
      <TimeInputsView>
        <TimeInput
          value={values.startTime}
          placeholder="Start Time"
          setFieldValue={(value) => setFieldValue('startTime', value)}
          error={errors.startTime}
        />
        <TimeInput
          value={values.endTime}
          placeholder="End Time"
          setFieldValue={(value) => setFieldValue('endTime', value)}
          error={errors.endTime}
        />
      </TimeInputsView>
      <ToggleView>
        <ToggleLabel>Reminds me</ToggleLabel>
        <Toggle
          value={values.remindMe}
          onValueChange={(value) => setFieldValue('remindMe', value)}
        />
      </ToggleView>
      <Button text={'Send Request'} onPress={() => handleSubmit()} />
    </BottomSheetModal>
  )
}

const TimeInputsView = styled.View`
  flex-direction: row;
  column-gap: 24px;
  justify-content: space-between;
  margin-top: 30px;
`
const ToggleView = styled.View`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
`
const ToggleLabel = styled.Text`
  color: #222b45;
  font-size: 14px;
  font-family: 'Outfit-Regular';
`

export default TimeOffRequestModal
