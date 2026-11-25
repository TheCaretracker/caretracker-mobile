import { ActivityIndicator, ScrollView } from 'react-native'
import styled from 'styled-components/native'

interface ITotalHourBlueCardProps {
  title?: string
  hour?: number | string
  smallLabel?: string
  loading?: boolean
}

const TotalHourBlueCard = ({
  title,
  hour,
  smallLabel,
  loading = false,
}: ITotalHourBlueCardProps) => {
  return (
    <Container>
      <Title maxFontSizeMultiplier={1.0} numberOfLines={1}>
        {title}
      </Title>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-end' }}
        contentContainerStyle={{ flexDirection: 'column' }}
      >
        <Hour maxFontSizeMultiplier={1.0}>
          {loading ? <ActivityIndicator size={40} /> : hour}
        </Hour>

        <SmallLabel>{smallLabel}</SmallLabel>
      </ScrollView>
    </Container>
  )
}

export default TotalHourBlueCard

const Container = styled.View`
  flex: 1;
  /* aspect-ratio: 1; */
  min-height: 122px;
  border-radius: 16px;
  background-color: #cef0ff;
  padding: 16px 20px;
`
const Title = styled.Text`
  font-family: 'Outfit-Regular';
  font-size: 16px;
  margin-bottom: 16px;
  color: #2e2e2e;
`
const Hour = styled.Text`
  font-family: 'Outfit-Bold';
  font-size: 32px;
  text-align: right;
  color: #2e2e2e;
  height: 42px;
`
const SmallLabel = styled.Text`
  font-family: 'Outfit-Regular';
  font-size: 12px;
  text-align: right;
  color: #2e2e2e;
`
