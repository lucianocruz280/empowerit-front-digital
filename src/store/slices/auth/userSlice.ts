import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { Coins } from '@/views/memberships/methods'
import dayjs from 'dayjs'
import { Timestamp } from 'firebase/firestore'

export type UserState = {
  credits?: number
  is_admin?: boolean
  academy_access_expires_at?: string | null
  algorithm_mr_range_access_expires_at?: string | null
  mr_sport_money_expires_at?: string | null
  mr_money_power_expires_at?: Timestamp | null
  crypto_xpert_expires_at?: string | null
  pro_funnel_expires_at?: string | null
  insta_ads_expires_at?: string | null
  flow_bot_expires_at?: string | null
  pack_marketing_expires_at?: string | null
  credits_spent_this_month?: number
  uid?: string
  avatar?: string
  name?: string
  birthdate?: string
  country?: string
  state?: string
  city?: string
  num_ext: string
  num_int: string
  reference: string
  whatsapp?: number
  telegram?: number
  instagram?: string
  last_name?: string
  email?: string
  authority?: string[]
  sponsor?: string
  sponsor_id?: string
  left?: string
  right?: string
  wallet_bitcoin?: string
  wallet_litecoin?: string
  bank_account?: string
  rfc?: string
  left_points: number
  right_points: number
  left_binary_user_id: string | null
  right_binary_user_id: string | null
  rank: string
  max_rank?: string | null
  is_new: boolean
  position: 'left' | 'right'
  user_profile?: string
  algorithmId?: number
  has_bought_mr_sport?: boolean
  has_bought_mr_money_power?: boolean
  has_automatic_franchises?: boolean

  membership: string | null
  membership_status: 'paid' | 'expired' | null
  membership_expires_at: string | null
  membership_cap_current?: number
  membership_cap_limit?: number
  zip?: string
  street?: string
  customToken: string
  colony: string

  bond_presenter: number
  bond_quick_start: number
  presenter_code: string

  payment_link?: {
    //CoinPayments
    /* address: string
    amount: string
    checkout_url: string
    confirms_needed: string
    expires_at: { seconds: number }
    membership: string
    qrcode_url: string
    status: 'pending' | 'confirming' | 'paid'
    status_url: string
    timeout: number
    txn_id: string
    uid: string
    updated_at: { seconds: number } */
    [type: string]: {
      amount: string
      expires_at: { seconds: number }
      qr: string
      qrcode_url: string
      currency: Coins
      status: 'pending' | 'confirming' | 'paid'
      address: string
      redirect_url?: string
      openpay?: {
        
      }
    }
  }
  payment_link_credits?: {
    [type: string]: {
      amount: string
      expires_at: { seconds: number }
      qr: string
      qrcode_url: string;
      currency: Coins
      status: 'pending' | 'confirming'
      address: string
      redirect_url?: string
    }
  }
  payment_link_participations?: {
    [type: string]: {
      amount: string
      expires_at: { seconds: number }
      qr: string
      currency: Coins
      status: 'pending' | 'confirming'
      address: string
      redirect_url?: string
    }
  }
  payment_link_automatic_franchises?: {
    [type: string]: {
      amount: string
      expires_at: { seconds: number }
      qr: string
      qrcode_url: string
      currency: Coins
      status: 'pending' | 'confirming'
      address: string
      redirect_url?: string
    }
  }

  is_pending_complete_personal_info: boolean
  founder_pack?: {
    status: 'paid'
    created_at: Date
    price: number
  }
  has_participations: boolean
}

