import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { CellComponent } from '../cell-component/cell-component';
import type { ColDef, GridOptions, GridReadyEvent, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-basic-grid',
  imports: [AgGridAngular],
  template: ` <ag-grid-angular
    class="ag-theme-quartz"
    style="height:500px"
    [columnDefs]="colDefs"
    [defaultColDef]="defaultColDef"
    [pagination]="pagination"
    [paginationPageSize]="paginationPageSize"
    [paginationPageSizeSelector]="paginationPageSizeSelector"
    [rowSelection]="'multiple'"
    (gridReady)="onGridReady($event)"
    (cellValueChanged)="onCellValueChanged($event)"
  />`,
  styleUrl: './basic-grid.css',
})
export class BasicGrid implements OnInit {
  private apiUrl = '/api/cars';
  private gridApi!: GridApi;
  
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 20];

  // Row Data: The data to be displayed.
  rowData: any[] = [];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: 'make',
      headerName: 'Company Make',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Tesla', 'Ford', 'Toyota', 'BMW', 'Mercedes-Benz', 'Audi'] },
      checkboxSelection: true,
    },
    {
      field: 'model',
      headerName: 'Model',
      flex: 1.5,
    },
    {
      field: 'price',
      headerName: 'Price',
      valueFormatter: (params) => {
        return params.value ? '$' + params.value.toLocaleString() : '';
      },
      filter: 'agNumberColumnFilter',
    },
    { 
      field: 'electric',
      headerName: 'Electric',
    },
  ];

  // default col definations for all colums ,
  defaultColDef: ColDef = {
    flex: 1, // so in this case if we want to apply flex 1 to all colums
    filter: true, // to have filter on each column , NgGrid provide 5 filters , Text, Number, Date, SetFilter, & MultiFilter, we can build our own filters with components.
    floatingFilter: true, // to show the filter for quick access
    editable: true, // to make the cols editable
  };

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    console.log('Grid is ready');
    this.gridApi = params.api;
    this.loadCars();
  }

  ngOnInit(): void {
    // Data will be loaded in onGridReady
  }

  loadCars(): void {
    console.log('Fetching cars from:', this.apiUrl);
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Cars loaded successfully:', data);
        console.log('Number of cars:', data.length);
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', data);
          console.log('Row data set to grid');
        }
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      }
    });
  }

  onCellValueChanged(event: any): void {
    const updatedCar = event.data;
    this.http.put(`${this.apiUrl}/${updatedCar.id}`, updatedCar).subscribe({
      next: () => {
        console.log('Car updated successfully');
      },
      error: (error) => {
        console.error('Error updating car:', error);
      }
    });
  }
}
