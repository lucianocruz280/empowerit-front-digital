import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'
import { useSelector } from 'react-redux'
import store from '@/store'
import { useEffect, useState } from 'react'

type DropdownList = {
  label: string
  path: string
  icon: JSX.Element
}

const dropdownItemList: DropdownList[] = []

const _UserDropdown = ({ className }: CommonProps) => {
  const myData = useSelector(store.getState)
  const [userLogged, setUserLogged] = useState<any>({})
  const [avatarProps, setAvatarProps] = useState<any>({})
  const { signOut } = useAuth()

  useEffect(() => {
    const user = store.getState()
    setUserLogged(user.auth.user)
  }, [myData])

  useEffect(() => {
    if (userLogged.avatar) {
      setAvatarProps({ src: userLogged.avatar })
    }
  }, [userLogged])

  const UserAvatar = (
    <div className={classNames(className, 'flex items-center gap-2')}>
      <Avatar
        size={32}
        shape="circle"
        icon={<HiOutlineUser />}
        {...avatarProps}
      />
      <div className="hidden md:block">
        <div className="font-bold">{userLogged.name}</div>
      </div>
    </div>
  )

  return (
    <div>
      <Dropdown
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        <Dropdown.Item variant="header">
          <Link className="flex h-full w-full px-2" to={'/profile'}>
            <div className="py-2 px-3 flex items-center gap-2">
              <Avatar
                shape="circle"
                icon={<HiOutlineUser />}
                {...avatarProps}
              />
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {userLogged.name}
                </div>
                <div className="text-xs">{userLogged.email}</div>
              </div>
            </div>
          </Link>

          {/* <div className="px-3 flex flex-col">
            <span className="font-bold">Código de presentador:</span>
            <span>{userLogged.presenter_code}</span>
          </div> */}
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        {dropdownItemList.map((item) => (
          <Dropdown.Item
            key={item.label}
            eventKey={item.label}
            className="mb-1 px-0"
          >
            <Link className="flex h-full w-full px-2" to={item.path}>
              <span className="flex gap-2 items-center w-full">
                <span className="text-xl opacity-50">{item.icon}</span>
                <span>{item.label}</span>
              </span>
            </Link>
          </Dropdown.Item>
        ))}
        {/* <Dropdown.Item variant="divider" /> */}
        <Dropdown.Item eventKey="Sign Out" className="gap-2" onClick={signOut}>
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>Cerrar Sesión</span>
        </Dropdown.Item>
      </Dropdown>
    </div>
  )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
