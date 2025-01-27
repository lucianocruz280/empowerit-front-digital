import { useState } from 'react'
import { Button, toast, Notification } from '@/components/ui'
import axios from 'axios'
import SevenLevelsTable from './components/SevenLevelsTable'
import { doc, increment, updateDoc } from '@firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export type SevenLevelsProps = {
  seven_levels_account: number
  email: string
  amount: number
  seven_level_sponsors: SevenLevelsProps[]
  percentage?: string
  user_id?: string
}
export type EmailNotFoundedProps = {
  email: string
  amount: number
}

export default function AdminSevenLevels() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loadingExcel, setLoadingExcel] = useState<boolean>(false)
  const [data, setData] = useState<SevenLevelsProps[]>()
  const [emailNotFounded, setEmailNotFounded] = useState<
    EmailNotFoundedProps[]
  >([])
  const [isLoadingPayllAllSponsors, setIsLoadingPayAllSponsors] =
    useState<boolean>(false)
  const navigate = useNavigate()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
  }

  const readExcel7Levels = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()

    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)

      try {
        setLoadingExcel(true)
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/seven-levels/readExcel`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        console.log('Response:', response.data)
        //Aqui tengo que setear el valor a una variable
        setData(response.data.data)
        setEmailNotFounded(response.data.emailNotFounded)
      } catch (error) {
        console.error('Error uploading file:', error)
      } finally {
        setLoadingExcel(false)
        setSelectedFile(null)
      }
    } else {
      console.error('No file selected')
    }
  }

  const payAllsponsors = async () => {
    if (!data) return
    try {
      setIsLoadingPayAllSponsors(true)
      for (const docu of data) {
        docu.seven_level_sponsors.forEach(async (docuSponsor, index) => {
          if (
            docuSponsor &&
            docuSponsor.user_id &&
            docu.user_id &&
            docu.email
          ) {
            const level = index + 1
            await addSevenLevelsBond(
              docuSponsor.user_id,
              Number(docuSponsor.amount),
              docu.user_id,
              docu.email,
              level
            )
          }
        })
      }
    } catch (error) {
      console.log('Error en la funcion de payAllsponsors')
    } finally {
      await createSevenLevelsHistory(data)
      setIsLoadingPayAllSponsors(false)
      toast.push(
        <Notification
          title={'El bono de 7 niveles ha sido repartido exitosamente'}
          type="success"
        />,
        {
          placement: 'top-center',
        }
      )
      navigate('/home')
    }
  }

  const addSevenLevelsBond = async (
    id: string,
    amount: number,
    sendingUserId: string,
    sendingUserEmail: string,
    level: number
  ) => {
    const userRef = doc(db, 'users', id)
    try {
      await updateDoc(userRef, {
        bond_seven_levels: increment(amount),
      })
      //Crearemos el historial para saber quien se lo mando
      const sevenLevelsSubCollection = collection(
        userRef,
        'seven-levels-history'
      )
      await addDoc(sevenLevelsSubCollection, {
        user_id: sendingUserId,
        email: sendingUserEmail,
        amount,
        level,
        created_at: new Date(),
      })
    } catch (error) {
      console.log('Error en la funcion de addSevenLevelsBond', error)
    }
  }

  const createSevenLevelsHistory = async (data: SevenLevelsProps[]) => {
    try {
      const sevenLevelsRef = collection(db, 'seven-levels-history')
      await addDoc(sevenLevelsRef, {
        data,
        emailNotFounded,
        created_at: new Date(),
      })
    } catch (error) {
      console.log('Error en la funcion de createSevenLevelsHistory', error)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="font-bold text-3xl">7 niveles</span>
      <div className="flex flex-col space-y-2 justify-between lg:w-2/3">
        <input type="file" name="file" onChange={handleFileChange} />
        <div className="justify-between space-x-2">
          <Button loading={loadingExcel} onClick={readExcel7Levels}>
            Leer Excel
          </Button>
          {!loadingExcel && data && (
            <Button
              variant="solid"
              loading={isLoadingPayllAllSponsors}
              onClick={payAllsponsors}
            >
              Pagar Bono 7 Niveles
            </Button>
          )}
        </div>
      </div>
      {/* Personas con correo bien */}
      {!loadingExcel && data && <SevenLevelsTable data={data} />}
      {/* Correos no encontrados */}
      {emailNotFounded && emailNotFounded.length > 0 && (
        <>
          <span className="text-lg font-bold">Usuarios no encontrados: </span>
          <ul>
            {emailNotFounded.map((email, index) => (
              <li key={index}>{email.email}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
