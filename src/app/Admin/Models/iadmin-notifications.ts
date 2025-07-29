import { INotificationReceiver } from "./inotification-receiver"

export interface IAdminNotifications {

  id?:number
   userId: number
  senderId: number
  message: string
   isRead?: boolean
  createdAt?: string
  user?: INotificationReceiver
}
