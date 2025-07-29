import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../Services/user-management-service';
import { IUser } from '../../Models/iuser';
import { IUserData } from '../../Models/iuser-data';
import { CommonModule } from '@angular/common';
import { IAddUser } from '../../Models/iadd-user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUserBan } from '../../Models/iuser-ban';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule , ReactiveFormsModule ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  AllUsers: IUser[] = [];
  UserData!: IUserData|null;
  UserBannedId!: number;

  constructor(private service: UserManagementService , private cdr:ChangeDetectorRef) { }
  ngOnInit(): void {

    this.GetAllUsers();


  }

  GetAllUsers() {
     this.service.GetAllUsers().subscribe({
      next: (response) => {
         this.AllUsers = response.filter(u => u.role != 'admin');
         this.FilteredUsers = [...this.AllUsers];
        // console.log(this.AllUsers);
        this.cdr.detectChanges();

      }
    })

  }

  GetUserData(id: number) {
    this.service.GetUserData(id).subscribe({
      next: (response) => {
        this.UserData = response;
        this.cdr.detectChanges();

      }
    })

  }



  AddUser(user:IAddUser) {
    this.service.AddUser(user).subscribe({
      next: (response) => {
        this.GetAllUsers();
        console.log(response);


      }
    })
  }


  AddUserForm = new FormGroup({
  email: new FormControl('',Validators.required),
  password:  new FormControl('',Validators.required),
  confirmPassword:  new FormControl('',Validators.required),
  firstName:  new FormControl('',Validators.required),
  lastName:  new FormControl('',Validators.required),
  phoneNumber:  new FormControl('',Validators.required),
  dateOfBirth:  new FormControl('',Validators.required),
  gender:  new FormControl('',Validators.required),

  })


  Data?: IAddUser ;



 SubmitAddUser() {
  this.Data = this.AddUserForm.value as IAddUser;

  if (this.AddUserForm.valid) {
    const payload: IAddUser = {
      ...this.Data,
      dateOfBirth: this.Data.dateOfBirth
        ? new Date(this.Data.dateOfBirth).toISOString()
        : null
    };

    this.service.AddUser(payload).subscribe({
      next: (response) => {
        console.log(response);
        this.GetAllUsers();

        // ✅ Hide Modal
        const modal = document.getElementById('addUserModal');
        if (modal) {
          const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
          bsModal.hide();
        }

        // ✅ Reset Form
        this.AddUserForm.reset();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
}


    FilteredUsers: IUser[] = []; // For displaying filtered data

  searchQuery: string = '';
  selectedRole: string = 'all';


onSearch(event: any) {
  this.searchQuery = event.target.value.toLowerCase();
  this.applyFilters();
}


   onRoleFilterChange(event: any) {
    this.selectedRole = event.target.value;
    this.applyFilters();
  }



 applyFilters() {
  this.FilteredUsers = this.AllUsers.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(this.searchQuery) ||
      user.lastName.toLowerCase().includes(this.searchQuery) ||
      user.email.toLowerCase().includes(this.searchQuery);

    const matchesRole =
      this.selectedRole === 'all' || user.role === this.selectedRole;

    return matchesSearch && matchesRole;
  });

  this.cdr.detectChanges();
}


  BanUserForm = new FormGroup({
    reason: new FormControl(''),
    banUntil: new FormControl(''),
  });




  BanUser(id: number) {

    this.UserBannedId = id;
    const modal = document.getElementById('banUserModal');
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();

    }
  }



  SubmitBanUser() {
    this.service.BanUser(this.UserBannedId, this.BanUserForm.value as IUserBan).subscribe({
      next: (response) => {
        console.log(response);
        this.cdr.detectChanges();
        this.GetAllUsers();
      },

      error: (error) => {
        console.log(error);

      }

    })
  }

}
