import { View, Text, StyleSheet } from 'react-native'

interface IIndicatorProps {
  current?: boolean
}

const Indicator = ({ current }: IIndicatorProps) => {

  if (current === true) {
    return (
      <View style={styles.current}></View>
    )
  }

  return (
    <View style={styles.nextSlide}></View>
  )
}

const styles = StyleSheet.create({
  nextSlide: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
  },
  current: {
    width: 10,
    height: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFFFFF'
  },
})

export default Indicator
