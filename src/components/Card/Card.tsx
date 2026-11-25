import React from 'react'
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import RegularCard from './RegularCard'
import IconRight from './IconRight'
import ThreeSection from './ThreeSection'
import IconLeft from './IconLeft'
import globalStyles from '@/globalStyles'

interface Props {
  type?: 'avatar' | 'iconRight' | 'threeSection' | 'iconLeft'
  onPress?: (event: GestureResponderEvent) => void
  styleProps?: object
  icon?: React.ReactNode
  avatar?: React.ReactNode
  object?: object
  childData?: {
    id: number
    name: string
    age: string
    avatar: string
    guardian: string
  }
  children?: string
  additionalInfo?: string
}

const Card = ({
  type,
  onPress,
  styleProps,
  icon,
  avatar,
  object,
  childData,
  children,
  additionalInfo,
}: Props) => {
  const cartType = () => {
    switch (type) {
      // case 'avatar':
      //   return (
      //     <CaredForCard
      //       styleProps={styleProps}
      //       avatar={avatar}
      //       childData={childData}
      //     />
      //   )
      case 'iconRight':
        return (
          <IconRight
            styleProps={styleProps}
            icon={icon}
            children={children}
            additionalInfo={additionalInfo}
          />
        )
      case 'iconLeft':
        return (
          <IconLeft styleProps={styleProps} icon={icon} children={children} />
        )
      case 'threeSection':
        return <ThreeSection styleProps={styleProps} object={object} />
      default:
        return <RegularCard styleProps={styleProps} children={children} />
    }
  }

  return (
    <TouchableOpacity style={globalStyles.cardContainer} onPress={onPress}>
      {cartType()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})

export default Card
