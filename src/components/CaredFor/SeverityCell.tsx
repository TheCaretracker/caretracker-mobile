import SevereIcon from '@/assets/icons/severe-face.svg'
import MildIcon from '@/assets/icons/mild-face.svg'
import ModerateIcon from '@/assets/icons/moderate-face.svg'
import TextComponent from '../Card/TextComponent'
import { ViewStyle } from 'react-native'

const SeverityCell = ({
  value,
  style,
}: {
  value: number
  style?: ViewStyle
}) => {
  const getIcon = () => {
    if (!value) return null

    const SeverityIcon = {
      mild: MildIcon,
      moderate: ModerateIcon,
      severe: SevereIcon,
    }[value]

    return <SeverityIcon width={14} height={14} />
  }

  const getSeverity = () => {
    return {
      moderate: 'Moderate',
      mild: 'Mild',
      severe: 'Severe',
    }[value]
  }

  return (
    <TextComponent
      style={style}
      title="Severity"
      icon={getIcon()}
      value={getSeverity()}
    />
  )
}
export default SeverityCell
