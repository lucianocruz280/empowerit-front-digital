import LastLives from './Charts/LastLives'
import store from '@/store'
import React from 'react'
import TopGananciasMes from './Charts/TopGananciasMes'
import TopFirmasMes from './Charts/TopFirmasMes'

interface CardProps {
  children: React.ReactNode
}

const Card: React.FC<CardProps> = ({ children }: CardProps) => {
  return (
    <div className="bg-slate-100 rounded-[10px] p-4 card-border cursor-pointer user-select-none hover:shadow-lg flex flex-col space-y-2 overflow-hidden h-[450px] min-h-[450px]">
      {children}
    </div>
  )
}

const HalfCard: React.FC<CardProps> = ({ children }: CardProps) => {
  return (
    <div className="bg-slate-100 rounded-[10px] p-4 card-border cursor-pointer user-select-none hover:shadow-lg flex flex-col space-y-2 overflow-hidden h-[225px] min-h-[225px]">
      {children}
    </div>
  )
}

const Charts = () => {
  const user = store.getState().auth.user
  const hasProMembership = user.membership_status === 'paid' || user.is_admin 

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
      {hasProMembership && (
        <Card>
          <LastLives />
        </Card>
      )}
      <div>
      {/* <HalfCard>
        <TopFirmasMes />
      </HalfCard>
      <HalfCard>
        <TopGananciasMes />
      </HalfCard> */}
      </div>
    </div>
  )
}

export default Charts
