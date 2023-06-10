import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendFormService {

  constructor(public http: HttpClient) { }

  sendForm(body: object) {
    this.http.post("https://someapi", body)
  }
}
