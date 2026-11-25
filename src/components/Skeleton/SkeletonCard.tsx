import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Skeleton } from './Skeleton'

interface SkeletonCardProps {
  height?: number
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = 50 }) => {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.spacing}>
          <Skeleton variant="circle" width={height} height={height} />
        </View>
        <View style={[styles.spacing, { flex: 1 }]}>
          <Skeleton width={'100%'} height={height} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  spacing: {
    margin: 4,
  },
})
