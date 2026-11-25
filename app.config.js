export default ({ config }) => {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    ...config,
    expo: {
      ...config.expo,
      name: 'CareTracker',
      slug: 'caretracker',
      version: '1.6.7',
      web: {
        bundler: 'metro',
      },
      orientation: 'portrait',
      userInterfaceStyle: 'light',
      icon: './src/assets/icon_1024.png',
      scheme: 'caretracker',
      newArchEnabled: true,
      plugins: [
        // Listed first on purpose: Expo runs native mods in reverse order, so
        // these fixes run after the other plugins (e.g. Sentry) have added
        // their build phases.
        './plugins/withNativeBuildFixes',
        'expo-iap',
        '@react-native-firebase/app',
        'expo-font',
        [
          '@sentry/react-native/expo',
          {
            url: 'https://sentry.io/',
            project: 'react-native',
            organization: 'the-caretracker',
          },
        ],
        [
          'expo-splash-screen',
          {
            image: './src/assets/icon_1024.png',
            imageWidth: 200,
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
          },
        ],
        [
          'expo-build-properties',
          {
            ios: {
              // @react-native-firebase v27 ships Firebase Apple SDK 13 via
              // Swift Package Manager only, which requires dynamic frameworks.
              useFrameworks: 'dynamic',
              // Expo SDK 58 (ExpoModulesCore) requires iOS 16.4+
              deploymentTarget: '16.4',
            },
            android: {
              // Expo SDK 58 / React Native 0.88 require compileSdk 37
              compileSdkVersion: 37,
              targetSdkVersion: 36,
              buildToolsVersion: '37.0.0',
              // @react-native-firebase v27 requires Kotlin Gradle plugin 2.4.0+
              kotlinVersion: '2.4.0',
              gradleProperties: {
                'org.gradle.jvmargs': '-Xmx4096m -XX:MaxMetaspaceSize=1024m',
              },
            },
          },
        ],
        [
          '@config-plugins/react-native-branch',
          {
            apiKey: 'key_live_mBgFFSXDYC41mMDQ8xaXMhgkCFdfnyUD',
            iosUniversalLinkDomains: [
              'join.caretracker.fetchlydev.com',
              'pvnq0-alternate.app.link',
              'pvnq0.test-app.link',
              'pvnq0-alternate.test-app.link',
            ],
          },
        ],
        'expo-localization',
      ],
      assetBundlePatterns: ['**/*'],
      ios: {
        version: '1.6.7',
        buildNumber: '185',
        deploymentTarget: '16.4',
        supportsTablet: true,
        googleServicesFile: './creds/GoogleService-Info.plist',
        associatedDomains: [
          'applinks:join.caretracker.fetchlydev.com',
          'applinks:pvnq0-alternate.app.link',
          'applinks:pvnq0.test-app.link',
          'applinks:pvnq0-alternate.test-app.link',
        ],
        entitlements: {
          'aps-environment': isProd ? 'production' : 'development',
        },
        infoPlist: {
          UIBackgroundModes: ['fetch', 'remote-notification'],
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: true,
            NSExceptionDomains: {
              localhost: {
                NSExceptionAllowsInsecureHTTPLoads: true,
              },
            },
          },
          NSCameraUsageDescription:
            'Caretracker requires access to your camera for taking profile picture',
          NSFaceIDUsageDescription: 'Allow $(PRODUCT_NAME) to use FaceID',
          NSPhotoLibraryUsageDescription:
            'Caretracker requires access to your photo gallery for picking profile picture',
          ITSAppUsesNonExemptEncryption: false,
        },
        bundleIdentifier: 'com.caretracker.caretracker',
        appleTeamId: 'S58KAVDYVY',
      },
      android: {
        version: '1.6.5',
        versionCode: 184,
        googleServicesFile: './creds/google-services.json',
        adaptiveIcon: {
          foregroundImage: './src/assets/icon_android_1024.png',
          backgroundColor: '#ffffff',
        },
        permissions: [
          'INTERNET',
          'com.android.vending.BILLING',
          'READ_EXTERNAL_STORAGE',
          'WRITE_EXTERNAL_STORAGE',
          'CAMERA',
          'VIBRATE',
          'SYSTEM_ALERT_WINDOW',
          'ACCESS_NETWORK_STATE',
          'RECEIVE_BOOT_COMPLETED',
          'com.google.android.c2dm.permission.RECEIVE',
        ],
        intentFilters: [
          {
            action: 'VIEW',
            data: [
              {
                scheme: 'https',
                host: 'join.caretracker.fetchlydev.com',
                pathPrefix: '/',
              },
              {
                scheme: 'https',
                host: 'pvnq0-alternate.app.link',
                pathPrefix: '/',
              },
              { scheme: 'https', host: 'pvnq0.test-app.link', pathPrefix: '/' },
              {
                scheme: 'https',
                host: 'pvnq0-alternate.test-app.link',
                pathPrefix: '/',
              },
            ],
            category: ['BROWSABLE', 'DEFAULT'],
          },
        ],
        package: 'com.caretracker.caretracker2',
      },
      updates: {
        enabled: true,
        url: 'https://u.expo.dev/0aa5292b-6cb4-44ba-81d3-5d4c1da129bb',
      },
      runtimeVersion: {
        policy: 'appVersion',
      },
      extra: {
        eas: {
          projectId: '0aa5292b-6cb4-44ba-81d3-5d4c1da129bb',
        },
        API_URL: process.env.API_URL,
      },
      owner: 'gbird',
    },
  }
}
