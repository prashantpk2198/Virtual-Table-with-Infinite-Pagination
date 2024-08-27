import {
  CalendarIcon,
  ChevronDownIcon,
  SearchIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { data, ordertypes, statuses } from "../data";
import { MdStoreMallDirectory } from "react-icons/md";

export function TimeFilter({ setData }) {
  const [timefilter, setTimeFilter] = useState("All Time");
  function datafilter(time) {
    if (time === 100) {
      setData(data);
      setTimeFilter("All Time");
      return;
    }
    const filteredData = data.filter((row) => {
      const today = new Date();
      const rowDate = new Date(row["Order Date"]);
      return today.getTime() - rowDate.getTime() <= 86400 * time * 1000;
    });
    console.log(filteredData);
    setData(filteredData);
    setTimeFilter(`Last ${time} days`);
  }
  return (
    <Menu>
      <MenuButton
        size="sm"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<CalendarIcon />}
        fontWeight="normal"
        transition="all 0.2s"
      >
        {timefilter}
      </MenuButton>
      <MenuList zIndex="2">
        <MenuItem onClick={() => datafilter(100)} size="sm" fontWeight="normal">
          All Time
        </MenuItem>
        <MenuItem onClick={() => datafilter(7)} size="sm" fontWeight="normal">
          Last 7 days
        </MenuItem>
        <MenuItem onClick={() => datafilter(14)} size="sm" fontWeight="normal">
          Last 14 days
        </MenuItem>
        <MenuItem onClick={() => datafilter(30)} size="sm" fontWeight="normal">
          Last 30 days
        </MenuItem>
        <MenuItem onClick={() => datafilter(60)} size="sm" fontWeight="normal">
          Last 60 days
        </MenuItem>
        <MenuItem onClick={() => datafilter(90)} size="sm" fontWeight="normal">
          Last 90 days
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

const statusBool = statuses.reduce(
  (acc, stat) => ({ ...acc, [stat]: false }),
  {}
);

export function StatusFilter({ setData }) {
  const [statusFilter, setStatusFilter] = useState(statusBool);
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Menu isOpen={isOpen} onClose={onClose} closeOnSelect={false}>
      <MenuButton
        size="sm"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<TimeIcon />}
        fontWeight="normal"
        transition="all 0.2s"
        onClick={onOpen}
      >
        Status
      </MenuButton>
      <MenuList zIndex="2" minWidth="240px">
        <MenuOptionGroup type="checkbox">
          {statuses.map((stat) => (
            <MenuItemOption
              value={stat}
              key={stat}
              size="sm"
              fontWeight="normal"
              isChecked={statusFilter[stat]}
              onClick={() =>
                setStatusFilter((prev) => ({
                  ...prev,
                  [stat]: !prev[stat], // Toggle the value
                }))
              }
            >
              {stat}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
        <Button
          colorScheme="teal"
          size="xs"
          onClick={() => {
            const filterOn = Object.keys(statusFilter).filter(
              (obj) => statusFilter[obj]
            );
            if (!filterOn.length) {
              setData(data);
              onClose();
              return;
            }
            const filteredData = data.filter((row) =>
              filterOn.includes(row.Status)
            );
            //   console.log(filteredData)
            setData(filteredData);
            onClose();
          }}
        >
          Done
        </Button>
      </MenuList>
    </Menu>
  );
}

const OrderTypeBool = ordertypes.reduce(
  (acc, stat) => ({ ...acc, [stat]: false }),
  {}
);

export function OrderTypeFilter({ setData }) {
  const [statusFilter, setStatusFilter] = useState(OrderTypeBool);
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Menu isOpen={isOpen} onClose={onClose} closeOnSelect={false}>
      <MenuButton
        size="sm"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<MdStoreMallDirectory />}
        fontWeight="normal"
        transition="all 0.2s"
        onClick={onOpen}
      >
        OrderType
      </MenuButton>
      <MenuList zIndex="2" minWidth="240px">
        <MenuOptionGroup type="checkbox">
          {ordertypes.map((stat) => (
            <MenuItemOption
              value={stat}
              key={stat}
              size="sm"
              fontWeight="normal"
              isChecked={statusFilter[stat]}
              onClick={() =>
                setStatusFilter((prev) => ({
                  ...prev,
                  [stat]: !prev[stat], // Toggle the value
                }))
              }
            >
              {stat}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
        <Button
          colorScheme="teal"
          size="xs"
          onClick={() => {
            const filterOn = Object.keys(statusFilter).filter(
              (obj) => statusFilter[obj]
            );
            if (!filterOn.length) {
              setData(data);
              onClose();
              return;
            }
            const filteredData = data.filter((row) =>
              filterOn.includes(row["Order Type"])
            );
            //   console.log(filteredData)
            setData(filteredData);
            onClose();
          }}
        >
          Done
        </Button>
      </MenuList>
    </Menu>
  );
}
export function ColumnFilter({ table }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Menu isOpen={isOpen} onClose={onClose} closeOnSelect={false}>
      <MenuButton
        size="sm"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<MdStoreMallDirectory />}
        fontWeight="normal"
        transition="all 0.2s"
        onClick={onOpen}
      >
        Filter Columns
      </MenuButton>
      <MenuList zIndex="2" minWidth="240px">
        <MenuOptionGroup
          type="checkbox"
          value={table
            .getAllColumns()
            .filter((col) => col.getIsVisible())
            .map((col) => col.id)}
          onChange={(values) => {
            table.getAllColumns().forEach((column) => {
              const shouldBeVisible = values.includes(column.id);
              if (column.getIsVisible() !== shouldBeVisible) {
                column.toggleVisibility();
              }
            });
          }}
        >
          {table.getAllLeafColumns().map((column) => (
            <MenuItemOption
              value={column.id}
              key={column.id}
              isChecked={column.getIsVisible()}
              size="sm"
              fontWeight="normal"
            >
              {column.id}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
        <Button colorScheme="teal" size="xs" onClick={onClose} mt={2}>
          Save
        </Button>
      </MenuList>
    </Menu>
  );
}

export default function Filters({
  searchFilter,
  setSearchFilter,
  setData,
  table,
}) {
  return (
    <HStack mb={6} spacing={3}>
      <InputGroup size="sm" maxW="12rem">
        <InputLeftElement pointerEvents="none">
          <Icon as={SearchIcon} />
        </InputLeftElement>
        <Input
          type="text"
          variant="filled"
          placeholder="Search Anything"
          borderRadius={5}
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </InputGroup>
      <TimeFilter setData={setData} />
      <StatusFilter setData={setData} />
      <OrderTypeFilter setData={setData} />
      <ColumnFilter table={table} />
    </HStack>
  );
}
