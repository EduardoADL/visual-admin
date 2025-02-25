import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal";
import { Trash2, PlusCircle, Edit } from "lucide-react";
import LayoutTable from "../../../components/LayoutTable";
import { toast } from "react-toastify";
import { IRating, IRatingResponse } from "../../../interfaces/RatingInteface";
import { RatingService } from "../../../services/RatingService copy";
import { hasEmptyOrZero } from "../../../utils";


const RatingTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataRating, setDataRating] = useState<IRatingResponse[]>([])
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [idEdit, setIdEdit] = useState<number>(0);
    const [dataRatingCreate, setDataRatingCreate] = useState<IRating>({
        title: "",
        quality: 1,
        name: "",
        image: "",
        message: ""
    })
    const getRating = async () => {
        try {
            const response = await RatingService.getAllRating();
            setDataRating(response)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [dataRatingCreate.message]);


    const createRating = async () => {
        if (hasEmptyOrZero(dataRatingCreate)) {
            toast(`Preencha todos os campos!`, { type: "warning" })
            return
        }
        try {
            const response = await RatingService.postRating(dataRatingCreate);
            if (response) {
                setIsModalOpen(false)
                toast("Item criado com sucesso!", { type: "success" })
                getRating()
            }
        } catch (error) {
            const errorReturn = error as { code?: number, message?: string, status?: number }
            if (errorReturn && errorReturn.status === 401) {
                window.location.href = "/login";
            }
            toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar criar contato'}`, { type: "error" })
        }
    }

    const updateRating = async () => {
        const toSend: IRating = { ...dataRatingCreate, image: typeof dataRatingCreate.image === "string" ? null : dataRatingCreate.image }
        if (hasEmptyOrZero(toSend)) {
            toast(`Preencha todos os campos!`, { type: "warning" })
            return
        }
        try {
            const response = await RatingService.putRating(toSend, idEdit)
            if (response) {
                setIsModalOpen(false)
                toast("Item editado!", { type: "success" })
                getRating()
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
            setDataRatingCreate({
                title: "",
                quality: 1,
                name: "",
                image: null,
                message: ""
            })
            setIsEdit(false)
            setIsModalOpen(true)
        } else {
            if (index == null || index == undefined) return
            const rating = dataRating[index]
            setIdEdit(rating.id)
            setDataRatingCreate({
                ...dataRatingCreate,
                title: rating.title,
                quality: rating.quality,
                name: rating.name,
                message: rating.message,
                image: typeof rating.imgName === "string" ? dataRating[index].imgName : dataRatingCreate.image
            })
            setIsEdit(true)
            setIsModalOpen(true)
        }
    }

    const deleteRating = async (id: number) => {
        try {
            const response = await RatingService.deleteRating(id);
            if (response) {
                toast("Item excluido com sucesso!", { type: "success" })
                getRating();
            }
        } catch (error) {
            const errorReturn = error as { code?: number, message?: string, status?: number }
            if (errorReturn && errorReturn.status === 401) {
                window.location.href = "/login";
            }
            toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar excluir'}`, { type: "error" })
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setDataRatingCreate({ ...dataRatingCreate, image: event.target.files[0] });
        }
    };


    const executeMethod = () => {
        if (isEdit) {
            updateRating()
        } else {
            createRating()
        }
    }

    useEffect(() => {
        getRating();
    }, []);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="max-h-[500px] overflow-y-auto">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                        Visualizar
                    </h3>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Nome:</p>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            onChange={(text) => setDataRatingCreate({ ...dataRatingCreate, name: text.target.value })}
                            value={dataRatingCreate.name}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-sm ">Título:</p>
                        <input
                            type="text"
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            onChange={(text) => setDataRatingCreate({ ...dataRatingCreate, title: text.target.value })}
                            value={dataRatingCreate.title}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Mensagem:</p>
                        <textarea
                            ref={textareaRef}
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            onChange={(text) => setDataRatingCreate({ ...dataRatingCreate, message: text.target.value })}
                            value={dataRatingCreate.message}
                            rows={2}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <label htmlFor="select" className="text-sm">Escolha uma opção:</label>
                        <select
                            id="select"
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full"
                            value={dataRatingCreate.quality}
                            onChange={(e) => setDataRatingCreate({ ...dataRatingCreate, quality: Number(e.target.value) })}
                        >
                            <option value="" disabled>Selecione...</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div>
                        <p className="text-sm ">Selecione uma imagem:</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-gray-300 p-2 rounded-lg flex-1 w-full cursor-pointer"
                        />
                        {dataRatingCreate && dataRatingCreate.image && (
                            <div>
                                <p className="max-w-10/12 overflow-hidden text-ellipsis">Imagem selecionada: {typeof dataRatingCreate.image === "string" ? dataRatingCreate.image : dataRatingCreate.image.name}</p>
                                <img
                                    src={typeof dataRatingCreate.image === "string" ? `https://visualnet.letsinove.com/images/banner/${dataRatingCreate.image}` : URL.createObjectURL(dataRatingCreate.image)}
                                    alt="Preview"
                                    style={{ width: 200, height: "auto", marginTop: 10 }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-1 mt-2">

                        <button className="cursor-pointer w-full px-4 py-2 rounded-lg bg-purple-600 text-white mt-4 hover:bg-purple-700" onClick={() => executeMethod()}>
                            {isEdit ? 'Editar' : 'Adicionar'}
                        </button>
                        <button className="cursor-pointer w-full px-4 py-2 rounded-lg bg-white text-purple-700 mt-4 hover:bg-gray-200 border border-purple-700" onClick={() => setIsModalOpen(false)}>
                            Fechar
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
                {dataRating.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2 sm:p-3">{item.title} - {item.name}</td>
                        <td className="p-2 sm:p-3 flex justify-end gap-2">
                            <button className="text-purple-600 hover:text-blue-800" onClick={() => creatOrEdit(false, index)}>
                                <Edit size={18} />
                            </button>
                            <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => deleteRating(item.id)}
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
export default RatingTab;