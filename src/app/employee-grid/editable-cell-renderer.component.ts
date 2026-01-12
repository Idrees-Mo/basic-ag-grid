import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

export interface EditableCellRendererParams extends ICellRendererParams {
  icon?: string;
  iconPosition?: 'left' | 'right';
  showIconOnHover?: boolean;
  iconStyle?: string;
  cellStyle?: string;
  onIconClick?: () => void;
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
            (click)="onIconClicked($event)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="14" height="14">
          <path d="M14.1 5.9 3 17v4h4L18.1 9.9l-4-4zm1.5-1.5L18 2l4 4-2.4 2.4-4-4z"/>
        </svg>
      </span>
      <span class="cell-value">{{ value }}</span>
      <span *ngIf="iconPosition === 'right' && shouldShowIcon()" 
            class="cell-icon"
            (click)="onIconClicked($event)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="14" height="14">
          <path d="M14.1 5.9 3 17v4h4L18.1 9.9l-4-4zm1.5-1.5L18 2l4 4-2.4 2.4-4-4z"/>
        </svg>
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
  `]
})
export class EditableCellRendererComponent implements ICellRendererAngularComp {
  value: any;
  icon: string = '✏️';
  iconPosition: 'left' | 'right' = 'right';
  showIconOnHover: boolean = true;
  iconStyle: string = '';
  cellStyle: string = '';
  isHovering: boolean = false;
  private params!: EditableCellRendererParams;

  agInit(params: EditableCellRendererParams): void {
    this.params = params;
    this.value = params.value;
    this.icon = params.icon || '✏️';
    this.iconPosition = params.iconPosition || 'right';
    this.showIconOnHover = params.showIconOnHover !== false;
    this.iconStyle = params.iconStyle || '';
    this.cellStyle = params.cellStyle || '';
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
    if (this.params.api && this.params.node) {
      this.params.api.startEditingCell({
        rowIndex: this.params.node.rowIndex!,
        colKey: this.params.column!.getColId()
      });
    }
  }
}
