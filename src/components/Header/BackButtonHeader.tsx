import { StyleProp, StyleSheet, TextStyle, StatusBar, View } from 'react-native'
import { Text } from 'react-native'
import globalStyles from '@/globalStyles'
import LeftArrow from '@/assets/icons/arrow-left.svg'
import { styled } from 'styled-components/native'

interface Props {
  textStyle?: StyleProp<TextStyle>
  navigation?: any
  header?: string
}

const BackButtonHeader = ({ navigation, textStyle, header }: Props) => {
  return (
    <View style={styles.header}>
      <StatusBar backgroundColor="#F8F8F8" barStyle="dark-content" />
      <BackButton onPress={() => navigation.goBack()}>
        <LeftArrow />
      </BackButton>
      <Text style={[globalStyles.h2, textStyle, { lineHeight: 25 }]}>
        {header}
      </Text>
      <View style={{ width: 28 }} />
    </View>
  )
}

const BackButton = styled.TouchableOpacity`
  padding: 10px;
  aspect-ratio: 1;
`

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
})

export default BackButtonHeader
