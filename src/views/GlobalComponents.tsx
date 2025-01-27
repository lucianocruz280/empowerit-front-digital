import { useEffect, useState } from 'react'

import { Dialog } from '@/components/ui'
import useUserModalStore, { Slice as UserModalSlice } from '@/zustand/userModal'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import Avatar from '@/components/ui/Avatar/Avatar'
import { HiOutlineUser } from 'react-icons/hi'

const GlobalComponents = () => {
  const userModal: UserModalSlice = useUserModalStore((state) => state)

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (userModal.user_id) {
      getDoc(doc(db, `users/${userModal.user_id}`))
        .then((r) => {
          setUser({
            id: r.id,
            ...r.data(),
          })
        })
        .catch(console.error)
      }
  }, [userModal.user_id])

  return (
    <>
      <Dialog isOpen={userModal.open} onClose={userModal.closeModal}>
        <div className="flex flex-col gap-1">
          <div className='flex items-center justify-center'>
            <Avatar size={50} shape="square" icon={<HiOutlineUser />} {...user?.avatar} />
          </div>
          <br/>
          <div className="flex items-center">
            <label className="font-semibold mr-2">Nombre:</label>
            <span>{user?.name}</span>
          </div>

          <div className="flex items-center">
            <label className="font-semibold mr-2">Email:</label>
            <span>{user?.email}</span>
          </div>

          <div className="flex items-center">
            <label className="font-semibold mr-2">Upline:</label>
            <span>{user?.sponsor}</span>
          </div>

          <div className="flex items-center">
            <label className="font-semibold mr-2">Upline Email:</label>
            <span>{user?.sponsor_email}</span>
          </div>
          
        </div>
      </Dialog>
    </>
  )
}

export default GlobalComponents
