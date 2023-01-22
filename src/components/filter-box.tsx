import React, { useEffect, useState } from "react";
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

export interface CheckItem {
  key: string;
  field: string;
  value: string;
}

interface Props {
  open: boolean;
  anchorRef: any;
  handleClose: () => void;
  dataForFilterMenu: {
    names: string[];
    projects: string[];
    companies: string[];
  };
  setCheckedForFilter?: React.Dispatch<React.SetStateAction<CheckItem[]>>;
  checkedForFilter?: CheckItem[];
  applyFilters: (filters: FilteredItems, filterBy: FilterBy) => void;
  filterBy: FilterBy | null;
}

export interface FilteredItems {
  names: string[];
  projects: string[];
  companies: string[];
}

export type FilterBy = "names" | "projects" | "companies";

const FilterBox = (props: Props) => {
  const {
    open,
    filterBy,
    anchorRef,
    handleClose,
    dataForFilterMenu,
    applyFilters,
  } = props;

  const [filteredItems, setFilteredItems] = useState<FilteredItems>({
    names: [],
    projects: [],
    companies: [],
  });
  const [elementWidth, setElementWidth] = useState<number>(0);
  console.log("filteredItems", filteredItems);

  const handleCheckboxChange = (option: string, type: FilterBy) => {
    filteredItems[type].includes(option)
      ? setFilteredItems((prevState) => ({
          ...prevState,
          [type]: filteredItems[type].filter((item) => item !== option),
        }))
      : setFilteredItems((prevState) => ({
          ...prevState,
          [type]: [...filteredItems[type], option],
        }));
  };

  const getAllChecked = () => {
    if (!filterBy) return false;
    return dataForFilterMenu[filterBy].every((data) =>
      filteredItems[filterBy].includes(data)
    );
  };

  const handleToggleAll = () => {
    if (!filterBy) return;
    filteredItems[filterBy].length === dataForFilterMenu[filterBy].length
      ? handleClearFilter()
      : setFilteredItems(dataForFilterMenu);
  };

  const handleClearFilter = () => {
    if (!filterBy) return;
    setFilteredItems((prevState) => ({
      ...prevState,
      [filterBy]: [],
    }));
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
              value={option}
              onClick={() => handleCheckboxChange(option, filterBy)}
              dense
            >
              <Box>
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon>
                    <Checkbox
                      checked={filteredItems[filterBy].includes(option)}
                      color="default"
                    />
                  </ListItemIcon>
                  <Typography
                    variant="body2"
                    onMouseEnter={(e) =>
                      setElementWidth(e.currentTarget.offsetWidth)
                    }
                  >
                    {option}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
      </MenuList>
      <Box>
        <Button
          variant={"contained"}
          onClick={() => applyFilters(filteredItems, filterBy!)}
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
