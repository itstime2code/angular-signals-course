import {Injectable, Signal, WritableSignal, signal} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {

  #isLoading: WritableSignal<boolean> = signal(false);
  isLoading: Signal<boolean> = this.#isLoading.asReadonly();
  
  setLoadingState(isLoading: boolean) {
    this.#isLoading.set(isLoading);
  }
}
