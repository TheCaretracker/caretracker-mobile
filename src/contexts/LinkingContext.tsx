import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import branch from 'react-native-branch'
import { UserDataContext } from './UserDataContext'
import { linkInvite } from '@/requests/inviteRequests'
import { navigate } from '@/helpers/RootNavigation'
import { acceptInvite } from '@/requests/employmentRequests'

interface LinkContextParams {
  inviteCode: string
  wasInvited: boolean
}

export const LinkingContext = createContext<LinkContextParams>(null)

export const LinkingProvider = ({ children }) => {
  const [inviteCode, setInviteCode] = useState<string>()
  const { userData, isEmployee } = useContext(UserDataContext)

  const handleInvite = async (invite) => {
    if (userData && isEmployee) {
      const { data } = await acceptInvite(invite)
      if (data.success) {
        navigate('MyEmployers')
      }
    } else {
      setInviteCode(invite)
    }
  }

  useEffect(() => {
    branch.subscribe({
      onOpenStart: ({ uri, cachedInitialEvent }) => {
        console.log(
          `subscribe onOpenStart, will open ${uri} cachedInitialEvent is ${cachedInitialEvent}`
        )
      },
      onOpenComplete: ({ error, params, uri }) => {
        if (error) {
          console.log(
            `subscribe onOpenComplete, Error from opening uri: ${uri} error: ${error}`
          )
        } else if (params) {
          console.log(params)
          if (!params['+clicked_branch_link']) {
            if (params['+non_branch_link']) {
              console.log(`non_branch_link: ${uri}`)
              // Route based on non-Branch links
            }
          } else {
            // Handle params
            const invite = params.invite.toString()
            handleInvite(invite)
          }
        }
      },
    })
  }, [userData])

  const wasInvited = Boolean(inviteCode)
  return (
    <LinkingContext.Provider value={{ inviteCode, wasInvited }}>
      {children}
    </LinkingContext.Provider>
  )
}
