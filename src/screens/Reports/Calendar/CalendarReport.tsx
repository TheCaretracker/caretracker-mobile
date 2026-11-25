import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native'

import dayjs from 'dayjs'
import DefaultModal from '@/components/Modals/DefaultModal'
import { DateData, Calendar as ModalCalendar } from 'react-native-calendars'
import Colors from '@/utils/colors'
import { CalendarArrowDown } from '@/assets/icons/icon'
import { YEARS, getRangeMarkedDate } from './helpers'

type CalendarReportProps = {
  isModalVisible: boolean
  setIsModalVisible: (value: boolean) => void
  startDate: string | null
  endDate: string | null
  onChangeRange?: (start: string | null, end: string | null) => void
  onPressDone?: () => void
}

const CalendarReport = ({
  isModalVisible,
  setIsModalVisible,
  startDate,
  endDate,
  onChangeRange,
  onPressDone,
}: CalendarReportProps) => {
  const today = new Date()
  const [customDate, setCustomDate] = useState(dayjs())
  const [isYearSelectVisible, setIsYearSelectVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const todayString = today.toISOString().split('T')[0]

  // Normalize selection so range displays correctly even if user picks end before start
  const normalizedStart =
    startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))
      ? endDate
      : startDate
  const normalizedEnd =
    startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))
      ? startDate
      : endDate

  let range = {}
  if (normalizedStart && normalizedEnd) {
    range = getRangeMarkedDate(normalizedStart, normalizedEnd)
  }

  const isClearButtonDisabled = Object.keys(range).length === 0
  const isDoneButtonDisabled = startDate == null || endDate == null

  const onDayPress = (item: DateData) => {
    const picked = item.dateString
    if (dayjs(picked).isAfter(dayjs(todayString))) return
    // First pick
    if (startDate == null && endDate == null) {
      onChangeRange?.(picked, null)
      return
    }
    // Second pick — complete range regardless of order
    if (startDate != null && endDate == null) {
      if (dayjs(picked).isBefore(dayjs(startDate))) {
        onChangeRange?.(picked, startDate)
      } else {
        onChangeRange?.(startDate, picked)
      }
      return
    }
    if (startDate == null && endDate != null) {
      if (dayjs(picked).isBefore(dayjs(endDate))) {
        onChangeRange?.(picked, endDate)
      } else {
        onChangeRange?.(endDate, picked)
      }
      return
    }
    // Third pick — start a new selection from clicked date
    onChangeRange?.(picked, null)
  }

  return (
    <DefaultModal
      isVisible={isModalVisible}
      setModalVisible={setIsModalVisible}
      hideCloseButton
      modalstyle={styles.calendarModal}
    >
      <View>
        <ModalCalendar
          markingType="period"
          markedDates={{ [todayString]: { marked: true }, ...range }}
          onDayPress={onDayPress}
          enableSwipeMonths
          maxDate={todayString}
          theme={{
            textDayFontFamily: 'Outfit-Regular',
            textDayHeaderFontFamily: 'Outfit-Regular',
            textMonthFontFamily: 'Outfit-Regular',
          }}
          renderHeader={() => (
            <TouchableNativeFeedback
              onPress={() => {
                setIsYearSelectVisible(!isYearSelectVisible)
              }}
            >
              <View style={styles.headerContainer}>
                <Text>
                  {customDate.format('MMMM')} {customDate.year()}
                </Text>
                <CalendarArrowDown
                  style={isYearSelectVisible ? styles.arrowUp : null}
                />
              </View>
            </TouchableNativeFeedback>
          )}
          onPressArrowLeft={() =>
            setCustomDate((prev) =>
              dayjs(prev.format('YYYY-MM-DD')).subtract(1, 'month')
            )
          }
          onPressArrowRight={() =>
            setCustomDate((prev) =>
              dayjs(prev.format('YYYY-MM-DD')).add(1, 'month')
            )
          }
          initialDate={customDate.format('YYYY-MM-DD')}
          allowSelectionOutOfRange
          current={customDate.format('YYYY-MM-DD')}
        />

        {isYearSelectVisible && (
          <View style={styles.yearSelectContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <View style={styles.yearSelectContent}>
                {YEARS.map((year, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setCustomDate((prev) =>
                        dayjs().subtract(dayjs().year() - year, 'years')
                      )
                      setIsYearSelectVisible(false)
                    }}
                  >
                    <View style={styles.yearItem}>
                      <Text style={styles.yearText}>{year}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      <View
        style={[
          styles.buttonsModalRow,
          { justifyContent: isLoading ? 'center' : 'space-between' },
        ]}
      >
        <>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false)
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChangeRange?.(null, null)}
              disabled={isClearButtonDisabled}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: Colors.Red,
                    opacity: isClearButtonDisabled ? 0.5 : 1,
                  },
                ]}
              >
                Clear
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => onPressDone && onPressDone()}
            disabled={isDoneButtonDisabled}
          >
            <Text
              style={[
                styles.buttonText,
                { opacity: isDoneButtonDisabled ? 0.5 : 1 },
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>
        </>
      </View>
    </DefaultModal>
  )
}

const styles = StyleSheet.create({
  calendarModal: {
    width: '105%',
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
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearSelectContainer: {
    zIndex: 10,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    left: 15,
    backgroundColor: Colors.Transparent,
  },
  scrollViewContainer: {
    alignItems: 'center',
  },
  yearSelectContent: {
    backgroundColor: 'white',
    marginBottom: 50,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 25,
    padding: 15,
    width: '100%',
    height: '100%',
  },
  yearItem: {
    padding: 10,
    width: '100%',
  },
  yearText: {
    fontSize: 16,
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
})

export default CalendarReport