const initialState: UserState = {
  uid: '',
  avatar: '',
  name: '',
  birthdate: '',
  country: '',
  state: '',
  city: '',
  whatsapp: 0,
  telegram: 0,
  last_name: '',
  email: '',
  authority: [],
  sponsor: '',
  sponsor_id: '',
  left: '',
  right: '',
  left_points: 0,
  right_points: 0,
  left_binary_user_id: null,
  right_binary_user_id: null,
  rank: '',
  is_new: false,
  position: 'left',
  membership: null,
  membership_expires_at: null,
  crypto_xpert_expires_at: null,
  pro_funnel_expires_at: null,
  insta_ads_expires_at: null,
  flow_bot_expires_at: null,
  pack_marketing_expires_at: null,
  academy_access_expires_at: null,
  membership_status: null,
  is_pending_complete_personal_info: true,
  customToken: '',
  bond_presenter: 0,
  bond_quick_start: 0,
  presenter_code: '',
  street: '',
  num_ext: '',
  num_int: '',
  reference: '',
  colony: '',
  membership_cap_current: 0,
  membership_cap_limit: 0,
  algorithm_mr_range_access_expires_at: null,
  mr_sport_money_expires_at: null,
  mr_money_power_expires_at: null,
  algorithmId: 0,
  has_participations: false,
  has_bought_mr_sport: false,
  has_bought_mr_money_power: false,
  has_automatic_franchises: false,
  credits_spent_this_month: 0,
  credits: 0,
}

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState & any>) {
      const payload = action.payload

      if (payload) {
        state.uid = payload.uid
        state.avatar = payload.avatar
        state.credits = payload.credits
        state.email = payload.email
        state.name = payload.name
        state.birthdate = payload.birthdate
        state.country = payload.country
        state.state = payload.state
        state.city = payload.city
        state.whatsapp = payload.whatsapp
        state.telegram = payload.telegram
        state.instagram = payload.instagram
        state.last_name = payload.last_name
        state.max_rank = payload.max_rank
        state.is_admin = payload.is_admin
        state.presenter_code = payload.presenter_code
        state.street = payload.street
        state.num_ext = payload.num_ext
        state.num_int = payload.num_int
        state.colony = payload.colony
        state.reference = payload.reference
        state.zip = payload.zip
        state.customToken = payload.customToken
        state.academy_access_expires_at = payload.academy_access_expires_at
        state.algorithm_mr_range_access_expires_at =
          payload.algorithm_mr_range_access_expires_at
        state.crypto_xpert_expires_at = payload.crypto_xpert_expires_at
        state.pro_funnel_expires_at = payload.pro_funnel_expires_at
        state.insta_ads_expires_at = payload.insta_ads_expires_at
        state.flow_bot_expires_at = payload.flow_bot_expires_at
        state.pack_marketing_expires_at = payload.pack_marketing_expires_at
        state.has_participations = payload.has_participations
        state.has_automatic_franchises = payload.has_automatic_franchises
        state.mr_sport_money_expires_at = payload.mr_sport_money_expires_at
        state.mr_money_power_expires_at = payload.mr_money_power_expires_at
        state.has_bought_mr_sport = payload.has_bought_mr_sport
        state.credits_spent_this_month = payload.credits_spent_this_month

        const roles = []
        if (payload.uid == '5V5fwO7U48RHll0PLM5lK1g3gGa2') {
          roles.push('MR-RANGE')
        }
        if (payload.uid == 'S6xWMWvmKqUzsTLRSbnrCGwS9gm1') {
          roles.push('MR-MONEY-POWER')
        }
        if (payload.is_admin || payload.uid == '9CXMbcJt2sNWG40zqWwQSxH8iki2') {
          roles.push('ADMIN', 'USER')
        }
        /* if (payload.academy_access_expires_at) {
          if (
            payload.academy_access_expires_at.seconds >
            new Date().getTime() / 1000
          ) {
            roles.push('ACADEMY')
          }
        } */
        if (payload.algorithm_mr_range_access_expires_at) {
          if (
            payload.algorithm_mr_range_access_expires_at.seconds >
            new Date().getTime() / 1000
          ) {
            roles.push('ALGORITHM')
          }
        }
        if (payload.has_participations) {
          roles.push('PARTICIPATIONS')
        }
        if (payload.membership || payload.has_automatic_franchises) {
          roles.push('USER')
        }
        if (payload.has_automatic_franchises) {
          roles.push('AUTOMATIC_FRANCHISES')
        } else {
          roles.push('NONE')
        }

        state.authority = roles
        state.sponsor = payload.sponsor
        state.sponsor_id = payload.sponsor_id
        state.left = payload.left
        state.left_binary_user_id = payload.left_binary_user_id
        state.left_points = payload.left_points
        state.right = payload.right
        state.right_binary_user_id = payload.right_binary_user_id
        state.right_points = payload.right_points
        state.wallet_bitcoin = payload.wallet_bitcoin
        state.bank_account = payload.bank_account
        state.rfc = payload.rfc
        state.wallet_litecoin = payload.wallet_litecoin ?? ''
        state.rank = payload.rank
        state.position = payload.position ?? 'right'
        state.is_new = payload.is_new ?? false
        state.payment_link = payload.payment_link
        state.payment_link_credits = payload.payment_link_credits
        state.payment_link_participations = payload.payment_link_participations
        state.payment_link_automatic_franchises =
          payload.payment_link_automatic_franchises

        state.membership_status = payload.membership_status
        state.membership = payload.membership
        state.membership_cap_current = payload.membership_cap_current
        state.membership_cap_limit = payload.membership_cap_limit

        state.bond_quick_start = payload.bond_quick_start
        state.bond_presenter = payload.bond_presenter
        state.algorithmId = payload.algorithmId

        state.membership_expires_at = payload.membership_expires_at
          ? typeof payload.membership_expires_at == 'string'
            ? payload.membership_expires_at
            : dayjs(payload.membership_expires_at.seconds * 1000).toISOString()
          : null
      }
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
