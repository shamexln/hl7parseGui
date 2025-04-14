import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from '@odx/angular/components/header';
import {ButtonComponent} from '@odx/angular/components/button';
import {IconComponent} from '@odx/angular/components/icon';
import {MainMenuButtonDirective, MainMenuComponent} from '@odx/angular/components/main-menu';
import { MainMenuModule } from  '@odx/angular/components/main-menu';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, ButtonComponent, IconComponent, MainMenuButtonDirective, MainMenuComponent, MainMenuModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    class: 'odx-app'
  }

})
export class AppComponent {
  title:string = 'HL7 Parse Tool';
  subtitle: string = 'v1.0.0';
  copyright = '© Drägerwerk AG & Co. KGaA 2025';
}
