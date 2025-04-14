import { ChangeDetectionStrategy, Component , computed, input, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from '../patient.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ButtonComponent } from  '@odx/angular/components/button';
import { MainMenuModule } from  '@odx/angular/components/main-menu';
import {IconComponent} from '@odx/angular/components/icon';
import {HeaderComponent} from '@odx/angular/components/header';
import {AreaHeaderComponent} from '@odx/angular/components/area-header';
import {ActionGroupComponent} from '@odx/angular/components/action-group';
import { TableVariant } from '@odx/angular/components/table';
import {DataTableModule} from '@odx/angular/components/data-table';
import { PageChangeEvent, PaginatorModule } from '@odx/angular/components/paginator';

interface TableData {
  row_id: string;
  device_id: string;
  local_time: string;
  Date: string;
  Time: string;
  Hour: string;
  bed_label: string;
  pat_ID: string;
  mon_unit: string;
  care_unit: string;
  alarm_grade: string;
  alarm_state: string;
  'Alarm Grade 2': string;
  alarm_message: string;
  param_id: string;
  param_value: string;
  param_uom: string;
  param_upper_lim: string;
  param_lower_lim: string;
  'Limit Violation Type': string;
  'Limit Violation Value': string;
  onset_tick: string;
  alarm_duration: string;
  'change_time(UTC)': string;
  change_tick: string;
  aborted: string;
}

@Component({
  selector: 'app-patient',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    MainMenuModule,
    HttpClientModule,
    IconComponent,
    HeaderComponent,
    AreaHeaderComponent,
    ActionGroupComponent,
    DataTableModule,
    PaginatorModule
  ],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent {
  patientId = '';
  patientData = signal<any[]>([]);
  errorMessage = '';
  page = 1;
  pageSize = 20;
  totalPages = 0;
  totalItems = 0;
  previousPageIndex = 0; // 默认第一页索引通常为0

  public variantValue = TableVariant.DEFAULT;

  private filteredData(): TableData[] {
    const data: TableData[] = [];
    // 从信号获取最新值
    const patientDataArray = this.patientData();

    if (patientDataArray && Array.isArray(patientDataArray)) {
      patientDataArray.forEach((patient: any) => {
        data.push({
          row_id: patient.id || '',
          device_id: patient.device_id || '',
          local_time: patient.local_time || '',
          Date: patient.Date || '',
          Time: patient.Time || '',
          Hour: patient.Hour || '',
          bed_label: patient.bed_label || '',
          pat_ID: patient.pat_ID || '',
          mon_unit: patient.mon_unit || '',
          care_unit: patient.care_unit || '',
          alarm_grade: patient.alarm_grade || '',
          alarm_state: patient.alarm_state || '',
          'Alarm Grade 2': patient['Alarm Grade 2'] || '',
          alarm_message: patient.alarm_message || '',
          param_id: patient.param_id || '',
          param_value: patient.param_value || '',
          param_uom: patient.param_uom || '',
          param_upper_lim: patient.param_upper_lim || '',
          param_lower_lim: patient.param_lower_lim || '',
          'Limit Violation Type': patient['Limit Violation Type'] || '',
          'Limit Violation Value': patient['Limit Violation Value'] || '',
          onset_tick: patient.onset_tick || '',
          alarm_duration: patient.alarm_duration || '',
          'change_time(UTC)': patient['change_time(UTC)'] || '',
          change_tick: patient.change_tick || '',
          aborted: patient.aborted || '',
        });
      });
    } else {
      console.error('patientData is invalid or empty.', patientDataArray);
    }

    return data;
  }

  public variant = input.required<TableVariant>();
  public paginationParams = signal<PageChangeEvent>({
    pageSize: this.pageSize,
    length: this.totalItems,
    pageIndex: this.page,
  });

  public dataSource = computed<TableData[]>(() => this.filteredData());


  public displayedColumns = ['row_id','device_id','local_time', 'Date', 'Time', 'Hour', 'bed_label', 'pat_ID', 'mon_unit',
    'care_unit', 'alarm_grade', 'alarm_state', 'Alarm Grade 2', 'alarm_message', 'param_id', 'param_value',
    'param_uom', 'param_upper_lim', 'param_lower_lim', 'Limit Violation Type', 'Limit Violation Value',
    'onset_tick', 'alarm_duration', 'change_time(UTC)', 'change_tick', 'aborted'];



  constructor(private patientService: PatientService) {}

  queryPatient(page: number = 1) {
    this.errorMessage = '';
    this.patientData.set([]);
    this.patientService.getPaginatedPatientById(this.patientId, page, this.pageSize).subscribe({
      next: (data) => {
        const result = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (result) {
          /*this.patientData = result.rows || [];*/
          this.patientData.set(result.rows || []); // 设置新数据（响应式的信号更新）
          this.page = result.page;
          this.pageSize = result.pageSize;
          this.totalPages = result.totalPages;
          this.totalItems = result.total;

          this.paginationParams.set({
            pageSize: this.pageSize,
            length: this.totalItems,
            pageIndex: this.page - 1,
          });


        } else {
          this.patientData.set([]);
          this.errorMessage = 'Server returned invalid data format';
          console.error("Server returned invalid data format", data);
        }

      },
      error: (err) => {
        this.patientData.set([]);
        this.errorMessage = err.message;
        console.error(err);
      },
    });
  }

  onPageChange(event: PageChangeEvent): void {
    const currentPageIndex = event.pageIndex;

    if (currentPageIndex > this.previousPageIndex) {
      console.log('next page →');
    } else if (currentPageIndex < this.previousPageIndex) {
      console.log('← previous page');
    } else {
      console.log('page not changed');
    }

    this.previousPageIndex = currentPageIndex; // 更新页码记录

    // 更新当前页状态，用于后端API请求
    this.page = currentPageIndex + 1;
    this.pageSize = event.pageSize;

    this.paginationParams.set({
      pageSize: this.pageSize,
      length: this.totalItems,
      pageIndex: currentPageIndex
      ,
    });

    this.queryPatient(this.page); // 调用API重新加载对应页的数据
  }


  handlePageSizeChange() {
    // 当用户更改每页数量时，重置到第一页并重新加载数据
    this.page = 1;
    this.queryPatient(this.page);
  }

/*
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.queryPatient(newPage);
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
*/

  // 导出方法
  exportToExcel(): void {
    const data = this.patientData();
    if (!data || data.length === 0)
    {
      alert('没有可导出的数据！');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
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

  exportAllDataToExcel() {
    this.patientService.exportAllDataToExcel(this.patientId).subscribe({
      next: (blobData: Blob) => {
        const fileName = 'patients_data';
        saveAs(blobData, `${fileName}_${new Date().getTime()}.${EXCEL_EXTENSION}`);
      },
      error: (err) => {
        console.error('导出所有数据失败', err);
        alert('导出所有数据失败！');
      }
    });
  }



}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = 'xlsx';
