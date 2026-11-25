import { StyleSheet, View, Platform } from 'react-native'
import { BackButtonHeader, Card, CardWithToggle } from '@/components'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import { useEffect, useState } from 'react'
import { AppConsts } from '@/utils/AppConsts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SettingsScreen = ({ navigation }: any) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(false)
  const insets = useSafeAreaInsets()

  const cardData = [
    {
      title: 'Notification Settings',
      screenUrl: 'NotificationSettingsScreen',
    },
    { title: 'Change Password', screenUrl: 'ChangePasswordScreen' },
    { title: 'Terms & Conditions', screenUrl: 'TermsAndConditionsScreen' },
    { title: 'Privacy Policy', screenUrl: 'PrivacyPolicyScreen' },
  ]

  useEffect(() => {
    readBiometricEnabled()
  }, [])

  const readBiometricEnabled = async () => {
    const _isBiometricEnabled =
      (await AppConsts.getIsBiometricEnabled()) as boolean
    setIsBiometricEnabled(_isBiometricEnabled)
  }

  const toggleBiometricEnabled = async () => {
    await AsyncStorage.setItem(
      AppConsts.isBiometricEnabled,
      (!isBiometricEnabled).toString()
    )
    await readBiometricEnabled()
  }

  const renderCards = () => {
    return cardData.map((item, index) => (
      <View
        key={index}
        style={{ marginBottom: index === 1 || index === 3 ? 20 : 0 }}
      >
        <Card
          type="iconRight"
          icon={<ArrowRightIcon />}
          children={item.title}
          onPress={() => navigation.navigate(item.screenUrl)}
        />
      </View>
    ))
  }
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BackButtonHeader header="Settings" navigation={navigation} />
      <View style={styles.wrapper}>
        {/* <CardWithToggle
          header="Two-Factor Authentication"
          value={false}
          setValue={() => {}}
        /> */}

        <CardWithToggle
          header={`Enable ${Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint'}`}
          value={isBiometricEnabled}
          setValue={() => {
            toggleBiometricEnabled()
          }}
        />
        {renderCards()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  wrapper: {
    flexGrow: 1,
    gap: 12,
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
})

export default SettingsScreen
