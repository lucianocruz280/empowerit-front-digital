import { Table } from '@/components/ui'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import { useAppSelector } from '@/store'
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { useEffect, useState } from 'react'

interface PendingShip {
    created_at: Date;
    total: number;
    concept: string;
}

function MarketPlaceHistory() {

    const user = useAppSelector((state) => state.auth.user)
    const [pendingShips, setPendingShips] = useState<PendingShip[]>([]);

    useEffect(() => {
        getPendingShips()
    },[pendingShips])

    const getPendingShips = async () => {
        const q = query(collection(db, `users/${user.uid}/credits-history`),orderBy("created_at","desc"))
        const querySnapshot = await getDocs(q)
        const pendingShipsData : PendingShip [] = []

        querySnapshot.forEach((doc) => {
            pendingShipsData.push({
                created_at: doc.data().created_at.toDate(),
                total: doc.data().total,
                concept: doc.data().concept
            })
        })
        setPendingShips(pendingShipsData)
    }

    const getRightPoints = async (documentId: string, id: string) => {
        const rightPointsRef = collection(db, `users/${id}/right-points`);
        const q = query(rightPointsRef, where("user_id", "==", documentId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
            const docRef = doc(db, `users/${id}/right-points`, docSnapshot.id);
            const currentPoints = docSnapshot.data().points;

            const updatedPoints = currentPoints * 2;

            await updateDoc(docRef, {
                points: updatedPoints
            });
        });
    }

    const getLeftPoints = async (documentId: string, id: string) => {
        const rightPointsRef = collection(db, `users/${id}/left-points`);
        const q = query(rightPointsRef, where("user_id", "==", documentId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
            const docRef = doc(db, `users/${id}/left-points`, docSnapshot.id);
            const currentPoints = docSnapshot.data().points;

            const updatedPoints = currentPoints * 2;

            await updateDoc(docRef, {
                points: updatedPoints
            });
        });
    }

    const getParentBinaryUserId = async (documentId: string, id: string) => {
        const res = await getDoc(doc(db, `users/${id}`))
        if (res.exists()) {
            if (res.data().parent_binary_user_id) {
                await getRightPoints(documentId, res.data().parent_binary_user_id)
                await getLeftPoints(documentId, res.data().parent_binary_user_id)
            }
            await fixBinaryPoints(documentId, res.data().parent_binary_user_id)
        }

    }

    const fixBinaryPoints = async (documentId: string, id: string) => {
        if (documentId) {
            await getParentBinaryUserId(documentId, id)
        }
    }

    const getDocumentIdByEmail = async (email: string) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            await fixBinaryPoints(doc.id, doc.id)
        } else {
            return null;
        }
    }

    return (
        <>
            <span className='font-bold text-2xl my-4'>Historial de Créditos</span>
            <Table>
                <THead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Fecha</Th>
                        <Th>Créditos</Th>
                        <Th>CONCEPTO</Th>
                    </Tr>
                </THead>
                <TBody>
                    {pendingShips && pendingShips.map((pendingShip, index) => (
                        <Tr key={index}>
                        <Td>{index}</Td>
                        <Td>{pendingShip.created_at.toLocaleDateString()}</Td>
                        <Td>{pendingShip.total}</Td>
                        <Td>{pendingShip.concept}</Td>
                    </Tr>
                    ))}
                    
                </TBody>
            </Table>
            {/* <div className='flex space-between'>
                <button
                    onClick={() => getDocumentIdByEmail("gonzalestoro1032+1@gmail.com")}
                    className='bg-black text-white rounded mx-auto p-3'
                >
                    Boton para arreglar binario por correo
                </button>
            </div> */}
        </>
    )
}

export default MarketPlaceHistory