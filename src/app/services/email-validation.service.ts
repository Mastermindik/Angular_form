import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {

  constructor(public http: HttpClient) { }

  checkEmail(c: any){
    return this.http.get('https://sss.com').pipe(
      catchError((res) => {
        delay(2000)
        return c.value === 'test@test.test' ? of({ fail: true }) : of(null)
      }))
  }
}


// .pipe(map(() => {
//   timer(2000); 
//   return email === 'test@test.test';
// }))