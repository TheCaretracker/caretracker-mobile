import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import {
  ArrowDownSmall,
  CheckboxEmpty,
  CheckboxFill,
} from '@/assets/icons/icon'
import Colors from '@/utils/colors'

type Option = {
  label: string
  value: string
  subLabel?: string
}

type Props = {
  placeholder?: string
  options: Option[]
  initialSelectedValues?: string[]
  onSelectionChange?: (selected: Option[]) => void
}

const MultiSelect: React.FC<Props> = ({
  placeholder = 'Select Options',
  options,
  initialSelectedValues,
  onSelectionChange,
}) => {
  const initialSelectedOptions = options.filter((option) =>
    initialSelectedValues?.some(
      (selectedValue) => selectedValue.contactId === option.value
    )
  )
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    initialSelectedOptions
  )
  const [showOptions, setShowOptions] = useState(false)

  const getDisplayText = (selected: Option[]) => {
    switch (selected.length) {
      case 0:
        return placeholder
      case 1:
        return selected[0].label
      case 2:
        return `${selected[0].label}, ${selected[1].label}`
      default:
        return `${selected[0].label}, ${selected[1].label}, ${
          selected.length - 2
        }+`
    }
  }

  const toggleOption = (option: Option) => {
    let updatedSelection
    if (selectedOptions.some((o) => o.value === option.value)) {
      updatedSelection = selectedOptions.filter((o) => o.value !== option.value)
    } else {
      updatedSelection = [...selectedOptions, option]
    }
    setSelectedOptions(updatedSelection)
    if (onSelectionChange) {
      onSelectionChange(updatedSelection)
    }
  }

  const toggleShowOptions = () => {
    setShowOptions(!showOptions)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleShowOptions}
        style={[
          styles.field,
          {
            borderColor: showOptions ? Colors.PrimaryPurple : Colors.LightGrey,
            borderWidth: 1,
          },
        ]}
      >
        {selectedOptions.length > 0 && (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Text
          style={[
            styles.text,
            {
              marginTop: selectedOptions.length > 0 ? 8 : 0,
              color:
                selectedOptions.length > 0 ? Colors.BlackText : Colors.DarkGrey,
            },
          ]}
        >
          {getDisplayText(selectedOptions)}
        </Text>
        {!showOptions ? (
          <ArrowDownSmall />
        ) : (
          <ArrowDownSmall style={styles.arrowup} />
        )}
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>
          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => toggleOption(option)}
                style={styles.option}
              >
                {selectedOptions.some((o) => o.value === option.value) ? (
                  <CheckboxFill width={20} />
                ) : (
                  <CheckboxEmpty width={20} />
                )}
                <Text style={styles.text}>{option.label}</Text>
                {option.subLabel && (
                  <Text style={styles.subText}>{option.subLabel}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  field: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  optionsContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.PrimaryPurple,
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 138,
  },
  option: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  arrowup: {
    transform: [{ rotate: '180deg' }],
  },
  text: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.BlackText,
  },
  subText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: Colors.DarkGrey,
    paddingTop: 2,
  },
  placeholder: {
    position: 'absolute',
    top: 4,
    left: 18,
    fontFamily: 'Outfit-Regular',
    fontSize: 10,
    color: Colors.PrimaryBlue,
  },
})

export default MultiSelect
