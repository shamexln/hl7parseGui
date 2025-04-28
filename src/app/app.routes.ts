import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import {ConfigurationComponent} from './configuration/configuration.component';

export const routes: Routes = [
  {
    path: 'patient-query',
    loadComponent: () => import('./patient/patient.component')
      .then(m => m.PatientComponent)
  },
  {
    path: 'config',
    loadComponent: () => import('./configuration/configuration.component')
      .then(m => m.ConfigurationComponent)
  },
  { path: '', redirectTo: '/patient-query', pathMatch: 'full' }

];
