import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '@/screens/Login/Login'
import LoadingPage from '@/screens/Login/LoadingPage'
import AllSet from '@/screens/Login/AllSet'
import CreateAccountNavigator from './CreateAccountNavigator'
import OnboardingScreenTwo from '@/screens/OnboardingScreens/OnboardingScreenTwo'
import OnboardingScreenThree from '@/screens/OnboardingScreens/OnboardingScreenThree'
import OnboardingScreenFour from '@/screens/OnboardingScreens/OnboardingScreenFour'
import TermsAndConditionsScreen from '@/screens/Account/Settings/termsAndConditions'

const App = createNativeStackNavigator()

const AuthRoutes = ({ isFirstTime }) => {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (isFirstTime === true) {
      setShowOnboarding(true)
    }
  }, [isFirstTime])

  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8f8f8' },
      }}
    >
      {showOnboarding && (
        <App.Group>
          <App.Screen
            name="OnboardingScreenTwo"
            component={OnboardingScreenTwo}
          />
          <App.Screen
            name="OnboardingScreenThree"
            component={OnboardingScreenThree}
          />
          <App.Screen
            name="OnboardingScreenFour"
            component={OnboardingScreenFour}
          />
        </App.Group>
      )}

      <App.Screen name="Login" component={Login} />
      <App.Screen name="AllSet" component={AllSet} />
      <App.Screen name="LoadingPage" component={LoadingPage} />
      <App.Screen
        name="CreateAccountNavigator"
        component={CreateAccountNavigator}
      />
      <App.Screen
        name="TermsAndConditionsScreen"
        component={TermsAndConditionsScreen}
      />
    </App.Navigator>
  )
}

export default AuthRoutes
