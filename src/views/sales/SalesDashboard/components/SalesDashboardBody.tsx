import { useEffect, useState } from 'react'

import Loading from '@/components/shared/Loading'
import Rank from './components/Rank'
import Summary from './components/Summary'
import Links from './components/Links'
import Charts from './components/Charts'
import { Dialog, Notification, toast } from '@/components/ui'
import WelcomeForm from '@/views/account/components/WelcomeForm'

import { UserState, useAppSelector } from '@/store'
import { db } from '@/configs/firebaseConfig'
import { doc, onSnapshot } from 'firebase/firestore'
import { getRestDaysMembership } from '@/utils/membership'
import dayjs from 'dayjs'
import CapSlider from './CapSlider'

const modalName = 'modal-2'

const SalesDashboardBody = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [data, setData] = useState<any>({})
  /* const [secondModal, setSecondModal] = useState<boolean>(false) */

  const userLogged = useAppSelector((state) => state.auth.user)

  const validateUserData = (userData: any) => {
    const requiredFields = [
      'name',
      'email',
      'country',
      'state',
      'city',
      'num_ext',
      'birthdate',
      'whatsapp',
      'street',
      'zip',
    ]

    return requiredFields.every((field) => Boolean(userData[field]))
  }

  const [openWelcomeModal, setOpenWelcomeModal] = useState(
    !validateUserData(userLogged) || false
  )
  useEffect(() => {
    const isModal = window.localStorage.getItem(modalName)

    if (userLogged && userLogged.uid) {
      setOpenWelcomeModal(!validateUserData(userLogged))

      if (!userLogged.is_admin)
        if (!isModal && !openWelcomeModal) setIsOpenModal(true)
    }
  }, [userLogged.uid])

  useEffect(() => {
    if (user.uid) {
      const unsub1 = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
        setData(snap.data())
        verifyMembershipExpiration()
      })
      return () => {
        unsub1()
      }
    }
  }, [user.uid])

  useEffect(() => {
    if (userLogged && userLogged.uid) {
      setOpenWelcomeModal(!validateUserData(userLogged))

      if (
        ![
          'JpdntP2OQzNSBi3IylyMfSEqqSD2',
          '7iRezG7E6vRq7OQywQN3WawSa872',
        ].includes(userLogged.uid)
      )
        if (!openWelcomeModal) setIsOpenModal(true)
    }
  }, [userLogged.uid])

  const closeModal = () => {
    window.localStorage.setItem(modalName, '1')
    setIsOpenModal(false)
    setOpenWelcomeModal(false)
    /* setSecondModal(true) */
  }

  const checkSubscription = (user: UserState) => {
    const isActive = user?.membership_status === 'paid'
    const restDays = getRestDaysMembership(dayjs(user?.membership_expires_at))
    return { isActive, restDays }
  }

  const createNotification = (title: string, type: any, duration: number) => {
    toast.push(
      <Notification closable title={title} type={type} duration={duration} />
    )
  }

  const checkProSubscription = () => {
    if (
      checkSubscription(user).isActive &&
      checkSubscription(user).restDays <= 5
    ) {
      const title = `Su membresía de tipo Pro está por vencer. ${
        checkSubscription(user).restDays
      } días restantes`
      const type = checkSubscription(user).restDays > 3 ? 'warning' : 'danger'
      createNotification(title, type, 600000)
    }
  }

  const verifyMembershipExpiration = () => {
    checkProSubscription()
  }

  return (
    <Loading /* loading={loading} */>
      <Dialog isOpen={isOpenModal} onClose={closeModal}>
        <div className="py-5">
          <img src="/img/retiro-de-liderazgo-mexico-colombia.jpg" />
        </div>
      </Dialog>
      {/* <Dialog isOpen={secondModal} onClose={() => setSecondModal(false)} >
        <div className='py-5'>
          <img src="/img/pack-founder--vertical.png" />
        </div>
      </Dialog> */}
      <div
        className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border bg-slate-100 rounded-[10px]"
        role="presentation"
      >
        <img
          src="/img/dashboard/banner-1-empowerit-top.jpg"
          className="w-full"
        />
      </div>
      <Rank />
      {user &&
      user.membership_cap_limit &&
      typeof user.membership_cap_current === 'number' &&
      typeof user.membership_cap_limit === 'number' ? (
        <CapSlider />
      ) : null}
      <div
        className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border bg-slate-100 rounded-[10px]"
        role="presentation"
      >
        <img
          src="/img/dashboard/banner-horizontal-emp-top-2.jpg"
          className="w-full"
        />
      </div>
      {/* <Charts /> */}
      {/*<Events />*/}
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-x-4 gap-y-4">
        <Summary />
        {user && user.membership != '49-pack' && <Links />}
      </div>

      <Dialog
        isOpen={openWelcomeModal}
        width={1000}
        closable={true}
        onClose={closeModal}
      >
        <WelcomeForm
          data={userLogged}
          setOpenWelcomeModal={setOpenWelcomeModal}
        />
      </Dialog>
    </Loading>
  )
}

export default SalesDashboardBody
