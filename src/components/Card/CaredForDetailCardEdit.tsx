import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import TextComponent from './TextComponent'
import moment from 'moment'
import Colors from '@/utils/colors'
import AddButton from '../Button/AddButton'
import TitleWithIcon from '../Label/TitleWithIcon'
import SeverityCell from '../CaredFor/SeverityCell'
import WeekDaysCell from '../CaredFor/WeekDaysCell'
import { Content } from '@/contexts/CaredForForm/CaredForFormContext'

interface props {
  items?: any[]
  title?: string
  hasSeparator?: boolean
  unFormatedTime?: boolean
  hasAddButton?: boolean
  type?: string
  contentId: Content
  openModal: (props: { content: Content; itemIndex?: number }) => void
  icon: React.ElementType
}

const CaredForDetailCardEdit = ({
  items,
  title,
  hasSeparator,
  unFormatedTime,
  hasAddButton = true,
  type,
  contentId,
  openModal,
  icon: Icon,
}: props) => {
  const openEditModal = (itemIndex: number) =>
    openModal({ content: contentId, itemIndex })

  const openAddModal = () => openModal({ content: contentId })
  const formatTime = (timeWithZone) =>
    moment.utc(timeWithZone).local().format('hh:mm A')

  const cartType = (item: any, index: number) => {
    switch (type) {
      case 'threeColumn':
        return (
          <View style={styles.contentWrapper} key={index}>
            {title === 'Allergies' ? (
              <View style={styles.contentRow}>
                <SeverityCell value={item.severity} />
                <TextComponent title="Type" value={item.name} />
                <TouchableOpacity onPress={() => openEditModal(index)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.contentRow}>
                <TextComponent title="Period" value={item.period} />
                <TextComponent title="Time" value={formatTime(item.time)} />
                <TouchableOpacity onPress={() => openEditModal(index)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )
      case 'fourColumn':
        return (
          <View style={styles.contentWrapper} key={index}>
            <View style={styles.contentRow}>
              <TextComponent title="Period" value={item.period} />
              <TextComponent title="Start" value={formatTime(item.startTime)} />
              <TextComponent title="End" value={formatTime(item.endTime)} />
              <TouchableOpacity onPress={() => openEditModal(index)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      default:
        return (
          <View style={styles.contentWrapper} key={index}>
            {hasSeparator && index > 0 && <View style={styles.separator} />}
            <View style={styles.contentRow}>
              <TextComponent title="Name" value={item.name} />
              <TouchableOpacity onPress={() => openEditModal(index)}>
                <Text style={[styles.editText, styles.less16]}>Edit</Text>
              </TouchableOpacity>
            </View>
            {item.location && (
              <TextComponent title="Location" value={item.location} />
            )}
            {title === 'Medications' ? (
              <View style={styles.contentRow}>
                <TextComponent title="Dose" value={item.dose} />
                <TextComponent title="Time" value={formatTime(item.time)} />
                <WeekDaysCell title="Frequency" days={item.days} />
              </View>
            ) : (
              <View style={styles.contentRow}>
                <TextComponent
                  title="Start Time"
                  value={formatTime(item.startTime)}
                />
                <TextComponent
                  title="End Time"
                  value={formatTime(item.endTime)}
                />
                <WeekDaysCell title="Day" days={item.days} />
              </View>
            )}
          </View>
        )
    }
  }
  return (
    <>
      <TitleWithIcon title={title} icon={<Icon />} />
      {items?.length > 0 && (
        <View style={styles.container}>
          {items?.map((item: any, index: number) => {
            if (item._destroy) {
              return null
            }
            return cartType(item, index)
          })}
        </View>
      )}
      {hasAddButton ? (
        <AddButton text={`Add ${title}`} onPressAdd={() => openAddModal()} />
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    backgroundColor: 'white',
    padding: 16,
  },
  contentWrapper: {
    flexDirection: 'column',
    gap: 8,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGrey,
  },
  editText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    textDecorationLine: 'underline',
    color: Colors.DarkBlue,
  },
  less16: {
    marginTop: -16,
  },
})

export default CaredForDetailCardEdit
