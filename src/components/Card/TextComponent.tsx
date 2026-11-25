import { StyleSheet, Text, View } from 'react-native'

type TextComponentProps = {
  title: string
  value: any
  style?: object
  icon?: React.ReactNode
}

const TextComponent: React.FC<TextComponentProps> = ({
  title,
  value,
  style,
  icon,
}) => {
  const renderValues = () => {
    return Array.isArray(value) && value.length > 0 ? (
      <View>
        {value.map((item, index) => (
          <>
            <Text
              key={index}
              style={[
                styles.bodyTextBold,
                styles.bodyTextMedium,
                styles.textDarkBlue,
              ]}
            >{`${item.contactName}: +${item.contactPhone}`}</Text>
            {index < value.length - 1 && <Text style={styles.lineBreak} />}
          </>
        ))}
      </View>
    ) : (
      <Text
        style={[
          styles.bodyTextBold,
          styles.bodyTextMedium,
          styles.textDarkBlue,
        ]}
      >
        {Array.isArray(value) ? 'N/A' : value}
      </Text>
    )
  }

  return (
    <View style={style ? style : styles.textColumn}>
      <Text
        style={[styles.bodyTextRegular, styles.bodyTextSmall, styles.textGrey]}
      >
        {title}
      </Text>
      <View style={styles.valueWrapper}>
        {icon}
        {renderValues()}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  bodyTextBold: {
    fontFamily: 'Outfit-SemiBold',
    lineHeight: 17.5,
  },
  bodyTextRegular: {
    fontFamily: 'Outfit-Regular',
    lineHeight: 15,
  },
  bodyTextLarge: { fontSize: 18 },
  bodyTextMedium: {
    fontSize: 14,
  },
  bodyTextSmall: {
    fontSize: 12,
  },
  textGrey: {
    color: '#6D767C',
  },
  textDarkBlue: {
    color: '#375064',
  },
  valueWrapper: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  textColumn: {
    flex: 1,
  },
  lineBreak: {
    height: 1,
  },
})

export default TextComponent
