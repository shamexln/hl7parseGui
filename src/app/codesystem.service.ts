import { Injectable } from '@angular/core';
import {map, Observable, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CodesystemService {
  private apiUrl = '/api/codesystem';
  constructor(private http: HttpClient) { }
  public getCodesystem(): Observable<any[]> {
    return this.http.get<any | any[]>(`${this.apiUrl}`).pipe(
      map((response: any | any[]) => Array.isArray(response) ? response : [response]), // Ensure always returns an array
      tap((data:any|any[]) => console.log('get code system:', data)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || error.statusText || 'Unknown error';
    return throwError(() => new Error(`request fail：${message}`));
  }
}
