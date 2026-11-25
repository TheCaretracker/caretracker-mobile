import React from 'react'
import { Dimensions, Platform, StatusBar, View } from 'react-native'
import { OnboardingScreenBottom } from '@/components'
import Logo from '@/assets/images/logoSVG.svg'
import Star from '@/assets/images/star.svg'
import Ground from '@/assets/images/ground.svg'
import Bear from '@/assets/images/bear.svg'
import Toy from '@/assets/images/toy.svg'

const OnboardingScreenFour = ({ navigation }: any) => {
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
            justifyContent: 'space-around',
            flex: 1,
            paddingBottom: 75,
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
              justifyContent: 'flex-end',
              flex: 1,
            }}
          >
            <View
              style={{ transform: [{ translateY: 120 }, { translateX: 50 }] }}
            >
              <Star />
            </View>
            <View
              style={{
                alignSelf: 'center',
              }}
            >
              <View style={{ zIndex: 0, transform: [{ translateY: 220 }] }}>
                <Ground />
              </View>
              <View style={{ flexDirection: 'row', zIndex: 1 }}>
                <View
                  style={{
                    transform: [{ translateY: 100 }, { translateX: 30 }],
                  }}
                >
                  <Toy />
                </View>
                <View
                  style={{
                    transform: [{ translateY: 12 }, { translateX: 45 }],
                  }}
                >
                  <Bear />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            height: screenHeight * 0.45,
          }}
        >
          <OnboardingScreenBottom
            header="Nanny share flexibility"
            description="Nannies can have multiple employers on their account so they can appropriately clock in and out for each employer."
            slideNumber={3}
            next={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </View>
  )
}

export default OnboardingScreenFour
