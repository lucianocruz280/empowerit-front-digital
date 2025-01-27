import { useEffect, useState } from 'react'
import {
  Button,
  Notification,
  toast,
  FormContainer,
  Input,
} from '@/components/ui'
import FormDescription from './FormDescription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import { setUser, useAppDispatch, useAppSelector } from '@/store'
import { updateUser } from '@/services/AuthService'
import {
  createVerificationCode,
  deleteVerificationCode,
  generateOTP,
  verifyCode,
} from '@/services/VerificationCodeService'
import { sendEmail } from '@/services/emailSender'
import { HiShieldCheck } from 'react-icons/hi'
import { validateWallet } from '@/services/ValidateWallet'
import { doc, getDoc, updateDoc } from '@firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import WalletsHistoryTable from './WalletsHistoryTable'

const Billing = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [data, setData] = useState({
    wallet_bitcoin: user.wallet_bitcoin,
    wallet_litecoin: user.wallet_litecoin,
  })
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [isValidCode, setIsValidCode] = useState(false)
  const [isValidWallet, setIsValidWallet] = useState(false)
  const [isValidWalletLitecoin, setIsValidWalletLitecoin] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setData({
      wallet_bitcoin: user.wallet_bitcoin,
      wallet_litecoin: user.wallet_litecoin,
    })
  }, [user])

  const onFormSubmit = (values: any, setSubmitting: any) => {
    toast.push(
      <Notification title={'Billing information updated'} type="success" />,
      {
        placement: 'top-center',
      }
    )
    setSubmitting(false)
  }

  const onRequestVerificationCode = (userId: unknown, userEmail: string) => {
    setIsUnlocking(true)
    const otp = generateOTP()
    createVerificationCode(userId, otp)
      .then((status) => {
        if (status) {
          sendEmail(userEmail, otp).then((response) => {
            setIsAuthenticating(true)
            setIsUnlocking(false)
            toast.push(
              <Notification
                title={'Se envió un código de verificación a tu correo'}
                type="success"
              />,
              {
                placement: 'top-center',
              }
            )
          })
        }
      })
      .catch((err) => {
        setIsUnlocking(false)
        console.log(err)
      })
  }

  const onVerifyCode = (userId: unknown, code: string) => {
    verifyCode(userId, code)
      .then((isValid) => {
        toast.push(
          <Notification
            title={isValid ? 'Código valido' : 'Código invalido'}
            type={isValid ? 'success' : 'danger'}
          />,
          {
            placement: 'top-center',
          }
        )
        if (isValid) {
          setIsAuthenticating(false)
          setIsValidCode(true)
          deleteVerificationCode(userId)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onVerifyWallet = (
    wallet: string,
    blockchain: 'bitcoin' | 'xrp' | 'litecoin',
    tag?: string
  ) => {
    if (wallet.length != 0) {
      validateWallet(wallet, blockchain)
        .then(async (res) => {
          if (blockchain == 'bitcoin') setIsValidWallet(res.isValid || false)
          if (blockchain == 'litecoin')
            setIsValidWalletLitecoin(res.isValid || false)

          if (res.isValid) {
            if (blockchain == 'bitcoin') {
              const sendData = {
                wallet_bitcoin: wallet,
              }
              updateUser(user.uid!, sendData)
            }

            if (blockchain == 'xrp') {
              const sendData = {
                wallet_ripple: wallet,
                wallet_ripple_tag: tag,
              }
              updateUser(user.uid!, sendData)
            }

            if (blockchain == 'litecoin') {
              const sendData = {
                wallet_litecoin: wallet,
              }
              updateUser(user.uid!, sendData)
              await registerWallet(wallet,'litecoin')
            }

            if (blockchain == 'xrp') {
              const sendData = {
                wallet_litecoin: wallet,
              }
              updateUser(user.uid!, sendData)
            }
          }

          toast.push(
            <Notification
              title={res.isValid ? 'Wallet Valida' : 'Wallet Invalida'}
              type={res.isValid ? 'success' : 'danger'}
            />,
            {
              placement: 'top-center',
            }
          )
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const deleteWallet = async () => {
    try {
      if (user && user.uid) {
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          wallet_litecoin: ''
        });
      }
      await registerWallet('',"litecoin")
    } catch (error) {
      console.log('Error a la hora de borrar la wallet', error)
    } finally {
      toast.push(
        <Notification title={'Wallet eliminada correctamente'} type="success" />,
        {
          placement: 'top-center',
        }
      )
      navigate('/home')
    }
  }

  const registerWallet = async (wallet: string, type: string) => {
    if (!user || !user.uid) return
    await addDoc(collection(db, "users", user.uid, "wallets-history"), {
      prev_wallet: user.wallet_litecoin,
      new_wallet: wallet,
      type,
      created_at: new Date(),
      email: user.email,
      user_id: user.uid
    });
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={data}
        onSubmit={async (values: any, { setSubmitting }) => {
          if (!isValidCode || isAuthenticating || !isValidWallet) {
            return false
          }
          setSubmitting(true)
          try {
            const sendData = {
              wallet_bitcoin: values.wallet_bitcoin,
              wallet_ripple: values.wallet_ripple,
              wallet_litecoin: values.wallet_litecoin,
            }
            await updateUser(user.uid!, sendData)
            dispatch(setUser({ ...user, ...sendData }))
            setTimeout(() => {
              onFormSubmit(values, setSubmitting)
            }, 1000)
          } catch (e) {
            console.error(e)
            toast.push(
              <Notification title={'Ha ocurrio un error'} type="danger" />,
              {
                placement: 'top-center',
              }
            )
          }
        }}
      >
        {({ values, touched, errors, isSubmitting, resetForm }) => {
          const validatorProps = { touched, errors }
          return (
            <Form>
              <FormContainer>
                <FormDescription title="Wallets" desc="" />
                <FormRow
                  name="wallet_bitcoin"
                  label="Dirección Wallet Bitcoin"
                  {...validatorProps}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="wallet_bitcoin"
                    placeholder="Wallet Address"
                    component={Input}
                    readOnly={!isValidCode || isValidWallet}
                    disabled={!isValidCode || isValidWallet}
                  />
                  <Button
                    className="mt-2 ltr:mr-2 rtl:ml-2"
                    type="button"
                    variant="default"
                    color="primary"
                    onClick={() =>
                      onVerifyWallet(values.wallet_bitcoin, 'bitcoin')
                    }
                    hidden={!isValidCode}
                  >
                    Verificar
                  </Button>
                </FormRow>
                <FormRow
                  name="wallet_litecoin"
                  label="Dirección Wallet Litecoin"
                  {...validatorProps}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="wallet_litecoin"
                    placeholder="Wallet Address"
                    component={Input}
                    readOnly={!isValidCode || isValidWalletLitecoin}
                    disabled={!isValidCode || isValidWalletLitecoin}
                  />
                  <Button
                    className="mt-2 ltr:mr-2 rtl:ml-2"
                    type="button"
                    variant="default"
                    color="primary"
                    onClick={() =>
                      onVerifyWallet(values.wallet_litecoin, 'litecoin')
                    }
                    hidden={!isValidCode}
                  >
                    Verificar
                  </Button>
                  <Button
                    className="mt-2 ltr:mr-2 rtl:ml-2 "
                    type="button"
                    variant="default"
                    color="primary"
                    onClick={() => deleteWallet()}
                    disabled={user.wallet_litecoin == '' ? true : false}
                  >
                    Quitar wallet
                  </Button>
                </FormRow>
                {isAuthenticating && (
                  <FormRow name="code" label="Código" {...validatorProps}>
                    <Field
                      type="text"
                      autoComplete="off"
                      name="code"
                      placeholder="Código de verificación"
                      component={Input}
                      prefix={<HiShieldCheck className="text-xl" />}
                      onChange={(e: any) => {
                        setAuthCode(e.currentTarget.value)
                      }}
                    />
                    <Button
                      className="mt-2 ltr:mr-2 rtl:ml-2 "
                      type="button"
                      variant="default"
                      color="primary"
                      onClick={() => onVerifyCode(user.uid, authCode)}
                    >
                      Verificar
                    </Button>
                  </FormRow>
                )}
                <div className="mt-4 ltr:text-right">
                  <Button
                    className="ltr:mr-2 rtl:ml-2"
                    type="button"
                    onClick={() => resetForm}
                  >
                    Cancelar
                  </Button>
                  {/*<Button
                  variant="solid"
                  loading={isSubmitting}
                  type="submit"
                  hidden={isAuthenticating || !isValidCode || !isValidWallet}
                  >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                  </Button>*/}
                  <Button
                    className="mt-2 ltr:mr-2 rtl:ml-2"
                    type="button"
                    variant="solid"
                    hidden={isAuthenticating || isValidCode}
                    disabled={isAuthenticating || isValidCode}
                    loading={isUnlocking}
                    onClick={() =>
                      onRequestVerificationCode(user.uid, user.email || '')
                    }
                  >
                    Desbloquear
                  </Button>
                </div>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
      <WalletsHistoryTable/>
    </>
  )
}

export default Billing
