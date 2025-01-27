import { useAppSelector } from '@/store'
import classNames from 'classnames'
import { BsCheck } from 'react-icons/bs'

const Goals = () => {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <>
      <div className="flex flex-col bg-slate-100 p-4 rounded-[10px] h-fit w-full xl:w-[40%] relative">
        <h5>Metas para Beca</h5>
        <p> Por ser nuevo usuario, si firmas a dos personas obtienes beca</p>
        <div className="flex items-center justify-between m-auto space-x-10 mt-7">
          <div className="flex flex-col justify-center items-center">
            <div
              className={classNames(
                'w-[50px] h-[50px] flex items-center justify-center text-[80px] rounded-[10px]',
                user.scholarship?.count_scholarship_people > 0
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-800 text-white'
              )}
            >
              <BsCheck />
            </div>
            <p className="text-center">Consigue tu primer firma</p>
            <h5>Paso 1</h5>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div
              className={classNames(
                'w-[50px] h-[50px] flex items-center justify-center text-[80px] rounded-[10px]',
                user.scholarship?.count_scholarship_people > 1
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-800 text-white'
              )}
            >
              <BsCheck />
            </div>
            <p className="text-center">Consigue tu segunda firma</p>
            <h5>Paso 2</h5>
          </div>
        </div>
      </div>
    </>
  )
}

export default Goals
