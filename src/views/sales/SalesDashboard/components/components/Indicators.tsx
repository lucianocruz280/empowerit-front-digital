
import { Button, Dialog, Spinner } from "@/components/ui"
import { db } from "@/configs/firebaseConfig"
import { useAppSelector } from "@/store"
import useUserModalStore from "@/zustand/userModal"
import dayjs from "dayjs"
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { FaTrophy } from "react-icons/fa"
import { FaNetworkWired, FaPeopleArrows, FaPeopleLine, FaRegMoneyBill1 } from "react-icons/fa6"
import useRank from '../../../../../hooks/useRank';
import DialogBinary from "./DialogBinary"

const Indicators = () => {
    const user = useAppSelector((state) => state.auth.user)
    const { rank, loading } = useRank()
    const [payrollDirect, setPayrollDirect] = useState(0)
    const [payrollBinary, setPayrollBinary] = useState(0)
    const [payrollInvestment, setPayrollInvestment] = useState(0)
    const [modalDetails, setModalDetails] = useState<any[]>([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [payrollDetails, setPayrollDetails] = useState<any[]>([])
    const [lastPayroll, setLastPayroll] = useState<any>(null)
    const [isOpenModalInvestment, setIsOpenModalInvestment] = useState(false)
    const userModal = useUserModalStore((state) => state)
    const [data, setData] = useState<any>({})
    const [binaryPoints, setBinaryPoints] = useState(0)
    const [binarySide, setBinarySide] = useState<'left_points' | 'right_points'>('left_points')
    const [isOpenBianry, setIsOpenBinary] = useState(false)
    const [investmentError, setInvestmentError] = useState("")
    useEffect(() => {
        if (user.uid) {
            const unsub1 = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
                setData(snap.data())
            })
            return () => {
                unsub1()
            }
        }
    }, [user.uid])

    useEffect(() => {
        if (user.uid) {
            getDocs(
                query(
                    collection(db, 'users/' + user.uid + '/payroll'),
                    orderBy('created_at', 'desc'),

                )
            ).then((snap) => {
                if (!snap.empty) {
                    const payrolls = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any))
                    const dataDirect = payrolls.reduce((a, b) => a + b.bond_direct, 0)
                    const dataBinary = payrolls.reduce((a, b) => a + b.bond_binary, 0)
                    const dataInvestment = payrolls.reduce((a, b) => a + b?.bond_investment || 0, 0)
                    setPayrollDirect(dataDirect)
                    setPayrollBinary(dataBinary || 0)
                    setPayrollInvestment(dataInvestment)
                    setLastPayroll(snap.docs[0].data())
                }
            })
        }
    }, [user.uid])

    useEffect(() => {
        const _query = lastPayroll
            ? query(
                collection(db, 'users/' + user.uid + '/profits_details'),
                where('created_at', '>=', lastPayroll.created_at),
                orderBy('created_at', 'asc')
            )
            : query(
                collection(db, 'users/' + user.uid + '/profits_details'),
                orderBy('created_at', 'asc')
            )
        getDocs(_query).then((snap) => {
            setPayrollDetails(() => snap.docs.map((d) => d.data()))
        }).catch((err) => {
            console.error("fallo al obtener la consulta", err)
        })
    }, [lastPayroll])

    const openDetails = (...types: string[]) => {
        setModalDetails(payrollDetails.filter((r) => types.includes(r.type)).map((d) => ({
            ...d,
            total: d.amount / 0.85,
            bond_investment: (d.amount / 0.85) * 0.15
        })))
        setIsOpenModal(true)
    }
    const openDetailsInvestment = (...types: string[]) => {
        const payrollBefore = payrollDetails.filter((r) => types.includes(r.type)).map((d) => ({
            ...d,
            total: d.amount / 0.85,
            bond_investment: (d.amount / 0.85) * 0.15
        }))
        setModalDetails(payrollBefore)
        setIsOpenModalInvestment(true)
    }

    useEffect(() => {
        const getBinaryPoints = async () => {
            if (!user.uid) return
            const userRef = await getDoc(doc(db, 'users', user.uid))
            const smallLeg = user.left_points > user.right_points ? 'right_points' : 'left_points'
            const binary_position = userRef.get(smallLeg)
            const binarypoints = binary_position * (rank?.binary_percent ? rank.binary_percent : 0.07)
            setBinaryPoints(binarypoints)
            setBinarySide(smallLeg)
        }
        getBinaryPoints()
    }, [rank?.binary_percent])

    const requestInvestment = () => {
        if(user.bond_investment < 300) {
            setInvestmentError("Necesitas tener mas de 300 USD para poder solicitar el retiro")
        }
    }

    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DialogBinary
                binary_side={binarySide}
                isOpenModal={isOpenBianry}
                setIsOpenModal={setIsOpenBinary}
            />
            <Dialog
                isOpen={isOpenModalInvestment}
                className="!w-full"
                onClose={() => setIsOpenModalInvestment(false)}
            >
                <div className="p-4">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Concepto</th>
                                <th className="text-left">Usuario</th>
                                <th className="text-right">Total del bono</th>
                                <th className="text-right">15% Bono Investment</th>
                                <th className="text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalDetails.map((r, idx) => (
                                <tr key={idx}>
                                    <td>{r.description}</td>
                                    <td>
                                        <span
                                            className="text-blue-500 underline hover:cursor-pointer"
                                            onClick={() => userModal.openModal(r.id_user)}
                                        >
                                            {r.user_name}
                                        </span>
                                    </td>
                                    <td className="text-right">{r.total} USD</td>
                                    <td className="text-right">{r.bond_investment?.toFixed(2)} USD</td>
                                    <td className="text-right">
                                        {r.created_at.seconds
                                            ? dayjs(r.created_at.seconds * 1000).format(
                                                'DD/MM/YYYY HH:mm:ss'
                                            )
                                            : null}
                                    </td>
                                </tr>
                            ))}
                            {modalDetails.length == 0 && (
                                <tr>
                                    <td colSpan={4} className="text-left">
                                        No hay datos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-end flex-col items-end">
                        <Button disabled={user?.bond_investment == 0} onClick={requestInvestment}>Solicitar Inversión</Button>
                        <span className="text-red-500">{investmentError}</span>
                    </div>
                </div>
            </Dialog>

            <Dialog
                isOpen={isOpenModal}
                className="!w-full"
                onClose={() => setIsOpenModal(false)}
            >
                <div className="p-4">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Concepto</th>
                                <th className="text-left">Usuario</th>
                                <th className="text-right">Bono total</th>
                                <th className="text-right">-15% Investment</th>
                                <th className="text-right">Total USD</th>
                                <th className="text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalDetails.map((r, idx) => (
                                <tr key={idx}>
                                    <td>{r.description}</td>
                                    <td>
                                        <span
                                            className="text-blue-500 underline hover:cursor-pointer"
                                            onClick={() => userModal.openModal(r.id_user)}
                                        >
                                            {r.user_name}
                                        </span>
                                    </td>
                                    <td className="text-right">{r?.total || 0}</td>
                                    <td className="text-right">{r?.bond_investment?.toFixed(2)}</td>
                                    <td className="text-right">{r?.amount?.toFixed(2) || 0}</td>
                                    <td className="text-right">
                                        {r.created_at.seconds
                                            ? dayjs(r.created_at.seconds * 1000).format(
                                                'DD/MM/YYYY HH:mm:ss'
                                            )
                                            : null}
                                    </td>
                                </tr>
                            ))}
                            {modalDetails.length == 0 && (
                                <tr>
                                    <td colSpan={4} className="text-left">
                                        No hay datos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Dialog>
            {/* modales */}



            <div className="flex flex-col gap-4">
                <span className="text-xl">Total Históricos</span>
                <Card >
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaRegMoneyBill1 size={30} className="text-yellow-600" />
                        </div>
                        <span className="text-lg font-medium">Bono Inicio Rápido</span>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">
                            ${' '}
                            <span className="text-3xl">
                                {payrollDirect}
                            </span>{' '}
                            USD
                        </span>
                    </div>
                </Card>
                <Card >
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaNetworkWired size={30} className="text-gray-700" />
                        </div>
                        <span className="text-lg font-medium">Bono Binario</span>
                    </div>
                    <div className="flex justify-between gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">
                            ${' '}
                            <span className="text-3xl">
                                {payrollBinary}
                            </span>{' '}
                            USD
                        </span>
                        <span className="text-3xl font-medium">%{((rank?.binary_percent || 0.07) * 100).toFixed()}</span>
                    </div>
                </Card>
                <Card >
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaPeopleLine size={30} className="text-green-700" />
                        </div>
                        <span className="text-lg font-medium">Bono Investment</span>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">
                            ${' '}
                            <span className="text-3xl">
                                {payrollInvestment}
                            </span>{' '}
                            USD
                        </span>
                    </div>
                </Card>
            </div>
            {/* columna dos de ganancias por cobrar */}
            <div className="flex flex-col gap-4">
                <span className="text-xl">Ganancias por Cobrar</span>
                <Card onClick={() => openDetails('bond_quick_start')}>
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaRegMoneyBill1 size={30} className="text-yellow-600" />
                        </div>
                        <span className="text-lg font-medium">Bono Inicio Rápido</span>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">
                            ${' '}
                            <span className="text-3xl">
                                {user.bond_quick_start?.toFixed(2)}
                            </span>{' '}
                            USD
                        </span>
                    </div>
                </Card>
                <Card onClick={() => setIsOpenBinary(true)}>
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaNetworkWired size={30} className="text-gray-700" />
                        </div>
                        <span className="text-lg font-medium">Bono Binario</span>
                    </div>
                    <div className="flex justify-between gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">
                            ${' '}
                            <span className="text-3xl">
                                {loading ? (
                                    <Spinner className={`select-loading-indicatior`} size={40} />
                                ) : (
                                    binaryPoints?.toFixed(2)
                                )
                                }
                            </span>{' '}
                            USD
                        </span>
                        <span className="text-3xl font-medium">%{((rank?.binary_percent || 0.07) * 100).toFixed()}</span>
                    </div>
                </Card>
                <Card onClick={() => openDetailsInvestment('bond_quick_start')}>
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaPeopleLine size={30} className="text-green-700" />
                        </div>
                        <span className="text-lg font-medium">Bono Investment</span>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">
                            ${' '}
                            <span className="text-3xl">
                                {user?.bond_investment?.toFixed(2)}
                            </span>{' '}
                            USD
                        </span>
                    </div>
                </Card>
            </div>
            {/* columna de miembros */}

            <div className="flex flex-col gap-4">
                <span className="lg:pt-7">{ }</span>
                <Card >
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaPeopleArrows size={30} className="text-yellow-600" />
                        </div>
                        <span className="text-lg font-medium">Miembros organización</span>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">

                            <span className="text-3xl">
                                {data?.count_underline_people || 0}
                            </span>{' '}

                        </span>
                    </div>
                </Card>
                <Card >
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaPeopleArrows size={30} className="text-gray-700" />
                        </div>
                        <span className="text-lg font-medium">Miembros Directos</span>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">

                            <span className="text-3xl">
                                {data?.count_direct_people || 0}
                            </span>{' '}

                        </span>
                    </div>
                </Card>
                <Card >
                    <div className="flex space-x-2 items-center">
                        <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
                            <FaTrophy size={30} className="text-green-700" />
                        </div>
                        <span className="text-lg font-medium">Rango</span>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
                        <span className="font-bold text-right">

                            <span className="text-3xl">
                                {loading ? (
                                    <Spinner className={`select-loading-indicatior`} size={40} />
                                ) : (
                                    <p className="text-[24px] font-bold">{rank?.display || ''}</p>
                                )}
                            </span>{' '}

                        </span>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export const Card = ({ children, onClick }: any) => {
    return (
        <div
            className="bg-slate-100 rounded-[10px] p-4 card-border cursor-pointer user-select-none hover:shadow-lg flex flex-col space-y-2"
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default Indicators