import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import LayoutTable from "../../../components/LayoutTable";
import { toast } from "react-toastify";
import { PlanService } from "../../../services/PlansService";
import { IPlan, IPlanResponse } from "../../../interfaces/PlansInterface";
import { hasEmptyOrZero, maskCurrency, unmaskCurrency } from "../../../utils";
import { TableCell, TableRow } from "@/components/ui/table";

const PlansTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataPlans, setDataPlans] = useState<IPlanResponse[]>([])
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [idEdit, setIdEdit] = useState<number>(0);
    const [text, setText] = useState("");
    const [items, setItems] = useState<string[]>([]);

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
        const toSend = { ...dataPlansCreate, description: items.join(", ") }
        if (hasEmptyOrZero(toSend)) {
            toast(`Preencha todos os campos!`, { type: "warning" })
            return
        }
        try {
            const response = await PlanService.postPlan(toSend)
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
        const toSend: IPlan = { ...dataPlansCreate, description: items.join(", ") }
        if (hasEmptyOrZero(toSend)) {
            toast(`Preencha todos os campos!`, { type: "warning" })
            return
        }
        try {
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
            setItems([])
            setIsEdit(false)
            setIsModalOpen(true)
        } else {
            if (index == null || index == undefined) return
            const plan = dataPlans[index]
            setIdEdit(plan.id)
            setDataPlansCreate(plan)
            const itemsInput = plan.description.split(",").map(item => item.trim()).filter(item => item !== "");
            setItems(itemsInput)
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

    const addItem = () => {
        if (text.trim() !== "") {
            setItems((prev) => [...prev, text.trim()]);
            setText("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addItem();
        }
    };

    const removeItem = (itemToRemove: string) => {
        setItems((prev) => prev.filter(item => item !== itemToRemove));
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
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            onChange={(text) => setDataPlansCreate({ ...dataPlansCreate, mega_quantity: parseInt(text.target.value) })}
                            value={dataPlansCreate.mega_quantity}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Valor:</p>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            placeholder="R$ 0,00"
                            onChange={handleChange}
                            value={dataPlansCreate.value === 0 ? "" : maskCurrency(dataPlansCreate.value)}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Diferênciais:</p>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            placeholder="Digite um item e pressione Enter"
                        />
                        <button
                            onClick={addItem}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition mt-2"
                        >
                            Adicionar
                        </button>
                        {items.length > 0 && (
                            <div className="text-gray-700">
                                <p>Itens:</p>
                                <ul className="flex flex-row flex-wrap gap-3 mt-1">
                                    {items.map((item) => (
                                        <li key={item} className="flex justify-between items-center gap-2 bg-gray-200 px-2 rounded-lg">
                                            <span>{item}</span>
                                            <button
                                                onClick={() => removeItem(item)}
                                                className="cursor-pointer text-black text-center rounded-lg hover:bg-gray-300 transition"
                                            >
                                                x
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-6">
                        <label htmlFor="select" className="text-sm">Escolha uma opção:</label>
                        <select
                            id="select"
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            value={dataPlansCreate.plan_type}
                            onChange={(e) => setDataPlansCreate({ ...dataPlansCreate, plan_type: e.target.value })}
                        >
                            <option value="" disabled>Selecione...</option>
                            <option value="RESIDENTIAL">Residencial</option>
                            <option value="BUSINESS">Empresarial</option>
                        </select>
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">

                        <button className="cursor-pointer w-full px-4 py-2 rounded-lg bg-purple-600 text-white mt-4 hover:bg-purple-700" onClick={() => executeMethod()}>
                            {isEdit ? 'Editar' : 'Adicionar'}
                        </button>
                        <button className="cursor-pointer w-full px-4 py-2 rounded-lg bg-white text-purple-700 mt-4 hover:bg-gray-200 border border-purple-700" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
            <button
                className="flex items-center gap-2 bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg mb-4 hover:bg-purple-700"
                onClick={() => creatOrEdit(true)}
            >
                <PlusCircle size={20} /> <span className="hidden sm:inline">Adicionar Novo</span>
            </button>
            <LayoutTable>
                {dataPlans.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.mega_quantity + " MEGAS"}</TableCell>

                        <TableCell className="text-right">
                            <button className="text-black hover:text-black-80 cursor-pointer" onClick={() => creatOrEdit(false, index)}>
                                <Edit size={18} />
                            </button>
                            <button
                                className="text-black hover:text-black-80 cursor-pointer ms-1"
                                onClick={() => deleteBanner(item.id)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </TableCell>
                    </TableRow>
                ))}
            </LayoutTable>
        </>
    )
}
export default PlansTab;