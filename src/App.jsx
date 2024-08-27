import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Box, Card, ChakraProvider } from "@chakra-ui/react";
import Table from "./components/Table";
import StatusCell from "./components/StatusCell";
import OrderTypeCell from "./components/OrderTypeCell";
import { ordertypes } from "./data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { data } from "./data";

function App() {
  const [mdata, setmData] = useState(data);
  /** @type import('@tanstack/react-table').ColumnDef<any> */
  const columns = [
    {
      id: "Select", // for checkbox column
      header: ({ table }) => (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
    },
    {
      header: "ID",
      accessorKey: "ID",
      meta: {
        className: "sticky right-0",
      },
    },
    {
      header: "Name",
      accessorKey: "Name",
      meta: {
        className: "sticky right-0",
      },
    },
    {
      header: "Email",
      accessorKey: "Email",
    },
    {
      header: "Country",
      accessorKey: "Country",
    },
    {
      header: "State",
      accessorKey: "State",
    },
    {
      header: "City",
      accessorKey: "City",
    },
    {
      header: "Order ID",
      accessorKey: "Order ID",
    },
    {
      header: "User ID",
      accessorKey: "User ID",
    },
    {
      header: "Product",
      accessorKey: "Product",
    },
    {
      header: "Order Type",
      accessorKey: "Order Type",
      cell: OrderTypeCell,
    },
    {
      header: "Assignee",
      accessorKey: "Assignee",
    },
    {
      header: "Status",
      accessorKey: "Status",
      cell: StatusCell,
    },
    {
      header: "Price",
      accessorKey: "Price",
    },
    {
      header: "Order Date",
      accessorKey: "Order Date",
    },
  ];
  // const queryClient = new QueryClient()
  return (
    // <QueryClientProvider client={queryClient}>
    // </QueryClientProvider>
    <ChakraProvider>
      <Box
        position="absolute"
        top="100"
        right="20"
        left="20"
        p="4"
        maxHeight={700}
      >
        <Table columns={columns} mdata={mdata} setmData={setmData} />
      </Box>
    </ChakraProvider>
  );
}

export default App;


function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
