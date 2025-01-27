import { Button, Dialog, Table } from '@/components/ui';
import TBody from '@/components/ui/Table/TBody';
import THead from '@/components/ui/Table/THead';
import Td from '@/components/ui/Table/Td';
import Th from '@/components/ui/Table/Th';
import Tr from '@/components/ui/Table/Tr';
import { db } from '@/configs/firebaseConfig';
import { useAppSelector } from '@/store';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { ChangeEvent, useEffect, useState } from 'react';
import { LicenseHistoryProps } from './AlgorithmTable';
import { useNavigate } from 'react-router-dom';


export default function AlgorithmTable() {

    const user = useAppSelector((state) => state.auth.user);
    const navigate = useNavigate()

    const [licenses, setLicenses] = useState<LicenseHistoryProps[]>();
    const [modal, setModal] = useState(false);
    const [inputValue, setInputValue] = useState<number | ''>('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [pendingLicenses, setPendingLicenses] = useState<number>()



    useEffect(() => {
        getLicenseHistoryById();
        getPendingLicensesSize()
    }, [user]);

    const getPendingLicensesSize = async () => {
        const ref = collection(db, `users/${user.uid}/pending-algorithm-licenses`)
        const snapshot = await getDocs(ref)
        const count = snapshot.size;
        setPendingLicenses(count)
        if(count == 0){
            setModal(false)
            return
        }
        setModal(true)
    }

    const getLicenseHistoryById = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, `users/${user.uid}/algorithm-license-history`));
            const licenseHistory: LicenseHistoryProps[] = [];

            querySnapshot.forEach((doc) => {
                licenseHistory.push({
                    id: doc.id,
                    expires_at: doc.data().expires_at.toDate(),
                    ICMarketAccount: doc.data().algorithmId
                });
            });
            setLicenses(licenseHistory);
        } catch (error) {
            console.error("Error retrieving license history: ", error);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setInputValue(value === '' ? '' : parseFloat(value));
    };

    const getFirstPendingLicense = async () => {
        try {
            const ref = collection(db, `users/${user.uid}/pending-algorithm-licenses`);
            const snapshot = await getDocs(ref);
            if (!snapshot.empty) {
                const firstDoc = snapshot.docs[0];
                const firstDocId = firstDoc.id;

                const docRef = doc(db, `users/${user.uid}/pending-algorithm-licenses/${firstDocId}`);
                await deleteDoc(docRef);
                console.log(`Documento con ID ${firstDocId} eliminado.`);
            } else {
                console.log("No hay documentos en la subcolección.");
                return null;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const createLicenseHistory = async () => {
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(now.getDate() + 30);

        const docRef = await addDoc(collection(db, `users/${user.uid}/algorithm-license-history`), {
            expires_at: expiresAt
        });

        await updateDoc(docRef, {
            licenseId: docRef.id,
            algorithmId: inputValue
        });
        await addDoc(collection(db, `algorithm-license-history`), {
            expires_at: expiresAt,
            licenseId: docRef.id,
            userId: user.uid,
            algorithmId: inputValue,
            email: user.email
        });
    }

    const setAlgorithmId = async () => {
        getFirstPendingLicense()
        createLicenseHistory()
        setConfirmModal(false);
        navigate('/home')
    };

    const updateAlgorithmId = async () => {
        try {
            const userId = user.uid;
            const q = query(
                collection(db, "algorithm-license-history"),
                where("userId", "==", userId)
            );


            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (docu) => {
                console.log(docu.id, " => ", docu.data());
                const docRef = doc(db, `algorithm-license-history/${docu.id}`)
                await updateDoc(docRef, {
                    algorithmId: inputValue
                });
            });
            console.log("Algorithm Id updated successfully");
        } catch (error) {
            console.error("Error updating algorithm Id: ", error);
            throw new Error("Error updating algorithm Id");
        }
    };


    return (
        <div className='flex flex-col justify-center'>
                <>
                    <div className='flex flex-col pb-4 space-x-5'>
                        <div className='flex'>
                            <h3 className="text-xl font-bold mb-2">Administra tus licencias</h3>
                            {(pendingLicenses && pendingLicenses > 0) ? (
                                <>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        placeholder='Ingresa tu cuenta de IC Markets Ejemplo: 51697086'
                                        className='min-w-[400px] mb-2 ml-3'
                                        onChange={handleInputChange} />
                                    <button
                                        className={`border rounded-lg px-3 py-1 mb-2 mx-2 shadow-sm text-center ${!inputValue ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                                        disabled={!inputValue}
                                        onClick={() => setConfirmModal(true)}
                                    >
                                        Registrar
                                    </button>
                                </>

                            ) : null}
                        </div>
                        {licenses && licenses.length > 0 && (
                            <Table>
                                <THead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>Licencia</Th>
                                        <Th>Cuenta IC Markets</Th>
                                        <Th>Expira</Th>
                                    </Tr>
                                </THead>
                                <TBody>
                                    {licenses && licenses.map((license, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{index}</Td>
                                                <Td>{license.id}</Td>
                                                <Td>{license.ICMarketAccount}</Td>
                                                <Td>{license.expires_at.toLocaleDateString()}</Td>
                                            </Tr>
                                        );
                                    })}
                                </TBody>
                            </Table>
                        )}
                       
                        <Dialog isOpen={confirmModal} onClose={() => setConfirmModal(false)}>
                            <div className='flex flex-col items-center text-center'>
                                <span className='justify-center w-[90%] text-xl font-black'>
                                    Es correcta tu cuenta de IC Markets?
                                </span>
                                <span className='justify-center w-[90%] text-lg'>{inputValue}</span>
                                <span className='justify-center w-[90%] text-lg'>
                                    Una vez registrada, no podrá ser modificada
                                </span>
                                <Button className='w-[90%] mt-4' onClick={() => setAlgorithmId()}>
                                    Aceptar
                                </Button>
                            </div>
                        </Dialog>
                    </div>

                </>
            <Dialog isOpen={modal} onClose={() => setModal(false)}>
                <div className='flex flex-col items-center'>

                    <span className='text-left w-full p-3' >
                        Para el correcto registro y funcionamiento de las licencias deberás ingresar una cuenta diferente en el apartado de <span className='font-bold'> Administra tus licencias</span>
                    </span>
                    <span>Cuentas con {pendingLicenses} registros pendientes </span>
                    <Button className='w-[60%] mt-4' onClick={() => setModal(false)}>
                        Aceptar
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}
