import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  user: User;

  userActions: MenuItem[];
  constructor(public authService: AuthService) {
  }
  ngOnInit() {
    this.authService.user$.pipe(filter((user) => user != null)).subscribe((user) => {
      this.user = user;
      this.userActions = [
        {label: 'ORCID Profile',  icon: 'pi pi-fw pi-external-link', url: `https://orcid.org/${this.idFromSub(user.sub)}`},
        {label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: e => this.logout()}
      ];
    });
  }

  /**
   *  Transforms the authId sub to just the orcId.
   *
   *  @param sub the auth0 id with leading information
   *  @returns only the orcid.
   */
  idFromSub(sub: string) {
    return sub.split('|')[2];
  }

  /**
   * Logout but override the redirect.
   */
  logout() {
    this.authService.logout({
      openUrl() {
        window.location.replace(window.location.origin);
      }
    });
  }
}
