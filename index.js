import { registerRootComponent } from 'expo'
import { messaging } from '@/firebase'
import App from './App'
import { setBackgroundMessageHandler } from '@react-native-firebase/messaging'

setBackgroundMessageHandler(messaging(), async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage)
})
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// Text.defaultProps = Text.defaultProps || {}
// Text.defaultProps.allowFontScaling = false
registerRootComponent(App)
