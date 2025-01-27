import { Table } from "@/components/ui";
import TBody from "@/components/ui/Table/TBody";
import Td from "@/components/ui/Table/Td";
import Th from "@/components/ui/Table/Th";
import THead from "@/components/ui/Table/THead";
import Tr from "@/components/ui/Table/Tr";
import { Participation } from "..";
import { INVESTMENT_PARTICIPATION } from "..";

type ParticipationsTableProps = {
     participations: Participation[]
}



export default function ParticipationsTable({participations} : ParticipationsTableProps) {
  return (
     <Table>
     <THead>
       <Tr>
         <Th>Participación</Th>
         <Th>Ganancia</Th>
         <Th>Próximo Pago</Th>
       </Tr>
     </THead>
     <TBody>
       {participations.map((row,index) => (
         <Tr key={index}>
           <Td> Participación {INVESTMENT_PARTICIPATION[row.participation_name]}</Td>
           <Td>$ {row.participation_cap_current}</Td>
           <Td><span>{row.next_pay.toDate().toLocaleDateString()}</span></Td>
         </Tr>
       ))}
     </TBody>
   </Table>
  )
}
