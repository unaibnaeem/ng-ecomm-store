import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private resetHomePageSubject = new BehaviorSubject<boolean>(false);
  resetHomePage$ = this.resetHomePageSubject.asObservable();

  private pageSubject = new BehaviorSubject<number>(1);
  page$ = this.pageSubject.asObservable();

  constructor() {}

  triggerHomeReset() {
    this.resetHomePageSubject.next(true);
  }

  setPage(page: number) {
    this.pageSubject.next(page);
  }

  resetPage() {
    this.pageSubject.next(1);
  }
}
