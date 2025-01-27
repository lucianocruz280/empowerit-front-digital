import { Button, Input, Notification, toast } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { setUser, useAppDispatch } from '@/store'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { useState } from 'react'

const AdminPayroll = () => {
  const [userEmail, setUserEmail] = useState('')
  const dispatch = useAppDispatch()

  const enter = async () => {
    const res = await getDocs(
      query(collection(db, 'users'), where('email', '==', userEmail))
    )
    if (!res.empty) {
      dispatch(setUser({
        uid: res.docs[0].id,
        ...res.docs[0].data()
      }))
    } else {
      toast.push(<Notification title="Usuario no existe" type="success" />, {
        placement: 'top-center',
      })
    }
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="w-full md:w-1/2 flex flex-col space-y-4 items-end">
        <Input
          placeholder="Email"
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <div>
          <Button onClick={enter}>Entrar</Button>
        </div>
      </div>
    </div>
  )
}

export default AdminPayroll
