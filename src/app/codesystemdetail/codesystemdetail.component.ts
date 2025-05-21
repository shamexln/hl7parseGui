import {Component, computed, OnInit, signal} from '@angular/core';
import {AreaHeaderComponent} from '@odx/angular/components/area-header';
import {CodesystemService} from '../codesystem.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PageChangeEvent, PaginatorModule} from '@odx/angular/components/paginator';
import {DataTableModule} from '@odx/angular/components/data-table';
import {TableVariant} from '@odx/angular/components/table';
import {FormFieldModule} from '@odx/angular/components/form-field';

interface TableData {
  row_id: string;
  observationtype: string;
  datatype: string;
  encode: string;
  parameterlabel: string;
  encodesystem: string;
  subid: string;
  description: string;
  source: string;
  channel: string;
  channelid: string;
}

@Component({
  selector: 'app-codesystemdetail',
  imports: [
    AreaHeaderComponent,
    PaginatorModule,
    DataTableModule,
    FormFieldModule,
  ],
  templateUrl: './codesystemdetail.component.html',
  standalone: true,
  styleUrl: './codesystemdetail.component.css'
})
export class CodesystemdetailComponent implements OnInit {
  public filterText = signal<string>('');
  public codesystemData = signal<any[]>([]);
  public errorMessage = '';
  public id: string = '';
  public page = 1;
  public pageSize = 20;
  public totalPages = 0;
  public totalItems = 0;
  previousPageIndex = 0; // 默认第一页索引通常为0
  public paginationParams = signal<PageChangeEvent>({
    pageSize: this.pageSize,
    length: this.totalItems,
    pageIndex: this.page,
  });
  public tablevariantValue = TableVariant.STRIPED;

  constructor(
    private codesystemService: CodesystemService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  private filteredData(): TableData[] {
    const data: TableData[] = [];
    // 从信号获取最新值
    const codesystemDataArray = this.codesystemData();

    if (codesystemDataArray && Array.isArray(codesystemDataArray)) {
      codesystemDataArray.forEach((codesystem: any) => {
        data.push({
          row_id: codesystem.id || '',
          observationtype: codesystem.observationtype || '',
          datatype: codesystem.datatype || '',
          encode: codesystem.encode || '',
          parameterlabel: codesystem.parameterlabel || '',
          encodesystem: codesystem.encodesystem || '',
          subid: codesystem.subid || '',
          description: codesystem.description || '',
          source: codesystem.source || '',
          channel: codesystem.channel || '',
          channelid: codesystem.channelid || '',

        });
      });
    } else {
      console.error('codesystem is invalid or empty.', codesystemDataArray);
    }

    return data;
  }

  public dataSource = computed<TableData[]>(() => this.filteredData().filter((data) =>
    data.encode.toLowerCase().includes(this.filterText().toLowerCase())));


  public displayedColumns = ['row_id', 'observationtype', 'datatype', 'encode', 'parameterlabel', 'encodesystem', 'subid', 'description',
    'source', 'channel', 'channelid'];

  ngOnInit(): void {
    // Get the id parameter from the route
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
      if (this.id) {
        this.queryCodesystemDetail(this.id);
      }
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

    this.queryCodesystemDetail(this.id, this.page); // 调用API重新加载对应页的数据
  }

  queryCodesystemDetail(id: string, page: number = 1) {
    this.errorMessage = '';
    this.codesystemData.set([]);

    this.codesystemService.getPaginatedCodesystemDetailById(id, page, this.pageSize).subscribe({
      next: (data) => {
        const result = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (result) {

          this.codesystemData.set(result.rows || []); // 设置新数据（响应式的信号更新）
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
          this.codesystemData.set([]);
          this.errorMessage = 'Server returned invalid data format';
          console.error("Server returned invalid data format", data);
        }

      },
      error: (err) => {
        this.codesystemData.set([]);
        this.errorMessage = err.message;
        console.error(err);
      },
    });
  }

}
