import Colors from '@/utils/colors'
import styled from 'styled-components/native'

const ValidationError = ({ error }: { error: string | string[] }) => {
  return <ErrorMessage>{error}</ErrorMessage>
}

export default ValidationError

const ErrorMessage = styled.Text`
  color: ${Colors.Red};
  font-family: 'Outfit-Regular';
  font-size: 12px;
`
