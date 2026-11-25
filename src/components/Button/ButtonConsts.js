/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import globalStyles from '@/globalStyles'

export const getButtonStyle = ({ type, styles, buttonStyle }) => {
  if (type === 'primary') {
    return [globalStyles.primaryButton, styles.button, buttonStyle]
  }
  if (type === 'secondary') {
    return [globalStyles.secondaryButton, styles.button, buttonStyle]
  }
  if (type === 'clock out') {
    return [globalStyles.clockOutButton, styles.button, buttonStyle]
  }
  // Default style if 'type' is not provided or invalid
  return [styles.button, buttonStyle]
}

export const getTextStyle = ({ type, styles, textStyle }) => {
  if (type === 'primary') {
    return [globalStyles.primaryButtonText, styles.text, textStyle]
  }
  if (type === 'secondary') {
    return [globalStyles.secondaryButtonText, styles.text, textStyle]
  }
  if (type === 'clock out') {
    return [globalStyles.clockOutButtonText, styles.text, textStyle]
  }
  // Default style if 'type' is not provided or invalid
  return [styles.text, textStyle]
}

// Global Default disabled style
export const getDisabledButtonStyle = ({ styles, buttonStyle }) => [
  globalStyles.disabledButton,
  styles.button,
  buttonStyle,
]

export const getDisabledTextStyle = ({ styles }) => [
  globalStyles.disabledButtonText,
  styles.text,
]
