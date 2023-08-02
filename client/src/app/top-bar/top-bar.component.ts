import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  username: string | null = '';
  ngOnInit() {
    this.username = localStorage.getItem('currentUserUsername');
  }
}
