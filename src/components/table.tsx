import React, { useEffect, useMemo, useState } from "react";

import FilterListIcon from "@material-ui/icons/FilterList";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Table,
  IconButton,
  Typography,
} from "@material-ui/core";

import { CustomTableRow, TableColumn } from "./types";
import FilterBox, { FilterBy, FilteredItems } from "./filter-box";

interface Props {
  columns: TableColumn[];
  rows: CustomTableRow[];
}

type FilterableColumn = "Full Name" | "Project Name" | "Company Name";

const CustomTable = ({ columns, rows }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [filterColumns, setFilterColumns] = useState<FilteredItems>({
    names: [],
    projects: [],
    companies: [],
  });
  const [tableRows, setTableRows] = useState(rows);
  const [filterBy, setFilterBy] = useState<FilterBy | null>(null);

  const openFilterMenu = Boolean(anchorEl);

  const getUnique = (array: string[]) => Array.from(new Set([...array]));

  const setFilters = () => {
    const fullNameDataMenu = rows.map((row) => row.user_info.user_full_name);
    const fullNames = getUnique(fullNameDataMenu);

    const projectNameData = tableRows.map((row) => row.data[2].answer);
    const projectNames = getUnique(projectNameData);

    const companyData = tableRows.map((row) => row.data[3].answer);
    const companyNames = getUnique(companyData);

    const filters = {
      names: fullNames,
      projects: projectNames,
      companies: companyNames,
    };

    setFilterColumns(filters);
  };

  const handleOpenFilterMenu = (
    e: React.MouseEvent,
    columnToFilter: FilterBy
  ) => {
    setFilters();
    setFilterBy(columnToFilter);
    setAnchorEl(e.currentTarget);
  };

  const applyFilters = (filters: FilteredItems, filterBy: FilterBy) => {
    if (!filterBy) return;
    switch (filterBy) {
      case "names":
        {
          const filteredRows = rows.filter((row) =>
            filters.names.includes(row.user_info.user_full_name)
          );
          setTableRows(filters.names.length === 0 ? rows : filteredRows);
        }
        break;
      case "projects":
        {
          const filteredRows = rows.filter((row) =>
            filters.projects.includes(row.data[2].answer)
          );

          const hasFilters = filters.projects.length > 0;
          hasFilters
            ? setTableRows(filteredRows)
            : applyFilters(filters, "names");
        }
        break;

      case "companies": {
        const filteredRows = rows.filter((row) =>
          filters.companies.includes(row.data[3].answer)
        );
        setTableRows(filters.companies.length === 0 ? rows : filteredRows);
      }
    }
    setFilters();
  };

  const handleCloseFilterMenu = () => {
    setAnchorEl(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth: "950px" }}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={column.label} component="th" scope="column">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">{column.label}</Typography>
                  {column.filterable && (
                    <IconButton
                      onClick={(e) =>
                        handleOpenFilterMenu(e, column.filterBy as FilterBy)
                      }
                    >
                      <FilterListIcon />
                    </IconButton>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.user_info.user_full_name}
              </TableCell>
              <TableCell>{row.data[2].answer}</TableCell>
              <TableCell>{row.data[3].answer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FilterBox
        open={openFilterMenu}
        handleClose={handleCloseFilterMenu}
        anchorRef={anchorEl}
        dataForFilterMenu={filterColumns}
        applyFilters={applyFilters}
        filterBy={filterBy}
      />
    </TableContainer>
  );
};

export default CustomTable;
