import { CheckBlueIcon } from '@/assets/icons/icon'
import { Button } from '@/components'
import BottomSheetModal from '@/components/Modals/BottomSheetModal'
import { useCreateAccountContext } from '@/contexts/CreateAccountContext'
import Colors from '@/utils/colors'
import Constants from 'expo-constants'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {
  ErrorCode,
  getAvailablePurchases,
  syncIOS,
  type Purchase,
  useIAP,
} from 'expo-iap'

const SUBSCRIPTION_ID = 'employer_subscription'

const backendUrl = Constants.expoConfig?.extra?.API_URL as string | undefined

interface SubscribeModalProps {
  isVisible: boolean
  setModalVisible: (visible: boolean) => void
  onSubscribe: (purchase?: Purchase) => void
  purchase?: Purchase | null
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message.split('(')[0]?.trim() || error.message
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message.split('(')[0]?.trim() || error.message
  }

  return 'Unknown purchase error'
}

/**
 * expo-iap@6.x:
 * - purchase.productId là SKU chính (purchase.id giờ là transaction/order id)
 * - purchase.ids là danh sách SKU (Android)
 */
const isEmployerSubscription = (purchase: Purchase): boolean => {
  if (purchase.productId === SUBSCRIPTION_ID) {
    return true
  }

  if (purchase.store === 'google') {
    return purchase.ids?.includes(SUBSCRIPTION_ID) ?? false
  }

  return false
}

