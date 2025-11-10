"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createContext, useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getVietnameseTableStatus, handleErrorApi } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import { TableListResType } from "@/schemaValidations/table.schema";
import EditTable from "@/app/[locale]/manage/tables/edit-table";
import AddTable from "@/app/[locale]/manage/tables/add-table";
import { useDeleteTableMutation, useTableListQuery } from "@/queries/useTable";
import QRCodeTable from "@/components/qrcode-table";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Edit,
  Trash2,
  Wifi,
  WifiOff,
  Maximize2,
} from "lucide-react";
import { useAppStore } from "@/components/app-provider";
import { useInvalidateTableQueries } from "@/queries/useTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TableItem = TableListResType["data"][0];

const TableTableContext = createContext<{
  setTableIdEdit: (value: number) => void;
  tableIdEdit: number | undefined;
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}>({
  setTableIdEdit: (value: number | undefined) => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: (value: TableItem | null) => {},
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200";
    case "Hidden":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200";
    case "Reserved":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200";
  }
};

export const columns: ColumnDef<TableItem>[] = [
  {
    accessorKey: "number",
    header: () => (
      <div className="flex items-center space-x-2 font-semibold">
        <span>Số bàn</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {row.getValue("number")}
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
        <div>
          <span className="font-semibold text-gray-900 dark:text-white block">
            Bàn {row.getValue("number")}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ID: #{row.getValue("number")}
          </span>
        </div>
      </div>
    ),
    filterFn: (rows, columnId, filterValue) => {
      if (!filterValue) return true;
      return String(filterValue) === String(rows.getValue("number"));
    },
  },
  {
    accessorKey: "capacity",
    header: () => (
      <div className="flex items-center space-x-2 font-semibold">
        <Users className="w-4 h-4" />
        <span>Sức chứa</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg flex items-center justify-center border border-emerald-200 dark:border-emerald-700">
          <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <span className="font-semibold text-gray-900 dark:text-white block text-sm">
            {row.getValue("capacity")} người
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Sức chứa tối đa
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center space-x-2 font-semibold">
        <span>Trạng thái</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusIcon = (status: string) => {
        switch (status) {
          case "Available":
            return "🟢";
          case "Reserved":
            return "🟡";
          case "Hidden":
            return "⚫";
          default:
            return "🔵";
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon(status)}</span>
          <div>
            <Badge
              className={`${getStatusColor(status)} border font-medium text-xs`}
            >
              {getVietnameseTableStatus(status as any)}
            </Badge>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {status === "Available" && "Sẵn sàng phục vụ"}
              {status === "Reserved" && "Đang có khách"}
              {status === "Hidden" && "Không khả dụng"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "token",
    header: () => (
      <div className="flex items-center space-x-2 font-semibold">
        <span>QR Code</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="group relative cursor-pointer">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105 max-w-[120px]">
                  <QRCodeTable
                    token={row.getValue("token")}
                    tableNumber={row.getValue("number")}
                    width={100}
                  />
                </div>
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Maximize2 className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="p-4 bg-white dark:bg-gray-800 border shadow-xl"
            >
              <div className="text-center">
                <QRCodeTable
                  token={row.getValue("token")}
                  tableNumber={row.getValue("number")}
                  width={200}
                />
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">Thao tác</div>,
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableDelete } = useContext(TableTableContext);
      const openEditTable = () => {
        setTableIdEdit(row.original.number);
      };

      const openDeleteTable = () => {
        setTableDelete(row.original);
      };
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="font-semibold">
                Thao tác
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={openEditTable}
                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Chỉnh sửa</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openDeleteTable}
                className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="font-medium">Xóa bàn</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete,
}: {
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}) {
  const { mutateAsync } = useDeleteTableMutation();
  const deleteTable = async () => {
    if (tableDelete) {
      try {
        const result = await mutateAsync(tableDelete.number);
        setTableDelete(null);
        toast({
          title: result.payload.message,
        });
      } catch (error) {
        handleErrorApi({
          error,
        });
      }
    }
  };
  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null);
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <span>Xóa bàn ăn?</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Bạn có chắc chắn muốn xóa{" "}
            <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded px-2 py-1 font-semibold">
              Bàn số {tableDelete?.number}
            </span>{" "}
            không? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300">Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteTable}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa bàn
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;

export default function TableTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null);
  const tableListQuery = useTableListQuery();
  const data = tableListQuery.data?.payload.data ?? [];
  const socket = useAppStore((state) => state.socket);
  const { updateTableStatusInCache, invalidateTableList } =
    useInvalidateTableQueries();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  // Listen to order events that affect table status
  useEffect(() => {
    if (!socket) return;

    function onNewOrder(data: any[]) {
      if (data.length > 0 && data[0].tableNumber) {
        console.log("📝 New order affecting table:", data[0].tableNumber);
        updateTableStatusInCache(data[0].tableNumber, "Reserved");
      }
    }

    function onPayment(data: any[]) {
      if (data.length > 0 && data[0].guest?.tableNumber) {
        console.log("💰 Payment affecting table:", data[0].guest.tableNumber);
        updateTableStatusInCache(data[0].guest.tableNumber, "Available");
      }
    }

    socket.on("new-order", onNewOrder);
    socket.on("payment", onPayment);

    return () => {
      socket.off("new-order", onNewOrder);
      socket.off("payment", onPayment);
    };
  }, [socket, updateTableStatusInCache]);

  return (
    <TableTableContext.Provider
      value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}
    >
      <div className="w-full space-y-3">
        <EditTable id={tableIdEdit} setId={setTableIdEdit} />
        <AlertDialogDeleteTable
          tableDelete={tableDelete}
          setTableDelete={setTableDelete}
        />

        {/* Realtime Status Indicator */}
        <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {socket?.connected ? (
                <Wifi className="w-3 h-3 text-green-600" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-600" />
              )}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                {socket?.connected ? "Realtime" : "Offline"}
              </span>
            </div>
            <Badge variant="outline" className="text-xs px-1 py-0">
              {data.length} bàn
            </Badge>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Tự động cập nhật
          </div>
        </div>

        {/* Search and Add Section */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="🔍 Tìm kiếm số bàn..."
              value={
                (table.getColumn("number")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("number")?.setFilterValue(event.target.value);
              }}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-10 rounded-lg shadow-sm focus:shadow-md transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              {data.length} bàn
            </span>
            <AddTable />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 hover:from-gray-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-blue-800/30 transition-all duration-200"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="font-semibold text-gray-900 dark:text-gray-100 py-2 text-sm"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Không tìm thấy bàn nào
                      </p>
                      <p className="text-sm text-gray-400">
                        Thử tìm kiếm với từ khóa khác hoặc thêm bàn mới
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Hiển thị{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {table.getPaginationRowModel().rows.length}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.length}
            </span>{" "}
            bàn
          </div>
          <AutoPagination
            page={table.getState().pagination.pageIndex + 1}
            pageSize={table.getPageCount()}
            pathname="/manage/tables"
          />
        </div>
      </div>
    </TableTableContext.Provider>
  );
}
