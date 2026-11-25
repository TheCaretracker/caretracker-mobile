import { View } from 'react-native'
import RadioButton from '../Button/RadioButton'

interface RoleSelectProps {
  roles: { name: string; value: string }[]
  value: string
  onChangeValue: (value: string) => void
}

const RoleSelect = ({ roles, value, onChangeValue }: RoleSelectProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 42,
        // marginHorizontal: 20,
        justifyContent: 'space-between',
      }}
    >
      {roles.map((role) => (
        <RadioButton
          key={role.name}
          text={role.name}
          isSelected={role.value === value}
          pressButton={() => onChangeValue(role.value)}
        />
      ))}
    </View>
  )
}

export default RoleSelect
