import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native'
import { BarChart, CurveType, LineChart } from 'react-native-gifted-charts'
import moment from 'moment'
import { vw } from '@/utils/viewport'

interface HoursOverviewChartProps {
  data?: {
    value: number
    label: string
  }[]
  dataDate?: any[]
  title?: string
  label?: string
  onPress?: () => void
  onPressDateRange?: () => void
  onPressThisWeek?: () => void
  onPressAllTime?: () => void
  hasButtons?: boolean
  startDate?: string
  endDate?: string
  periodType?: 'thisWeek' | 'dateRange' | 'allTime'
  children?: React.ReactNode
  showChart?: boolean
}

const smallScreen = Dimensions.get('window').width <= 375

const HoursOverviewChart = ({
  data = [],
  dataDate = [],
  title = 'Hours overview',
  label,
  onPress,
  onPressDateRange,
  onPressThisWeek,
  onPressAllTime,
  hasButtons,
  startDate,
  endDate,
  periodType,
  showChart = false,
  children,
}: HoursOverviewChartProps) => {
  const onClickThisWeek = () => {
    onPressThisWeek?.()
  }
  const onClickDateRange = () => {
    onPressDateRange?.()
  }
  const onClickAllTime = () => {
    onPressAllTime?.()
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.labelText}>{label}</Text>}
      <View style={styles.inlineRow}>
        <Text style={styles.chartTitle} maxFontSizeMultiplier={1}>
          {title}
        </Text>
        {onPress && (
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.link}>My Timesheet</Text>
          </TouchableOpacity>
        )}
      </View>
      {hasButtons && (
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={
              periodType === 'allTime' ? styles.buttonOn : styles.buttonOff
            }
            onPress={onClickAllTime}
          >
            <Text
              style={
                periodType === 'allTime'
                  ? styles.buttonTextOn
                  : styles.buttonTextOff
              }
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              periodType === 'thisWeek' ? styles.buttonOn : styles.buttonOff
            }
            onPress={onClickThisWeek}
          >
            <Text
              style={
                periodType === 'thisWeek'
                  ? styles.buttonTextOn
                  : styles.buttonTextOff
              }
            >
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              periodType === 'dateRange' ? styles.buttonOn : styles.buttonOff
            }
            onPress={onClickDateRange}
          >
            <Text
              style={
                periodType === 'dateRange'
                  ? styles.buttonTextOn
                  : styles.buttonTextOff
              }
            >
              Date Range
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {showChart && (
        <>
          {periodType === 'thisWeek' ? (
            <View style={styles.chartContainer}>
              <BarChart
                data={data}
                height={144}
                width={vw * 68}
                frontColor={'#FFE0A0f0'}
                barBorderRadius={4}
                barWidth={vw * 6}
                spacing={vw * 4}
                // showFractionalValues
                // showValuesAsTopLabel
                // topLabelTextStyle={{
                //   fontSize: 8,
                //   color: '#a16c00ff',
                //   marginBottom: 2,
                // }}
                renderTooltip={(item: { value: number; label: string }) => (
                  <View style={styles.tooltipContainer}>
                    <Text style={styles.tooltipTitle}>{item.value}</Text>
                    <Text style={styles.tooltipSubTitle}>
                      {moment(item.label, 'ddd').format('dddd')}
                    </Text>
                  </View>
                )}
                activeOpacity={0.6}
                noOfSections={2}
                initialSpacing={0}
                yAxisThickness={0}
                xAxisThickness={0}
                dashGap={0}
                labelsExtraHeight={40}
                yAxisLabelContainerStyle={styles.yAxisLabelStyle}
                yAxisTextStyle={styles.yAxisTextStyle}
                xAxisLabelTextStyle={styles.xAxisLabelStyle}
              />
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <Text style={styles.datesText}>
                {startDate} - {endDate}
              </Text>
              <LineChart
                areaChart
                curved
                curveType={CurveType.QUADRATIC}
                data={dataDate}
                width={vw * 70}
                height={144}
                adjustToWidth
                startFillColor="#F76085"
                startOpacity={0.8}
                endFillColor="#ffffff"
                endOpacity={0.3}
                color="#F76085"
                thickness={3}
                hideDataPoints
                noOfSections={2}
                maxValue={24}
                initialSpacing={0}
                yAxisThickness={0}
                xAxisThickness={0}
                dashGap={0}
                labelsExtraHeight={40}
                yAxisLabelContainerStyle={styles.yAxisLabelStyle}
                yAxisTextStyle={styles.yAxisTextStyle}
                xAxisLabelTextStyle={styles.xAxisLabelStyle2}
                pointerConfig={{
                  autoAdjustPointerLabelPosition: true,
                  showPointerStrip: false,
                  activatePointersOnLongPress: true,
                  pointerComponent: () => {
                    return <View style={styles.pointer} />
                  },
                  pointerLabelComponent: (items: any) => {
                    return (
                      <View style={styles.pointerLabelStyle}>
                        <Text style={styles.pointerLabelHour}>
                          {parseInt(items[0].value) + ' hours'}
                        </Text>
                        <Text style={styles.pointerLabelDate}>
                          {moment(items[0].date).format('MMMM DD, YYYY')}
                        </Text>
                      </View>
                    )
                  },
                }}
              />
            </View>
          )}
        </>
      )}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEBEC',
    width: '100%',
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  chartTitle: {
    fontFamily: 'Outfit-SemiBold',
    color: '#375064',
    fontSize: 18,
  },
  labelText: {
    fontFamily: 'Outfit-SemiBold',
    color: '#375064',
    fontSize: 16,
    marginBottom: 18,
  },
  link: {
    fontFamily: 'Outfit-Regular',
    color: '#4440d6',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  chartContainer: {
    marginTop: -5,
  },
  yAxisLabelStyle: {
    justifyContent: 'flex-start',
    paddingLeft: 5,
  },
  yAxisTextStyle: {
    color: '#6D767C',
    fontFamily: 'Outfit-Regular',
    fontSize: 10,
  },
  xAxisLabelStyle: {
    color: '#375064',
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    fontSize: 12,
  },
  xAxisLabelStyle2: {
    color: '#375064',
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 8,
    marginTop: 18,
  },
  buttonOn: {
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#4440D6',
    backgroundColor: '#DED2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextOn: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4440D6',
  },
  buttonOff: {
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#BBC3C9',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextOff: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#6D767C',
  },
  pointer: {
    width: 12,
    height: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F76085',
    backgroundColor: 'white',
  },
  pointerLabelStyle: {
    minHeight: 44,
    minWidth: 110,
    marginTop: -42,
    marginLeft: 15,
    paddingVertical: 5,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    backgroundColor: '#4440D6',
  },
  pointerLabelHour: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  pointerLabelDate: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: 'white',
  },
  datesText: {
    marginTop: 18,
    marginBottom: -18,
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: '#6D767C',
  },
  tooltipContainer: {
    top: -42,
  },
  tooltipTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 9,
    color: '#4540d6ed',
  },
  tooltipSubTitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 8,
    color: '#4540d6ed',
  },
})

export default HoursOverviewChart
