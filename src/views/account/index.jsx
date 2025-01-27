import { useState, Suspense, lazy } from 'react'
import { Spinner, Tabs } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'

const Profile = lazy(() => import('./components/Profile'))
const Password = lazy(() => import('./components/Password'))
const Billing = lazy(() => import('./components/Billing'))

const { TabNav, TabList } = Tabs

const settingsMenu = {
  profile: { label: 'Perfil', path: 'profile' },
  password: { label: 'Contraseña', path: 'password' },
  billing: { label: 'Wallets', path: 'billing' },
}

const Settings = () => {
  const [currentTab, setCurrentTab] = useState('profile')
  const userLogged = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()

  const onTabChange = (val) => {
    setCurrentTab(val)
    navigate(`/${val}`)
  }

  return (
    <div>
      <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
        <TabList>
          {Object.keys(settingsMenu).map((key) => (
            <TabNav key={key} value={key}>
              {settingsMenu[key].label}
            </TabNav>
          ))}
        </TabList>
      </Tabs>
      <div className="px-4 py-6">
        <Suspense fallback={<Spinner />}>
          {currentTab === 'profile' && <Profile data={userLogged} />}
          {currentTab === 'password' && <Password />}
          {currentTab === 'billing' && <Billing />}
        </Suspense>
      </div>
    </div>
  )
}

export default Settings
