import {
  CaredForFormContext,
  CaredForFormProvider,
} from '@/contexts/CaredForForm/CaredForFormContext'
import CaredForForm from './CaredForForm'

const AddEditCaredFor = ({ route, navigation }: any) => {
  const id = route.params?.id

  return (
    <CaredForFormProvider id={id}>
      <CaredForFormContext.Consumer>
        {(value) => {
          return value && <CaredForForm navigation={navigation} />
        }}
      </CaredForFormContext.Consumer>
    </CaredForFormProvider>
  )
}

export default AddEditCaredFor
