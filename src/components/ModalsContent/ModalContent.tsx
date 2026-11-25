import { RemoveIcon } from '@/assets/icons/icon'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import Button from '../Button/Button'
import { useContext } from 'react'
import { CaredForFormContext } from '@/contexts/CaredForForm/CaredForFormContext'
import Colors from '@/utils/colors'

const ModalContent = ({
  children,
  handleSubmit,
  handleRemove,
  modalProps,
  closeModalProps,
}: any) => {
  const context = useContext(CaredForFormContext)
  const { modal, closeModal } = {
    modal: modalProps ?? context?.modal,
    closeModal: closeModalProps ?? context?.closeModal,
  }
  return (
    <View style={styles.container}>
      {children}
      {modal?.itemIndex !== undefined && (
        <TouchableOpacity onPress={handleRemove}>
          <View style={styles.row}>
            <RemoveIcon />
            <Text style={styles.removeText}>Remove</Text>
          </View>
        </TouchableOpacity>
      )}
      <View style={[styles.twoColumnRow, styles.top8]}>
        <Button
          text="Cancel"
          type="secondary"
          buttonStyle={styles.halfWidth}
          onPress={() => closeModal?.()}
        />
        <Button
          text="Save"
          buttonStyle={styles.halfWidth}
          onPress={(values) => handleSubmit(values)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    alignItems: 'flex-start',
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
    width: '100%',
  },
  top8: {
    marginTop: 8,
  },
  halfWidth: {
    width: '47%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginLeft: 4,
  },
  removeText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    textDecorationLine: 'underline',
    color: Colors.Red,
  },
})

export default ModalContent
