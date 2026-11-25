import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from 'react-native'
import Colors from '@/utils/colors'
import DefaultModal from '@/components/Modals/DefaultModal'
import { Calendar, CalendarProps, DateData } from 'react-native-calendars'

interface CalendarModalProps extends CalendarProps {
  isVisible: boolean
  setModalVisible: (visible: boolean) => void
  onDayPress?: (day: DateData) => void
  selectedDate?: string
  onPressCancel?: () => void
  onPressDone?: () => void
  modalStyles?: ViewStyle
}

const ModalWidth = Dimensions.get('window').width * 0.85

const CalendarModal = ({
  isVisible,
  setModalVisible,
  onDayPress,
  selectedDate,
  onPressCancel,
  onPressDone,
  modalStyles,
  ...rest
}: CalendarModalProps) => {
  return (
    <>
      <DefaultModal
        isVisible={isVisible}
        setModalVisible={setModalVisible}
        modalstyle={[styles.calendarModal, modalStyles]}
        hideCloseButton
      >
        <Calendar
          onDayPress={(day) => onDayPress(day)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: Colors.LightBlue,
              selectedTextColor: Colors.BrightBlue,
            },
          }}
          theme={{
            todayTextColor: Colors.BrightBlue,
            textDayFontFamily: 'Outfit-Regular',
            textDayHeaderFontFamily: 'Outfit-Regular',
            textMonthFontFamily: 'Outfit-Regular',
          }}
          {...rest}
        />
        <View style={styles.buttonsModalRow}>
          <TouchableOpacity onPress={onPressCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressDone}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </DefaultModal>
    </>
  )
}

const styles = StyleSheet.create({
  calendarModal: {
    width: ModalWidth,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16,
  },
  buttonsModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.LightGrey,
    paddingTop: 14,
  },
  buttonText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.BrightBlue,
  },
})

export default CalendarModal
