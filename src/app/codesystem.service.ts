import {Injectable} from '@angular/core';
import {map, Observable, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CodesystemService {
  private apiUrl = '/api/codesystem';

  constructor(private http: HttpClient) {
  }

  public getCodesystem(): Observable<any[]> {
    return this.http.get<any | any[]>(`${this.apiUrl}`).pipe(
      map((response: any | any[]) => Array.isArray(response) ? response : [response]), // Ensure always returns an array
      tap((data: any | any[]) => console.log('get code system:', data)),
      catchError(this.handleError)
    );
  }


  public getPaginatedCodesystemDetailById(id: string, page: number, pageSize: number): Observable<any> {
    const url = id
      ? `${this.apiUrl}-detail/paginated/${encodeURIComponent(id)}`
      : `${this.apiUrl}-detail/paginated`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());


    return this.http.get<any | any[]>(url, {params})
      .pipe(
        map((response: any | any[]) => Array.isArray(response) ? response : [response]), // 确保总是返回数组
        tap((data: any | any[]) => console.log('get patient data:', data)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || error.statusText || 'Unknown error';
    return throwError(() => new Error(`request fail：${message}`));
  }
}
