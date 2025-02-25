import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { Edit } from "lucide-react";
import LayoutTable from "../../../components/LayoutTable";
import { toast } from "react-toastify";
import { IService, IServiceResponse } from "../../../interfaces/ServiceInterface";
import { ServiceService } from "../../../services/ServiceService";
import { hasEmptyOrZero } from "../../../utils";


const ServicesTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataService, setDataService] = useState<IServiceResponse[]>([])
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [idEdit, setIdEdit] = useState<number>(0);
    const [dataServiceCreate, setDataServiceCreate] = useState<IService>({
        title: "",
        description: ""
    })
    const getService = async () => {
        try {
            const response = await ServiceService.getAllService();
            setDataService(response)
        } catch (error) {
            console.log(error);
        }
    };


    // const createService = async () => {
    //     try {
    //         const response = await ServiceService.postService(dataServiceCreate);
    //         if (response) {
    //             setIsModalOpen(false)
    //             toast("Item criado com sucesso!", { type: "success" })
    //             getService()
    //         }
    //     } catch (error) {
    //         const errorReturn = error as { code?: number, message?: string, status?: number }
    //         if (errorReturn && errorReturn.status === 401) {
    //             window.location.href = "/login";
    //         }
    //         toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar criar contato'}`, { type: "error" })
    //     }
    // }

    const updateService = async () => {
        const toSend: IService = { ...dataServiceCreate }
        if (hasEmptyOrZero(toSend)) {
            toast(`Preencha todos os campos!`, { type: "warning" })
            return
        }
        try {
            const response = await ServiceService.putService(toSend, idEdit)
            if (response) {
                setIsModalOpen(false)
                toast("Item editado!", { type: "success" })
                getService()
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
            setDataServiceCreate({
                title: "",
                description: ""
            })
            setIsEdit(false)
            setIsModalOpen(true)
        } else {
            if (index == null || index == undefined) return
            const plan = dataService[index]
            setIdEdit(plan.id)
            setDataServiceCreate(plan)
            setIsEdit(true)
            setIsModalOpen(true)
        }
    }

    // const deleteService = async (id: number) => {
    //     try {
    //         const response = await ServiceService.deleteService(id);
    //         if (response) {
    //             toast("Item excluido com sucesso!", { type: "success" })
    //             getService();
    //         }
    //     } catch (error) {
    //         const errorReturn = error as { code?: number, message?: string, status?: number }
    //         if (errorReturn && errorReturn.status === 401) {
    //             window.location.href = "/login";
    //         }
    //         toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar excluir'}`, { type: "error" })
    //     }
    // }


    const executeMethod = () => {
        if (isEdit) {
            updateService()
        } else {
            // createService()
        }
    }

    useEffect(() => {
        getService();
    }, []);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="max-h-[500px] overflow-y-auto">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                        Adicionar
                    </h3>
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-sm ">Título:</p>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            onChange={(text) => setDataServiceCreate({ ...dataServiceCreate, title: text.target.value })}
                            value={dataServiceCreate.title}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Descrição:</p>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            onChange={(text) => setDataServiceCreate({ ...dataServiceCreate, description: text.target.value })}
                            value={dataServiceCreate.description}
                        />
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
            {/* <button
                className="flex items-center gap-2 bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg mb-4 hover:bg-purple-700"
                onClick={() => creatOrEdit(true)}
            >
                <PlusCircle size={20} /> <span className="hidden sm:inline">Adicionar Novo</span>
            </button> */}
            <LayoutTable>
                {dataService.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2 sm:p-3">{item.title}</td>
                        <td className="p-2 sm:p-3 flex justify-end gap-2">
                            <button className="text-purple-600 hover:text-blue-800" onClick={() => creatOrEdit(false, index)}>
                                <Edit size={18} />
                            </button>
                            {/* <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => deleteService(item.id)}
                            >
                                <Trash2 size={18} />
                            </button> */}
                        </td>
                    </tr>
                ))}
            </LayoutTable>
        </>
    )
}
export default ServicesTab;