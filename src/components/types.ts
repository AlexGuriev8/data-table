import { FilterBy } from "./filter-box";

export interface TableColumn {
  label: string;
  filterable: boolean;
  filterBy: FilterBy;
}

export interface CustomTableRow {
  _id: string;
  user_info: {
    user_full_name: string;
    user_email: string;
    survey_date: string;
  };
  project_id: number;
  data: {
    question: string;
    answer: string;
  }[];
}
