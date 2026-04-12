import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { AuthService } from '@auth0/auth0-angular'

@Component({
  selector: 'app-login-status',
  standalone: false,
  templateUrl: './login-status.html',
  styleUrl: './login-status.css',
})
export class LoginStatus implements OnInit {
  isAuthenticated: boolean = false;
  profileJson: string | undefined;
  name: string | undefined;

  storage: Storage = sessionStorage;

  constructor(@Inject(AuthService) public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(
      (autheticated: boolean) => {
        this.isAuthenticated = autheticated;
        this.getUserDetails();
        console.log(`User is authenticated: ${this.isAuthenticated}`);
      },

    );

    this.auth.error$.subscribe(error => {
      console.error('Auth0 Error:', error);  // 
    });
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.auth.user$.subscribe((user) => {
        this.name = user?.name as string;

        const theEmail = user?.email as string;

        this.storage.setItem('userEmail', JSON.stringify(theEmail));
        this.storage.setItem('name', JSON.stringify(this.name));
        this.cd.detectChanges();
        console.log(`USER ID: ${this.name}`);
      })
    }

  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin
      }
    });
    this.storage.clear();
  }

}
