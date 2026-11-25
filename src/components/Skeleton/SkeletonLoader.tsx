import { useFocusEffect } from '@react-navigation/native'
import { useEffect, useState } from 'react'

const SkeletonLoader = ({ renderSkeleton, renderContent, isReady }) => {
  const [timeoutFinished, setTimeOutFinished] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeOutFinished(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const finishedLoading = Boolean(isReady) && timeoutFinished

  return finishedLoading ? renderContent() : renderSkeleton()
}

export default SkeletonLoader
