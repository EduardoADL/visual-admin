import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import LayoutTable from "../../../components/LayoutTable";
import { toast } from "react-toastify";
import { ContactService } from "../../../services/ContactService";
import { IContact, IContactReponse } from "../../../interfaces/ContactsINterface";

const ContactsTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataContacts, setDataContacts] = useState<IContactReponse[]>([])
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [idEdit, setIdEdit] = useState<number>(0);
    const [dataContactsCreate, setDataContactsCreate] = useState<IContact>({
        email: "",
        mobile_phone: "",
        landline: "",
        address: ""
    })
    const getContacts = async () => {
        try {
            const response = await ContactService.getAllContacts();
            setDataContacts(response)
        } catch (error) {
            console.log(error);
        }
    };


    const createContacts = async () => {
        try {
            const response = await ContactService.postContacts(dataContactsCreate);
            if (response) {
                setIsModalOpen(false)
                toast("Item criado com sucesso!", { type: "success" })
                getContacts()
            }
        } catch (error) {
            const errorReturn = error as { code?: number, message?: string, status?: number }
            if (errorReturn && errorReturn.status === 401) {
                window.location.href = "/login";
            }
            toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar criar contato'}`, { type: "error" })
        }
    }

    const updateContact = async () => {
        try {
            const toSend: IContact = { ...dataContactsCreate }
            const response = await ContactService.putContacts(toSend, idEdit)
            if (response) {
                setIsModalOpen(false)
                toast("Item editado!", { type: "success" })
                getContacts()
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
            setDataContactsCreate({
                email: "",
                mobile_phone: "",
                landline: "",
                address: ""
            })
            setIsEdit(false)
            setIsModalOpen(true)
        } else {
            if (index == null || index == undefined) return
            const plan = dataContacts[index]
            setIdEdit(plan.id)
            setDataContactsCreate(plan)
            setIsEdit(true)
            setIsModalOpen(true)
        }
    }

    const deleteContact = async (id: number) => {
        try {
            const response = await ContactService.deleteContacts(id);
            if (response) {
                toast("Item excluido com sucesso!", { type: "success" })
                getContacts();
            }
        } catch (error) {
            const errorReturn = error as { code?: number, message?: string, status?: number }
            if (errorReturn && errorReturn.status === 401) {
                window.location.href = "/login";
            }
            toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar excluir'}`, { type: "error" })
        }
    }


    const executeMethod = () => {
        if (isEdit) {
            updateContact()
        } else {
            createContacts()
        }
    }

    useEffect(() => {
        getContacts();
    }, []);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="max-h-[500px] overflow-y-auto">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                        Adicionar
                    </h3>
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-sm ">Celular:</p>
                        <input
                            type="number"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            onChange={(text) => setDataContactsCreate({ ...dataContactsCreate, mobile_phone: text.target.value })}
                            value={dataContactsCreate.mobile_phone}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">E-mail:</p>
                        <input
                            type="text"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            onChange={(text) => setDataContactsCreate({ ...dataContactsCreate, email: text.target.value })}
                            value={dataContactsCreate.email}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Endereço</p>
                        <input
                            type="text"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            onChange={(text) => setDataContactsCreate({ ...dataContactsCreate, address: text.target.value })}
                            value={dataContactsCreate.address}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Telefone Fixo:</p>
                        <input
                            type="text"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            onChange={(text) => setDataContactsCreate({ ...dataContactsCreate, landline: text.target.value })}
                            value={dataContactsCreate.landline}
                        />
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
                {dataContacts.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2 sm:p-3">{item.email + " - " + item.mobile_phone}</td>
                        <td className="p-2 sm:p-3 flex justify-end gap-2">
                            <button className="text-blue-600 hover:text-blue-800" onClick={() => creatOrEdit(false, index)}>
                                <Edit size={18} />
                            </button>
                            <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => deleteContact(item.id)}
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
export default ContactsTab;