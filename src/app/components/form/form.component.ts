import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { SendFormService } from 'src/app/services/send-form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public jsTechnologies: string[] = ["angular", "react", "vue"];
  public versions: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  }
  public maxDate: Date = new Date();

  constructor(
    public validationService: EmailValidationService,
    public sendFormService: SendFormService
  ) { }

  emailVal = () => (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (!c || c.value.length === 0) {
      return of(null);
    }
    return this.validationService.checkEmail(c)
  }

  form = new FormGroup({
    firstName: new FormControl<string>(""),
    lastName: new FormControl<string>(""),
    dateOfBirth: new FormControl<string>(""),
    framework: new FormControl(),
    frameworkVersion: new FormControl<string>({ value: "", disabled: true }),
    email: new FormControl<string>("", [Validators.email], this.emailVal()),
    hobbies: new FormArray([
      new FormGroup({
        name: new FormControl("", Validators.required),
        duration: new FormControl("", Validators.required)
      })
    ])
  })

  get email() {
    return this.form.controls['email']
  }

  //Submit
  submit(): void {
    console.log(this.form.value);
    if (this.form.valid) {
      console.log("Form is valid");
      // this.sendFormService.sendForm(this.form.value)
    } else {
      console.log("Form is invalid");
    }

  }
  //Datepicker
  changeFormat(): void {
    const dateOfBirthValue = moment(this.form.get('dateOfBirth')?.value).format("YYYY-MM-DD").toString();
    console.log(dateOfBirthValue);
    
    this.form.get('dateOfBirth')?.setValue(dateOfBirthValue);
  }
  //Framework version
  enableVersions(): void {
    this.form.get('frameworkVersion')?.enable();
  }
  getVersions(): string[] {
    return this.versions[this.form.get('framework')?.value]
  }

  //Hobbies group
  public hobbies = this.form.get("hobbies") as FormArray;
  getHobbyControls(): AbstractControl[] {
    return this.hobbies.controls;
  }
  addHobby(): void {
    if (this.hobbies.value[this.hobbies.length - 1].name && this.hobbies.value[this.hobbies.length - 1].duration) {
      this.hobbies.push(new FormGroup({
        name: new FormControl(""),
        duration: new FormControl("")
      }))
    }
    else {
      this.hobbies.markAllAsTouched();
    }
  }
  removeHobby(index: number): void {
    this.hobbies.removeAt(index);
  }
  showAddBtn(index: number): boolean {
    return this.hobbies.length - 1 === index;
  }
  showRemoveBtn(index: number): boolean {
    return index !== 0
  }
}
