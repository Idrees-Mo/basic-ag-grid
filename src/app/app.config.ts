import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { BasicGrid } from './basic-grid/basic-grid';
import { EmployeeGrid } from './employee-grid/employee-grid';

// import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
// import { AllCommunityModule, AllEnterpriseModule, ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';



import 'ag-grid-enterprise'

// Register all Community features
// ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([
  AllCommunityModule,
  AllEnterpriseModule
]);

// Define routes
export const routes: Routes = [
  { path: '', redirectTo: '/basic-grid', pathMatch: 'full' },
  { path: 'basic-grid', component: BasicGrid },
  { path: 'employee-grid', component: EmployeeGrid },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};