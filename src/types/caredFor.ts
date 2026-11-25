interface InitialsAvatar {
  isAvatar: false
  initials: string
}

interface ImageAvatar {
  isAvatar: false
  avatarId: number
}

type CaredForAvatar = InitialsAvatar | ImageAvatar

export interface CaredForSmall {
  id: number
  fullName: string
  avatar: CaredForAvatar
  guardianId: number
  guardianName: string
  age: number
}

export enum Severity {
  Mild = 'mild',
  Moderate = 'moderate',
  Severe = 'severe',
}

export interface Allergy {
  id?: number
  name: string
  severity: Severity
  reaction: string
  treatment: string
  allergyContactsAttributes: any[]
}

export interface Medication {
  id?: number
  name: string
  dose: string
  time: string
  description: string
  days: string[]
}

export interface FeedingTime {
  id?: number
  period: string
  time: string
}

export interface NapTime {
  id?: number
  period: string
  startTime: string
  endTime: string
}
export interface Activity {
  id?: number
  name: string
  startTime: string
  endTime: string
  location?: string
  days: string[]
}

export interface CaredForData {
  id?: number
  fullName?: string
  avatarId?: number
  guardianName?: string
  age?: number
  birthday?: Date
  allergies: Allergy[]
  medications: Medication[]
  napTimes: NapTime[]
  feedingTimes: FeedingTime[]
  activities: Activity[]
}
