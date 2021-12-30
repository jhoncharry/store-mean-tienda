import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  currentUser: any;
  userLabel: string;

  currentUser$: Observable<any>;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((x: any) => {
      console.log('VALORRRRR', x);
      this.currentUser = x;
      this.userLabel = `${this.currentUser?.name} ${this.currentUser?.lastname}`;
    });
  }

  logout() {
    this.auth.logout();
  }
}
