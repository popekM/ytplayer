import { Component } from '@angular/core';
import { ProviderService } from './provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  display: number = 0;

  constructor(private provider: ProviderService){}

  changeView(view){
    this.display = view;
  }
  condChangeView(){
    if(this.display!=0){
      this.display=0;
    }
  }
}
