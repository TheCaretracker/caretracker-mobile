import globalStyles from '@/globalStyles'
import React from 'react'
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import CaredForAvatar from './CaredForAvatar'
import styled from 'styled-components/native'
import { CaredForSmall } from '@/types/caredFor'

interface Props {
  childData?: CaredForSmall
  onPress: (e: GestureResponderEvent) => void
}

const CaredForCard = ({ childData, onPress }: Props) => {
  return (
    <TouchableOpacity style={globalStyles.cardContainer} onPress={onPress}>
      <View style={styles.cardContainer}>
        <AvatarContainer>
          <CaredForAvatar avatar={childData?.avatar} />
        </AvatarContainer>
        <View style={styles.cardBody}>
          <Text
            style={[
              styles.bodyTextBold,
              styles.bodyTextMedium,
              { lineHeight: 18 },
            ]}
          >
            {childData?.fullName}
          </Text>
          <View style={styles.cardInfo}>
            <Text style={[styles.bodyTextRegular, styles.bodyTextSmall]}>
              {childData?.age}
            </Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Text style={[styles.bodyTextRegular, styles.bodyTextSmall]}>
                Added by
              </Text>
              <Text
                style={[
                  styles.bodyTextBold,
                  styles.bodyTextSmall,
                  { maxWidth: 120, lineHeight: 15 },
                ]}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {childData?.guardianName}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const AvatarContainer = styled.View`
  width: 58px;
  height: 58px;
`

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardBody: {
    justifyContent: 'center',
    gap: 8,
    paddingLeft: 8,
    flex: 1,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyTextBold: {
    fontFamily: 'Outfit-SemiBold',
    color: '#375064',
  },
  bodyTextRegular: {
    fontFamily: 'Outfit-Regular',
  },
  bodyTextMedium: {
    fontSize: 14,
  },
  bodyTextSmall: {
    fontSize: 12,
  },
})

export default CaredForCard
