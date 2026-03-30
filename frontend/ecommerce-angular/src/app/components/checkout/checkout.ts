import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsDropDownService } from '../../services/forms-drop-down-service';
import { State } from '../../models/state';
import { Country } from '../../models/country';

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
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        expirationMonth: [''],
        expirationYear: [''],
        securityCode: ['']
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
      next:(data)=>{
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
      this.billingAddressStates =[];
    }
  }

 getStates(formGroupName: string): void{
  const formGroup = this.checkoutFormGroup.get(formGroupName)!;

  const countryCode = formGroup.value.country.code;

  console.log(`Country code: ${countryCode}`);

  this.formsDropDownService.getStateList(countryCode).subscribe({
    next:(data)=>{
      if(formGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      }else{
        this.billingAddressStates = data;
      }

      formGroup.get('state')?.setValue(data[0]);
    }
  })

 }
}
