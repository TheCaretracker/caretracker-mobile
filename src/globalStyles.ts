import { StyleSheet } from 'react-native'
import Colors from './utils/colors'

const globalStyles = StyleSheet.create({
  h1: {
    fontWeight: '600',
    fontSize: 24,
  },
  h2: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 20,
  },
  bodyTextRegular: {
    fontFamily: 'Outfit-Regular',
  },
  bodyTextBold: {
    fontFamily: 'Outfit-SemiBold',
  },
  bodyTextLight: {
    fontFamily: 'Outfit-Regular',
    color: Colors.DarkBlue,
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: '#4440D6',
  },
  buttonText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#DED2FF',
  },
  secondaryButtonText: {
    color: '#4440D6',
  },

  // For disabled state
  disabledButton: {
    backgroundColor: Colors.LightGrey,
  },
  disabledButtonText: {
    color: Colors.Grey,
  },

  clockOutButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FD5252',
  },
  clockOutButtonText: {
    color: '#FD5252',
  },
  cardContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(234, 235, 236, 1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
  },
})

export default globalStyles
