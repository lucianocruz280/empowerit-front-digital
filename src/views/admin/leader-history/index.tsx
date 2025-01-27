
import useHistory from "@/hooks/useHistory"
import { Dialog, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useState } from "react"
import ViewDetails from "./components/ViewDetails"
import { PiX } from "react-icons/pi"


const AdminLeaders = () => {
    const { data } = useHistory()
    const [modal, setModal] = useState(false)
    const [details, setDetails] = useState<any[]>([])
    console.log("el historial es", data)
    return (
        <div>
            <span className="text-xl font-bold">Rendimiento de los líderes</span>
            <Dialog open={modal} onClose={() => setModal(false)} className="!h-[700px] overflow-y-scroll">
                <IconButton
                    aria-label="close"
                    onClick={() => setModal(false)}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <PiX />
                </IconButton>
                <ViewDetails details={details} />
            </Dialog>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Total Facturación</TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {data.map((user: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{user?.name}</TableCell>
                                <TableCell>{user?.email}</TableCell>
                                <TableCell>{user?.totalAmount?.toFixed(2)}</TableCell>
                                <TableCell><div className="cursor-pointer bg-blue-500 flex items-center justify-center text-white font-black text-center rounded-md p-4" onClick={() => {
                                    setDetails(user?.acumulado)
                                    setModal(true)
                                }}>Ver detalle</div></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default AdminLeaders