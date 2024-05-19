import { Component } from '@angular/core';

@Component({
  selector: 'app-rapid-system',
  templateUrl: './rapid-system.component.html',
  styleUrls: ['./rapid-system.component.css']
})
export class RapidSystemComponent {
  selectedModuleEnum : number = 9;

  changeModule(moduleEnum : number){
    this.selectedModuleEnum = moduleEnum;
  }
}
