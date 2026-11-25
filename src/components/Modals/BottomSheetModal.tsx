import { TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'
import styled from 'styled-components/native'
import { CloseIcon } from '@/assets/icons/icon'

interface BottomSheetModalProps extends Partial<ModalProps> {
  setModalVisible: (isVisible: boolean) => void
  title?: string
}
const BottomSheetModal = ({
  children,
  isVisible,
  title,
  setModalVisible,
  ...rest
}: BottomSheetModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop
      onBackdropPress={() => setModalVisible(false)}
      backdropColor="black"
      backdropOpacity={0.5}
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      avoidKeyboard
      style={{ margin: 0, justifyContent: 'flex-end' }}
      swipeDirection={['down']}
      useNativeDriverForBackdrop
      onSwipeComplete={() => setModalVisible(false)}
      {...rest}
    >
      <View style={styles.modal}>
        <Header>
          {!!title && <Title>{title}</Title>}
          <CloseButton onPress={() => setModalVisible(false)}>
            <CloseIcon style={styles.closeButton} />
          </CloseButton>
        </Header>
        <View>{children}</View>
      </View>
    </Modal>
  )
}

const Title = styled.Text`
  font-family: 'Outfit-SemiBold';
  font-size: 18px;
`

const Header = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-bottom: 20px;
`

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 5px;
`

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
  },
  closeButtonContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
  },
})

export default BottomSheetModal
