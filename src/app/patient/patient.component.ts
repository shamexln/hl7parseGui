import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from '../patient.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent {
  patientId = '';
  patientData: any;
  errorMessage = '';
  constructor(private patientService: PatientService) {}

  queryPatient() {
    this.patientData = null;
    this.errorMessage = '';

    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data) => (this.patientData = data),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // 导出方法
  exportToExcel(): void {
    if (!this.patientData || this.patientData.length === 0) {
      alert('没有可导出的数据！');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.patientData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "patients_data");
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.${EXCEL_EXTENSION}`);
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = 'xlsx';
