import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native'
import Colors from '@/utils/colors'
import { CalendarIcon } from '@/assets/icons/icon'
import ValidationError from '../Error/ValidationError'
import moment from 'moment'

interface dateFieldProps {
  placeholder?: string
  value?: string
  onChangeValue?: (key: string) => void
  onPressIn?: () => void
  style?: ViewStyle
  containerStyle?: ViewStyle
  error?: string
}

const DateFieldButton = ({
  placeholder = 'Date',
  value,
  onChangeValue,
  onPressIn,
  containerStyle,
  style,
  error,
}: dateFieldProps) => {
  const handlePress = () => {
    onPressIn()
    if (onChangeValue) {
      onChangeValue(value)
    }
  }
  return (
    <View style={[containerStyle, { flex: 1 }]}>
      <TouchableOpacity onPress={handlePress} style={[styles.field, style]}>
        {value && <Text style={styles.placeholder}>{placeholder}</Text>}
        <Text
          style={[
            styles.text,
            {
              marginTop: value ? 8 : 0,
              color: value ? Colors.BlackText : Colors.DarkGrey,
            },
          ]}
        >
          {value ? moment(value).format('MM/DD/YYYY') : placeholder}
        </Text>
        <CalendarIcon />
      </TouchableOpacity>
      {error && <ValidationError error={error} />}
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    height: 44,
    borderColor: Colors.LightGrey,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  placeholder: {
    position: 'absolute',
    top: 4,
    left: 18,
    fontFamily: 'Outfit-Regular',
    fontSize: 10,
    color: Colors.PrimaryBlue,
  },
  text: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.BlackText,
  },
})

export default DateFieldButton