const SubscribeModal = ({
  isVisible,
  setModalVisible,
  onSubscribe,
  purchase,
}: SubscribeModalProps) => {
  const { setPurchase } = useCreateAccountContext()

  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const { connected, subscriptions, fetchProducts, requestPurchase } = useIAP({
    onPurchaseSuccess: (completedPurchase) => {
      setIsPurchasing(false)

      /*
       * Chưa finishTransaction ở đây.
       * CreateAccountContext sẽ finish sau khi backend tạo tài khoản.
       */
      setPurchase(completedPurchase)
      setModalVisible(false)
      onSubscribe(completedPurchase)
    },

    onPurchaseError: (error) => {
      setIsPurchasing(false)

      if (error.code === ErrorCode.UserCancelled) {
        return
      }

      console.error('Subscription purchase error:', error)

      Alert.alert(
        'Subscription failed',
        error.message || 'Unable to complete the subscription.'
      )
    },
  })

  const subscription = subscriptions.find((item) => item.id === SUBSCRIPTION_ID)

  /**
   * expo-iap@6.x Android:
   * subscriptionOffers[].offerTokenAndroid
   */
  const androidOfferToken =
    subscription?.platform === 'android'
      ? (subscription.subscriptionOffers?.find((offer) =>
          Boolean(offer.offerTokenAndroid)
        )?.offerTokenAndroid ?? null)
      : null

  const displayedPrice = subscription?.displayPrice ?? '4.99'

  const onPressSubscribe = async (): Promise<void> => {
    if (isPurchasing) {
      return
    }

    /*
     * Đã có purchase từ lần mua hoặc restore trước đó.
     */
    if (purchase) {
      onSubscribe(purchase)
      return
    }

    if (!connected) {
      Alert.alert(
        'Subscription Error',
        'The store is not connected. Please try again.'
      )
      return
    }

    if (!subscription) {
      Alert.alert(
        'Subscription Error',
        'The subscription is not currently available.'
      )
      return
    }

    if (Platform.OS === 'android' && !androidOfferToken) {
      Alert.alert(
        'Subscription Error',
        'No valid subscription offer is available.'
      )
      return
    }

    setIsPurchasing(true)

    try {
      if (Platform.OS === 'ios') {
        await requestPurchase({
          request: {
            apple: {
              sku: SUBSCRIPTION_ID,

              /*
               * Không tự finish transaction.
               * Transaction sẽ được finish sau khi backend xử lý xong.
               */
              andDangerouslyFinishTransactionAutomatically: false,
            },
          },
          type: 'subs',
        })

        return
      }

      if (Platform.OS === 'android') {
        await requestPurchase({
          request: {
            google: {
              skus: [SUBSCRIPTION_ID],
              subscriptionOffers: [
                {
                  sku: SUBSCRIPTION_ID,
                  offerToken: androidOfferToken!,
                },
              ],
            },
          },
          type: 'subs',
        })

        return
      }

      setIsPurchasing(false)

      Alert.alert(
        'Subscription Error',
        'Subscriptions are not supported on this platform.'
      )
    } catch (error: unknown) {
      setIsPurchasing(false)

      console.error('Request subscription error:', error)

      Alert.alert('Subscription failed', getErrorMessage(error))
    }
  }

  const handleRestorePurchases = async (): Promise<void> => {
    if (isRestoring) {
      return
    }

    if (!connected) {
      Alert.alert(
        'Subscription Error',
        'The store is not connected. Please try again.'
      )
      return
    }

    setIsRestoring(true)

    try {
      /*
       * Trên iOS cần yêu cầu App Store đồng bộ trước khi đọc
       * danh sách purchase hiện có.
       */
      if (Platform.OS === 'ios') {
        await syncIOS()
      }

      /*
       * Dùng API trực tiếp thay vì hook restorePurchases.
       * API trực tiếp trả về danh sách purchase ngay lập tức.
       */
      const purchases = await getAvailablePurchases({
        alsoPublishToEventListenerIOS: false,
        onlyIncludeActiveItemsIOS: true,
      })

      const restoredPurchase = purchases.find(isEmployerSubscription)

      if (!restoredPurchase) {
        Alert.alert('Subscription Error', 'No active subscription was found.')
        return
      }

      setPurchase(restoredPurchase)
      setModalVisible(false)
      onSubscribe(restoredPurchase)
    } catch (error: unknown) {
      console.error('Restore purchases error:', error)

      Alert.alert('Restore failed', getErrorMessage(error))
    } finally {
      setIsRestoring(false)
    }
  }

  useEffect(() => {
    if (!connected) {
      return
    }

    /*
     * expo-iap@6.x: getSubscriptions(skus) -> fetchProducts({ skus, type: 'subs' }).
     * Kết quả vẫn được đưa vào state `subscriptions` của hook.
     */
    void fetchProducts({ skus: [SUBSCRIPTION_ID], type: 'subs' })
  }, [connected, fetchProducts])

  const handleTermsPress = async (): Promise<void> => {
    if (!backendUrl) {
      Alert.alert('Error', 'Terms and Conditions URL is unavailable.')
      return
    }

    const termsUrl = `${backendUrl}/terms_and_conditions`

    try {
      const canOpen = await Linking.canOpenURL(termsUrl)

      if (!canOpen) {
        Alert.alert('Error', 'Unable to open Terms and Conditions.')
        return
      }

      await Linking.openURL(termsUrl)
    } catch (error) {
      console.error('Error opening Terms URL:', error)

      Alert.alert('Error', 'Unable to open Terms and Conditions.')
    }
  }

  return (
    <BottomSheetModal isVisible={isVisible} setModalVisible={setModalVisible}>
      <View style={styles.modalWrapper}>
        <Text style={styles.modalTitle}>Subscribe to start using</Text>

        <Text style={styles.price}>
          {displayedPrice}
          <Text style={styles.subPrice}>/month</Text>
        </Text>

        <View>
          <View style={styles.rowText}>
            <CheckBlueIcon />

            <Text style={styles.subTitle}>Free for employees</Text>
          </View>

          <Text style={[styles.subTitle, styles.fontRegular]}>
            Invite your employees to use CareTracker for free
          </Text>
        </View>

        <View>
          <View style={styles.rowText}>
            <CheckBlueIcon />

            <Text style={styles.subTitle}>14-day trial</Text>
          </View>

          <Text style={[styles.subTitle, styles.fontRegular]}>
            Start paying only after your trial is over
          </Text>
        </View>

        <View>
          <View style={styles.rowText}>
            <CheckBlueIcon />

            <Text style={styles.subTitle}>Cancel any time</Text>
          </View>

          <Text style={[styles.subTitle, styles.fontRegular]}>
            No commitment, cancel any time
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.termsOfServiceText}>
            By clicking Subscribe, you have read and agree to The
            CareTracker&apos;s
          </Text>

          <TouchableOpacity onPress={handleTermsPress}>
            <Text style={[styles.termsOfServiceText, styles.termsLink]}>
              Terms and Conditions
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsOfServiceText}>.</Text>
        </View>

        <Button
          text={isPurchasing ? 'Processing...' : 'Subscribe'}
          buttonStyle={styles.buttonStyle}
          onPress={onPressSubscribe}
        />

        <View style={styles.restoreContainer}>
          <View style={styles.rowText}>
            <Text style={styles.subTitle}>Already have a subscription?</Text>
          </View>

          <TouchableWithoutFeedback
            onPress={isRestoring ? undefined : handleRestorePurchases}
          >
            <View style={styles.restoreButton}>
              {isRestoring ? (
                <>
                  <ActivityIndicator size="small" />

                  <Text style={styles.restoreText}>Restoring purchases...</Text>
                </>
              ) : (
                <Text style={styles.restoreText}>
                  Click here to restore your purchases.
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  modalWrapper: {
    rowGap: 16,
  },
  modalTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: Colors.BlackText,
  },
  subTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: Colors.DarkBlue,
  },
  fontRegular: {
    fontFamily: 'Outfit-Regular',
    marginLeft: 20,
  },
  price: {
    fontFamily: 'Outfit-Bold',
    fontSize: 32,
    color: Colors.PrimaryPurple,
  },
  subPrice: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 20,
  },
  rowText: {
    flexDirection: 'row',
    columnGap: 8,
    marginBottom: 4,
    alignItems: 'center',
  },
  buttonStyle: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  termsOfServiceText: {
    color: '#375064',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    lineHeight: 18 * 0.75,
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
    marginLeft: 3,
  },
  restoreContainer: {
    marginTop: -10,
    alignItems: 'center',
  },
  restoreButton: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  restoreText: {
    marginLeft: 0,
    color: Colors.PrimaryBlue,
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
  },
})

export default SubscribeModal
