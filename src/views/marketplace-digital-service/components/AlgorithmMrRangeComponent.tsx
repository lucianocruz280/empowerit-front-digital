import { Button, Dialog } from "@/components/ui";
import { db } from "@/configs/firebaseConfig";
import { useAppSelector } from "@/store";
import { Firestore, addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AlgorithmMrRangeComponent() {

    const user = useAppSelector((state) => state.auth.user)

    const [openModal, setOpenModal] = useState(false)
    const [hasAccess, setHasAccess] = useState(false)
    const [leftDaysString, setLeftDaysString] = useState<string>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const getLeftDays = (expires_at: any) => {
        if (expires_at && expires_at.seconds > new Date().getTime() / 1000) {
            const leftDays = Math.floor((expires_at.seconds - (new Date().getTime() / 1000)) / 60 / 60 / 24)
            setHasAccess(true)
            setLeftDaysString(leftDays + ' días restantes')
            return
        }
        setHasAccess(false)
    }

    useEffect(() => {
        if (user && user.algorithm_mr_range_access_expires_at) {
            getLeftDays(user.algorithm_mr_range_access_expires_at);
        } else {
            setHasAccess(false);
        }
    }, [user]);

    const buyProcess = async () => {
        setLoading(true)
        try {
            createHistoryCreditsDoc(150)
            addPendingLicense()
        } catch (error) {
            console.log('Error en la compra de Mr.Range')
        } finally {
            setLoading(false)
            navigate('/home')
        }
    }

    const addPendingLicense = async () => {
        const ref = collection(db, `users/${user.uid}/pending-algorithm-licenses`);
        await addDoc(ref, {
            created_at: new Date()
        });
    }

    const createHistoryCreditsDoc = async (total: number) => {
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(now.getDate() + 30);

        const usersRef = doc(db, `users/${user.uid}`);
        const res = await getDoc(usersRef)
        await updateDoc(usersRef, {
            credits: Number(user.credits) - 150,
            algorithm_mr_range_access_expires_at: expiresAt,
        })

        await addDoc(collection(db, `users/${user.uid}/credits-history/`), {
            id_user: user.uid,
            email: user.email,
            name: user.name,
            total,
            created_at: new Date(),
            concept: "Compra en Marketplace Servicios Digital",
            academy_access_expires_at: expiresAt
        });
    }

    return (
        <div
            className="bg-gray-100 flex flex-col items-center rounded-lg px-4 pb-4"
        >
            <img
                src="/img/digital-marketplace/algorithm-mr-range.jpeg"
                className="max-w-[250px] max-h-[250px] flex-1 object-contain"
            />
            <div className="flex justify-start w-full text-lg">
                <span className="font-bold">Acceso a Algoritmo Mr. Rango</span>
            </div>
            <div className="flex justify-start w-full space-x-2">
                <span className="font-medium">
                    150 créditos
                </span>
                <span className="line-through text-gray-400">
                    180 créditos
                </span>
            </div>
            <div className="flex justify-start w-full space-x-2">
                {!hasAccess ? (
                    <>
                        <span className="font-medium">
                            Duración:
                        </span>
                        <span className=" text-gray-400">
                            30 días
                        </span>
                    </>
                ) : (
                    <>
                        <span className="font-bold text-green-400">
                            Activa:
                        </span>
                        <span className=" text-gray-400">
                            {leftDaysString} 
                        </span>
                    </>
                )}
            </div>
            <div className="flex justify-start items-center w-full pb-4 space-x-2">
                <div className="flex justify-start text-yellow-500 space-x-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                </div>
                <div>
                    <span className="font-medium">En existencia</span>
                </div>
            </div>
            {/* Verificar que exista user y efectivamente tenga creditos */}
            {user && typeof user.credits === 'number' ? (
                user.credits < 150 ? (
                    <Button
                        disabled={true}
                        className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed"
                    >
                        Creditos insuficientes
                    </Button>

                ) : (
                    <Button
                        onClick={() => setOpenModal(true)}
                        className={'px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 '}
                    >
                        Comprar Licencia
                    </Button>
                )
            ) : (
                <Button
                    disabled={true}
                    className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed"
                >
                    Creditos insuficientes
                </Button>

            )}
            <Dialog isOpen={openModal} onClose={() => setOpenModal(false)} >
                <div>
                    <span className="pt-4">Desea comprar este producto por 150 créditos?</span>
                    <div className="flex justify-between w-full mt-4">
                        <Button onClick={() => buyProcess()} loading={loading}>
                            ACEPTAR
                        </Button>
                        <Button onClick={() => setOpenModal(true)}>
                            CERRAR
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>

    )
}
