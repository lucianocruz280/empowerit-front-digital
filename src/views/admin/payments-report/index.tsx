
import { FC } from "react"


const PaymentsReport = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-6 gap-y-4">
                <CardPayments
                    value={1250}
                    currency="MXN"
                    description="Franquicias Digitales"
                    classNames="text-green-500"
                />
                <CardPayments
                    value={300}
                    currency="MXN"
                    description="Franquicias Automáticas"
                    classNames="text-green-500"
                />
                <CardPayments
                    value={924}
                    currency="MXN"
                    description="Franquicias de Producto"
                    classNames="text-green-500"
                />
                <CardPayments
                    value={800}
                    currency="MXN"
                    description="Créditos Comprados"
                    classNames="text-green-500"
                />
                <CardPayments
                    value={430}
                    currency="MXN"
                    description="Créditos Gastados"
                    classNames="text-yellow-500"
                />
                <CardPayments
                    value={2500}
                    currency="MXN"
                    description="Pagos Totales"
                    classNames="text-red-500"
                />
                <CardPayments
                    value={2180}
                    currency="MXN"
                    description="Retirados"
                    classNames="text-red-500"
                />
            </div>

        </div>
    )
}

export default PaymentsReport

type PropsCard = {
    value: number
    currency: string
    description: string
    classNames?: string
}

const CardPayments: FC<PropsCard> = ({ value, currency, description, classNames }) => {
    return (
        <div className={`border border-solid rounded-md p-8 w-min `}>
            <span className=" flex gap-1 items-end">
                <span className={`text-xl ${classNames}`}>{value}</span>
                <span>{currency}</span>
            </span>

            <p className="text-sm whitespace-nowrap">
                {description}
            </p>
        </div>
    )
}