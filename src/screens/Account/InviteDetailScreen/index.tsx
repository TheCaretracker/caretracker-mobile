import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native'
import { BackButtonHeader, Button } from '@/components'
import globalStyles from '@/globalStyles'
import { useCallback, useEffect, useState } from 'react'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'
import { MenuVertical, USIcon, TrashIcon } from '@/assets/icons/icon'
import Colors from '@/utils/colors'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import Avatar from '@/components/Avatar/Avatar'
import SkeletonLabelValue from '@/components/Skeleton/SkeletonLabelValue'
import SkeletonLoader from '@/components/Skeleton/SkeletonLoader'
import { useFocusEffect } from '@react-navigation/native'
import { deleteInvite, showInviteById } from '@/requests/inviteRequests'
import { shareInvite } from '../InviteEmployeeScreen/share'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const DeviceHeight = Dimensions.get('window').height
const SmallDevice = Dimensions.get('window').height <= 667

const InviteDetailsScreen = ({ route, navigation }: any) => {
  const { id } = route.params
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [invite, setInvite] = useState<any>()

  const insets = useSafeAreaInsets()

  const fetchEmployeeData = async () => {
    const { data } = await showInviteById(id)

    console.log(data)

    if (data.success) {
      setInvite(data.invite)
    }
  }
  useFocusEffect(
    useCallback(() => {
      fetchEmployeeData()
    }, [id])
  )

  const handleDelete = async () => {
    const { data } = await deleteInvite(id)

    if (data.success) {
      navigation.goBack()
    }
  }

  const renderSkeleton = () => (
    <View style={styles.wrapper}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarNameWrapper}>
          <Skeleton width={32} height={32} variant="circle" />
          <Skeleton width={200} height={22} />
        </View>
      </View>
      <SkeletonLabelValue />
      <SkeletonLabelValue />
      <SkeletonLabelValue />
    </View>
  )

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <BackButtonHeader header="Invite Details" navigation={navigation} />
      <SkeletonLoader
        renderSkeleton={renderSkeleton}
        isReady={invite}
        renderContent={() => (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.wrapper}>
              <View>
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarNameWrapper}>
                    <View style={styles.avatarStyle}>
                      <Avatar source={invite.avatar} />
                    </View>
                    <Text
                      style={[
                        styles.employeeName,
                        globalStyles.bodyTextBold,
                        { flexShrink: 1 },
                      ]}
                    >
                      {invite.fullName}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                    <MenuVertical />
                  </TouchableOpacity>
                </View>
                {showMenu && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(true)
                      setShowMenu(!showMenu)
                    }}
                  >
                    <View style={styles.menu}>
                      <Text style={styles.infoText}>Delete</Text>
                      <TrashIcon />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.infoText}>{invite.email}</Text>
              </View>
              <View>
                <Text style={styles.label}>Phone number</Text>
                <View style={styles.avatarNameWrapper}>
                  <USIcon />
                  <Text style={styles.infoText}>{invite.phoneNumber}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.label}>Code</Text>
                <Text style={styles.infoText}>{invite.code}</Text>
              </View>
            </View>
          </ScrollView>
        )}
      />
      <ConfirmationModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        title="Delete Invite?"
        description="By deleting this invite, your employer will no longer be able to register using this code and you will have to invite them again. Would you like to proceed?"
        primaryButtonText="Delete"
        onConfirm={handleDelete}
      />
      <View style={{ flexGrow: 1 }} />
      <Button
        text="Resend Invite Link"
        buttonStyle={styles.buttonStyle}
        onPress={async () => {
          await shareInvite(invite)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingTop: 8,
    paddingHorizontal: 24,
    rowGap: 24,
    paddingBottom: 100,
  },
  flatlistStyle: {
    width: '100%',
    maxHeight: SmallDevice ? DeviceHeight * 0.38 : DeviceHeight * 0.52,
  },
  contactListWrapper: {
    backgroundColor: 'white',
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    rowGap: 4,
    alignItems: 'flex-start',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  avatarNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarStyle: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  employeeName: {
    fontSize: 16,
    color: Colors.DarkBlue,
    lineHeight: 20,
  },
  schedulesText: {
    fontSize: 18,
    color: Colors.DarkBlue,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGrey,
  },
  label: {
    fontFamily: 'Outfit-Regular',
    color: Colors.PrimaryBlue,
    fontSize: 10,
  },
  infoText: {
    fontFamily: 'Outfit-Regular',
    color: Colors.BlackText,
    fontSize: 14,
    lineHeight: 17.5,
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Outfit-Regular',
    color: Colors.DarkBlue,
    fontSize: 14,
  },
  repeatText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: Colors.DarkBlue,
  },
  pendingText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: Colors.DarkGrey,
  },
  buttonStyle: {
    width: '88%',
    alignSelf: 'center',
  },
})

export default InviteDetailsScreen
