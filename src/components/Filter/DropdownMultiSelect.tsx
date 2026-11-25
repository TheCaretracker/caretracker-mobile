import { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import { ArrowDown, CheckboxEmpty, CheckboxFill } from '@/assets/icons/icon'

type Option = {
  label: string
  value: string
  id: string
}

interface IDropdownMultiSelectProps {
  title?: string
  options: Option[]
  onValueChange: (values: Option[]) => void
  isOpen: boolean
  onOpen: () => void
  selectedValues?: Option[]
}

const DropdownMultiSelect = ({
  title,
  options,
  onValueChange,
  isOpen,
  onOpen,
  selectedValues = [],
}: IDropdownMultiSelectProps) => {
  const [internalSelectedValues, setInternalSelectedValues] =
    useState<Option[]>(selectedValues)

  useEffect(() => {
    setInternalSelectedValues(selectedValues)
  }, [selectedValues])

  const handleSelect = (option: Option) => {
    let updatedValues
    if (internalSelectedValues.some((val) => val.value === option.value)) {
      updatedValues = internalSelectedValues.filter(
        (val) => val.value !== option.value
      )
    } else {
      updatedValues = [...internalSelectedValues, option]
    }
    setInternalSelectedValues(updatedValues)
    // onValueChange(updatedValues.map((opt) => opt.value))
    onValueChange(updatedValues.map((opt) => opt))
  }

  return (
    <Card>
      <TouchableOpacity onPress={onOpen}>
        <Row>
          <RowTitle>{title}</RowTitle>
          {isOpen ? <ArrowDown style={styles.arrowUp} /> : <ArrowDown />}
        </Row>
      </TouchableOpacity>
      {isOpen && (
        <OptionContainer>
          {options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelect(option)}>
              <OptionRow>
                {internalSelectedValues.some(
                  (val) => val.value === option.value
                ) ? (
                  <CheckboxFill />
                ) : (
                  <CheckboxEmpty />
                )}
                <Label>{option.label}</Label>
              </OptionRow>
            </TouchableOpacity>
          ))}
        </OptionContainer>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  arrowUp: {
    transform: [{ rotate: '180deg' }],
  },
})

export default DropdownMultiSelect

const Card = styled.View`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eaebec;
  padding-bottom: 30px;
  row-gap: 16px;
`
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
