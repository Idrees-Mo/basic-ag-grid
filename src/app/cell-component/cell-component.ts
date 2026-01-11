import { Component } from '@angular/core';
import { ICellEditorRendererAngularComp, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-cell-component',
  imports: [],
  template: `
    <button (click)="onButtonClicked()">{{value}}</button>
  `,
  styleUrl: './cell-component.css',
})
export class CellComponent implements ICellRendererAngularComp {
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }
  public value!: string;
      public data!: any;
  agInit(params: ICellRendererParams<any, any, any>): void {
    this.data = params.data;
    // this.data = params.context.componentParent.rowData;
    this.value = params.value
  }
  // agInit(params: ICellEditorRendererParams<any, any, any>): void {
  //   this.data = params.context.componentParent.rowData;
  //   this.value = params.value
  // }
  onButtonClicked() {
    console.log('The button clicked!!!');
    console.warn(this.data);
  }
}
