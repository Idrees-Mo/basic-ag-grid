import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions, GridReadyEvent, GridApi } from 'ag-grid-community';
import { PositionCellRendererComponent } from './position-cell-renderer.component';
import { EditableCellRendererComponent } from './editable-cell-renderer.component';

@Component({
  selector: 'app-employee-grid',
  imports: [AgGridAngular],
  templateUrl: './employee-grid.html',
  styleUrl: './employee-grid.css',
})
export class EmployeeGrid implements OnInit {
  private apiUrl = '/api/employees';
  private gridApi!: GridApi;
  
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 20, 50];

  rowData: any[] = [];

  // Column Definitions
  colDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      field: 'name',
      headerName: 'Employee Name',
      flex: 1.5,
      editable: true,
      cellClass: 'editable-cell',
      cellRenderer: EditableCellRendererComponent,
      cellRendererParams: {
        iconPosition: 'right',
        showIconOnHover: true
      }
    },
    {
      field: 'position',
      headerName: 'Position',
      editable: true,
      singleClickEdit: true,
      cellClass: 'editable-cell',
      cellRenderer: PositionCellRendererComponent,
    },
    {
      field: 'department',
      headerName: 'Department',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Human Resources', 'IT']
      },
    },
    {
      field: 'salary',
      headerName: 'Salary',
      valueFormatter: (params) => {
        return '$' + params.value.toLocaleString();
      },
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      filter: 'agDateColumnFilter',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      editable: true,
      cellClass: 'editable-cell',
      cellRenderer: EditableCellRendererComponent,
      cellRendererParams: {
        iconPosition: 'left',
        showIconOnHover: true
      }
    },
  ];

  // Default column definitions
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
  };

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    console.log('Employee grid is ready');
    this.gridApi = params.api;
    this.loadEmployees();
  }

  ngOnInit(): void {
    // Data will be loaded in onGridReady
  }

  loadEmployees(): void {
    console.log('Fetching employees from:', this.apiUrl);
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Employees loaded successfully:', data);
        console.log('Number of employees:', data.length);
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', data);
          console.log('Employee row data set to grid');
        }
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      }
    });
  }

  onCellValueChanged(event: any): void {
    const updatedEmployee = event.data;
    this.http.put(`${this.apiUrl}/${updatedEmployee.id}`, updatedEmployee).subscribe({
      next: () => {
        console.log('Employee updated successfully');
      },
      error: (error) => {
        console.error('Error updating employee:', error);
      }
    });
  }
}
