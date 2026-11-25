import { useEffect, useRef, useState } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

const Timer = ({ onPress = () => {} }) => {
  const initialTotalSeconds = 330
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (totalSeconds > 0) {
        setTotalSeconds(totalSeconds - 1)
      }
    }, 1000)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [totalSeconds])

  const handleResend = async () => {
    await onPress()
    clearTimer()
  }

  const clearTimer = () => {
    clearInterval(intervalRef.current)
    setTotalSeconds(initialTotalSeconds) // Reset the timer
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return (
    <>
      {totalSeconds > 0 ? (
        <Text style={styles.expirationWarning}>
          Code expires in {Boolean(minutes) && `${minutes} min`}
          {Boolean(minutes) && Boolean(seconds) && ' and '}
          {Boolean(seconds) && `${seconds} sec`}
        </Text>
      ) : (
        <TouchableOpacity onPress={handleResend}>
          <Text
            style={[
              styles.expirationWarning,
              { textDecorationLine: 'underline' },
            ]}
          >
            Didn't get a code? Click here to resend.
          </Text>
        </TouchableOpacity>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  expirationWarning: {
    textAlign: 'center',
    color: '#282728',
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
  },
})

export default Timer
