import { getInscriptions } from '@/services/Inscriptions'
import { useAppSelector } from '@/store'
import {
  useCallback,
  createContext,
  ReactNode,
  FC,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react'

type Context = {
  datatable: any[]
  setDatatable: Dispatch<SetStateAction<any[]>>
  fetchData: () => Promise<void>
}

const OrderContext = createContext<Context>({
  datatable: [],
  setDatatable: () => {
    //
  },
  fetchData: () => Promise.resolve(),
})

type Props = {
  children: ReactNode
}

const OrderContextProvider: FC<Props> = (props) => {
  const [datatable, setDatatable] = useState<any[]>([])

  const user = useAppSelector((state) => state.auth.user)

  const fetchData = useCallback(async () => {
    const response = await getInscriptions(user.uid!)
    if (response.data) {
      setDatatable(response.data.data)
    }
  }, [user.uid])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <OrderContext.Provider
      value={{
        datatable,
        setDatatable,
        fetchData,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  return useContext(OrderContext)
}

export default OrderContextProvider
