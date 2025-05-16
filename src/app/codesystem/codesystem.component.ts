import { Component, OnInit } from '@angular/core';
import {ButtonComponent, ButtonVariant} from '@odx/angular/components/button';
import {CodesystemService} from '../codesystem.service';
import {CodesystemMockService} from '../mock/codesystem-mock';
import {AreaHeaderComponent} from '@odx/angular/components/area-header';

@Component({
  selector: 'app-codesystem',
  imports: [
    ButtonComponent,
    AreaHeaderComponent
  ],
  templateUrl: './codesystem.component.html',
  styleUrl: './codesystem.component.css'
})
export class CodesystemComponent implements OnInit {

  public variantValue = ButtonVariant.SECONDARY;
  public codesystems: any[] = [];
  public loading = false;
  public error: string | null = null;

  constructor(private codesystemService: CodesystemMockService) {}

  ngOnInit(): void {
    // Load codesystems when component initializes
    this.fetchCodesystems();
  }

  fetchCodesystems() {
    this.loading = true;
    this.error = null;

    this.codesystemService.getCodesystem().subscribe({
      next: (response) => {
        this.codesystems = response;
        this.loading = false;
        console.log('Codesystem data:', response);
      },
      error: (error) => {
        this.error = 'Error fetching codesystem data';
        this.loading = false;
        console.error('Error fetching codesystem data:', error);
      }
    });
  }

  startEditing() {
    console.log('Edit button clicked');
    // Implement editing functionality here
  }
}
