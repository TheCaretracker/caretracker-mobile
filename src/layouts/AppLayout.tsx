import { AppHeader } from '@/components'
import styled from 'styled-components/native'

const AppLayout = ({ title, showUserData = false, children, navigation }) => {
  return (
    <RootContainer>
      <AppHeader text={title} navigation={navigation} />
      <ScrollContainer>{children}</ScrollContainer>
    </RootContainer>
  )
}

export default AppLayout

const ScrollContainer = styled.ScrollView`
  padding-left: 24px;
  padding-right: 24px;
  margin-top: 120px;
  padding-bottom: 12px;
`

const RootContainer = styled.View`
  flex: 1;
`
