import Colors from '@/utils/colors'
import { CSSProperties } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { RuleSet, css } from 'styled-components'
import styled from 'styled-components/native'
import CustomDot from './CustomDot'

const CustomDay = ({ date, state, marking, theme, onPress }) => {
  const renderDots = (dots: any[]) => {
    const dotsOverflow = dots.slice(3).length
    return (
      <>
        {dots.slice(0, 3).map((dot, index) => (
          <CustomDot color={dot.color} key={index} />
        ))}

        {dotsOverflow ? <DotsOverflow>+{dotsOverflow}</DotsOverflow> : null}
      </>
    )
  }

  const dayStyle = css`
    ${marking?.selected && selectedStyle}
    ${state === 'today' && todayStyle};
    ${state === 'disabled' && disabledStyle};
  `
  const containerStyle = css`
    ${marking?.selected && selectedContainerStyle};
    ${state === 'today' && todayContainerStyle};
  `

  return (
    <DayTouchable
      onPress={() => onPress(date)}
      disabled={marking?.disableTouchEvent}
    >
      <DayContainer style={[baseContainerStyle, containerStyle]}>
        <Day adjustsFontSizeToFit style={[baseStyle, dayStyle]}>
          {date.day}
        </Day>
      </DayContainer>
      <DotContainer>
        {marking?.dots && state !== 'disabled' && renderDots(marking.dots)}
      </DotContainer>
    </DayTouchable>
  )
}

const DayTouchable = styled.TouchableOpacity``
const DayRootContainer = styled.View``
const DayContainer = styled.View<{ style: RuleSet }>`
  ${({ style }) => style}
`
const Day = styled.Text<{ style: RuleSet }>`
  ${({ style }) => style}
`
const DotContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-shrink: 0;
`

const DotsOverflow = styled.Text`
  font-family: 'Outfit-Regular';
  color: ${Colors.DarkGrey};
  font-size: 10px;
`

const baseStyle = css`
  font-family: 'Outfit-Regular';
  font-size: 14px;
  text-align: center;
  color: #2e2e2e;
`
const disabledStyle = css`
  color: ${Colors.Grey};
`
const todayStyle = css`
  color: #fff;
  font-family: 'Outfit-SemiBold';
`
const selectedStyle = css`
  color: ${Colors.PrimaryPurple};
  font-family: 'Outfit-SemiBold';
`
const baseContainerStyle = css`
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin: 1px;
  aspect-ratio: 1;
  flex-shrink: 1;
  padding: 5px;
  border-width: 1px;
  border-color: transparent;
`
const todayContainerStyle = css`
  background-color: ${Colors.PrimaryPurple};
`
const selectedContainerStyle = css`
  border-width: 1px;
  border-color: ${Colors.SecondaryPurple};
`

export default CustomDay
