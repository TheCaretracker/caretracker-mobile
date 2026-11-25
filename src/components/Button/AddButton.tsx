import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import Colors from '@/utils/colors'
import { PlusIcon } from '@/assets/icons/icon'

interface IAddButton {
  text?: string
  onPressAdd?: () => void
}
const AddButton = ({ text, onPressAdd }: IAddButton) => {
  return (
    <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={onPressAdd}>
      <AddButtonView>
        <PlusIcon />
        <ButtonText>{text}</ButtonText>
      </AddButtonView>
    </TouchableOpacity>
  )
}

export default AddButton

const AddButtonView = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
  padding: 7px 16px;
  background-color: white;
  border-radius: 100px;
`
const ButtonText = styled.Text`
  font-family: 'Outfit-SemiBold';
  font-size: 16px;
  color: ${Colors.PrimaryPurple};
  line-height: 20px;
`
