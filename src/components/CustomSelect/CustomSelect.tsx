import React, { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import Colors from '@/utils/colors'
import ValidationError from '../Error/ValidationError'
import { Platform } from 'react-native'
import { ArrowDownSmall } from '@/assets/icons/icon'

interface Props {
  selectedValue: string
  options: Array<{ label: string; value: string }>
  onSelect: (value: string) => void
  label: string
  useSearch?: boolean
  useDropdownStyle?: boolean
  minHeight?: number
  error?: string
  onBlur?: () => void
  renderItem?: (
    item: any,
    selected?: boolean
  ) => React.JSX.Element | null | undefined
}

const CustomSelect = ({
  options,
  selectedValue,
  onSelect,
  label,
  minHeight,
  error,
  renderItem,
  ...rest
}: Props) => {
  const [isFocus, setIsFocus] = useState(false)

  const renderLabel = () => {
    if (selectedOption?.value) {
      return <Text style={[styles.label]}>{label}</Text>
    }
  }

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === selectedValue),
    [selectedValue, options]
  )

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          (selectedOption?.value || isFocus) && {
            flex: 1,
            justifyContent: 'center',
          },
          isFocus && styles.dropdownOnFocus,
          error && styles.dropdownError,
        ]}
        selectedTextProps={{ allowFontScaling: false }}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemContainerStyle={styles.itemContainerStyle}
        itemTextStyle={styles.itemTextStyle}
        containerStyle={styles.dropdownContinerStyle}
        activeColor={Colors.Transparent}
        data={options}
        maxHeight={200}
        minHeight={minHeight}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? label : '...'}
        value={selectedOption}
        keyboardAvoiding={false}
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false)
        }}
        onChange={(item) => {
          onSelect(item.value)
          setIsFocus(false)
        }}
        renderRightIcon={(visible) =>
          isFocus ? (
            <ArrowDownSmall style={styles.arrowUp} />
          ) : (
            <ArrowDownSmall />
          )
        }
        renderItem={renderItem}
      />
      {error && (
        <View style={styles.errorContainer}>
          <ValidationError error={error} />
        </View>
      )}
    </View>
  )
}

export default CustomSelect

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdown: {
    width: '100%',
    minHeight: 44,
    maxHeight: 44,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    fontFamily: 'Outfit-Regular',
    color: Colors.DarkGrey,
    fontSize: 14,
  },
  dropdownError: {
    borderColor: Colors.Red,
  },
  dropdownOnFocus: {
    borderColor: Colors.PrimaryPurple,
  },
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
  itemTextStyle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    height: 40,
  },
  dropdownContinerStyle: {
    marginTop: Platform.OS === 'android' ? -22 : 2, // Patch for android
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.PrimaryPurple,
  },
  itemContainerStyle: {
    borderRadius: 8,
    height: 40,
  },
  errorContainer: {
    marginLeft: 16,
  },
  placeholderStyle: {
    fontSize: 14,
    color: Colors.DarkGrey,
    fontFamily: 'Outfit-Regular',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: Colors.BlackText,
  },
  inputSearchStyle: {
    maxHeight: 44,
    minHeight: 44,
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
  },
  label: {
    position: 'absolute',
    color: Colors.PrimaryBlue,
    zIndex: 999,
    paddingHorizontal: 18,
    paddingVertical: 4,
    fontSize: 10,
    fontFamily: 'Outfit-Regular',
  },
})
