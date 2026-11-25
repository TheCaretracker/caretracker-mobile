import { StyleSheet, View } from 'react-native'

const IconContainer = ({ icon, iconStyle }: any) => (
  <View style={[styles.imageContainer, iconStyle]}>{icon}</View>
)

export default IconContainer

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 100,
    width: 34,
    height: 34,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4440D6',
  },
})
