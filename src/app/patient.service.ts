import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {tap, map, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = '/api/patients';
  constructor(private http: HttpClient) { }
  getPatientById(id: string): Observable<any[]> {
    return this.http.get<any | any[]>(`${this.apiUrl}/${encodeURIComponent(id)}`).pipe(
      map((response: any | any[]) => Array.isArray(response) ? response : [response]), // 确保总是返回数组
      tap((data:any|any[]) => console.log('获取到的病人数据:', data)), // 添加这一行用于输出日志
      catchError(this.handleError)
    );
  }



  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || error.statusText || 'Unknown error';
    return throwError(() => new Error(`请求失败：${message}`));
  }

}
