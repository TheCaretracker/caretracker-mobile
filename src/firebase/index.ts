import '@react-native-firebase/analytics'

import { getApp } from '@react-native-firebase/app'
import { getMessaging } from '@react-native-firebase/messaging'

const firebase = getApp()

/**
 * @react-native-firebase v26+ removed the namespaced API (`app.messaging()`).
 * Use the modular `getMessaging(app)` instead.
 */
export const messaging = () => getMessaging(firebase)

export default firebase
