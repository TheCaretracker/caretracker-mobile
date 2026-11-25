import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
import DefaultModal from '../Modals/DefaultModal'
import TextComponent from './TextComponent'
import moment from 'moment'
import SeverityCell from '../CaredFor/SeverityCell'
import WeekDaysCell from '../CaredFor/WeekDaysCell'

const CaredForDetailCard = ({
  items,
  title,
  icon,
  hasSeperator,
  type,
}: any) => {
  const [allergyModal, setAllergyModal] = useState({ isOpen: false })

  const formatTime = (timeWithZone) =>
    moment.utc(timeWithZone).local().format('hh:mm A')

  const cartType = (item, index) => {
    switch (type) {
      case 'twoColumn':
        return (
          <View style={styles.personalHistory}>
            <View style={styles.personalHistoryInfo}>
              <TextComponent title="Period" value={item.period} />
              <TextComponent title="Time" value={formatTime(item.time)} />
            </View>
          </View>
        )
      case 'threeColumn':
        return (
          <View style={styles.personalHistory}>
            {title === 'Allergies' ? (
              <View style={styles.personalHistoryInfo}>
                <SeverityCell value={item.severity} />
                <TextComponent title="Type" value={item.name} />
                <TouchableOpacity
                  onPress={() => {
                    setAllergyModal({ isOpen: true, item })
                  }}
                >
                  <Text
                    style={[
                      styles.bodyTextSmall,
                      styles.readMoreText,
                      styles.bodyTextRegular,
                      styles.textDarkBlue,
                    ]}
                  >
                    Read more
                  </Text>
                </TouchableOpacity>
                <DefaultModal
                  isVisible={allergyModal.isOpen}
                  setModalVisible={(isOpen) => setAllergyModal({ isOpen })}
                >
                  <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Allergy details</Text>
                    <View style={styles.modalBody}>
                      <View style={styles.typeNSeverity}>
                        <TextComponent
                          title="Type"
                          value={allergyModal.item?.name}
                          style={styles.modalContent}
                        />
                        <SeverityCell
                          style={{ flex: 0 }}
                          value={allergyModal.item?.severity}
                        />
                      </View>
                      <TextComponent
                        title="Reaction"
                        value={allergyModal.item?.reaction}
                        style={styles.modalContent}
                      />
                      <TextComponent
                        title="Treatment"
                        value={allergyModal.item?.treatment}
                        style={styles.modalContent}
                      />
                      <TextComponent
                        title="In case of emergency call"
                        value={allergyModal?.item?.allergyContactsAttributes}
                        style={styles.modalContent}
                      />
                    </View>
                  </View>
                </DefaultModal>
              </View>
            ) : (
              <View style={styles.personalHistoryInfo}>
                <TextComponent title="Period" value={item.period} />
                <TextComponent
                  title="Start"
                  value={formatTime(item.startTime)}
                />
                <TextComponent title="End" value={formatTime(item.endTime)} />
              </View>
            )}
          </View>
        )
      default:
        return (
          <View style={styles.personalHistory}>
            {hasSeperator && index > 0 && <View style={styles.separator} />}
            <TextComponent title="Name" value={item.name} />
            {item.location && (
              <TextComponent title="Location" value={item.location} />
            )}
            {title === 'Medication' ? (
              <View style={styles.personalHistoryInfo}>
                <TextComponent title="Dose" value={item.dose} />
                <TextComponent title="Time" value={formatTime(item.time)} />
                <WeekDaysCell title="Frequency" days={item.days} />
              </View>
            ) : (
              <View style={styles.personalHistoryInfo}>
                <TextComponent
                  title="Start Time"
                  value={formatTime(item.startTime)}
                />
                <TextComponent
                  title="End Time"
                  value={formatTime(item.endTime)}
                />
                <WeekDaysCell days={item.days} />
              </View>
            )}
          </View>
        )
    }
  }
  return (
    <View>
      {items?.length > 0 && (
        <View style={styles.personalDetail}>
          <View style={styles.title}>
            {icon}
            <Text
              style={[
                styles.bodyTextBold,
                styles.bodyTextLarge,
                styles.textDarkBlue,
              ]}
            >
              {title}
            </Text>
          </View>
          <View style={styles.personalInfoWrapper}>
            {items?.map((item: any, index: number) => {
              return cartType(item, index)
            })}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  personalDetail: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    marginLeft: 24,
    marginRight: 24,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bodyTextBold: {
    fontFamily: 'Outfit-SemiBold',
    lineHeight: 22.5,
  },
  bodyTextRegular: {
    fontFamily: 'Outfit-Regular',
  },
  bodyTextLarge: { fontSize: 18 },
  bodyTextMedium: {
    fontSize: 14,
  },
  bodyTextSmall: {
    fontSize: 12,
  },
  textGrey: {
    color: '#6D767C',
  },
  textDarkBlue: {
    color: '#375064',
  },
  personalInfoWrapper: {
    width: '100%',
    flexDirection: 'column',
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEBEC',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  personalHistory: {
    flexDirection: 'column',
    gap: 8,
  },
  personalHistoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAEBEC',
  },
  readMoreText: {
    textDecorationLine: 'underline',
    marginTop: 16,
  },
  modal: {
    width: 300,
    flexDirection: 'column',
    gap: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Outfit-SemiBold',
    color: '#2E2E2E',
    lineHeight: 30,
  },
  modalBody: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 8,
  },
  typeNSeverity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContent: {
    flex: 0,
  },
})

export default CaredForDetailCard
