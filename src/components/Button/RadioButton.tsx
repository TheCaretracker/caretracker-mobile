import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'

interface IButtonProps {
  text: string
  isSelected: boolean
  pressButton?: (params: any) => any
}

const RadioButton = ({ text, isSelected, pressButton }: IButtonProps) => {
  return (
    <View>
      <TouchableOpacity
        style={
          isSelected === true ? styles.selectedButton : styles.unselectedButton
        }
        onPress={pressButton}
      >
        <Text
          style={
            isSelected === true
              ? styles.selectedButtonText
              : styles.unselectedButtonText
          }
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  unselectedButton: {
    minWidth: '46%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#BBC3C9',
  },
  selectedButton: {
    minWidth: '46%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#DED2FF',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#4440D6',
  },
  unselectedButtonText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    color: '#6D767C',
    textAlign: 'center',
  },
  selectedButtonText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    color: '#4440D6',
    textAlign: 'center',
  },
})

export default RadioButton
