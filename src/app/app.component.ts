import { Component, HostListener } from '@angular/core';
import { ProviderService } from './provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostListener('window:beforeunload')
  saveData(){
    this.provider.localStorageSaveData();
  }

  display: number = 0;
  top = 0;
  height = 0;
  width = 0;
  constructor(private provider: ProviderService){}

  ngOnInit() {
    this.provider.localStorageGetData();
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    if(window.innerWidth>599){
      this.top = 64;
    }else{
      this.top = 56;
    }
  }
  changeView(view){
    this.display = view;
  }
  condChangeView(){
    if(this.display!=0){
      this.display=0;
    }
  }
}
