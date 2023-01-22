import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  MenuList,
  Tooltip,
  Popover,
  Typography,
} from "@material-ui/core";
import { FilterBy } from "./table";

export interface CheckItem {
  key: string;
  field: string;
  value: string;
}

interface Props {
  open: boolean;
  anchorRef: any;
  handleClose: () => void;
  dataForFilterMenu: FilteredItems;
  checkedForFilter?: CheckItem[];
  applyFilters: () => void;
  filterBy: FilterBy | null;
  setFilterColumns: React.Dispatch<React.SetStateAction<FilteredItems>>;
}

type Item = {
  name: string;
  checked: boolean;
};

export interface FilteredItems {
  names: Item[];
  projects: Item[];
  companies: Item[];
}

const FilterBox = (props: Props) => {
  const {
    open,
    filterBy,
    anchorRef,
    handleClose,
    dataForFilterMenu,
    applyFilters,
    setFilterColumns,
  } = props;

  const [elementWidth, setElementWidth] = useState<number>(0);

  const handleCheckboxChange = (option: Item, type: FilterBy) => {
    const newFilterColumns = { ...dataForFilterMenu };
    newFilterColumns[type] = newFilterColumns[type].map((item) =>
      item.name === option.name ? { ...item, checked: !item.checked } : item
    );
    setFilterColumns(newFilterColumns);
  };

  const getAllChecked = () => {
    if (!filterBy) return false;
    return dataForFilterMenu[filterBy].every((item) => item.checked);
  };

  const handleToggleAll = () => {
    const newFilterColumns = { ...dataForFilterMenu };
    newFilterColumns[filterBy!] = newFilterColumns[filterBy!].map((item) => ({
      ...item,
      checked: !getAllChecked(),
    }));
    setFilterColumns(newFilterColumns);
  };

  const handleClearFilter = () => {
    const newFilterColumns = { ...dataForFilterMenu };
    newFilterColumns[filterBy!] = newFilterColumns[filterBy!].map((item) => ({
      ...item,
      checked: false,
    }));
    setFilterColumns(newFilterColumns);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorRef}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <MenuList>
        <MenuItem onClick={handleToggleAll} dense>
          <ListItemIcon>
            <Checkbox color="default" checked={getAllChecked()} />
          </ListItemIcon>
          <ListItemText primary="Select All" />
        </MenuItem>
        {filterBy &&
          dataForFilterMenu[filterBy].map((option, index) => (
            <MenuItem
              key={index}
              value={option.name}
              onClick={() => handleCheckboxChange(option, filterBy)}
              dense
            >
              <Box>
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon>
                    <Checkbox checked={option.checked} color="default" />
                  </ListItemIcon>
                  <Typography
                    variant="body2"
                    onMouseEnter={(e) =>
                      setElementWidth(e.currentTarget.offsetWidth)
                    }
                  >
                    {option.name}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
      </MenuList>
      <Box>
        <Button
          variant={"contained"}
          onClick={applyFilters}
          disableElevation
          style={{ backgroundColor: "#e0e0e0", color: "#000" }}
        >
          Apply filter
        </Button>
        <Button
          variant={"outlined"}
          onClick={handleClearFilter}
          disableElevation
          style={{ backgroundColor: "#363636", color: "#fff" }}
        >
          Clear filter
        </Button>
      </Box>
    </Popover>
  );
};

export default FilterBox;
