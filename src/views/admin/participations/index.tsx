import { Button, Table, Notification, toast } from '@/components/ui'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import { db } from '@/configs/firebaseConfig'
import {
  getAllParticipations,
  getAvailableParticipations,
} from '@/services/Participations'
import { Participation } from '@/views/participations'
import {
  collectionGroup,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

export default function ParticipationsHistory() {
  const [participations, setParticipations] = useState<Participation[] | null>(
    null
  )
  const [valuePayroll, setValuePayroll] = useState(0)
  const [availableParticipations, setAvailableParticipations] = useState<
    Participation[] | null
  >(null)
  const [walletsChecked, setWalletsChecked] = useState(false)

  useEffect(() => {
    getParticipations()
    getAllAvailableParticipations()
  }, [])

  useEffect(() => {
    if (participations && !walletsChecked) {
      hasLTCWallet(participations)
    }
  }, [participations, walletsChecked])

  const hasLTCWallet = async (participations: Participation[]) => {
    const updatedParticipations = await Promise.all(
      participations.map(async (part) => {
        const q = query(
          collectionGroup(db, 'users'),
          where('email', '==', part.email),
          limit(1)
        )
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0]
          const wallet = firstDoc.data().wallet_litecoin
          return {
            ...part,
            has_wallet: !!wallet,
            ...(wallet && { wallet }),
          }
        } else {
          return {
            ...part,
            has_wallet: false,
          }
        }
      })
    )

    setParticipations(updatedParticipations)
    setAvailableParticipations(updatedParticipations)
    setWalletsChecked(true)
  }

  const getParticipations = async () => {
    const participations = await getAllParticipations()
    if (participations) {
      setParticipations(participations as Participation[])
    }
  }

  const getAllAvailableParticipations = async () => {
    const availableParticipations = await getAvailableParticipations()
    if (availableParticipations) {
      setAvailableParticipations(availableParticipations as Participation[])
    }
  }

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValuePayroll(Number(e.target.value))
  }

  const payrollParticipations = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/pay-participations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availableParticipations,
          amount: valuePayroll,
        }),
      })
      toast.push(
        <Notification type="success">Se ha realizado el pago!!</Notification>
      )
      window.location.reload()
    } catch (error) {
      console.log('error en fetch de repartir en participaciones', error)
    }
  }

  return (
    <div>
      {/* <div className="flex justify-between my-4">
        <input
          type="number"
          className="border rounded-md"
          value={valuePayroll}
          onChange={onChangeValue}
        />
        <Button
          variant="solid"
          disabled={
            availableParticipations?.length == 0 || valuePayroll == 0
              ? true
              : false
          }
          onClick={payrollParticipations}
        >
          Repartir ${valuePayroll}
        </Button>
      </div> */}
      <Table>
        <THead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Correo</Th>
            <Th>Fecha Adquisición</Th>
            <Th>Participación</Th>
            <Th>Ganancia Pendiente</Th>
            <Th>Ganancias</Th>
            <Th>Ganancia Límite</Th>
            <Th>Proximo pago</Th>
            <Th>Wallet (LTC)</Th>
          </Tr>
        </THead>
        <TBody>
          {walletsChecked &&
            participations &&
            participations.map((row, index) => (
              <Tr
                key={index}
                className={`${
                  row.next_pay.toDate() > new Date() ? 'bg-gray-200' : ''
                }`}
              >
                <Td>{row.userName}</Td>
                <Td>{row.email}</Td>
                <Td>{row.starts_at.toDate().toLocaleDateString()}</Td>
                <Td>{row.participation_name}</Td>
                <Td>{row.pending_amount}</Td>
                <Td>{row.participation_cap_current}</Td>
                <Td>{row.participation_cap_limit}</Td>
                <Td>{row.next_pay.toDate().toLocaleDateString()}</Td>
                <Td>
                  {row.has_wallet ? (
                    <FaCheck className="text-green-400" />
                  ) : (
                    <FaTimes className="text-red-400" />
                  )}
                </Td>
              </Tr>
            ))}
        </TBody>
      </Table>
    </div>
  )
}
