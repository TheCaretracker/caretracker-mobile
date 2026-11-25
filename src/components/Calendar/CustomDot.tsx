import styled from 'styled-components/native'

const CustomDot = ({ color }) => {
  return <Dot color={color} />
}

const Dot = styled.View<{ color: string }>`
  aspect-ratio: 1;
  border-radius: 4px;
  border-width: 2px;
  border-color: ${({ color }) => color};
  padding: 2px;
`
export default CustomDot
