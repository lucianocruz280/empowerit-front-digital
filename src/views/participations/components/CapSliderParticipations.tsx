import { useAppSelector } from "@/store"
import { Participation } from "..";

type CapSliderParticipationsProps = {
     participation: Participation;
     index: number
};


export default function CapSliderParticipations({ participation, index }: CapSliderParticipationsProps) {

     const { next_pay, participation_cap_current, participation_cap_limit, participation_name, starts_at } = participation

     const user = useAppSelector((state) => state.auth.user)

     const currentCap = participation_cap_current;
     const capLimit = participation_cap_limit;

     const percentage = (currentCap / capLimit) * 100;

     const capBackgroundColor = percentage >= 80 ? 'bg-red-500' : 'bg-indigo-400';

     return (
          <div className='card p-4  card-border bg-slate-100 rounded-[10px] flex flex-col w-full'>
               <span className='mx-auto font-bold text-xl uppercase'>Participación # {index + 1}</span>
               <div className='w-full bg-white h-[30px] rounded-full my-4 mx-auto'>
                    <div style={{ minWidth: '80px', width: `${percentage}%` }} className={`rounded-full h-[30px] flex text-center justify-center text-white ${capBackgroundColor}`}>
                         <span className='font-bold pt-1'>{currentCap}</span>
                    </div>
                    <div className="justify-between flex font-bold mt-1">
                         <span className="text-left">0</span>
                         <span className="text-right">CAP {participation_cap_limit}</span>
                    </div>
               </div>
          </div>

     )
     {/* <p>participation_name: <span>{participation_name}</span></p>
<p>Proximo pago: <span>{next_pay.toDate().toLocaleDateString()}</span></p>
<p>participation_cap_current: <span>${participation_cap_current}</span></p>
<p>participation_cap_limit: <span>${participation_cap_limit}</span></p>
<p>starts_at: <span>{starts_at.toDate().toLocaleDateString()}</span></p> */}
}
