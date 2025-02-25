import { FC } from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface iParams {
    children: React.ReactNode;
}
const LayoutTable: FC<iParams> = ({ children }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-4/5">Identificador</TableHead>
                    <TableHead className="text-right">Métodos</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {children}
            </TableBody>
        </Table>
    )
}
export default LayoutTable;