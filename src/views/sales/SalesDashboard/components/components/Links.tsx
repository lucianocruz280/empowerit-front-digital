import useCopyLink from '@/utils/hooks/useCopyLink'
import { useAppSelector } from '@/store'
import { toast, Notification } from '@/components/ui'
import { useEffect, useState } from 'react'
import classNames from 'classnames'

const Links = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [host, setHost] = useState('')
  const { copyLink } = useCopyLink()

  useEffect(() => {
    setHost(window.location.host)
  }, [])

  const handleClick = (position: string) => {
    copyLink(user.uid!, position)
    toast.push(<Notification title={'Link copiado'} type="success" />, {
      placement: 'top-center',
    })
  }

  return (
    <>
      <div className="flex flex-col bg-slate-100 p-4 rounded-[10px] h-fit w-full">
        <h5>Links de registro</h5>
        <p>Comparte tu link para el registro de tus referidos</p>
        <div className=" border border-slate-300 p-4 mt-2  rounded-[8px] space-y-2">
          {
            <span>
              Links autogenerados por <strong>EMPOWERIT TOP</strong>
            </span>
          }
          {
            <div className="flex items-center justify-between space-x-4">
              <div className=" b bg-white flex-1 p-2 rounded-[8px] w-[0%] border border-slate-300">
                <p className={classNames('truncate')}>
                  {host}/sign-up/{user?.uid}/{user?.left}
                </p>
              </div>
              <button
                className={classNames(
                  'p-2 rounded-[8px] border border-slate-300',
                  'hover:border-slate-600 bg-white'
                )}
                onClick={() => handleClick('left')}
              >
                Copiar link izq.
              </button>
            </div>
          }
          {
            <div className="flex items-center justify-between space-x-4">
              <div className=" b bg-white flex-1 p-2 rounded-[8px] w-[0%] border border-slate-300">
                <p className={classNames('truncate')}>
                  {host}/sign-up/{user?.uid}/{user?.right}
                </p>
              </div>
              <button
                className={classNames(
                  'p-2 rounded-[8px] border border-slate-300',
                  'hover:border-slate-600 bg-white'
                )}
                onClick={() => handleClick('right')}
              >
                Copiar link der.
              </button>
            </div>
          }
        </div>
        {/*<span className="mt-2">
          <strong>Contáctanos</strong> para cualquier duda{' '}
        </span>*/}
      </div>
    </>
  )
}

export default Links
