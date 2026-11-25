interface AvatarImage {
  isAvatar: true
  url: string
}

interface AvatarInitials {
  isAvatar: false
  initials: string
}

export type AvatarType = AvatarImage | AvatarInitials

export interface User {
  id: string
  fullName: string
  avatar: AvatarType
  email: string
  phoneNumber: string
  address: {
    city: string
    state: string
    street: string
  }
}
