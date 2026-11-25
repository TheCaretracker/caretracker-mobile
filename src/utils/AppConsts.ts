import AsyncStorage from "@react-native-async-storage/async-storage"

export class AppConsts {
  // AsyncStorage constants
  static isFirstTime = 'isFirstTime'
  static isBiometricEnabled = 'isBiometricEnabled'
  static token = 'token'

  static async getIsFirstTime(): Promise<Boolean> {
    const firstTime = await AsyncStorage.getItem(AppConsts.isFirstTime)
    console.log(AppConsts.isFirstTime, firstTime)
    if (firstTime == undefined) {
      return true
    }
    return firstTime === 'true'
  }

  static async getIsBiometricEnabled(): Promise<Boolean> {
    const enabled = await AsyncStorage.getItem(AppConsts.isBiometricEnabled)
    console.log(AppConsts.isBiometricEnabled, enabled)
    if (enabled == undefined) {
      return false
    }
    return enabled === 'true'
  }

}
