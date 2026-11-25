import styled from 'styled-components/native'
import Colors from '@/utils/colors'

interface ITitleWithIcon {
  icon?: React.ReactNode
  title?: string
}

const RowTitle = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  column-gap: 4px;
`
const Title = styled.Text`
  font-family: 'Outfit-SemiBold';
  font-size: 18px;
  color: ${Colors.DarkBlue};
  line-height: 23px;
`

const TitleWithIcon = ({ icon, title }: ITitleWithIcon) => {
  return (
    <RowTitle>
      {icon}
      <Title>{title}</Title>
    </RowTitle>
  )
}

export default TitleWithIcon
