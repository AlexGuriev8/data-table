import React, { useState } from "react";

import FilterListIcon from "@material-ui/icons/FilterList";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Table,
  IconButton,
  Typography,
} from "@material-ui/core";

import { CustomTableRow, TableColumn } from "./types";
import FilterBox, { FilteredItems } from "./filter-box";

interface Props {
  columns: TableColumn[];
  rows: CustomTableRow[];
}

export const FilterMenu = {
  names: "names",
  projects: "projects",
  companies: "companies",
} as const;

export type FilterBy = typeof FilterMenu[keyof typeof FilterMenu];

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

  const setStateKeys = (
    data: string[],
    state: FilteredItems,
    key: FilterBy
  ) => {
    return data.map((name) => ({
      name,
      checked: state[key].find((item) => item.name === name)?.checked || false,
    }));
  };

  const setFilters = () => {
    const fullNameDataMenu = rows.map((row) => row.user_info.user_full_name);
    const projectNameData = tableRows.map((row) => row.data[2].answer);
    const companyData = tableRows.map((row) => row.data[3].answer);

    const fullNames = getUnique(fullNameDataMenu);
    const projectNames = getUnique(projectNameData);
    const companyNames = getUnique(companyData);

    setFilterColumns((prevState) => ({
      ...prevState,
      names: setStateKeys(fullNames, prevState, FilterMenu.names),
      projects: setStateKeys(projectNames, prevState, FilterMenu.projects),
      companies: setStateKeys(companyNames, prevState, FilterMenu.companies),
    }));
  };

  const removeFilters = (key: FilterBy) => {
    setFilterColumns((prevState) => ({
      ...prevState,
      [key]: prevState.projects.map((item) => ({ ...item, checked: false })),
    }));
  };

  const handleOpenFilterMenu = (
    e: React.MouseEvent,
    columnToFilter: FilterBy
  ) => {
    setFilters();
    setFilterBy(columnToFilter);
    setAnchorEl(e.currentTarget);
  };

  const getFilteredRows = (
    rowToFilter: CustomTableRow[],
    filterBy: FilterBy
  ) => {
    const filteredRows = rowToFilter.filter((row) => {
      const filterColumn = filterColumns[filterBy];
      const filterItem = filterColumn.find(
        (item) => item.name === getFilterBy(row, filterBy)
      );
      return filterItem?.checked;
    });
    return filteredRows;
  };

  const getFilterBy = (row: CustomTableRow, filterBy: FilterBy) => {
    switch (filterBy) {
      case FilterMenu.names:
        return row.user_info.user_full_name;
      case FilterMenu.projects:
        return row.data[2].answer;
      case FilterMenu.companies:
        return row.data[3].answer;
    }
  };

  const getRows = (filter: FilterBy) => {
    const hasNamesFilter = filterColumns.names.some((name) => name.checked);
    const hasProjectsFilter = filterColumns.projects.some(
      (project) => project.checked
    );
    const hasCompaniesFilter = filterColumns.companies.some(
      (company) => company.checked
    );

    const rowsFilteredByNames = getFilteredRows(rows, FilterMenu.names);
    const rowsFilteredByProjects = getFilteredRows(rows, FilterMenu.projects);
    const rowsFilteredByCompanies = getFilteredRows(rows, FilterMenu.companies);

    switch (filter) {
      case FilterMenu.names: {
        //removed checked projects and companies when filter by name
        if (filterBy === FilterMenu.names) {
          removeFilters(FilterMenu.projects);
          removeFilters(FilterMenu.companies);
        }
        return hasNamesFilter ? rowsFilteredByNames : rows;
      }
      case FilterMenu.projects: {
        //removed checked  companies when filter by project
        if (filterBy === FilterMenu.projects) {
          removeFilters(FilterMenu.companies);
        }
        if (hasProjectsFilter && hasNamesFilter) {
          return getFilteredRows(rowsFilteredByNames, FilterMenu.projects);
        }
        if (hasNamesFilter) {
          return rowsFilteredByNames;
        }
        if (hasProjectsFilter) {
          return rowsFilteredByProjects;
        }
        return rows;
      }
      case FilterMenu.companies: {
        if (hasProjectsFilter && hasNamesFilter && hasCompaniesFilter) {
          const rowsFilteredByProjectsAndNames = getFilteredRows(
            rowsFilteredByNames,
            FilterMenu.projects
          );
          return getFilteredRows(
            rowsFilteredByProjectsAndNames,
            FilterMenu.companies
          );
        }
        if (hasProjectsFilter && hasNamesFilter) {
          return getFilteredRows(rowsFilteredByNames, FilterMenu.projects);
        }
        if (hasProjectsFilter && hasCompaniesFilter) {
          return getFilteredRows(rowsFilteredByProjects, FilterMenu.companies);
        }
        if (hasNamesFilter && hasCompaniesFilter) {
          return getFilteredRows(rowsFilteredByNames, FilterMenu.companies);
        }
        if (hasNamesFilter) {
          return rowsFilteredByNames;
        }
        if (hasProjectsFilter) {
          return rowsFilteredByProjects;
        }

        if (hasCompaniesFilter) {
          return rowsFilteredByCompanies;
        }
        return rows;
      }
    }
  };

  const syncMenuWithFilteredRows = (newRows: CustomTableRow[]) => {
    setFilterColumns((prevState) => ({
      ...prevState,
      projects: setStateKeys(
        getUnique(newRows.map((row) => row.data[2].answer)),
        prevState,
        FilterMenu.projects
      ),
      companies: setStateKeys(
        getUnique(newRows.map((row) => row.data[3].answer)),
        prevState,
        FilterMenu.companies
      ),
    }));
  };

  const applyFilters = () => {
    const newRows = getRows(filterBy as FilterBy);
    syncMenuWithFilteredRows(newRows);
    setTableRows(newRows);
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
        setFilterColumns={setFilterColumns}
      />
    </TableContainer>
  );
};

export default CustomTable;
