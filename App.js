import { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import {
  useFonts,
  Outfit_100Thin,
  Outfit_200ExtraLight,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from '@expo-google-fonts/outfit'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

import * as SplashScreen from 'expo-splash-screen'
import * as Sentry from '@sentry/react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import ApiInterceptor from '@/api/ApiInterceptor'
import { LinkingProvider } from '@/contexts/LinkingContext'
import { UserDataProvider } from '@/contexts/UserDataContext'
import { navigationRef } from '@/helpers/RootNavigation'
import Routes from '@/navigators/Routes'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://494b38e7c741d4df9a419e7ec81ea2d6@o4509556502626304.ingest.us.sentry.io/4509556504723456',
    tracesSampleRate: 1.0,
    release: 'caretracker@20250702+1',
    attachScreenshot: true,
  })
}

void SplashScreen.preventAutoHideAsync().catch(console.warn)

function App() {
  const [fontsLoaded, fontsError] = useFonts({
    'Outfit-Thin': Outfit_100Thin,
    'Outfit-ExtraLight': Outfit_200ExtraLight,
    'Outfit-Light': Outfit_300Light,
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
    'Outfit-ExtraBold': Outfit_800ExtraBold,
    'Outfit-Black': Outfit_900Black,
  })

  useEffect(() => {
    if (!fontsLoaded && !fontsError) {
      return
    }

    void SplashScreen.hideAsync().catch(console.warn)
  }, [fontsLoaded, fontsError])

  useEffect(() => {
    if (fontsError) {
      console.error('Font loading error:', fontsError)
    }
  }, [fontsError])

  if (!fontsLoaded && !fontsError) {
    return null
  }

  return (
    // React Navigation 7: `navigationInChildEnabled` keeps the v6 behaviour of
    // `navigate()` reaching screens inside nested navigators (e.g. tab stacks).
    <NavigationContainer ref={navigationRef} navigationInChildEnabled>
      <UserDataProvider>
        <ApiInterceptor>
          <ActionSheetProvider>
            <LinkingProvider>
              <SafeAreaProvider>
                <KeyboardProvider>
                  <Routes />
                </KeyboardProvider>
              </SafeAreaProvider>
            </LinkingProvider>
          </ActionSheetProvider>
        </ApiInterceptor>
      </UserDataProvider>
    </NavigationContainer>
  )
}

export default process.env.NODE_ENV === 'production' ? Sentry.wrap(App) : App
