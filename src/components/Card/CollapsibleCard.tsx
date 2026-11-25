import { useState } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import ArrowDownIcon from '@/assets/icons/arrow-down.svg'
import globalStyles from '@/globalStyles'

interface Props {
  title: string
  text: string
}

const CollapsibleCard = ({ title, text }: Props) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded(!expanded)
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: expanded
            ? 'rgba(68, 64, 214, 1)'
            : 'rgba(234, 235, 236, 1)',
        },
      ]}
      onPress={toggleExpand}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerText,
            { color: expanded ? 'rgba(68, 64, 214, 1)' : 'black' },
          ]}
        >
          {title}
        </Text>
        {expanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
      </View>

      <View style={[styles.body, { height: expanded ? null : 0 }]}>
        {expanded && <Text style={styles.bodyText}>{text}</Text>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.cardContainer,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    ...globalStyles.bodyTextBold,
    maxWidth: '90%',
  },
  body: {
    overflow: 'hidden',
  },
  bodyText: {
    ...globalStyles.bodyTextRegular,
    paddingTop: 10,
  },
})

export default CollapsibleCard
