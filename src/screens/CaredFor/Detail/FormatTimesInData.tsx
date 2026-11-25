import moment from 'moment'

export const formatTimesInData = (data) => {
  const newData = { ...data } // Creating a shallow copy to avoid mutating the original data

  // Format activity times
  newData.activities = newData.activities.map((activity) => ({
    ...activity,
    startTime: moment(activity.startTime).format('hh:mm A'),
    endTime: moment(activity.endTime).format('hh:mm A'),
  }))

  // Format feeding times
  newData.feedingTimes = newData.feedingTimes.map((feeding) => ({
    ...feeding,
    time: moment(feeding.time).format('hh:mm A'),
  }))

  // Format medication times
  newData.medications = newData.medications.map((medication) => ({
    ...medication,
    time: moment(medication.time).format('hh:mm A'),
  }))

  // Format nap times
  newData.napTimes = newData.napTimes.map((nap) => ({
    ...nap,
    startTime: moment(nap.startTime).format('hh:mm A'),
    endTime: moment(nap.endTime).format('hh:mm A'),
  }))

  return newData
}
