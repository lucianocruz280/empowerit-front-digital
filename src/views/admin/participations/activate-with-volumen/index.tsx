import { Button, DatePicker, Input, Select, toast, Notification } from "@/components/ui"
import { db } from "@/configs/firebaseConfig"
import { OPTIONS_PARTICIPATIONS } from "@/utils/packs"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useState } from "react"

const PARTICIPATIONS_CAP_LIMIT = {
  '3000-participation': 6000
}

const initialValues = {
  email: '',
  participation_name: '3000-participation',
  starts_at: '',
  participation_cap_current: 0
}

export default function ActivateWithVolumenPartitipacions() {

  const [loading, setLoading] = useState<boolean>(false)

  const [part, setPart] = useState({
    label: 'Participación 3000',
    value: '3000-participation',
    image: '/img/memberships/p300.png',
  })

  const [form, setForm] = useState(initialValues)

  const [errors, setErrors] = useState({
    email: '',
    starts_at: '',
    participation_cap_current: ''
  })

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const onChangeForm = (e) => {
    const { name, value } = e.target
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }))

    if (name === 'email') {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: validateEmail(value) ? '' : 'Correo electrónico no válido'
      }))
    }
  }

  const onChangeDate = (date) => {
    setForm(prevForm => ({
      ...prevForm,
      starts_at: date
    }))
  }

  const onChangeParticipation = (option) => {
    setPart(option)
    setForm(prevForm => ({
      ...prevForm,
      participation_name: option.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let valid = true

    if (!validateEmail(form.email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: 'Correo electrónico no válido'
      }))
      valid = false
    }

    if (form.starts_at === '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        starts_at: 'La fecha de inicio no puede estar vacía'
      }))
      valid = false
    }

    if(form.participation_cap_current < 0 || form.participation_cap_current > PARTICIPATIONS_CAP_LIMIT[form.participation_name] ) {
      setErrors(prevErrors => ({
        ...prevErrors,
        participation_cap_current : 'Ingrese un numero válido'
      }))
      valid = false
    }

    if (valid) {
      setLoading(true)
        try {
        const res = await getDocs(
          query(collection(db, 'users'), where('email', '==', form.email))
        )
          if (!res.empty) {
            const user_id = res.docs[0].id
            await fetch(
              `${import.meta.env.VITE_API_URL}/participations/activateWithVolumen`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  form,
                  user_id
                }),
              }
            )
            toast.push(
              <Notification title="Participación Activada!!" type="success" />,
              {
                placement: 'top-center',
              }
            )
            setForm(initialValues)
          } else {
            toast.push(
              <Notification title="Usuario no existe" type="warning" />,
              {
                placement: 'top-center',
              }
            )
          }
        }catch(err){
            console.error(err)
        }finally{
            setLoading(false)
        }
    } else {
      console.log('Errores en el formulario', errors)
    }
  }

  return (
    <div>
      <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
        <div className="md:w-1/2">
          <label>Correo Electrónico: </label>
          <Input
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={onChangeForm}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>
        <div className="md:w-1/2">
          <label>Participación: </label>
          <Select
            className="w-full"
            options={OPTIONS_PARTICIPATIONS}
            value={part}
            name="participation_name"
            onChange={onChangeParticipation}
          />
        </div>
        <div className="md:w-1/2">
          <label>Fecha de inicio: </label>
          <DatePicker
            selected={form.starts_at}
            onChange={onChangeDate}
          />
          {errors.starts_at && <span className="text-red-500">{errors.starts_at}</span>}
        </div>
        <div className="md:w-1/2">
          <label>Ganancia Actual: </label>
          <Input
            type="number"
            placeholder="123"
            name="participation_cap_current"
            value={form.participation_cap_current}
            onChange={onChangeForm}
          />
        </div>
        {errors.participation_cap_current && <span className="text-red-500">{errors.participation_cap_current}</span>}
        <div>
          <Button loading={loading}>
            Activar
          </Button>
        </div>
      </form>
    </div>
  )
}