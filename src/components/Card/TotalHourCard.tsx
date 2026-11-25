import styled from 'styled-components/native'
import { TotalIcon } from '@/assets/icons/icon'

interface props {
  total?: number | string
}

const TotalHourCard = ({ total }: props) => {
  return (
    <Container>
      <InlineRow>
        <TotalIcon />
        <Text>Hours this week</Text>
      </InlineRow>
      <TotalHour>{total}</TotalHour>
    </Container>
  )
}

export default TotalHourCard

const Container = styled.View`
  width: 100%;
  min-height: 66px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  padding: 13.5px 24px;
  background-color: #ffe0a0;
`
const InlineRow = styled.View`
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
`
const Text = styled.Text`
  font-family: 'Outfit-Regular';
  font-size: 16px;
  color: #2e2e2e;
`
const TotalHour = styled.Text`
  font-family: 'Outfit-Bold';
  font-size: 32px;
  color: #2e2e2e;
`
