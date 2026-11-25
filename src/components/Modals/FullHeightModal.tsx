import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'
import { CloseIcon } from '@/assets/icons/icon'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface BottomSheetModalProps extends Partial<ModalProps> {
  setModalVisible: (isVisible: boolean) => void
  title?: string
}

const FullHeightModal = ({
  children,
  isVisible,
  setModalVisible,
  title,
  ...rest
}: BottomSheetModalProps) => {
  const insets = useSafeAreaInsets()

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop
      backdropColor="black"
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      avoidKeyboard
      style={styles.modal}
      swipeDirection={['down']}
      useNativeDriverForBackdrop
      propagateSwipe={true}
      scrollTo={() => {}}
      scrollOffset={1}
      onSwipeComplete={() => setModalVisible(false)}
      {...rest}
    >
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            paddingBottom: insets.bottom,
            paddingTop: insets.top,
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    width: '100%',
    flex: 1,
  },
  header: {
    width: '100%',
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 18,
    color: '#2E2E2E',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 12,
    alignSelf: 'flex-end',
  },
})

export default FullHeightModal
