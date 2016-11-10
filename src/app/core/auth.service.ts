import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  lock = new Auth0Lock('[YOUR_AUTH0_CLIENT_ID]', '[YOUR_AUTH0_CLIENT_DOMAIN].auth0.com', {});
  userProfile: Object;

  constructor() {
    this.userProfile = JSON.parse(localStorage.getItem('profile'));

    // Add callback for lock 'authenticated' event
    this.lock.on('authenticated',
      (authResult) => {
        localStorage.setItem('id_token', authResult.idToken);

        this.lock.getProfile(authResult.idToken, (error, profile) => {
          if (error) {
            throw Error('There was an error retrieving profile data!');
          }

          localStorage.setItem('profile', JSON.stringify(profile));
          this.userProfile = profile;
        });
      }
    );
  }

  login() {
    // Call the show method to display the Lock widget
    this.lock.show();
  }

  authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  logout() {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = undefined;
  }

}
