import { Button } from "@/components/ui"
import { Coins, Method, PackCredits, createPaymentLinkForCredits } from "@/views/memberships/methods"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/store"
import ShowQRForCredits from "@/views/memberships/components/ShowQRForCredits"


export default function RechargeCreditsCard() {

  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  const [selectedCredits, setSelectedCredits] = useState<PackCredits>('100-credits');

  const _createPaymentLink = async (
    type: PackCredits,
    currency: Coins,
    method: Method,
    email: string
  ) => {
    try {
      if (loading) return
      setLoading(true)
      await createPaymentLinkForCredits(user.uid!, type, currency, method, user.email!)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  const PACK_CREDITS: { [key in PackCredits]: number } = {
    '30-credits': 15,
    '50-credits': 25,
    '100-credits': 50,
    '500-credits': 250,
    '1000-credits': 500,
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCredits(event.target.value as PackCredits);
  };


  return (
    <div className='flex flex-col max-w-28 rounded-md w-full ring-1 ring-gray-200 p-4 justify-center mt-2 space-y-1'>
      <img src='/img/credits.jpeg' className="mx-auto h-[300px] w-[300px] rounded-lg mb-3" />

      <div className='flex space-x-2'>
        <span className="max-w-xs truncate">Puntos de Binario:  </span>
        <span className="font-bold">{PACK_CREDITS[selectedCredits]} puntos</span>
      </div>
      <select className='p-1 w-full rounded-lg border' value={selectedCredits} onChange={handleSelectChange}>
        <option value="30-credits">30 créditos</option>
        <option value="50-credits">50 créditos</option>
        <option value="100-credits">100 créditos</option>
        <option value="500-credits">500 créditos</option>
        <option value="1000-credits">1000 créditos</option>
      </select>
      <ShowQRForCredits
        type={selectedCredits}
        loading={loading}
        createPaymentLink={_createPaymentLink}
      />

    </div>
  )
}
