import { useCallback, useEffect, useState } from 'react'
import { getUser } from '@/services/AuthService'

const useCopyLink = () => {
  const [host, setHost] = useState('')

  useEffect(() => {
    setHost(window.location.host)
  }, [])

  const copyLink = useCallback(
    async (uid: string, position: string) => {
      try {
        const userRef = await getUser(uid, position)
        if (userRef) {
          const link = position === 'left' ? userRef.left : userRef.right
          const linkCopied = `${host}/sign-up/${uid}/${link}`
          await navigator.clipboard.writeText(linkCopied)
          return link
        }
      } catch (e) {
        //
      }
    },
    [host]
  )

  return { copyLink }
}

export default useCopyLink
