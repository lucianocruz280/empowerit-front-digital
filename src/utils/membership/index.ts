import dayjs, { Dayjs } from 'dayjs'

export type MembershipStatus = {
  pro: boolean
  ibo: boolean
  supreme: boolean
  starter: boolean
  crypto_elite: boolean
  toprice_xpert: boolean
}

export const getRestDaysMembership = (
  subscription_expires_at?: Dayjs | null
): number => {
  if (subscription_expires_at) {
    return dayjs(subscription_expires_at).diff(dayjs(), 'days')
  }
  return 0
}

export const getRestHoursMembership = (
  restDays: number,
  subscription_expires_at?: Dayjs
): number => {
  if (subscription_expires_at && restDays >= 0) {
    return dayjs(subscription_expires_at).diff(dayjs(), 'hours') - restDays * 24
  }
  return 0
}

export const MEMBERSHIP_COLORS = {
  supreme: '#f59701',
  pro: '#021d6d',
  'alive-pack': '#00b000',
  'freedom-pack': '#c00005',
  'business-pack': '#6822a3',
  'vip-pack': '#959595',
  'elite-pack': '#bd9c3a',
}
