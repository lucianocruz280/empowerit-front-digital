import AdaptableCard from '@/components/shared/AdaptableCard'
import OrdersTable from './components/OrdersTable'
import OrdersTableTools from './components/OrdersTableTools'
import OrderContextProvider from './components/OrderContext'

const OrderList = () => {
  return (
    <OrderContextProvider>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <div className="lg:flex items-center justify-between mb-4">
          <h3 className="mb-4 lg:mb-0">Inscripciones</h3>
          <OrdersTableTools />
        </div>
        <OrdersTable />
      </AdaptableCard>
    </OrderContextProvider>
  )
}

export default OrderList
