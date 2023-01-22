import { FilterMenu } from "./components/table";
import { TableColumn } from "./components/types";

export const rows = [
  {
    _id: "63bfeee77f76adde4de2a8c0",
    user_info: {
      user_full_name: "Test Client 1",
      user_email: "marius.lupasco@amdaris.com",
      survey_date: "2023-01-12T11:28:39.338000",
    },
    project_id: 399,
    data: [
      {
        question: "Name",
        answer: "Test Client",
      },
      {
        question: "Job Title",
        answer: "Delivery Lead",
      },
      {
        question: "Project",
        answer: "TestProjectAmurov",
      },
      {
        question: "Company",
        answer: ".ClientAmurov",
      },
    ],
  },

  {
    _id: "63bfeee77f76adde4de2a8c0",
    user_info: {
      user_full_name: "Test Client 2",
      user_email: "marius.lupasco@amdaris.com",
      survey_date: "2023-01-12T11:28:39.338000",
    },
    project_id: 399,
    data: [
      {
        question: "Name",
        answer: "Test Client",
      },
      {
        question: "Job Title",
        answer: "Delivery Lead",
      },
      {
        question: "Project",
        answer: "TestProjectAmurov",
      },
      {
        question: "Company",
        answer: ".ClientAmurov",
      },
    ],
  },
  {
    _id: "63bfeee77f76adde4de2a8c0",
    user_info: {
      user_full_name: "Test Client 3",
      user_email: "marius.lupasco@amdaris.com",
      survey_date: "2023-01-12T11:28:39.338000",
    },
    project_id: 399,
    data: [
      {
        question: "Name",
        answer: "Test Client",
      },
      {
        question: "Job Title",
        answer: "Delivery Lead",
      },
      {
        question: "Project",
        answer: "TestProjectAmurov2",
      },
      {
        question: "Company",
        answer: "PT 2",
      },
    ],
  },
];

export const columns: TableColumn[] = [
  {
    label: "Full Name",
    filterable: true,
    filterBy: FilterMenu.names,
  },
  {
    label: "Project Name",
    filterable: true,
    filterBy: FilterMenu.projects,
  },
  {
    label: "Company Name",
    filterable: true,
    filterBy: FilterMenu.companies,
  },
];
