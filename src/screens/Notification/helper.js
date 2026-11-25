export const timesheetChangesDescription = (notification, inapp) => {
  if (notification.data.requestType === 'delete') {
    return inapp
      ? 'has requested a time record removal'
      : 'has requested removal of the following time record'
  }
  return inapp
    ? 'has requested a new time record'
    : 'has requested a new time record for'
}
