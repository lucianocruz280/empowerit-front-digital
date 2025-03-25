import { Dialog } from "@/components/ui"
import { db } from "@/configs/firebaseConfig"
import { useAppSelector } from "@/store"
import useUserModalStore from "@/zustand/userModal"
import dayjs from "dayjs"
import { collection, getDocs } from 'firebase/firestore';
import { FC, useEffect, useState } from "react"

type Props = {
    isOpenModal: boolean
    setIsOpenModal: (status: boolean) => void
    binary_side: 'left_points' | 'right_points'
}

const DialogBinary: FC<Props> = ({ isOpenModal, setIsOpenModal, binary_side }) => {
    const userModal = useUserModalStore((state) => state)
    const user = useAppSelector((state) => state.auth.user)
    const [modalDetails, setModalDetails] = useState<any>(null)
    const getSidePoints = () => {
        if (!user.uid) return null
        const binary_collection = binary_side == 'left_points' ? 'left-points' : 'right_points'
        const docRef = collection(db, "users", user.uid, binary_collection)
        const data = getDocs(docRef).then((d) => {
            const binaries = !d.empty ? d.docs.map((b) => ({ id: b.id, ...b.data() })) : null
            setModalDetails(binaries)
        })
    }
    useEffect(() => {
        getSidePoints()
    }, [binary_side])

    console.log("modalD", modalDetails)
    return (
        <Dialog
            isOpen={isOpenModal}
            className="!w-full"
            onClose={() => setIsOpenModal(false)}
        >
            <div className="p-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Puntos</th>
                            <th className="text-left">Correo</th>
                            <th className="text-right">Patrocinador</th>
                            <th className="text-right">Lado</th>
                            <th className="text-right">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modalDetails && modalDetails?.map((r: any, idx: number) => (
                            <tr key={idx}>
                                <td>{r.points}</td>
                                <td>
                                    <span
                                        className=""
                                  
                                    >
                                        {r.user_email}
                                    </span>
                                </td>
                                <td className="text-right">{r.user_sponsor}</td>
                                <td className="text-right">{binary_side == 'left_points' ? 'Izquierdo': 'Derecho'}</td>
                                <td className="text-right">
                                    {r.created_at.seconds
                                        ? dayjs(r.created_at.seconds * 1000).format(
                                            'DD/MM/YYYY HH:mm:ss'
                                        )
                                        : null}
                                </td>
                            </tr>
                        ))}
                        {modalDetails && modalDetails.length == 0 && (
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
    )
}

export default DialogBinary