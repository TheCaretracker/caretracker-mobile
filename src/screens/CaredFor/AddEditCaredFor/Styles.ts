import { StyleSheet } from 'react-native'
import Colors from '@/utils/colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardBody: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 41,
    gap: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: Colors.LightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 74,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.LightGrey,
  },
  buttonSave: {
    width: '87%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalStyle: {
    width: '100%',
    minHeight: 200,
    backgroundColor: Colors.BackgroundGrey,
  },
  editAvatarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  linearGradientStyle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  editText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    marginBottom: 4,
  },
})
