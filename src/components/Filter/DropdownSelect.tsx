import { useMemo } from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import { ArrowDown, CheckboxEmpty, CheckboxFill } from '@/assets/icons/icon'

type Option = {
  label: string
  value: any
}

interface IDropdownSelectProps {
  title?: string
  options: Option[]
  onValueChange: (value: any[]) => void
  isOpen: boolean
  onOpen: () => void
  selectedValues?: Option[]
}

const DropdownSelect = ({
  title,
  options,
  onValueChange,
  isOpen,
  onOpen,
  selectedValues = [],
}: IDropdownSelectProps) => {
  const selectedOptions = useMemo(() => {
    return findSelectedOptions()
  }, [selectedValues])

  function findSelectedOptions() {
    const newSelectedValues = []

    options.forEach((option) => {
      selectedValues?.forEach((selected) => {
        if (option.value === selected.value) {
          newSelectedValues.push(selected)
        }
      })
    })

    return newSelectedValues || []
  }

  const handleSelect = (option: Option) => {
    const newSelection = [...new Set([...selectedValues, option.value])]
    onValueChange(newSelection)
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onOpen}>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>{title}</Text>
          {isOpen ? <ArrowDown style={styles.arrowUp} /> : <ArrowDown />}
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.optionContainer}>
          {options.map((option, index) => {
            const isSelected = selectedValues.find(
              (selected) => selected === option.value
            )
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(option)}
              >
                <View style={styles.optionRow}>
                  {isSelected ? <CheckboxFill /> : <CheckboxEmpty />}
                  <Text style={styles.label}>{option.label}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#eaebec',
    paddingBottom: 30,
    rowGap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    fontFamily: 'Outfit-Medium',
    color: '#375064',
    fontSize: 18,
    lineHeight: 24,
  },
  optionContainer: {
    rowGap: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 12,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    color: '#2e2e2e',
  },
})

export default DropdownSelect
