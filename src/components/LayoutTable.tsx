import { FC } from "react";

interface iParams {
    children: React.ReactNode;
}
const LayoutTable: FC<iParams> = ({ children }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white text-left text-sm shadow-md">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 sm:p-3">Nome</th>
                        <th className="p-2 sm:p-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    )
}
export default LayoutTable;