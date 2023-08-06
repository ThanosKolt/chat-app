import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  username: string | null = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('currentUserUsername');
  }

  onLogout() {
    localStorage.removeItem('currentUserUsername');
    localStorage.removeItem('currentUserId');
    this.router.navigate(['/login']);
  }
}
