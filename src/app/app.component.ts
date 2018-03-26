import { Component } from '@angular/core';
import { ProviderService } from './provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'player';

  constructor(private provider: ProviderService){}

  testInit() {
    this.provider.initApi();
  }

  testQuery(){
    this.provider.execQ();
  }
  
}
