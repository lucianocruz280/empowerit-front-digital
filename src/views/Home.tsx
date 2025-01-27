import { Button } from '@/components/ui'
import { useEffect, useState } from 'react'
import useCopyLink from '@/utils/hooks/useCopyLink'
import store from '@/store'
import { useSelector } from 'react-redux'

const Home = () => {
  const [userLogged, setUserLogged] = useState<any>(null)
  const myData = useSelector(store.getState)
  const { copyLink } = useCopyLink()
  const handleClick = (position: string) => {
    copyLink(userLogged.uid, position)
  }
  useEffect(() => {
    const user = store.getState()
    setUserLogged(user.auth.user)
  }, [myData])

  return (
    <div className="block ">
      <div className="">Copiar links para binario</div>
      <div className="inline-flex flex-wrap gap-2">
        <Button variant="twoTone" onClick={() => handleClick('left')}>
          Izquierda
        </Button>
        <Button variant="twoTone" onClick={() => handleClick('right')}>
          Derecha
        </Button>
      </div>
    </div>
  )
}

export default Home
