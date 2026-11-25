import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { BackButtonHeader } from '@/components'
import { Policy } from './data'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PrivacyPolicyScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BackButtonHeader header="Privacy Policy" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.wrapper}>
        {Policy.map((item, index) => (
          <Text key={index} style={styles.text}>
            {item}
          </Text>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexGrow: 1,
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 21,
  },
  text: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    lineHeight: 21,
  },
})

export default PrivacyPolicyScreen
