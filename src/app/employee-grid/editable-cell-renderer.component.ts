import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

export interface EditableCellRendererParams extends ICellRendererParams {
  action?: 'edit' | 'info' | 'delete' | 'custom';
  iconType?: 'edit' | 'info' | 'delete' | 'custom';
  customIcon?: string;
  iconPosition?: 'left' | 'right';
  showIconOnHover?: boolean;
  iconStyle?: string;
  cellStyle?: string;
  canPerformAction?: (params: ICellRendererParams) => boolean;
  onActionClick?: (params: ICellRendererParams) => void;
}

@Component({
  selector: 'app-editable-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="editable-cell" 
         (mouseenter)="onMouseEnter()" 
         (mouseleave)="onMouseLeave()"
         [style]="cellStyle">
      <span *ngIf="iconPosition === 'left' && shouldShowIcon()" 
            class="cell-icon"
            [class.disabled]="!hasPermission"
            (click)="onIconClicked($event)">
        <ng-container [ngSwitch]="iconType">
          <svg *ngSwitchCase="'edit'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" [attr.fill]="iconColor" width="14" height="14">
            <path d="M14.1 5.9 3 17v4h4L18.1 9.9l-4-4zm1.5-1.5L18 2l4 4-2.4 2.4-4-4z"/>
          </svg>
          <svg *ngSwitchCase="'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" [attr.fill]="iconColor" width="14" height="14">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <svg *ngSwitchCase="'delete'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" [attr.fill]="iconColor" width="14" height="14">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          <span *ngSwitchCase="'custom'" [innerHTML]="customIcon"></span>
        </ng-container>
      </span>
      <span class="cell-value">{{ value }}</span>
      <span *ngIf="iconPosition === 'right' && shouldShowIcon()" 
            class="cell-icon"
            [class.disabled]="!hasPermission"
            (click)="onIconClicked($event)">
        <ng-container [ngSwitch]="iconType">
          <svg *ngSwitchCase="'edit'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" [attr.fill]="iconColor" width="14" height="14">
            <path d="M14.1 5.9 3 17v4h4L18.1 9.9l-4-4zm1.5-1.5L18 2l4 4-2.4 2.4-4-4z"/>
          </svg>
          <svg *ngSwitchCase="'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" [attr.fill]="iconColor" width="14" height="14">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <svg *ngSwitchCase="'delete'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" [attr.fill]="iconColor" width="14" height="14">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          <span *ngSwitchCase="'custom'" [innerHTML]="customIcon"></span>
        </ng-container>
      </span>
    </div>
  `,
  styles: [`
    .editable-cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      padding: 0 8px;
    }
    
    .cell-value {
      flex: 1;
    }
    
    .cell-icon {
      margin: 0 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    
    .cell-icon:hover svg {
      opacity: 0.7;
    }
    
    .cell-icon.disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
    
    .cell-icon.disabled:hover svg {
      opacity: 0.4;
    }
  `]
})
export class EditableCellRendererComponent implements ICellRendererAngularComp {
  value: any;
  action: 'edit' | 'info' | 'delete' | 'custom' = 'edit';
  iconType: 'edit' | 'info' | 'delete' | 'custom' = 'edit';
  customIcon: string = '';
  iconPosition: 'left' | 'right' = 'right';
  showIconOnHover: boolean = true;
  iconStyle: string = '';
  cellStyle: string = '';
  isHovering: boolean = false;
  hasPermission: boolean = true;
  iconColor: string = '#3b82f6';
  private params!: EditableCellRendererParams;

  agInit(params: EditableCellRendererParams): void {
    this.params = params;
    this.value = params.value;
    this.action = params.action || 'edit';
    this.iconType = params.iconType || params.action || 'edit';
    this.customIcon = params.customIcon || '';
    this.iconPosition = params.iconPosition || 'right';
    this.showIconOnHover = params.showIconOnHover !== false;
    this.iconStyle = params.iconStyle || '';
    this.cellStyle = params.cellStyle || '';
    
    // Check permissions
    if (params.canPerformAction) {
      this.hasPermission = params.canPerformAction(params);
    }
    
    // Update icon color based on permission
    this.iconColor = this.hasPermission ? '#3b82f6' : '#9ca3af';
  }

  refresh(params: EditableCellRendererParams): boolean {
    this.value = params.value;
    return true;
  }

  onMouseEnter(): void {
    this.isHovering = true;
  }

  onMouseLeave(): void {
    this.isHovering = false;
  }

  shouldShowIcon(): boolean {
    return this.showIconOnHover ? this.isHovering : true;
  }

  onIconClicked(event: MouseEvent): void {
    event.stopPropagation();
    
    if (!this.hasPermission) {
      console.warn('Action not permitted');
      return;
    }
    
    // Handle custom action callback
    if (this.params.onActionClick) {
      this.params.onActionClick(this.params);
      return;
    }
    
    // Handle built-in actions
    switch (this.action) {
      case 'edit':
        if (this.params.api && this.params.node) {
          this.params.api.startEditingCell({
            rowIndex: this.params.node.rowIndex!,
            colKey: this.params.column!.getColId()
          });
        }
        break;
      case 'info':
        console.log('Info clicked for:', this.params.data);
        break;
      case 'delete':
        console.log('Delete clicked for:', this.params.data);
        break;
      case 'custom':
        console.log('Custom action for:', this.params.data);
        break;
    }
  }
}
