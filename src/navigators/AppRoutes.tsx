import React from 'react'
import { StyleSheet } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TabLabel } from '@/components'

import CaredForIcon from '@/assets/icons/cared-for.svg'
import CaredForIconSelected from '@/assets/icons/cared-for-selected.svg'
import DashboardIcon from '@/assets/icons/dashboard.svg'
import DashboardIconSelected from '@/assets/icons/dashboard-selected.svg'
import ScheduleIcon from '@/assets/icons/schedule.svg'
import ScheduleIconSelected from '@/assets/icons/schedule-selected.svg'
import AccountIcon from '@/assets/icons/account.svg'
import AccountIconSelected from '@/assets/icons/account-selected.svg'
import ReportsIcon from '@/assets/icons/reports.svg'
import ReportsIconSelected from '@/assets/icons/reports-selected.svg'

// Dashboard Stack
import DashboardScreen from '@/screens/Dashboard'
import TimeSheetScreen from '@/screens/Dashboard/TimeSheet'
// Schedule Stack
import ScheduleScreen from '@/screens/Schedule'
// Reports Stack
import ReportsScreen from '@/screens/Reports'
// Account Stack
import AccountScreen from '@/screens/Account'
import FAQScreen from '@/screens/Account/FAQ'
import AccountSettingsScreen from '@/screens/Account/AccountSettings'
import EmployersScreen from '@/screens/Account/MyEmployers'
import EmployeesScreen from '@/screens/Account/MyEmployees'
import EmergencyContactsScreen from '@/screens/Account/MyEmergencyContacts'
import EmployeeDetailsScreen from '@/screens/Account/EmployeeDetailsScreen'
import InviteEmployeeScreen from '@/screens/Account/InviteEmployeeScreen'
import SettingsScreen from '@/screens/Account/Settings'
import ChangePasswordScreen from '@/screens/Account/Settings/changePassword'
import TermsAndConditionsScreen from '@/screens/Account/Settings/termsAndConditions'
import PrivacyPolicyScreen from '@/screens/Account/Settings/privacyPolicy'
import NotificationSettingsScreen from '@/screens/Account/Settings/Notifications'
import EmployeeViewSchedule from '@/screens/Account/EmployeeViewSchedule'
import AddEditSchedule from '@/screens/Account/AddEditSchedule'

import Notification from '@/screens/Notification'
import AddContactScreen from '@/screens/Account/MyEmergencyContacts/AddContact'
import CaredForNavigator from './CaredForNavigator'
import InviteDetailsScreen from '@/screens/Account/InviteDetailScreen'
import { NotificationsProvider } from '@/contexts/NotificationsContext'
import TimeSheetAddEdit from '@/screens/Dashboard/TimeSheetAddEdit'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const App = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const ScheduleStack = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <App.Screen name="ScheduleScreen" component={ScheduleScreen} />
  </App.Navigator>
)

const DashboardStack = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <App.Screen name="DashboardScreen" component={DashboardScreen} />
    <App.Screen name="TimeSheetScreen" component={TimeSheetScreen} />
    <App.Screen name="TimeSheetAddEdit" component={TimeSheetAddEdit} />
  </App.Navigator>
)

const ReportsStack = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <App.Screen name="ReportsScreen" component={ReportsScreen} />
  </App.Navigator>
)

const AccountStack = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <App.Screen name="AccountScreen" component={AccountScreen} />
  </App.Navigator>
)

const Tabs = () => {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        // React Navigation 7: `sceneContainerStyle` prop -> `sceneStyle` option
        sceneStyle: {
          backgroundColor: '#f8f8f8',
        },
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'The Cared For':
              return !focused ? <CaredForIcon /> : <CaredForIconSelected />
            case 'Schedule':
              return !focused ? <ScheduleIcon /> : <ScheduleIconSelected />
            case 'Dashboard':
              return !focused ? (
                <DashboardIcon color="white" />
              ) : (
                <DashboardIconSelected />
              )
            case 'Reports':
              return !focused ? <ReportsIcon /> : <ReportsIconSelected />
            case 'Account':
              return !focused ? <AccountIcon /> : <AccountIconSelected />
          }
        },
        headerShown: false,
        tabBarStyle: [styles.tabBarStyle, { height: 70 + insets.bottom }],
        tabBarIconStyle: styles.tabBarIconStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabel: ({ focused }) => (
          <TabLabel label={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="The Cared For" component={CaredForNavigator} />
      <Tab.Screen name="Schedule" component={ScheduleStack} />
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Reports" component={ReportsStack} />
      <Tab.Screen name="Account" component={AccountStack} />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarButton: () => null,
          // React Navigation 7 still renders a flex:1 slot for a tab whose
          // button returns null, which squeezes the visible tabs. Hide the slot.
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  )
}

const AppRoutes = () => {
  return (
    <NotificationsProvider>
      <App.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8f8f8' },
        }}
      >
        <App.Screen name="TabNavigator" component={Tabs} />
        <App.Screen name="AccountSettings" component={AccountSettingsScreen} />
        <App.Screen name="MyEmployers" component={EmployersScreen} />
        <App.Screen name="MyEmployees" component={EmployeesScreen} />
        <App.Screen
          name="MyEmergencyContacts"
          component={EmergencyContactsScreen}
        />
        <App.Screen name="EmployeeDetails" component={EmployeeDetailsScreen} />
        <App.Screen name="InviteDetails" component={InviteDetailsScreen} />

        <App.Screen name="InviteEmployee" component={InviteEmployeeScreen} />
        <App.Screen
          name="EmployeeViewSchedule"
          component={EmployeeViewSchedule}
        />
        <App.Screen name="AddEditSchedule" component={AddEditSchedule} />
        <App.Screen name="Settings" component={SettingsScreen} />
        <App.Screen name="FAQScreen" component={FAQScreen} />
        <App.Screen
          name="NotificationSettingsScreen"
          component={NotificationSettingsScreen}
        />
        <App.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <App.Screen
          name="TermsAndConditionsScreen"
          component={TermsAndConditionsScreen}
        />
        <App.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
        />
        <App.Screen name="AddContactScreen" component={AddContactScreen} />
      </App.Navigator>
    </NotificationsProvider>
  )
}

export default AppRoutes

/*
 * React Navigation 7 changed the bottom tab layout. These values keep the
 * tab bar pixel-identical to the v6 version (measured on device):
 * - v7 sets `paddingTop: 0` on the bar, overriding `paddingVertical` -> set it
 *   explicitly.
 * - v7 adds `padding: 5` inside each tab button -> extend the item by 5 on
 *   every side (height 50 -> 60, marginTop -5, marginHorizontal -5) so the
 *   content box matches v6 and long labels ("The Cared For") aren't truncated.
 * - v7 gives the icon a fixed-size box -> `flex: 1` restores v6's behaviour of
 *   centring the icon in the space above the label.
 */
const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#4440D6',
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingTop: 8,
    justifyContent: 'center',
  },
  tabBarIconStyle: {
    width: 32,
    flex: 1,
  },
  tabBarItemStyle: {
    height: 60,
    marginTop: -5,
    marginBottom: 15,
    marginHorizontal: -5,
  },
})
