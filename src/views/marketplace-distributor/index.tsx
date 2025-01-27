import { useState } from 'react'
import MarketplaceDistributorList from './list'
import MarketplaceDistributorForm from './form'

export default function MarketplaceDistributor() {
  const [stage, setStage] = useState<'cart' | 'form' | 'checkout'>('cart')
  if (stage === 'form') {
    return (
      <MarketplaceDistributorForm
        onComplete={() => setStage('checkout')}
        onBack={() => setStage('cart')}
      />
    )
  }
  return <MarketplaceDistributorList onComplete={() => setStage('form')} />
}
