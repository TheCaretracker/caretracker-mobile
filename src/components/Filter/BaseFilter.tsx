import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Text,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import moment from 'moment'
import FullHeightModal from '../Modals/FullHeightModal'
import { useEffect, useMemo, useState } from 'react'
import DropdownSelect from './DropdownSelect'
import { CheckboxFill } from '@/assets/icons/icon'
import Button from '../Button/Button'
import { CaredForSmall } from '@/types/caredFor'
import DateRangeSelector from './DateRangeSelector'

export type Option = {
  label: string
  value: any
}

type UserData = CaredForSmall[]

export interface FilterOptions {
  [filter: string]: {
    options?: Option[]
    name: string
    type?: 'dropdown' | 'dateRange' // Add type property
  }
}

export interface IBaseFilterProps {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  onApplyFilters: (filters: any) => void
  userData?: UserData
  options: FilterOptions
}

const deviceHeight = Dimensions.get('window').height
const smallPhone = Dimensions.get('window').width <= 375
const isAndroid = Platform.OS === 'android'

const BaseFilter = ({
  isVisible,
  setIsVisible,
  onApplyFilters,
  options,
}: IBaseFilterProps) => {
  const insets = useSafeAreaInsets()
  // store multiple openend dropdown
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean
  }>(Object.keys(options).reduce((acc, key) => ({ ...acc, [key]: false }), {}))

  // store the selected options
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: any[]
  }>({})

  // convert all selected options into array
  const selectedEntries = useMemo(
    () =>
      Object.entries(selectedValues).flatMap(([key, values]) => {
        const filterData = options[key]

        // Handle date range type
        if (filterData?.type === 'dateRange') {
          if (values && values.length === 2 && values[0] && values[1]) {
            return [
              {
                filter: key,
                value: values,
                label: `${moment(values[0]).format('MMM D, YYYY')} - ${moment(values[1]).format('MMM D, YYYY')}`,
              },
            ]
          }
          return []
        }

        // Handle dropdown type
        if (!filterData?.options || !values || values.length === 0) return []

        return values.map((value) => {
          const label =
            filterData.options?.find((option) => option.value === value)
              ?.label || ''
          return {
            filter: key,
            value,
            label,
          }
        })
      }),
    [selectedValues, options]
  )

  useEffect(() => {
    onApplyFilters(selectedValues)
  }, [selectedValues])

  // handle open dropdown for each
  const handleDropdownsToggle = (dropdownName: string) => {
    setOpenDropdowns((prevDropdowns) => ({
      ...prevDropdowns,
      [dropdownName]: !prevDropdowns[dropdownName],
    }))
  }
  // handle close/open all dropdown
  const handleToggleAllDropdowns = (value: boolean) => {
    setOpenDropdowns((prevOpenDropdowns) =>
      Object.keys(prevOpenDropdowns).reduce(
        (obj: Record<string, boolean>, key) => {
          obj[key] = value
          return obj
        },
        {}
      )
    )
  }

  // handle value change
  const handleValueChange = (dropdownKey: string, value: any[]) => {
    setSelectedValues((prevValues) => ({ ...prevValues, [dropdownKey]: value }))
  }

  // handle single remove selection
  const handleRemoveValue = (key: string, value: any) => {
    setSelectedValues((prevValues) => {
      // Special handling for date range: clear the entire range
      if (options[key]?.type === 'dateRange') {
        return { ...prevValues, [key]: [] }
      }

      const current = Array.isArray(prevValues[key]) ? prevValues[key] : []
      const newKeyValue = current.filter((optionValue) => optionValue !== value)
      return { ...prevValues, [key]: newKeyValue }
    })
  }

  // handle clear filters
  const handleClearFilters = () => {
    setSelectedValues({})
    handleToggleAllDropdowns(false)
    setIsVisible(false)
    onApplyFilters([])
  }

  // handle apply filters
  const handleApplyFilter = () => {
    handleToggleAllDropdowns(false)
    setIsVisible(false)
    onApplyFilters(selectedValues)
  }

  return (
    <FullHeightModal
      isVisible={isVisible}
      setModalVisible={setIsVisible}
      title="Filter by"
    >
      <ScrollView>
        <Container>
          <OptionContainer>
            {selectedEntries.length > 0 && (
              <RowTitle>Applied filters:</RowTitle>
            )}
            {selectedEntries.map(({ filter, label, value }) => (
              <TouchableOpacity
                key={`${filter}-${Array.isArray(value) ? value.join('_') : value}`}
                onPress={() => handleRemoveValue(filter, value)}
              >
                <OptionRow>
                  <CheckboxFill />
                  <Label>{label}</Label>
                </OptionRow>
              </TouchableOpacity>
            ))}
          </OptionContainer>
          {Object.entries(options).map(([filter, filterData], index) => {
            // Render date range selector
            if (filterData.type === 'dateRange') {
              return (
                <DateRangeSelector
                  key={index}
                  title={filterData.name}
                  startDate={selectedValues[filter]?.[0] || null}
                  endDate={selectedValues[filter]?.[1] || null}
                  onChangeRange={(start: string | null, end: string | null) => {
                    if (start && end) {
                      handleValueChange(filter, [start, end])
                    } else if (start || end) {
                      handleValueChange(filter, [start || '', end || ''])
                    } else {
                      handleValueChange(filter, [])
                    }
                  }}
                />
              )
            }

            // Render dropdown selector
            return (
              <DropdownSelect
                key={index}
                title={filterData.name}
                options={filterData.options || []}
                isOpen={openDropdowns[filter]}
                onOpen={() => handleDropdownsToggle(filter)}
                onValueChange={(value) => handleValueChange(filter, value)}
                selectedValues={selectedValues[filter]}
              />
            )
          })}
          <EmptySpace />
        </Container>
      </ScrollView>
      <RowButtons style={{ bottom: insets.bottom }}>
        <Button
          text="Clear Filters"
          type="secondary"
          buttonStyle={{ width: 152 }}
          onPress={handleClearFilters}
        />
        <Button
          text="Apply"
          buttonStyle={{ width: 152 }}
          onPress={handleApplyFilter}
        />
      </RowButtons>
    </FullHeightModal>
  )
}

export default BaseFilter

const Container = styled.View`
  padding: 24px;
  row-gap: 30px;
  min-height: ${deviceHeight - 92};
`
const EmptySpace = styled.View`
  width: 100%;
  height: ${smallPhone ? '74px' : isAndroid ? '94px' : '44px'};
`
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const RowButtons = styled(Row)`
  width: 100%;
  padding: 0 24px;
  position: absolute;
`
const OptionContainer = styled.View`
  row-gap: 16px;
`
const OptionRow = styled(Row)`
  justify-content: flex-start;
  column-gap: 12px;
`
const Label = styled.Text`
  font-family: 'Outfit-Regular';
  font-size: 16px;
  color: #2e2e2e;
`
const RowTitle = styled.Text`
  font-family: 'Outfit-Medium';
  color: #375064;
  font-size: 18px;
`
