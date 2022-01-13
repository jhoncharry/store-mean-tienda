import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
  styleUrls: ['./index-review.component.css'],
})
export class IndexReviewComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  public reviews: Array<any> = [];

  public page = 1;
  public pageSize = 15;

  private id: any;

  constructor(
    private clientService: ClienteService,
    private auth: AuthService
  ) {
    this.auth.currentUser$.pipe(first()).subscribe({
      next: (resp: any) => {
        const { _id } = resp || null;

        this.id = _id;

        this.load_data = false;
      },
      error: (error) => {
        console.log('error', error);
        this.load_data = false;
      },
    });
  }

  ngOnInit(): void {
    this.clientService.getReviewsClient(this.id).subscribe((response: any) => {
      this.reviews = response.data;
      this.load_data = false;
    });
  }
}
