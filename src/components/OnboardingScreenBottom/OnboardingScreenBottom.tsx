import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Button from '../Button/Button'
import Indicator from '../Indicator/Indicator'

interface IOnboardingScreenBottomProps {
  header: string
  description: string
  slideNumber: number
  next: (params: any) => any
}

const OnboardingScreenBottom = ({
  header,
  description,
  slideNumber,
  next,
}: IOnboardingScreenBottomProps) => {
  const screenHeight = Dimensions.get('window').height

  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        {slideNumber === 1 && (
          <>
            <Indicator current />
            <Indicator />
            <Indicator />
          </>
        )}
        {slideNumber === 2 && (
          <>
            <Indicator />
            <Indicator current />
            <Indicator />
          </>
        )}
        {slideNumber === 3 && (
          <>
            <Indicator />
            <Indicator />
            <Indicator current />
          </>
        )}
      </View>
      <View style={styles.items}>
        <Text style={styles.header}>{header}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          text="Next"
          type="secondary"
          onPress={next}
          buttonStyle={{ backgroundColor: 'white' }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#4440D6',
    paddingVertical: 30,
  },
  header: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 25,
  },
  description: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  items: {
    flex: 3,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonContainer: {
    flex: 1,
    width: '80%',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
})

export default OnboardingScreenBottom
