import { db } from "@/configs/firebaseConfig"
import { collection, collectionGroup, getDocs, orderBy, query, where } from "firebase/firestore"

export const getParticipations = async (id_user: string) => {
     let participations = []
     const queryRef = query(
          collection(db, `users/${id_user}/participations`),
          orderBy("next_pay", "asc")
     );
     const querySnapshot = await getDocs(queryRef);

     for (const doc of querySnapshot.docs) {
          participations.push(doc.data())
     }
     return participations
}

export const getAllParticipations = async () => {
     const q = query(collectionGroup(db, 'participations'), orderBy("next_pay", "asc"));
     const participations = await getDocs(q);
     if (!participations.empty) {
          const data = participations.docs.map((doc) => ({
               id_doc: doc.id,
               ...doc.data()
          }))
          return data
     } else {
          return null
     }
}

export const getAvailableParticipations = async () => {
     const q = query(collectionGroup(db, 'participations'), where("next_pay","<=",new Date()), orderBy("next_pay", "asc"));
     const participations = await getDocs(q);
     if (!participations.empty) {
          const data = participations.docs.map((doc) => ({
               id_doc: doc.id,
               ...doc.data()
          }))
          return data
     } else {
          return null
     }
}