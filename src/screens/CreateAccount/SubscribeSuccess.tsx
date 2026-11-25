import { View, Text, StyleSheet, StatusBar } from 'react-native'
import Colors from '@/utils/colors'
import { Button } from '@/components'
import { CheckBlueIcon } from '@/assets/icons/icon'

const SubscribeSuccess = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.PrimaryPurple}
      />
      <View style={styles.content}>
        <View style={styles.circle}>
          <CheckBlueIcon height={17} width={25} />
        </View>
        <Text style={styles.title}>Subscription completed</Text>
        <Text style={styles.text}>You are ready to create your profile</Text>
      </View>
      <Button
        text="Continue"
        type="secondary"
        buttonStyle={styles.button}
        onPress={() => navigation.navigate('PersonalInformation')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PrimaryPurple,
  },
  content: {
    alignItems: 'center',
  },
  circle: {
    width: 61,
    height: 61,
    borderRadius: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  text: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: 'white',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    backgroundColor: 'white',
  },
})

export default SubscribeSuccess
