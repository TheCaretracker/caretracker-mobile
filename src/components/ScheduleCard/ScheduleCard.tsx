import RegularCard from '../Card/RegularCard'
import CustomDot from '../Calendar/CustomDot'
import { styled } from 'styled-components/native'
import Colors from '@/utils/colors'
import { useContext } from 'react'
import { UserDataContext } from '@/contexts/UserDataContext'
import Button from '../Button/Button'
import { TouchableOpacity, View } from 'react-native'

const ScheduleCard = ({
  dotColor,
  timeInterval,
  name,
  status,
  type,
  onAccept,
  onDecline,
  onViewDetails,
}) => {
  const { isEmployee, isEmployer } = useContext(UserDataContext)

  const renderAcceptButtons = () => {
    if (
      (isEmployee && type === 'WorkEvent') ||
      // TODO: TimeOffRequest feature were removed for now
      (isEmployer && type === 'TimeOffRequest')
    ) {
      return (
        <AcceptanceButtonsContainer>
          <Button
            textStyle={{ color: Colors.PrimaryPurple }}
            buttonStyle={{
              backgroundColor: Colors.SecondaryPurple,
              paddingVertical: 5,
            }}
            text="Accept"
            onPress={onAccept}
          />
          <Button
            textStyle={{ color: Colors.PrimaryPurple }}
            buttonStyle={{ backgroundColor: Colors.White, paddingVertical: 5 }}
            text="Decline"
            onPress={onDecline}
          />
        </AcceptanceButtonsContainer>
      )
    }
  }

  const renderTitle = () => {
    if (type === 'WorkEvent') {
      return <Title>{name}</Title>
    }
    // TODO: TimeOffRequest feature were removed for now
    return <Title>Time Off Request</Title>
  }

  return (
    <TouchableOpacity
      onPress={onViewDetails}
      disabled={isEmployee || status === 'declined'}
    >
      <RegularCard styleProps={status == 'declined' && { opacity: 0.5 }}>
        <Header>
          <CustomDot
            color={status == 'declined' ? Colors.DarkGrey : dotColor}
          />
          <TimeInterval>{timeInterval}</TimeInterval>
        </Header>
        <TitleRow>
          <View style={{ flex: 1 }}>{renderTitle()}</View>
          {status === 'pending' && type === 'WorkEvent' && (
            <Status>Pending acceptance</Status>
          )}
        </TitleRow>
        {status == 'pending' && renderAcceptButtons()}
      </RegularCard>
    </TouchableOpacity>
  )
}

export default ScheduleCard

const AcceptanceButtonsContainer = styled.View`
  flex-direction: row;
  margin-top: 10px;
`

const Status = styled.Text`
  font-family: 'Outfit-Regular';
  color: ${Colors.Grey};
  font-size: 12px;
  line-height: 17.5;
`

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const TimeInterval = styled.Text`
  font-family: 'Outfit-Regular';
  color: ${Colors.DarkGrey};
`
const Title = styled.Text`
  font-family: 'Outfit-SemiBold';
  line-height: 17.5;
`
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`
