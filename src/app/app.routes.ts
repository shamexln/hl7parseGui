import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';

export const routes: Routes = [
  {
    path: 'patient-query',
    /*loadComponent: () => import('./patient/patient.component').then(m => m.PatientComponent)*/
   component: PatientComponent
},
  { path: '', redirectTo: '/patient-query', pathMatch: 'full' },

];
