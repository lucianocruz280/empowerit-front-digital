import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import dayjs from 'dayjs';
import { FC } from "react";

type Props = {
    details: {
        id: string
        amount: number
        created_at: Date
        user_name: string
    }[]
}

const ViewDetails: FC<Props> = ({ details }) => {
    const formattedDate = (timestamp:any) => {
        if (timestamp && timestamp.toDate) {
            const date = timestamp.toDate(); 
            return dayjs(date).format('DD/MM/YYYY'); 
        }
        return "Invalid date"; 
    };
    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Creación</TableCell>
                            <TableCell>Id</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Usuario</TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {details.map((detail: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{formattedDate(detail?.created_at)}</TableCell>
                                <TableCell>{detail?.id}</TableCell>
                                <TableCell>{detail?.amount}</TableCell>
                                <TableCell>{detail?.user_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ViewDetails