import { FlatList, StyleSheet, View, Dimensions } from 'react-native'
import { BackButtonHeader, Button, Card } from '@/components'
import React, { useState } from 'react'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import { listContacts } from '@/requests/contactRequests'
import { useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const EmergencyContactsScreen = ({ navigation }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height

  const insets = useSafeAreaInsets()

  const [contacts, setContacts] = useState()
  const fetchContacts = async () => {
    const { data } = await listContacts()
    if (data.success) {
      setContacts(data.contacts)
    } else {
      console.log('Error: /contacts')
    }
  }

  // Trigger this everytime screen gets focused
  // E.g.: Returning back from another screen
  useFocusEffect(
    React.useCallback(() => {
      console.log('Fetching all contacts')
      fetchContacts()
    }, [])
  )

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BackButtonHeader header="Emergency Contacts" navigation={navigation} />
      <View style={styles.wrapper}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 50 }}
          style={{ width: '100%', height: screenHeight / 1.24 }}
          data={contacts}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 4 }}>
              <Card
                type="iconRight"
                icon={<ArrowRightIcon />}
                children={item.contactName}
                additionalInfo={item.relationship}
                onPress={() =>
                  navigation.navigate('AddContactScreen', {
                    itemId: item.id,
                    isEdit: true,
                  })
                }
              />
            </View>
          )}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              width: screenWidth * 0.88,
            }}
          >
            <Button
              text="Add new contact"
              type="secondary"
              onPress={() => navigation.navigate('AddContactScreen')}
            />
          </View>
        </View>
        <ConfirmationModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          title="Remove contact?"
          description="By removing this employee, you will no longer be able to receive
          schedule invites from them."
          primaryButtonText="Remove"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  contactListWrapper: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEBEC',
  },
  avatarNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactName: {
    fontSize: 16,
    color: '#375064',
  },
  remove: {
    fontSize: 12,
    color: '#6D767C',
    textDecorationLine: 'underline',
  },
})

export default EmergencyContactsScreen
