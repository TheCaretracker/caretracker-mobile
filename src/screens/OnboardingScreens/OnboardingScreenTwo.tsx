import React from 'react'
import { Dimensions, Platform, StatusBar, View } from 'react-native'
import { OnboardingScreenBottom } from '@/components'
import Horse from '@/assets/images/horse-and-flower.svg'
import Ground from '@/assets/images/moving-ground.svg'
import Logo from '@/assets/images/logoSVG.svg'

const OnboardingScreenTwo = ({ navigation }: any) => {
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
            paddingBottom: 35,
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
            <View style={{ zIndex: 0, transform: [{ translateY: 270 }] }}>
              <Ground />
            </View>
            <View style={{ zIndex: 1 }}>
              <Horse />
            </View>
          </View>
        </View>
        <View
          style={{
            height: screenHeight * 0.45,
          }}
        >
          <OnboardingScreenBottom
            header="Time tracking made simple for household employers"
            description="With customized notifications we will make sure to remind you to update any payroll hours necessary."
            slideNumber={1}
            next={() => navigation.navigate('OnboardingScreenThree')}
          />
        </View>
      </View>
    </View>
  )
}

export default OnboardingScreenTwo
