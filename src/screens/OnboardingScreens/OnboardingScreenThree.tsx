import React from 'react'
import { Dimensions, Platform, StatusBar, View } from 'react-native'
import { OnboardingScreenBottom } from '@/components'
import Logo from '@/assets/images/logoSVG.svg'
import BoyWithBall from '@/assets/images/boy-with-ball.svg'

const OnboardingScreenThree = ({ navigation }: any) => {
  const screenHeight = Dimensions.get('window').height
  const isSmallDevice =
    Dimensions.get('window').width <= 375 || Platform.OS === 'android'
  const backgroundStyle = {
    backgroundColor: '#F8F8F8',
    height: screenHeight,
    flex: 1,
    paddingTop: isSmallDevice ? 35 : 54,
  }

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingBottom: 5,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
            }}
          >
            <Logo />
          </View>
          <View
            style={{
              alignSelf: 'center',
            }}
          >
            <BoyWithBall />
          </View>
        </View>
        <View
          style={{
            height: screenHeight * 0.45,
          }}
        >
          <OnboardingScreenBottom
            header="Nanny calendar sharing"
            description="Sharing a Calendar with your nanny allows the necessary communication of any changes to the schedule or any time of need."
            slideNumber={2}
            next={() => navigation.navigate('OnboardingScreenFour')}
          />
        </View>
      </View>
    </View>
  )
}

export default OnboardingScreenThree
