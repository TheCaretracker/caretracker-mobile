import Share, { ShareOptions } from 'react-native-share'
import { Alert } from 'react-native'

export const shareInvite = async (
  invite: {
    code: string
    branchLink: string
    email: string
    fullName: string
    phoneNumber: string
  },
  onShare?
) => {
  try {
    const options: ShareOptions = {
      title: 'Join Caretracker',
      message: `You were invited by your employer to join Caretracker. To sign up, use the code: ${invite.code}. If you already have an account, simply add your employer using the same code. Sign up now: ${invite.branchLink}`,
      email: invite.email,
      recipient: invite.phoneNumber,
    }

    const result = await Share.open(options)
    if (result) {
      console.log('Share completed')
      if (onShare) onShare()
    } else {
      console.log('Share canceled or failed')
      if (onShare) onShare()
    }
  } catch (error: any) {
    console.log(error)
  }
}
