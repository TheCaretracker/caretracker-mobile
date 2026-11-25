import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CreateAccountProvider } from '@/contexts/CreateAccountContext'
import CreateAccount from '@/screens/CreateAccount/CreateAccount'
import Location from '@/screens/CreateAccount/Location'
import PersonalInformation from '@/screens/CreateAccount/PersonalInformation'
import SubscribeSuccess from '@/screens/CreateAccount/SubscribeSuccess'

const Stack = createNativeStackNavigator()

const CreateAccountNavigator = () => {
  return (
    <CreateAccountProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8f8f8' },
        }}
      >
        <Stack.Group>
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="SubscribeSuccess" component={SubscribeSuccess} />
          <Stack.Screen
            name="PersonalInformation"
            component={PersonalInformation}
          />
          <Stack.Screen name="Location" component={Location} />
        </Stack.Group>
      </Stack.Navigator>
    </CreateAccountProvider>
  )
}

export default CreateAccountNavigator
