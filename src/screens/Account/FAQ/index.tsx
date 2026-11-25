import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { BackButtonHeader, CollapsibleCard } from '@/components'
import { FAQs } from './FAQs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const FAQScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BackButtonHeader header="FAQ" navigation={navigation} />
      <FlatList
        style={{ width: '100%' }}
        contentContainerStyle={styles.wrapper}
        data={FAQs}
        renderItem={({ item }) => (
          <CollapsibleCard title={item.title} text={item.text} />
        )}
        keyExtractor={(item) => item.title}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexGrow: 1,
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12,
  },
})

export default FAQScreen
