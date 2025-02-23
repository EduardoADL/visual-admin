import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { BannersService } from "../../../services/BannersService";
import { IBanner, IBannersResponse } from "../../../interfaces/BannersInterface";
import LayoutTable from "../../../components/LayoutTable";
import { toast } from "react-toastify";

const BannersTabs = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataBanners, setDataBanners] = useState<IBannersResponse[]>([])
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [idEdit, setIdEdit] = useState<number>(0);
    const [dataBannersCreate, setDataBannersCreate] = useState<IBanner>({
        name: "",
        image: null
    })
    const getBanners = async () => {
        try {
            const response = await BannersService.getAllBanners();
            setDataBanners(response)
        } catch (error) {
            console.log(error);
        }
    };


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setDataBannersCreate({ ...dataBannersCreate, image: event.target.files[0] });
        }
    };

    const createBanners = async () => {
        try {
            const response = await BannersService.postBanner(dataBannersCreate)
            if (response) {
                setIsModalOpen(false)
                toast("Item criado com sucesso!", { type: "success" })
                getBanners()
            }
        } catch (error) {
            const errorReturn = error as { code?: number, message?: string, status?: number }
            if (errorReturn && errorReturn.status === 401) {
                window.location.href = "/login";
            }
            toast(`${errorReturn && errorReturn.message ? errorReturn.message : 'Erro ao tentar criar banner'}`, { type: "error" })
        }
    }

    const updateBanner = async () => {
        try {
            const toSend: IBanner = { ...dataBannersCreate, image: typeof dataBannersCreate.name === "string" ? null : dataBannersCreate.image }
            const response = await BannersService.putBanner(toSend, idEdit)
            if (response) {
                setIsModalOpen(false)
                toast("Item editado!", { type: "success" })
                getBanners()
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
            setDataBannersCreate({ ...dataBannersCreate, name: "", image: null })
            setIsEdit(false)
            setIsModalOpen(true)
        } else {
            if (index == null || index == undefined) return
            const banner = dataBanners[index]
            setIdEdit(banner.id)
            setDataBannersCreate({ ...dataBannersCreate, name: banner.name, image: typeof banner.name === "string" ? dataBanners[index].imgName : dataBannersCreate.image })
            setIsEdit(true)
            setIsModalOpen(true)
        }
    }

    const deleteBanner = async (id: number) => {
        try {
            const response = await BannersService.deleteBanner(id);
            if (response) {
                toast("Item excluido com sucesso!", { type: "success" })
                getBanners();
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
            updateBanner()
        } else {
            createBanners()
        }
    }

    useEffect(() => {
        getBanners();
    }, []);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="max-h-[500px] overflow-y-auto">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                        Adicionar
                    </h3>
                    <div className="flex flex-col items-start gap-1">
                        <p className="text-sm ">Nome da imagem:</p>
                        <input
                            type="text"
                            className="h-8 w-10/12 border border-black rounded px-2"
                            onChange={(text) => setDataBannersCreate({ ...dataBannersCreate, name: text.target.value })}
                            value={dataBannersCreate.name}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-2">
                        <p className="text-sm ">Selecione uma imagem:</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="h-8 w-10/12 border border-black rounded px-2 cursor-pointer"
                        />
                        {dataBannersCreate && dataBannersCreate.image && (
                            <div>
                                <p className="max-w-10/12 overflow-hidden text-ellipsis">Imagem selecionada: {typeof dataBannersCreate.image === "string" ? dataBannersCreate.image : dataBannersCreate.image.name}</p>
                                <img
                                    src={typeof dataBannersCreate.image === "string" ? `https://visualnet.letsinove.com/images/banner/${dataBannersCreate.image}` : URL.createObjectURL(dataBannersCreate.image)}
                                    alt="Preview"
                                    style={{ width: 200, height: "auto", marginTop: 10 }}
                                />
                            </div>
                        )}
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
                {dataBanners.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2 sm:p-3">{item.name}</td>
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
export default BannersTabs;