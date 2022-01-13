import { Component, OnInit } from '@angular/core';
import { first, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  currentUser: any;
  userLabel: string;

  currentUser$: Observable<any>;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.currentUser$.pipe(first()).subscribe((x: any) => {
      this.currentUser = x;
      this.userLabel = `${this.currentUser?.name} ${this.currentUser?.lastname}`;
    });
  }

  logout() {
    this.auth.logout();
  }
}
