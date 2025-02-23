import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import LayoutTable from "../../../components/LayoutTable";
import { toast } from "react-toastify";
import { PlanService } from "../../../services/PlansService";
import { IPlan, IPlanResponse } from "../../../interfaces/PlansInterface";
import { maskCurrency, unmaskCurrency } from "../../../utils";

const PlansTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataPlans, setDataPlans] = useState<IPlanResponse[]>([])
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [idEdit, setIdEdit] = useState<number>(0);
    const [dataPlansCreate, setDataPlansCreate] = useState<IPlan>({
        mega_quantity: 0,
        plan_type: "RESIDENTIAL",
        value: 0,
        description: ""
    })
    const getPlans = async () => {
        try {
            const response = await PlanService.getAllPlans();
            setDataPlans(response)
        } catch (error) {
            console.log(error);
        }
    };


    const createBanners = async () => {
        try {
            const response = await PlanService.postPlan(dataPlansCreate)
            if (response) {
                setIsModalOpen(false)
                toast("Item criado com sucesso!", { type: "success" })
                getPlans()
            }
        } catch (error) {
            const errorReturn = error as { code?: number, message?: string, status?: number }
            if (errorReturn && errorReturn.status === 401) {
                window.location.href = "/login";
            }
            toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar criar plano'}`, { type: "error" })
        }
    }

    const updateBanner = async () => {
        try {
            const toSend: IPlan = { ...dataPlansCreate }
            const response = await PlanService.putPlan(toSend, idEdit)
            if (response) {
                setIsModalOpen(false)
                toast("Item editado!", { type: "success" })
                getPlans()
            }
        } catch (error) {
            const errorReturn = error as { code?: number, message?: string, status?: number }
            if (errorReturn && errorReturn.status === 401) {
                window.location.href = "/login";
            }
            toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao fazer Edição'}`, { type: "error" })
            console.log(errorReturn.status);
        }
    }

    const creatOrEdit = (isCreate: boolean, index?: number) => {
        if (isCreate) {
            setDataPlansCreate({
                mega_quantity: 0,
                plan_type: "RESIDENTIAL",
                value: 0,
                description: ""
            })
            setIsEdit(false)
            setIsModalOpen(true)
        } else {
            if (index == null || index == undefined) return
            const plan = dataPlans[index]
            setIdEdit(plan.id)
            setDataPlansCreate(plan)
            setIsEdit(true)
            setIsModalOpen(true)
        }
    }

    const deleteBanner = async (id: number) => {
        try {
            const response = await PlanService.deletePlan(id);
            if (response) {
                toast("Item excluido com sucesso!", { type: "success" })
                getPlans();
            }
        } catch (error) {
            const errorReturn = error as { code?: number, message?: string, status?: number }
            if (errorReturn && errorReturn.status === 401) {
                window.location.href = "/login";
            }
            toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar excluir'}`, { type: "error" })
        }
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = unmaskCurrency(event.target.value);
        setDataPlansCreate({ ...dataPlansCreate, value: numericValue });
    };


    const executeMethod = () => {
        if (isEdit) {
            updateBanner()
        } else {
            createBanners()
        }
    }

    useEffect(() => {
        getPlans();
    }, []);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="max-h-[500px] overflow-y-auto">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                        Adicionar
                    </h3>
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-sm ">Megas:</p>
                        <input
                            type="number"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            onChange={(text) => setDataPlansCreate({ ...dataPlansCreate, mega_quantity: parseInt(text.target.value) })}
                            value={dataPlansCreate.mega_quantity}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Valor:</p>
                        <input
                            type="text"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            onChange={handleChange}
                            value={dataPlansCreate.value === 0 ? "" : maskCurrency(dataPlansCreate.value)}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Descrição</p>
                        <input
                            type="text"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            onChange={(text) => setDataPlansCreate({ ...dataPlansCreate, description: text.target.value })}
                            value={dataPlansCreate.description}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <label htmlFor="select" className="text-sm">Escolha uma opção:</label>
                        <select
                            id="select"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            value={dataPlansCreate.plan_type}
                            onChange={(e) => setDataPlansCreate({ ...dataPlansCreate, plan_type: e.target.value })}
                        >
                            <option value="" disabled>Selecione...</option>
                            <option value="RESIDENTIAL">Residencial</option>
                            <option value="BUSINESS">Empresarial</option>
                        </select>
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">

                        <button className="cursor-pointer w-full px-4 py-2 rounded-lg bg-blue-600 text-white mt-4 hover:bg-blue-700" onClick={() => executeMethod()}>
                            {isEdit ? 'Editar' : 'Adicionar'}
                        </button>
                        <button className="cursor-pointer w-full px-4 py-2 rounded-lg bg-white text-blue-700 mt-4 hover:bg-gray-200 border border-blue-700" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
            <button
                className="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg mb-4 hover:bg-blue-700"
                onClick={() => creatOrEdit(true)}
            >
                <PlusCircle size={20} /> <span className="hidden sm:inline">Adicionar Novo</span>
            </button>
            <LayoutTable>
                {dataPlans.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2 sm:p-3">{item.mega_quantity + " MEGAS"}</td>
                        <td className="p-2 sm:p-3 flex justify-end gap-2">
                            <button className="text-blue-600 hover:text-blue-800" onClick={() => creatOrEdit(false, index)}>
                                <Edit size={18} />
                            </button>
                            <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => deleteBanner(item.id)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </LayoutTable>
        </>
    )
}
export default PlansTab;