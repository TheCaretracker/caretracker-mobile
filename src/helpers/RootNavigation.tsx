import {
  createNavigationContainerRef,
  NavigationContainerRef,
} from '@react-navigation/native'

export const navigationRef =
  createNavigationContainerRef<NavigationContainerRef<any>>()

export function navigate(name, params = {}) {
  if (navigationRef.isReady()) {
    // React Navigation 7: `navigate` no longer goes back to an existing screen
    // in the stack by default. `pop: true` keeps the v6 behaviour.
    navigationRef.current.navigate(name, params, { pop: true })
  }
}
export function getCurrentRouteName() {
  if (navigationRef.isReady()) {
    try {
      return navigationRef.current.getCurrentRoute().name || 'DashboardScreen'
    } catch (_) {
      return 'DashboardScreen'
    }
  }
}
