import { UserDataContext } from '@/contexts/UserDataContext'
import BaseFilter, { IBaseFilterProps, Option } from './BaseFilter'
import { useContext } from 'react'

interface ITimesheetFilterProps extends Omit<IBaseFilterProps, 'options'> {
  subjects: Option[]
}
const TimesheetFilter = ({
  isVisible,
  setIsVisible,
  onApplyFilters,
  subjects,
}: ITimesheetFilterProps) => {
  // identify user role
  const { isEmployer } = useContext(UserDataContext)

  const options = {
    subjects: {
      options: subjects,
      name: isEmployer ? 'Employee' : 'Employer',
      type: 'dropdown' as const,
    },
    dateRange: {
      name: 'Pay Period',
      type: 'dateRange' as const,
    },
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

export default TimesheetFilter
