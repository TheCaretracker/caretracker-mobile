import { ScrollView, StyleSheet, View } from 'react-native'
import { AppHeader, Card, CardWithToggle } from '@/components'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import UserIcon from '@/assets/icons/user-icon.svg'
import FaqIcon from '@/assets/icons/question-mark.svg'
import { useContext } from 'react'
import { UserDataContext, Role } from '@/contexts/UserDataContext'
import { Text, Image } from 'react-native'
import {
  LogoutIcon,
  SettingsIcon,
  StarIcon,
  PhoneIcon,
} from '@/assets/icons/icon'
import Avatar from '@/components/Avatar/Avatar'

const Account = ({ navigation }: any) => {
  const onPress = () => {
    console.log('pressing card')
  }

  const { getRole } = useContext(UserDataContext)
  const currentRole: Role = getRole()
  const isEmployee = currentRole === Role.Employee

  const { userData, performLogout } = useContext(UserDataContext)
  const userInfo = {
    name: userData.fullName,
    role: currentRole,
  }

  const cardData = [
    {
      icon: <UserIcon />,
      title: 'Account Settings',
      screenUrl: 'AccountSettings',
    },
    ...(isEmployee
      ? [
          {
            icon: <StarIcon />,
            title: 'My Employers',
            screenUrl: 'MyEmployers',
          },
        ]
      : [
          {
            icon: <StarIcon />,
            title: 'My Employees',
            screenUrl: 'MyEmployees',
          },
          {
            icon: <PhoneIcon />,
            title: 'My Emergency Contacts',
            screenUrl: 'MyEmergencyContacts',
          },
        ]),
    { icon: <SettingsIcon />, title: 'Settings', screenUrl: 'Settings' },
    { icon: <FaqIcon />, title: 'FAQ', screenUrl: 'FAQScreen' },
  ]

  const renderCards = () => {
    return cardData.map((item, index) => (
      <Card
        key={index}
        type="threeSection"
        object={{
          left: item.icon,
          middle: item.title,
          right: <ArrowRightIcon />,
        }}
        onPress={() => navigation.navigate(item.screenUrl)}
      />
    ))
  }

  return (
    <View style={styles.container}>
      <AppHeader text="Account" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.wrapper} style={styles.content}>
        <View style={styles.accountHeader}>
          <View style={styles.imageContainer}>
            <Avatar />
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.role}>{userInfo.role}</Text>
        </View>
        {renderCards()}
        <Card
          type="iconLeft"
          icon={<LogoutIcon />}
          onPress={() => performLogout()}
        >
          Log Out
        </Card>
        <View style={{ height: 12 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(248, 248, 248, 1)',
  },
  content: {
    marginTop: 120,
  },
  wrapper: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  accountHeader: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
  },
  role: { color: '#6D767C', fontSize: 12, fontFamily: 'Outfit-Regular' },
})

export default Account
