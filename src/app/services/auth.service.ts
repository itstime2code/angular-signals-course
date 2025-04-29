import {computed, effect, inject, Injectable, signal} from "@angular/core";
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  router = inject(Router);

  #user = signal<User| null>(null);
  user = this.#user.asReadonly();
  isLoggedIn = computed(() => !!this.user());

  constructor() {
    this.loadUserFromStorage();
    
    effect(() => {
      const user = this.user();
      if (user) {
        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(user)
        );
      }
    })
  }

  loadUserFromStorage() {
    const json = localStorage.getItem(USER_STORAGE_KEY);
    if (json) {
      const user = JSON.parse(json);
      this.#user.set(user);
    }
  }

  async login(email: string, password: string): Promise<User> {
      const login$ = this.http.post<User>(
        `${environment.apiRoot}/login`,
        { email, password }
      );
      const user = await firstValueFrom(login$);
      this.#user.set(user);
      return user;
  }

  async logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.#user.set(null);
    await this.router.navigateByUrl('/login');
  }
}
