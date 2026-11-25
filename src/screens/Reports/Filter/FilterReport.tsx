import styled from 'styled-components/native'

const COLORS = {
  counterBg: '#4440d6',
  counterText: 'white',
}

const Counter = styled.View`
  width: 21px;
  height: 21px;
  border-radius: 21px;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.counterBg};
`
const CounterText = styled.Text`
  font-family: 'Outfit-SemiBold';
  font-size: 12px;
  text-align: center;
  color: ${COLORS.counterText};
`

interface FilterCounterProps {
  count: number | null
}

const FilterCounter = ({ count }: FilterCounterProps) => (
  <Counter>
    <CounterText>{count}</CounterText>
  </Counter>
)

export default FilterCounter
