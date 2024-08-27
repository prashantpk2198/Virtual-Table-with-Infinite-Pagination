import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { statuses} from "../data";

export default function StatusCell({ row, column, getValue, table }) {
  const status = getValue();
  const { updateData } = table.options.meta;

  return (
    <Menu isLazy>
      <MenuButton
        px={1}
        py={1}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: "gray.400" }}
        _expanded={{ bg: "blue.400" }}
        _focus={{ boxShadow: "outline" }}
        textAlign="left"
        fontWeight="normal"
      >
        {status} <ChevronDownIcon />
          </MenuButton>
          <Portal>
      <MenuList>
        {statuses.map((stat) => (
          <MenuItem
            key={stat}
            onClick={() => {
              updateData(row.index, column.id, stat);
            }}
          >
            {stat}
          </MenuItem>
        ))}
              </MenuList>
              </Portal>
    </Menu>
  );
}
