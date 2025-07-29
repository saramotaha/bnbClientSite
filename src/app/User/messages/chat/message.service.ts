import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn:'root'})
export class messageService {
    constructor(private http:HttpClient){}
    sendMessage(dto:{content:string;senderId:number;receiverId:number}){
return this.http.post('https://localhost:7145/api/Message/send', dto)    }
}