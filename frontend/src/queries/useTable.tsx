import tableApiRequest from "@/apiRequests/table";
import { UpdateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTableListQuery = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tableApiRequest.list,
    refetchOnWindowFocus: false, // Disable auto refetch since we'll use socket
    staleTime: 0, // Always fresh for realtime updates
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};

export const useGetTableQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: () => tableApiRequest.getTable(id),
    enabled,
  });
};

export const useAddTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tableApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
        exact: true,
      });
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};

// Hook để invalidate table queries từ socket events
export const useInvalidateTableQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateTableList: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
    updateTableInCache: (tableData: any) => {
      queryClient.setQueryData(["tables"], (oldData: any) => {
        if (!oldData) return oldData;

        const existingTableIndex = oldData.payload.data.findIndex(
          (table: any) => table.number === tableData.number
        );

        if (existingTableIndex >= 0) {
          // Update existing table by merging with new data
          const newData = { ...oldData };
          newData.payload.data[existingTableIndex] = {
            ...newData.payload.data[existingTableIndex],
            ...tableData,
          };
          return newData;
        } else {
          // Add new table
          const newData = { ...oldData };
          newData.payload.data.unshift(tableData);
          return newData;
        }
      });
    },
    updateTableStatusInCache: (tableNumber: number, status: string) => {
      queryClient.setQueryData(["tables"], (oldData: any) => {
        if (!oldData) return oldData;

        const existingTableIndex = oldData.payload.data.findIndex(
          (table: any) => table.number === tableNumber
        );

        if (existingTableIndex >= 0) {
          // Update only the status field
          const newData = { ...oldData };
          newData.payload.data[existingTableIndex] = {
            ...newData.payload.data[existingTableIndex],
            status: status,
          };
          return newData;
        }

        return oldData;
      });
    },
    removeTableFromCache: (tableNumber: number) => {
      queryClient.setQueryData(["tables"], (oldData: any) => {
        if (!oldData) return oldData;

        const newData = { ...oldData };
        newData.payload.data = newData.payload.data.filter(
          (table: any) => table.number !== tableNumber
        );
        return newData;
      });
    },
  };
};
