import { Button } from '@/components'
import BottomSheetModal from '@/components/Modals/BottomSheetModal'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { Alert } from 'react-native'

import { styled } from 'styled-components/native'
import TimeInput from '@/components/InputField/TimeInput'
import { clockInOutRequest } from '@/requests/workEventsRequests'

interface TimeOffRequest {
  clockIn?: string
  clockOut?: string
}

interface TimeOffRequestProps {
  modalOpen: boolean
  setModalOpen: Dispatch<SetStateAction<boolean>>
  clockIn?: string
  clockOut?: string
  forceRefresh?: any
}

const TimeRecordRequestModal = ({
  eventId,
  modalOpen,
  setModalOpen,
  clockIn,
  clockOut,
  forceRefresh,
}) => {
  const handleAlertAction = (success) => {
    setModalOpen(false)
    if (success) {
      forceRefresh()
    }
  }

  const showAlert = (title, message, success) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: () => handleAlertAction(success),
        },
      ],
      {
        onDismiss: () => handleAlertAction(success),
      }
    )
  }

  const handleSubmitTimeRecordRequest = async (values) => {
    console.log({ values })
    const requestBody = {
      event_id: eventId,
      clock_in: values.clockIn,
      clock_out: values.clockOut,
    }

    try {
      const { data } = await clockInOutRequest(requestBody)

      if (data.success) {
        showAlert('Success', data.message, true)
      } else {
        showAlert('', data.errors, false)
      }
    } catch (error) {
      console.error('Error submitting time record:', error)
      showAlert('Error', 'An error occurred during the request.', false)
    }
  }

  const { values, setFieldValue, errors, handleSubmit } =
    useFormik<TimeOffRequest>({
      initialValues: { clockIn: clockIn, clockOut: clockOut },
      onSubmit: handleSubmitTimeRecordRequest,
      // validationSchema: timeOffRequestSchema,
      validateOnChange: false,
      enableReinitialize: true,
    })
  return (
    <BottomSheetModal
      title="Time Record Request"
      isVisible={modalOpen}
      setModalVisible={setModalOpen}
    >
      <TimeInputsView>
        <TimeInput
          value={values.clockIn}
          placeholder="Clock In"
          setFieldValue={(value) => setFieldValue('clockIn', value)}
          error={errors.clockIn}
        />
        <TimeInput
          value={values.clockOut}
          placeholder="Clock Out"
          setFieldValue={(value) => setFieldValue('clockOut', value)}
          error={errors.clockOut}
        />
      </TimeInputsView>
      <Button text={'Send Request'} onPress={() => handleSubmit()} />
    </BottomSheetModal>
  )
}

const TimeInputsView = styled.View`
  flex-direction: row;
  column-gap: 24px;
  justify-content: space-between;
  margin-bottom: 30px;
`

export default TimeRecordRequestModal
