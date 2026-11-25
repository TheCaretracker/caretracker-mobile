import { CaredForProvider } from '@/contexts/CaredForContext'
import CaredFor from '@/screens/CaredFor'
import CaredForDetail from '@/screens/CaredFor/Detail'
import AddEditCaredFor from '@/screens/CaredFor/AddEditCaredFor'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

const CaredForNavigator = () => {
  return (
    <CaredForProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8f8f8' },
        }}
      >
        <Stack.Group>
          <Stack.Screen name="CaredFor" component={CaredFor} />
          <Stack.Screen
            name="CaredForDetailScreen"
            component={CaredForDetail}
          />
          <Stack.Screen name="NewCaredFor" component={AddEditCaredFor} />
        </Stack.Group>
      </Stack.Navigator>
    </CaredForProvider>
  )
}

export default CaredForNavigator
