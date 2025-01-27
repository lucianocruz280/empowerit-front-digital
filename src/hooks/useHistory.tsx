import { db } from "@/configs/firebaseConfig"
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from "react"

const useHistory = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const getUsers = async () => {
        const userRef = collection(db, 'users')
        const q = query(userRef, where('count_direct_people', '>=', 1), orderBy('count_direct_people', 'desc'), orderBy('created_at', 'asc'), limit(50))
        const data = await getDocs(q)
        if (!data.empty) {
            const users = await Promise.all(
                data.docs.map(async (userDoc) => {
                    const userData = { id: userDoc.id, ...userDoc.data() };
                    const acumuladoRef = collection(db, "users", userDoc.id, "profits_details");
                    const qAcumulado = query(acumuladoRef, where("type", "==", "bond_quick_start"));
                    const acumuladoSnapshots = await getDocs(qAcumulado);


                    const acumulado = acumuladoSnapshots.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    //esta es la suma de los amount, de los weyes que tienen quick start
                    const totalAmount = acumuladoSnapshots.docs.reduce((sum, doc) => {
                        const data = doc.data();
                
                        return sum + (data.amount || 0);
                    }, 0);

                    return { ...userData, acumulado, totalAmount };
                })
            );

            setData(users);
        }
    }

    useEffect(() => {
        getUsers()
    }, [])
    return {
        data, loading
    }
}

export default useHistory