import React, { ReactNode } from 'react'
import { CloseIcon } from '@/assets/icons/icon'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'

import Modal from 'react-native-modal'
import DismissKeyboard from '../DismissKeyboard/DismissKeyboard'
interface DefaultModalProps {
  children: ReactNode
  isVisible: boolean
  modalstyle?: ViewStyle | any
  hideCloseButton?: boolean
  avoidKeyboard?: boolean
  setModalVisible: (visible: boolean) => void
}

const DefaultModal = ({
  isVisible,
  setModalVisible,
  children,
  modalstyle,
  hideCloseButton = false,
  avoidKeyboard = false,
}: DefaultModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      hasBackdrop
      onBackdropPress={() => {
        setModalVisible(false)
      }}
      backdropColor="black"
      backdropOpacity={0.5}
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      avoidKeyboard={avoidKeyboard}
    >
      <DismissKeyboard>
        <View style={styles.centeredView}>
          <View style={[styles.modal, modalstyle]}>
            {!hideCloseButton && (
              <View style={styles.closeButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  <CloseIcon style={styles.closeButton} />
                </TouchableOpacity>
              </View>
            )}
            {children}
          </View>
        </View>
      </DismissKeyboard>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modal: {
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    margin: 20,
    backgroundColor: 'white',
  },
  closeButtonContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
  closeButton: {
    width: 24, // Set the width of the close button image
    height: 24, // Set the height of the close button image
  },
})

export default DefaultModal
