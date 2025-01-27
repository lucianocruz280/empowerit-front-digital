import { apiSignIn, apiSignUp, getUser } from '@/services/AuthService'
import {
  setUser,
  signInSuccess,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { useNavigate } from 'react-router-dom'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import { useState } from 'react'
import dayjs from 'dayjs'
import { Notification, toast } from '@/components/ui'

type Status = 'success' | 'failed'

function useAuth() {
  const [userLoged, setUserLoged] = useState<any>({})
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { token, signedIn } = useAppSelector((state) => state.auth.session)

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status
        message: string
      }
    | undefined
  > => {
    try {
      // if(values.email != "saulmxempowerit@gmail.com" && values.password != "Saulmx123987xd") return
      console.log("values", values)
      const resp = await apiSignIn(values)

      if (resp.status === 'success' && resp.data) {
        const uid = resp.data.user.uid
        if (uid) {
          dispatch(signInSuccess(uid))
        }
        if (resp.data.user && uid) {
          const user = await getUser(uid)
          if (user) {
            setUserLoged({
              uid,
              email: resp.data.user.email,
              avatar: user.avatar,
              name: user.name || '',
              authority: user.is_admin ? ['ADMIN', 'USER'] : ['USER'],
              sponsor: user.sponsor,
              customToken: resp.data.customToken,
              subscription_expires_at: user.subscription_expires_at
                ? dayjs(user.subscription_expires_at.seconds * 100).toDate()
                : null,
            })
            dispatch(
              setUser({
                ...user,
                uid,
                email: resp.data.user.email,
                customToken: resp.data.customToken,
              })
            )
          }
          return {
            status: 'success',
            message: '',
          }
        }
      } else {
        return {
          status: 'failed',
          message: 'Usuario o contraseña incorrecto',
        }
      }
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const signUp = async (values: SignUpCredential) => {
    try {
      const response = await apiSignUp(values)

      if (response.status === 'success' && response.data) {
        const { user } = response.data
        if (user) {
          const uid = user.uid || undefined
          const email = user.email || undefined
          setUserLoged({
            uid,
            email,
            avatar: '',
            name: values.name,
            authority: ['USER'],
            customToken: response.data.customToken,
          })
          dispatch(
            setUser({
              uid,
              email,
              avatar: '',
              name: values.name,
              authority: ['USER'],
              left_binary_user_id: null,
              left_points: 0,
              right_binary_user_id: null,
              right_points: 0,
              customToken: response.data.customToken,
            })
          )

          toast.push(
            <Notification title={'Registrado correctamente'} type="success" />,
            {
              placement: 'top-center',
            }
          )

          navigate('/home')
        }
        return {
          status: 'success',
          message: '',
        }
      } else if (response.status === 'error' && response.message)
        return {
          status: 'failed',
          message: response.message,
        }
    } catch (errors: any) {
      console.error(errors)
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const handleSignOut = () => {
    dispatch(signOutSuccess())
    setUserLoged({
      avatar: '',
      name: '',
      last_name: '',
      email: '',
      authority: [],
    })
    dispatch(
      setUser({
        avatar: '',
        name: '',
        last_name: '',
        email: '',
        authority: [],
        left_binary_user_id: null,
        left_points: 0,
        right_binary_user_id: null,
        right_points: 0,
      })
    )
    navigate(appConfig.unAuthenticatedEntryPath)
  }

  const signOut = async () => {
    handleSignOut()
  }

  return {
    authenticated: token && signedIn,
    signIn,
    signUp,
    signOut,
    userLoged,
  }
}

export default useAuth
