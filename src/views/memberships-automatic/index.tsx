import FranchiseAutomatic from './FranchiseAutomatic'
import { AUTOMATIC_FRANCHISE } from './data/FranchisesAutomaticData'

export default function PayMembershipAutomatic() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-3xl">Franquicias Automáticas</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
          {AUTOMATIC_FRANCHISE.map((franchise) => (
            <FranchiseAutomatic
              key={franchise.name}
              name={franchise.name}
              binary_points={franchise.binary_points}
              range_points={franchise.range_points}
              cap={franchise.cap}
              image={franchise.image}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
