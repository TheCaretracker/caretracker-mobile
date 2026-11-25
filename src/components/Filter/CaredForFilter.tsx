import { Dimensions, Platform } from 'react-native'
import { CaredForSmall } from '@/types/caredFor'
import BaseFilter from './BaseFilter'

type Option = {
  label: string
  value: any
}

type UserData = CaredForSmall[]

interface ICaredForFilterProps {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  onApplyFilters?: (filters: Option[]) => void
  userData?: UserData
  employees: Option[]
}

const AgeOption = [
  { label: '< 1 year', value: { max: 1 } },
  { label: '1 - 5 years', value: { min: 1, max: 5 } },
  { label: '6 - 10 years', value: { min: 6, max: 10 } },
  { label: '11 - 16 years', value: { min: 11, max: 16 } },
  { label: '17 - 25 years', value: { min: 17, max: 25 } },
  { label: '26 - 35 years', value: { min: 26, max: 35 } },
  { label: '36 - 55 years', value: { min: 36, max: 55 } },
  { label: '> 55 years', value: { min: 55 } },
]

const CaredForFilter = ({
  isVisible,
  setIsVisible,
  onApplyFilters,
  employees,
}: ICaredForFilterProps) => {
  const options = {
    employers: { options: employees, name: 'Employer' },
    ages: { options: AgeOption, name: 'Age' },
  }

  return (
    <BaseFilter
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      onApplyFilters={onApplyFilters}
      options={options}
    />
  )
}

export default CaredForFilter
