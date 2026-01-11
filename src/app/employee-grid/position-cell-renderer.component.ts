import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-position-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="position-cell" 
         (mouseenter)="showIcon = true" 
         (mouseleave)="showIcon = false"
         style="display: flex; align-items: center; justify-content: space-between; height: 100%; width: 100%;">
      <span>{{ value }}</span>
      <span *ngIf="showIcon" style="font-size: 14px; margin-left: 8px;">✏️</span>
    </div>
  `,
  styles: [`
    .position-cell {
      cursor: pointer;
    }
  `]
})
export class PositionCellRendererComponent implements ICellRendererAngularComp {
  value: any;
  showIcon = false;

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}
