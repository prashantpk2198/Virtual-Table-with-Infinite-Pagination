import { Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ordertypes } from "../data";

export default function OrderTypeCell({ row, column, getValue, table }) {
  const orderType = getValue();
    const { updateData } = table.options.meta;
    

  return (
    <Menu isLazy>
      <MenuButton transition="all 0.2s" border="none" fontWeight='normal' _focus='none'>
        {orderType} <ChevronDownIcon />
      </MenuButton>
          <Portal>
          <MenuList isLazy portalProps={{ appendToParentPortal: false }}>
        {ordertypes.map((order) => (
          <MenuItem
            key={order}
            onClick={() => updateData(row.index, column.id, order)}
          >
            {order}
          </MenuItem>
        ))}
      </MenuList>
    </Portal>
    </Menu>
  );
}
