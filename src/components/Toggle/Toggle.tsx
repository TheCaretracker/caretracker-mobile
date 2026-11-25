import Colors from '@/utils/colors'
import { Switch, SwitchProps } from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'

interface ToggleProps extends SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => any
}

const Toggle = ({ value, onValueChange, ...rest }: ToggleProps) => {
  return (
    // <Switch
    //   trackColor={{ false: '#767577', true: 'rgba(91, 120, 238, 1)' }}
    //   thumbColor={Colors.White}
    //   onValueChange={onValueChange}
    //   value={value}
    //   style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
    //   {...rest}
    // />
    <ToggleSwitch
      isOn={value}
      onToggle={onValueChange}
      onColor={Colors.PrimaryBlue}
      offColor={Colors.Grey}
    />
  )
}

export default Toggle
