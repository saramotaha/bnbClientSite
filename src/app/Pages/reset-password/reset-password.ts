import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForgetResetPassword } from '../../Core/Services/forget-reset-password';
import { IResetPassWord } from '../../Core/Models/ireset-pass-word';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

   resetForm = new FormGroup({
    newPassword: new FormControl('', Validators.required)
   });

  newData!: IResetPassWord;


  constructor(private service: ForgetResetPassword, private route: ActivatedRoute) {


  }
  ngOnInit(): void {

   this.newData = {
    email: this.route.snapshot.queryParamMap.get('email')!,
    token:decodeURIComponent(this.route.snapshot.queryParamMap.get('token')!),
    newPassword: this.resetForm?.value.newPassword!


  }

  }








  ResetPass() {
    this.newData.newPassword = this.resetForm?.value?.newPassword ?? '';
    this.service.ResetPassWord(this.newData).subscribe({
      next: (response) => {

        console.log(response);


      }
    })

  }
}
