import { useActionSheet } from '@expo/react-native-action-sheet'
import { Alert } from 'react-native'
import ImageCropPicker from 'react-native-image-crop-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const usePicturePicker = (
  setPicture: (value: { data: string; mime: string }) => void
) => {
  const insets = useSafeAreaInsets()
  const { showActionSheetWithOptions } = useActionSheet()
  const actions = ['Take a photo', 'Choose from library', 'Cancel']

  const showPicker = () => {
    setTimeout(() => {
      showActionSheetWithOptions(
        {
          options: actions,
          title: 'Choose an Action',
          cancelButtonIndex: 2,
          userInterfaceStyle: 'light',
          containerStyle: { paddingBottom: insets.bottom },
        },
        handleActions
      )
    }, 100)
  }

  const handleActions = (index?: number) => {
    switch (index) {
      case 0:
        handleCameraLaunch()
        break
      case 1:
        handleImageLibrary()
        break
      default:
        break
    }
  }

  const handleCameraLaunch = async () => {
    await ImageCropPicker?.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then((result) => setPicture({ data: result.data, mime: result.mime }))
      .catch((e) => Alert.alert('Error', e.message))
  }

  const handleImageLibrary = async () => {
    await ImageCropPicker?.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then((result) => setPicture({ data: result.data, mime: result.mime }))
      .catch((e) => Alert.alert('Error', e.message))
  }

  return { showPicker }
}
