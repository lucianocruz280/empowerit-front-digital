import { useState, useEffect } from 'react'
import {
  
  Ranks,
  ranks_object,
  ranksOrder,
} from '../views/rank/ranks_object'
import { useAppSelector } from '@/store'

const useRank = () => {
  const user: any = useAppSelector((state) => state.auth.user)
  const [rank, setRank] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [currentRank, setCurrentRank] = useState<Ranks>('none' as Ranks)

  useEffect(() => {
    if (user.uid && !loading) {
      const getRank = async (id: string) => {
        setLoading(true)
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/ranks/getRank/${id}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          if (!response.ok) {
            throw new Error('Network response was not ok')
          }

          const data = await response.json()

          const nextRankObj =
            ranksOrder[
              ranksOrder.findIndex((rank_key) => rank_key == data.rank) + 1
            ]
          const rank_img = null
          const next_rank_img =  null
          const updatedRank = {
            ...data,
            next_rank: nextRankObj ? ranks_object[nextRankObj].key : null,
            rank: data.rank,
            display: ranks_object[data.rank as Ranks].display,
            rank_img,
            next_rank_img,
          }
          setRank(updatedRank)
          setLoading(false)
        } catch (error) {
          setLoading(false)

          return { status: 'error', error }
        }
      }

      getRank(user.uid)
    }
  }, [user.uid])

  const updateRank = (newRank: string) => {
    setCurrentRank(newRank as Ranks)
  }

  return { currentRank, updateRank, rank, loading }
}

export default useRank
