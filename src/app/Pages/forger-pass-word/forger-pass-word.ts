import { ChangeDetectorRef, Component } from '@angular/core';
import { ForgetResetPassword } from '../../Core/Services/forget-reset-password';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IForgetPassWord } from '../../Core/Models/ireset-pass-word';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-forger-pass-word',
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './forger-pass-word.html',
  styleUrl: './forger-pass-word.css'
})
export class ForgerPassWord {

  constructor(private service: ForgetResetPassword , private router:Router , private cdr:ChangeDetectorRef) { }
  Message: string = '';

  forgetPasswordForm = new FormGroup({
    Email: new FormControl('', Validators.required)
  });

  ForgetPass() {
    console.log(this.forgetPasswordForm?.value);
    this.service.ForgetPassWord(this.forgetPasswordForm?.value as IForgetPassWord).subscribe({
      next: (response) => {

        console.log(response);
        this.Message = response;

        // this.router.navigate(['/ResetPassword']);

        this.cdr.detectChanges();

      }
    })
  }

}
