import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '@/utils/colors'
import ValidationError from '../Error/ValidationError'

interface DayProps {
  day: string
  selected: boolean
  onPress: (day: string) => void
}

interface DaysSelectProps {
  label?: string
  onSelectionChange?: (selected: string[]) => void
  initialSelectedDays?: string[]
  error?: string | string[]
}

const DayButton = ({ day, selected, onPress }: DayProps) => {
  return (
    <TouchableOpacity
      style={[styles.dayButton, selected ? styles.selectedDay : {}]}
      onPress={() => onPress(day)}
    >
      <Text style={styles.dayText}>{day.charAt(0).toUpperCase()}</Text>
    </TouchableOpacity>
  )
}

const DaysSelect = ({
  onSelectionChange,
  label = 'Frequency',
  initialSelectedDays,
  error,
}: DaysSelectProps) => {
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialSelectedDays || []
  )

  const handleDayPress = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays((prevDays) => {
        const updatedDays = prevDays.filter((d) => d !== day)
        onSelectionChange?.(updatedDays)
        return updatedDays
      })
    } else {
      setSelectedDays((prevDays) => {
        const updatedDays = [...prevDays, day]
        onSelectionChange?.(updatedDays)
        return updatedDays
      })
    }
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <DayButton
            key={index}
            day={day}
            selected={selectedDays.includes(day)}
            onPress={handleDayPress}
          />
        ))}
      </View>
      <ValidationError error={error} />
    </View>
  )
}

const styles = StyleSheet.create({
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  selectedDay: {
    backgroundColor: Colors.SecondaryPurple,
    borderColor: Colors.PrimaryPurple,
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    marginBottom: 8,
    marginLeft: 2,
  },
})

export default DaysSelect
