import { createContext, useState } from 'react'

export const CaredForContext = createContext(null)

export const CaredForProvider = ({ children }) => {
  const [triggerRefresh, setTriggerRefresh] = useState()
  return (
    <CaredForContext.Provider value={{ triggerRefresh, setTriggerRefresh }}>
      {children}
    </CaredForContext.Provider>
  )
}
