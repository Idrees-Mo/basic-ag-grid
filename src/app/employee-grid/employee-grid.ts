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
  invalidEditValueMode: 'revert' | 'block' = 'revert';

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
        action: 'edit',
        iconType: 'edit',
        iconPosition: 'right',
        showIconOnHover: true,
        canPerformAction: (params: any) => {
          // Example: Only allow editing for Engineering department
          return params.data.department === 'Engineering' || params.data.department === 'Product';
        }
      },
      cellEditorParams: (params: any) => {
        return {
          getValidationErrors: (editorParams: any) => {
            const value = editorParams.value;
            const rowNode = params.node;
            const currentId = rowNode?.data?.id;
            
            if (!value || value.trim().length === 0) {
              return ['Name cannot be empty'];
            }
            
            // Check for duplicate names only if we have a valid ID
            if (currentId !== undefined && this.gridApi) {
              const isDuplicate = this.isDuplicateName(value, currentId);
              
              if (isDuplicate) {
                const errorMsg = `Duplicate name: "${value}" already exists`;
                // Show notification under the cell
                setTimeout(() => {
                  const cellElement = params.eGridCell;
                  this.showErrorNotificationUnderCell(errorMsg, cellElement);
                }, 0);
                return [errorMsg];
              }
            }
            
            return null;
          }
        };
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
      editable: false, // Not editable when using info action
      cellClass: 'editable-cell',
      cellRenderer: EditableCellRendererComponent,
      cellRendererParams: {
        action: 'info',
        iconType: 'info',
        iconPosition: 'left',
        showIconOnHover: true,
        onActionClick: (params: any) => {
          // Custom action: show employee email details
          alert(`Email: ${params.value}\nEmployee: ${params.data.name}\nDepartment: ${params.data.department}`);
        }
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

  isDuplicateName(name: string, currentId: number): boolean {
    let isDuplicate = false;
    this.gridApi.forEachNode((node) => {
      if (node.data.id !== currentId && 
          node.data.name.toLowerCase().trim() === name.toLowerCase().trim()) {
        isDuplicate = true;
      }
    });
    return isDuplicate;
  }

  showErrorNotification(message: string): void {
    console.log('Showing error notification:', message);
    // Create a temporary error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); z-index: 10000; font-size: 14px; max-width: 400px;';
    document.body.appendChild(notification);
    console.log('Notification appended to body');
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
        console.log('Notification removed');
      }, 300);
    }, 10000);
  }

  showErrorNotificationUnderCell(message: string, cellElement: HTMLElement): void {
    console.log('Showing error notification under cell:', message);
    
    // Remove any existing cell error notifications
    const existingNotifications = document.querySelectorAll('.cell-error-notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'cell-error-notification';
    notification.textContent = message;
    
    // Position it below the cell
    if (cellElement) {
      const rect = cellElement.getBoundingClientRect();
      notification.style.cssText = `
        position: fixed;
        left: ${rect.left}px;
        top: ${rect.bottom + 5}px;
        background-color: #ef4444;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 13px;
        max-width: 300px;
        animation: slideDown 0.2s ease-out;
      `;
    }
    
    document.body.appendChild(notification);
    console.log('Cell notification appended to body');
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.2s ease-out';
      setTimeout(() => {
        notification.remove();
        console.log('Cell notification removed');
      }, 200);
    }, 10000);
  }
}
