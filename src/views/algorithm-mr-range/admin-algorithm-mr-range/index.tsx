import { Table } from "@/components/ui";
import TBody from "@/components/ui/Table/TBody";
import THead from "@/components/ui/Table/THead";
import Td from "@/components/ui/Table/Td";
import Th from "@/components/ui/Table/Th";
import Tr from "@/components/ui/Table/Tr";
import { db } from '@/configs/firebaseConfig';
import { Timestamp, collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

interface licensesProps {
     algorithmId: string
     email: string;
     expires_at: Timestamp
     id: string
     licenseId: string
     userId: string
}

export default function AlgorithmDataTableHistory() {

     const [licenses, setLicenses] = useState<licensesProps []>([])

     useEffect(() => {
          getLicences()
     },[])

     const getLicences = async () => {
          try {
               const ref = collection(db, 'algorithm-license-history');
               const q = query(ref, orderBy("expires_at", "desc"));
               const querySnapshot = await getDocs(q);
           
               const licenses: any = [];
               querySnapshot.forEach(doc => {
                 licenses.push({
                   id: doc.id,
                   ...doc.data()
                 });
               });
               setLicenses(licenses)
          } catch (error) {
               console.error('Error fetching license history:', error)
          }
     }

     return (
          <>
               <Table>
                    <THead>
                         <Tr>
                              <Th>#</Th>
                              <Th>Correo Empowerit</Th>
                              <Th>ID Licencia</Th>
                              <Th>Cuenta IC Markets</Th>
                              <Th>Expira</Th>
                         </Tr>
                    </THead>
                    <TBody>
                         {licenses && licenses.map((license, index) => {
                              return (
                                   <Tr key={index}>
                                        <Td>{index}</Td>
                                        <Td>{license.email}</Td>
                                        <Td>{license.licenseId}</Td>
                                        <Td>{license.algorithmId}</Td>
                                        <Td>{license.expires_at.toDate().toLocaleDateString()}</Td>
                                   </Tr>
                              );
                         })}
                    </TBody>
               </Table>
          </>
     )
}
