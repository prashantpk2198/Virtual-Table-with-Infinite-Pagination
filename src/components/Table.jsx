import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Card,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import SortIcon from "../assets/SortIcon";
import Filters from "./Filters";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";

const itemsPerPage = 25;

// async function fetchData({ pageParam = 0 }) {
//   const start = pageParam * fetchSize;
//   const fetchedData = mdata.slice(start, start + fetchSize);
//       return { data: fetchedData, nextPage: pageParam + 1 };
//     // return {data:fetchedData}
// }

export default function CustomTable({ columns, setmData, mdata }) {
  const allData = mdata.map((item, index) => ({ ...item, ID: index }));
  //   const allData = mdata;
  console.log(allData.length);

  const tableContainerRef = useRef(null);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const [columnVisibility, setColumnVisibility] = useState({});
  const [searchfilter, setSearchFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    // Reset page and data when mdata (filter results) changes
    setPage(0);
    setData([]);
    setHasMore(true);
    if (mdata.length <= itemsPerPage) {
      setHasMore(false);
    }
    // Fetch the initial page of filtered data
    fetchData(0);
  }, [mdata, searchfilter]);
  console.log(data.length);

  const fetchData = async (page) => {
    setLoading(true);
    const start = page * itemsPerPage;
    const newData = allData.slice(start, start + itemsPerPage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (newData.length < itemsPerPage) {
      setHasMore(false);
    }
    if (page === 0) {
      setData(newData);
    } else {
      setData((prevData) => {
        const existingIds = prevData.map((item) => item.ID);
        // Filter out duplicates from newData
        const filteredNewData = newData.filter(
          (item) => !existingIds.includes(item.ID)
        );
        return [...prevData, ...filteredNewData];
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page, mdata]);

  useEffect(() => {
    console.log("Page:", page);
    console.log("Loading:", loading);
    console.log("Has more data:", hasMore);
  }, [page, loading, hasMore]);

  // Debouncing function
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      const handleScroll = debounce(() => {
        if (!hasMore || loading) return;

        requestAnimationFrame(() => {
          const container = tableContainerRef.current;
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (
              scrollHeight - scrollTop - clientHeight < 300 &&
              !loading &&
              data.length < allData.length
            ) {
              setPage((prevPage) => prevPage + 1);
            }
          }
        });
      }, 100); // Debounce delay set to 200ms

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, loading]);

  // pagination using useInfiniteQuery()

  //   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
  //     useInfiniteQuery({
  //       queryKey: ["tableData", searchfilter],
  //       queryFn: fetchData,
  //         initialPageParam:0,
  //         getNextPageParam: (lastPage, pages) =>
  //             pages.length * fetchSize < mdata.length ? pages.length : undefined,
  //       refetchOnWindowFocus: false,
  //         placeholderData:keepPreviousData,
  //     });

  //   const flatData = useMemo(
  //     () => data?.pages.flatMap((page) => page.data) ?? [],
  //     [data]
  //       );
  //     console.log(data);
  // const flatData = data;

  //   if (isFetching) {
  //     return <div>Loading...</div>;
  //   }

  //   if (flatData.length === 0) {
  //     return <div>No data available</div>;
  //   }

  //   const fetchMoreOnBottomReached = useCallback(
  //     (containerRefElement) => {
  //       if (containerRefElement) {
  //         const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
  //         if (
  //           scrollHeight - scrollTop - clientHeight < 500 &&
  //           !isFetching
  //         ) {
  //           fetchNextPage();
  //         }
  //       }
  //     },
  //     [fetchNextPage,isFetching]
  //   );

  //   useEffect(() => {
  //     fetchMoreOnBottomReached(tableContainerRef.current);
  //   }, []);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchfilter,
      rowSelection,
      columnVisibility,
      mdata,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setSearchFilter,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row
          )
        );
        console.log("status updated");
      },
    },
  });

  // need to try debouncing scroll events
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: useCallback(() => 40, []), // Adjust this based on the actual row height
    overscan: 5, // Increase overscan for smoother scrolling
    // measureElement:
    //   typeof window !== "undefined" &&
    //   navigator.userAgent.indexOf("Firefox") === -1
    //     ? (element) => element?.getBoundingClientRect().height
    //     : undefined,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const numericColumns = ["Price", "User ID", "Order Date"];
  // const truncateColumns = ["Country","Order ID"]
  const leftpinColumns = ["select", "ID", "Name"];
  return (
    <>
      <Filters
        searchfilter={searchfilter}
        setSearchFilter={setSearchFilter}
        setData={setmData}
        table={table}
      />
      <Card width="1200px">
        <TableContainer
          height="500px"
          position="relative"
          overflowY="auto"
          ref={tableContainerRef}
        >
          <Table variant="simple" size="xs">
            {/* <TableCaption>A mini Project Data Table</TableCaption> */}
            <Thead
              style={{
                backgroundColor: "#F9FAFB",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id} display="flex" width="100%">
                  {headerGroup.headers.map((header) => (
                    <Th
                      width={header.getSize()}
                      p="8px 10px"
                      fontSize="8px"
                      key={header.id}
                      //   height="15px"
                      isNumeric={numericColumns.includes(
                        header.column.columnDef.header
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <Icon
                          as={
                            {
                              asc: ArrowUpIcon,
                              desc: ArrowDownIcon,
                            }[header.column.getIsSorted()] || SortIcon
                          }
                          mx={1}
                          fontSize={10}
                          onClick={header.column.getToggleSortingHandler()}
                        />
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody position="relative" height={`${totalSize}px`}>
              {virtualRows.map((virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index];
                return (
                  <Tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      width: "100%",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                        p=" 0 10px"
                        fontSize="14px"
                        height="40px"
                        isNumeric={numericColumns.includes(
                          cell.column.columnDef.header
                        )}
                        maxWidth="150px"
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          {loading && <Spinner size="lg" />}
          {!hasMore && (
            <Text textAlign="center" mt={4}>
              No more data
            </Text>
          )}
        </TableContainer>
      </Card>
    </>
  );
}
