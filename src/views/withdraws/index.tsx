import { useState } from "react";
import HistoryWithdwas from "./components/HistoryWithdraws"
import { Button, Input, Notification, toast } from "@/components/ui";
import { useAppSelector } from "@/store";

const Withdraws = () => {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const user = useAppSelector((state) => state.auth.user)
    const exectWithdraw = async () => {
        setLoading(true);
        try {


            toast.push(<Notification title="Retiro solicitado con éxito" type="success" />);
            setLoading(false);
            setAmount(0);
        } catch (error: any) {
            toast.push(<Notification title="No se pudo solicitar el retiro" type="danger" />);
            console.log("fallo al realizar el retiro", error);
            setLoading(false);
        }
    };
    return (
        <div>
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="bg-primary flex flex-col items-center gap-2">
                            <span className="text-xl">
                               Cantidad disponible para retirar
                            </span>
                            <span className="text-[38px] font-bold">
                                $ {user?.balance || 0}
                            </span>
                            <Input
                                prefix={"$"}
                                title={"Cantidad a retirar"}
                                color="secondary"
                                type="number"
                                onChange={(e) => setAmount(Number(e.target.value))}
                                
                            />
                            <Button
                                size="lg"
                                
                                color="default"
                                className="w-full border-white"
                                loading={loading}
                                disabled={loading}
                                onClick={exectWithdraw}
                            >
                                Solicitar retiro
                            </Button>
                        </div>
                        <div className="bg-blue-500 justify-center flex flex-col items-center gap-2">
                            <span className="text-xl">
                                Fondo de ahorro
                            </span>
                            <span className="text-[38px] font-bold">
                                $ {user?.savings || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <HistoryWithdwas />
        </div>
    )
}

export default Withdraws