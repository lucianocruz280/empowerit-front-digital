import { Button, Input, toast, Notification } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ChangeEvent, FormEvent, useState } from 'react'

export default function AddCreditsComponent() {

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    credits: 0
  })
  const [formErrors, setFormErrors] = useState({
    email: '',
    credits: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true)
    e.preventDefault();
    let valid = true
    //Verificar que el correo si sea un correo
    if (!validateEmail(form.email)) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        email: 'Correo electrónico no válido'
      }))
      valid = false
    }
    //Verificar que credits sea mayor a 0 
    if (form.credits <= 0) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        credits: 'Ingrese un numero valido'
      }))
      valid = false
    }
    if (valid) {
      try {
        const res = await getDocs(
          query(collection(db, 'users'), where('email', '==', form.email))
        )
          if (!res.empty) {
            const user_id = res.docs[0].id
            await fetch(
              `${import.meta.env.VITE_API_URL}/subscriptions/addCredits/${user_id}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  credits: Number(form.credits)
                }),
              }
            )
            toast.push(
              <Notification title="Créditos agregados correctamente!!" type="success" />,
              {
                placement: 'top-center',
              }
            )
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
            setLoading(false)
            toast.push(
              <Notification title='Ocurrio un error al agregar los creditos' type='danger'/>
            )
        }finally{
            setLoading(false)
            setForm({
              email: '',
              credits: 0
            })
            setFormErrors({
              email: '',
              credits: ''
            })
        }
    } else {
      toast.push(
        <Notification title='Verifique los datos del formulario' type='danger'/>
      )
    }
    //Hacer el fetch al endpoint de agregar los creditos
  }

  const onChangeForm = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }))

    if (name === 'email') {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        email: validateEmail(value) ? '' : 'Correo electrónico no válido'
      }))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <div>
      <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
        <div className='md:w-1/2 space-y-2'>
          <div>
            <label>Correo Electrónico: </label>
            <Input
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={onChangeForm}
            />
            {formErrors.email && <span className="text-red-500">{formErrors.email}</span>}
          </div>
          <div>
            <label>Créditos a Agregar: </label>
            <Input
            type='number'
              placeholder="0"
              name="credits"
              value={form.credits}
              onChange={onChangeForm}
            />
            {formErrors.credits && <span className="text-red-500">{formErrors.credits}</span>}
          </div>
          <Button loading={loading} disabled={loading}>
            Agregar
          </Button>
        </div>
      </form>
    </div>
  )
}
