import { SvgProps } from 'react-native-svg'

export interface IAvatarModalContent {
  avatars?: React.FC<SvgProps>[]
  handleClearAvatar?: () => void
  handleSaveAvatar?: () => void
  tempSelectedAvatar?: number | null
  setTempSelectedAvatar?: (avatarIndex: number) => void
}

export type TMedicTime = {
  period: string
  time: string
}

export type TMedicationsData = {
  medicName: string
  dose: string
  medicTime: TMedicTime
  medicDays: string[]
}

export type TAllergiesData = {
  allergyType: string
  severity: string
  reaction: string
  treatment: string
  emergencyContact: string[]
}

export type Option = {
  label: string
  value: string
}

export type TFeedingTimeData = {
  feedPeriod: string
  feedTime: TMedicTime
}

export type TNapTimeData = {
  napPeriod: string
  napStartTime: TMedicTime
  napEndTime: TMedicTime
}

export type TActivityData = {
  activityName: string
  activityLocation: string
  actStartTime: TMedicTime
  actEndTime: TMedicTime
  activityDays: string[]
}
