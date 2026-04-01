import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsDropDownService } from '../../services/forms-drop-down-service';
import { State } from '../../models/state';
import { Country } from '../../models/country';
import { CheckoutFormValidator } from '../../validators/checkout-form-validator';

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
    private cd: ChangeDetectorRef
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
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required,
          Validators.minLength(2),CheckoutFormValidator.notOnlyWhiteSpace
        ]),
        cardNumber: new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        expirationMonth: new FormControl('',[Validators.required]),
        expirationYear: new FormControl('',[Validators.required]),
        securityCode: new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')])
      })
    })
    this.updateDropDownList();
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
    }
    console.log(`Customer first Name: ${this.checkoutFormGroup.get('customer')?.value.firstName}`);

    console.log(`Customer first Name: ${this.checkoutFormGroup.get('shippingAddress')?.value.state.name}`);
    console.log(`Customer first Name: ${this.checkoutFormGroup.get('shippingAddress')?.value.country.name}`);

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

  get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street')};
  get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city')};
  get shippingAddressZip() {return this.checkoutFormGroup.get('shippingAddress.zipCode')};
  get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country')};
  get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state')};

  get billingAddressStreet() {return this.checkoutFormGroup.get('billingAddress.street')};
  get billingAddressCity() {return this.checkoutFormGroup.get('billingAddress.city')};
  get billingAddressZip() {return this.checkoutFormGroup.get('billingAddress.zipCode')};
  get billingAddressCountry() {return this.checkoutFormGroup.get('billingAddress.country')};
  get billingAddressState() {return this.checkoutFormGroup.get('billingAddress.state')};

   get creditCardType() {return this.checkoutFormGroup.get('creditCard.cardType')};
  get creditCardNameOnCard() {return this.checkoutFormGroup.get('creditCard.nameOnCard')};
  get creditCardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber')};
  get creditCardSecurityCode() {return this.checkoutFormGroup.get('creditCard.securityCode')};
}
