import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsDropDownService } from '../../services/forms-drop-down-service';
import { State } from '../../models/state';
import { Country } from '../../models/country';
import { CheckoutFormValidator } from '../../validators/checkout-form-validator';
import { CartService } from '../../services/cart-service';
import { CheckoutService } from '../../services/checkout-service';
import { Router } from '@angular/router';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { Purchase } from '../../models/purchase';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private formsDropDownService: FormsDropDownService,
    private cd: ChangeDetectorRef,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          CheckoutFormValidator.notOnlyWhiteSpace
          ]),
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          CheckoutFormValidator.notOnlyWhiteSpace
          ]),
        email: new FormControl('',
          [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
          ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          CheckoutFormValidator.notOnlyWhiteSpace
          ]
        ),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          CheckoutFormValidator.notOnlyWhiteSpace
          ]
        ),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          CheckoutFormValidator.notOnlyWhiteSpace
          ]
        )
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          CheckoutFormValidator.notOnlyWhiteSpace
          ]
        ),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          CheckoutFormValidator.notOnlyWhiteSpace
          ]
        ),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          CheckoutFormValidator.notOnlyWhiteSpace
          ]
        )
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required,
        Validators.minLength(2), CheckoutFormValidator.notOnlyWhiteSpace
        ]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')])
      })
    })
    this.updateDropDownList();
    this.reviewCartDetails();
  }
  reviewCartDetails() {
    //subscribe to total price
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    )
    //Subscribe to total quantity
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    )
  }

  updateDropDownList(): void {

    //fetch months details
    const theStartMonth: number = new Date().getMonth() + 1;
    console.log(`Current Month: ${theStartMonth}`);
    this.formsDropDownService.getCreditCardMonths(theStartMonth).subscribe(
      data => {
        console.log('Retrived Credit Months :' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //fetch years details
    this.formsDropDownService.getCreditCardYears().subscribe({
      next: (data) => {
        console.log(`Retrieved Credit Years: ${JSON.stringify(data)}`);
        this.creditCardYears = data;
      },
    })

    //populate Countries
    this.formsDropDownService.getCountryList().subscribe({
      next: (data) => {
        console.log(`Retrieved countries : ${JSON.stringify(data)}`);
        this.countries = data;
        this.cd.detectChanges();
      }
    });

  }

  handleMonthsAndYear(): void {
    const form = this.checkoutFormGroup.get('creditCard')!;

    const currentYear = new Date().getFullYear();
    const selectedYear = Number(form.value.expirationYear);

    const theStartMonth = (currentYear === selectedYear) ? new Date().getMonth() + 1
      : 1;

    this.formsDropDownService.getCreditCardMonths(theStartMonth).subscribe(
      data => {
        console.log('Retrived Credit Months :' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

  onSubmit(): void {
    console.log(`Handling the submit button`);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart Items
    const cartItem = this.cartService.cartItem;

    //create orderitem from cartItems
    let orderItem: OrderItem[] = cartItem.map(item => new OrderItem(item));

    //setup  purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
   
    //populate purchase - billing address
 purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    
    //populate purchase order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItem;

    //call the rest api
    this.checkoutService.placeOrder(purchase).subscribe({
      next:(response: any)=>{
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

        //reset the cart
        this.resetCart();
      },
      error:(err) =>{
        alert(`There was an error: ${err}`);
      }
    })
  }

  resetCart(): void{
    //reset cart data
    this.cartService.cartItem =[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset form
    this.checkoutFormGroup.reset();

    //navigate to main page
    this.router.navigateByUrl("/products");
  }

  copyShippingToBillingAddress(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  getStates(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName)!;

    const countryCode = formGroup.value.country.code;

    console.log(`Country code: ${countryCode}`);

    this.formsDropDownService.getStateList(countryCode).subscribe({
      next: (data) => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        formGroup.get('state')?.setValue(data[0]);
      }
    })

  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName') };
  get lastName() { return this.checkoutFormGroup.get('customer.lastName') };
  get email() { return this.checkoutFormGroup.get('customer.email') };

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street') };
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city') };
  get shippingAddressZip() { return this.checkoutFormGroup.get('shippingAddress.zipCode') };
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country') };
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state') };

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street') };
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city') };
  get billingAddressZip() { return this.checkoutFormGroup.get('billingAddress.zipCode') };
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country') };
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state') };

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType') };
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard') };
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber') };
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode') };
}
