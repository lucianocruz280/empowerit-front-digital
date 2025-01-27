import { Periods } from './membership'

export type Franchises =
  | '100-pack'
  | '300-pack'
  | '500-pack'
  | '1000-pack'
  | '2000-pack'

export type PackCredits =
  | '30-credits'
  | '50-credits'
  | '100-credits'
  | '500-credits'
  | '1000-credits'

export type AutomaticFranchises =
  | 'FA500'
  | 'FA1000'
  | 'FA2000'
  | 'FA5000'
  | 'FA10000'
  | 'FA20000'

export type Memberships =
  | 'pro'
  | 'supreme'
  | 'alive-pack'
  | 'freedom-pack'
  | 'business-pack'
  | 'elite-pack'
  | 'vip-pack'
  | 'founder-pack'
  | '49-pack'
  | '100-pack'
  | '300-pack'
  | '500-pack'
  | '1000-pack'
  | '2000-pack'
  | '3000-pack'
  | '3000-participation'
  | 'FP200'
  | 'FP300'
  | 'FP500'
  | 'FD200'
  | 'FD300'
  | 'FD500'

export type Coins = 'MXN' | 'LTC'

export type Method = 'Fiat' | 'Coinpayments'

export type Participations = '3000-participation'

export enum PAYMENT_LINK_TYPE {
  PRO = 'pro',
  SUPREME = 'supreme',
  ALIVE_PACK = 'alive-pack',
  FREEDOM_PACK = 'freedom-pack',
  BUSINESS_PACK = 'business-pack',
  ELITE_PACK = 'elite-pack',
  VIP_PACK = 'vip-pack',
  FOUNDER_PACK = 'founder-pack',
}

export const createPaymentLink = async (
  user_id: string,
  type: Memberships,
  coin: Coins,
  period: Periods,
  method: Method,
  buyer_email: string
) => {
  console.log("el method", method)
  try {
    // Crear dirección de pago
    if (method == 'Fiat') {
      await fetch(
        `${import.meta.env.VITE_API_URL
        }/subscriptions/createPaymentAddress/${type}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user_id,
            type,
            coin,
            period,
          }),
        }
      )
    }

    if (method == 'Coinpayments') {
      await fetch(
        `${import.meta.env.VITE_API_URL
        }/coinpayments/create-transaction/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user_id,
            type,
            buyer_email,
            currency1: 'USDT',
            currency2: 'USDT.TRC20',
            period,
            cmd: 'create_transaction'
          }),
        }
      )
    }
  } catch (err) {
    console.error(err)
  }
}

export const createPaymentLinkForParticipations = async (
  user_id: string,
  type: Participations,
  coin: Coins,
  method: Method,
  buyer_email: string
) => {
  try {
    // Crear dirección de pago
    if (method == 'Fiat') {
      await fetch(
        `${import.meta.env.VITE_API_URL
        }/subscriptions/createPaymentAddressForParticipations/${type}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user_id,
            type,
            coin,
          }),
        }
      )
    }
    if (method == 'Coinpayments') {
      await fetch(
        `${import.meta.env.VITE_API_URL
        }/coinpayments/create-transaction/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user_id,
            type,
            buyer_email,
            currency1: 'USDT',
            currency2: 'USDT.TRC20',
            cmd: 'create_transaction'
          }),
        }
      )
    }
  } catch (err) {
    console.error(err)
  }
}

export const createPaymentLinkForCredits = async (
  user_id: string,
  type: PackCredits,
  coin: Coins,
  method: Method,
  buyer_email: string
) => {
  try {
    // Crear dirección de pago
    if (method == 'Fiat') {
      await fetch(
        `${import.meta.env.VITE_API_URL
        }/subscriptions/createPaymentAddressForCredits/${type}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user_id,
            coin,
          }),
        }
      )
    }
    if (method == 'Coinpayments') {
      await fetch(
        `${import.meta.env.VITE_API_URL
        }/coinpayments/create-transaction/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user_id,
            type,
            buyer_email,
            currency1: 'USDT',
            currency2: 'USDT.TRC20',
            cmd: 'create_transaction'
          }),
        }
      )
    }
  } catch (err) {
    console.error(err)
  }
}

export const createPaymentLinkForFranchiseAutomatic = async (
  user_id: string,
  type: AutomaticFranchises,
  coin: Coins,
  method: Method,
  buyer_email: string
) => {
  try {
    // Crear dirección de pago
    if(method == "Fiat") {
      await fetch(
        `${import.meta.env.VITE_API_URL
        }/subscriptions/createPaymentAddressForAutomaticFranchises/${type}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user_id,
            coin,
          }),
        }
      )
    }
    if (method == 'Coinpayments') {
      await fetch(
        `${import.meta.env.VITE_API_URL
        }/coinpayments/create-transaction/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user_id,
            type,
            buyer_email,
            currency1: 'USDT',
            currency2: 'USDT.TRC20',
            cmd: 'create_transaction'
          }),
        }
      )
    }
  } catch (err) {
    console.error(err)
  }
}
