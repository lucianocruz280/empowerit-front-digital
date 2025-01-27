import { BsBezier, BsTrophy } from 'react-icons/bs'
import { onSnapshot, doc, query, where, collection } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store'
import { db } from '@/configs/firebaseConfig'
import { FaPeopleArrows } from 'react-icons/fa'
import axios from 'axios'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useNavigate } from 'react-router-dom'
const Rank = () => {
  const [data, setData] = useState<any>(null)
  const [rank, setRank] = useState<any>('Sin rango')
  const [rankMissing, setRankMissing] = useState<any>({})
  const user: any = useAppSelector((state) => state.auth.user)
  const [dialogOpen, setDialogOpen] = useState(false)
  const navigate = useNavigate()

  const onConfirmDialogOpen = () => {
    setDialogOpen(true)
  }

  const onConfirmDialogClose = () => {
    setDialogOpen(false)
  }

  useEffect(() => {
    if (user.uid) {
      const unsub1 = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
        setData(snap.data())
      })
      return () => {
        unsub1()
      }
    }
  }, [user.uid])

  useEffect(() => {
    if (user.uid) {
      setRank(user.rank)
    }
  }, [user.uid])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 w-full">
        <ConfirmDialog
          isOpen={dialogOpen}
          type="info"
          title="Salta al siguiente rango"
          confirmButtonColor="red-600"
          onClose={onConfirmDialogClose}
          hideButtons
        >
          <p>
            Sanguinea:
            {rankMissing.missing_sanguinea >= 0 ? (
              'Completado'
            ) : (
              <>
                {' '}
                {rankMissing.missing_sanguinea}{' '}
                <span>usuarios patrocinados faltantes</span>
              </>
            )}{' '}
          </p>
          <p>
            Derrame:
            {rankMissing.missing_derrame >= 0 ? (
              'Completado'
            ) : (
              <>
                {' '}
                {rankMissing.missing_sanguinea}{' '}
                <span>usuarios patrocinados faltantes</span>
              </>
            )}{' '}
          </p>
          <p>
            USD:{' '}
            {rankMissing.missing_usd >= 0 ? (
              'Completado'
            ) : (
              <>
                ${rankMissing.missing_usd} <span>USD ganados faltantes</span>
              </>
            )}
          </p>
          <p>
            Beca:{' '}
            {rankMissing.missing_scolarship ? 'Beca faltante' : 'Completada'}
          </p>
          <p>Próximo rango: {rankMissing.next_rank}</p>
          <br />
          <p className="text-[10px]">
            Nota: Sólo se muestra el próximo rango del que se encuentera
            actualmente. Es importante tomar en cuenta que al momento del corte
            puede subir más de un rango.
          </p>
        </ConfirmDialog>
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
          onClick={() => navigate('/rank')}
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Rango</p>
              <p className="text-[24px] font-bold">{rank}</p>
            </div>

            <div className="flex flex-col justify-center">
              <BsTrophy />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Ganancias obtenidas</p>
              <p className="text-[24px] font-bold">${data?.profits || 0}</p>
            </div>

            <div className="flex flex-col justify-center">
              <BsTrophy />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Miembros Directos</p>
              <p className="text-[24px] font-bold">
                {data?.count_direct_people || 0}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <FaPeopleArrows />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Miembros organización</p>
              <p className="text-[24px] font-bold">
                {data?.count_underline_people || 0}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <FaPeopleArrows />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 w-full">
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>
                Bono Directo <span className="text-xs">(primer nivel)</span>
              </p>
              <p className="text-[24px] font-bold">
                {data?.bond_direct || 0}{' '}
                <span className="text-[18px] font-medium">usd</span>
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <FaPeopleArrows />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>
                Bono Directo <span className="text-xs">(segundo nivel)</span>
              </p>
              <p className="text-[24px] font-bold">
                {data?.bond_direct_second_level || 0}{' '}
                <span className="text-[18px] font-medium">usd</span>
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <FaPeopleArrows />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>
                Residual <span className="text-xs">(primer nivel)</span>
              </p>
              <p className="text-[24px] font-bold">
                {data?.residual_level_1 || 0}{' '}
                <span className="text-[18px] font-medium">pts</span>
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <BsBezier />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>
                Residual <span className="text-xs">(segundo nivel)</span>
              </p>
              <p className="text-[24px] font-bold">
                {data?.residual_level_2 || 0}{' '}
                <span className="text-[18px] font-medium">pts</span>
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <BsBezier />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 w-full">
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Binario Izq.</p>
              <p className="text-[24px] font-bold">
                {data?.left_points || 0}{' '}
                <span className="text-[18px] font-medium">pts</span>
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <BsBezier />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px]">
            <div className="flex flex-col">
              <p>Binario Der.</p>
              <p className="text-[24px] font-bold">
                {data?.right_points || 0}{' '}
                <span className="text-[18px] font-medium">pts</span>
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <BsBezier />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Rank
