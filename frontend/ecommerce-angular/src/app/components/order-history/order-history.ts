import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history-service';
import { OrderHistoryModel } from '../../models/order-history';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {

  orderHistoryList: OrderHistoryModel[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    const email = JSON.parse(this.storage.getItem("userEmail")!);

    this.orderHistoryService.getOrderHistory(email).subscribe({
      next: (data) => {
        this.orderHistoryList = data;
        console.log(`OrdeList ${this.orderHistoryList}`);
        this.cd.detectChanges();
      },
      error: (err) => {

      },
    })
  }

}
