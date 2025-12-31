// MyTable.tsx
import React from 'react';
import DataTable from 'react-data-table-component';
import type { TableColumn } from 'react-data-table-component';

// Define the shape of each row
interface DataRow {
  id: number;
  name: string;
  age: number;
  garden?: React.ReactNode;  // optional field for JSX
}

// Define columns with typed selectors
const columns: TableColumn<DataRow>[] = [
  { 
    name: 'Name', 
    selector: (row) => row.name, 
    sortable: true,
    width: '200px',
  },
  { 
    name: 'Age', 
    selector: (row) => row.age,
    sortable: true,
    width: '100px',
  },
  {
    name: 'Garden',
    cell: (row) => row.garden || '-',  // ✅ FIXED: use `cell` for JSX rendering
    width: '200px',
  }
];

// Sample data
const data: DataRow[] = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25, garden: <h1>head</h1> },
  { id: 3, name: 'Bob', age: 35, garden: <button>Click me</button> },
  { id: 4, name: 'Alice', age: 28 }
];

function MyTable() {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[5, 10, 15, 20]}
      highlightOnHover
      striped
      responsive
    />
  );
}

export default MyTable;
