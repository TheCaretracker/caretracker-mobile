import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { SadIcon, NeutralIcon, SmileIcon } from '@/assets/icons/icon'
import Colors from '@/utils/colors'
import { SvgProps } from 'react-native-svg'
import ValidationError from '../Error/ValidationError'

const screenWidth = Dimensions.get('window').width

interface SeverityOptionProps {
  Icon: React.FC<SvgProps>
  label: string
  value: string
  selected: boolean
  onSelected: (value: string) => void
}

interface SeveritySelectProps {
  onSeverityChange?: (severity: string) => void
  initialValue?: string
  error?: string
}

const SeverityOption = ({
  Icon,
  label,
  value,
  selected,
  onSelected,
}: SeverityOptionProps) => {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.selectedOption]}
      onPress={() => onSelected(value)}
    >
      <Icon width={24} height={24} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}

const SeveritySelect = ({
  onSeverityChange,
  initialValue,
  error,
}: SeveritySelectProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(initialValue || '')

  const handleSelected = (value: string) => {
    setSelectedValue(value)
    if (onSeverityChange) {
      onSeverityChange(value)
    }
  }

  const severities = [
    { Icon: SadIcon, label: 'Severe', value: 'severe' },
    { Icon: NeutralIcon, label: 'Moderate', value: 'moderate' },
    { Icon: SmileIcon, label: 'Mild', value: 'mild' },
  ]

  return (
    <View>
      <View style={styles.textRow}>
        <Text style={styles.title}>Severity</Text>
        <Text style={styles.subTitle}>(Required)</Text>
      </View>
      <View style={styles.optionWrapper}>
        {severities.map((severity) => (
          <SeverityOption
            key={severity.value}
            Icon={severity.Icon}
            label={severity.label}
            value={severity.value}
            selected={severity.value === selectedValue}
            onSelected={handleSelected}
          />
        ))}
      </View>
      {error && <ValidationError error={error} />}
    </View>
  )
}

const styles = StyleSheet.create({
  optionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  label: {
    fontFamily: 'Outfit-Medium',
    fontSize: 12,
    marginTop: 4,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: Colors.SecondaryPurple,
    borderColor: Colors.PrimaryPurple,
  },
  textRow: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'baseline',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    marginLeft: 2,
  },
  subTitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: Colors.DarkGrey,
  },
})

export default SeveritySelect
