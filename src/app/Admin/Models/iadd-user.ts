export interface IAddUser {
   email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth?: string| null
  gender: string

}
