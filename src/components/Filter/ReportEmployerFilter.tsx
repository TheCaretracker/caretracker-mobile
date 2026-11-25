import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native'
import { useState, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components/native'
import FullHeightModal from '../Modals/FullHeightModal'
import DropdownMultiSelect from './DropdownMultiSelect'
import { CheckboxFill } from '@/assets/icons/icon'
import { Button } from '@/components'

const deviceHeight = Dimensions.get('window').height
const smallPhone = Dimensions.get('window').width <= 375
const isAndroid = Platform.OS === 'android'
const CONTAINER_HEIGHT = deviceHeight - 92
const TOP_OFFSET = isAndroid ? deviceHeight - 130 : deviceHeight - 72
const EMPTY_SPACE_HEIGHT = smallPhone ? '74px' : '44px'

type Option = { label: string; value: string; id: string }
interface IFilterProps {
  filterData?: any[]
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  onApplyFilters?: (filters: Option[]) => void
}

const ReportEmployerFilter = ({
  filterData,
  isVisible,
  setIsVisible,
  onApplyFilters,
}: IFilterProps) => {
  const NameList = useMemo(() => {
    const UniqueNameList = new Set(filterData?.map((item) => item))

    return [...UniqueNameList].map((item) => {
      return {
        label: item.name,
        value: item.name,
        id: item.id,
      }
    })

    // const UniqueNameList = new Set(filterData?.map((item) => item.name))
    // return [...UniqueNameList].map((name) => ({ label: name, value: name }))
  }, [filterData])

  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean
    // }>({ fullName: false })
  }>({ id: false })
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: Option[]
  }>({})

  const [appliedValues, setAppliedValues] = useState<{
    [key: string]: Option[]
  }>({})

  useEffect(() => {
    setSelectedValues({ id: NameList })
    setAppliedValues({ id: NameList })
  }, [NameList])

  const selectedEntries = Object.entries(selectedValues)
  const selectedArray = useMemo(
    () => Object.values(selectedValues).flat(),
    [selectedValues]
  )

  const handleDropdownsToggle = useCallback((dropdownName: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }))
  }, [])

  const handleToggleAllDropdowns = useCallback((value: boolean) => {
    setOpenDropdowns(
      (prevOpenDropdowns) =>
        Object.keys(prevOpenDropdowns).reduce(
          (obj, key) => {
            obj[key] = value
            return obj
          },
          {} as Record<string, boolean>
        ) // Explicitly type the accumulator
    )
  }, [])

  const handleValueChange = useCallback((key: string, values: Option[]) => {
    setSelectedValues((prev) => ({
      ...prev,
      [key]: values.map((v) => ({ label: v.label, value: v.value, id: v.id })),
    }))
  }, [])

  const handleRemoveValue = useCallback(
    (dropdownKey: string, valueToRemove: string) => {
      setSelectedValues((prevValues) => {
        if (prevValues[dropdownKey]) {
          const updatedDropdown = prevValues[dropdownKey].filter(
            (option) => option.value !== valueToRemove
          )
          return { ...prevValues, [dropdownKey]: updatedDropdown }
        }
        return prevValues
      })
    },
    []
  )

  const getSelectedValue = useCallback(
    (key: string) => {
      return selectedValues[key] || []
    },
    [selectedValues]
  )

  const handleCloseFilter = useCallback(() => {
    setOpenDropdowns({})
    setIsVisible(false)
    setSelectedValues(appliedValues)
  }, [setIsVisible, setSelectedValues, appliedValues])

  const handleClearFilters = useCallback(() => {
    setSelectedValues({})
    setAppliedValues({})
    setOpenDropdowns({})
    setIsVisible(false)
    onApplyFilters?.([])
  }, [setIsVisible, onApplyFilters, setSelectedValues])

  const handleApplyFilter = useCallback(() => {
    handleToggleAllDropdowns(false)
    setIsVisible(false)
    onApplyFilters?.(selectedArray)
    setAppliedValues(selectedValues)
  }, [
    handleToggleAllDropdowns,
    setIsVisible,
    onApplyFilters,
    selectedArray,
    selectedValues,
  ])

  return (
    <FullHeightModal
      isVisible={isVisible}
      setModalVisible={handleCloseFilter}
      title="Filter by"
    >
      <ScrollView>
        <Container>
          <OptionContainer>
            {selectedArray.length > 0 && <RowTitle>Applied filters:</RowTitle>}
            {selectedEntries.flatMap(([key, values]) =>
              values.map((option) => (
                <TouchableOpacity
                  key={`${key}-${option.value}`}
                  onPress={() => handleRemoveValue(key, option.value)}
                >
                  <OptionRow>
                    <CheckboxFill />
                    <Label>{option.value}</Label>
                  </OptionRow>
                </TouchableOpacity>
              ))
            )}
          </OptionContainer>
          <DropdownMultiSelect
            title={'Employee'}
            options={NameList}
            // isOpen={openDropdowns['fullName']}
            isOpen={openDropdowns['id']}
            // onOpen={() => handleDropdownsToggle('fullName')}
            onOpen={() => handleDropdownsToggle('id')}
            // onValueChange={(value) => handleValueChange('fullName', value)}
            onValueChange={(values) => {
              handleValueChange('id', values)
            }}
            // selectedValues={getSelectedValue('fullName')}
            selectedValues={getSelectedValue('id')}
          />
          <EmptySpace />
        </Container>
      </ScrollView>
      <RowButtons topOffset={TOP_OFFSET}>
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

export default ReportEmployerFilter

const Container = styled.View`
  padding: 24px;
  row-gap: 30px;
  min-height: ${CONTAINER_HEIGHT}px;
`

const EmptySpace = styled.View`
  width: 100%;
  height: ${EMPTY_SPACE_HEIGHT};
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const RowButtons = styled(Row)<{ topOffset: number }>`
  width: 100%;
  padding: 0 24px;
  position: absolute;
  top: ${(props) => props.topOffset}px;
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
