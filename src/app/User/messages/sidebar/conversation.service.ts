import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Conversation } from "../models/conversation";

@Injectable({providedIn:'root'})
export class ConversationService{
    private baseUrl='http://localhost:7145/api/Conversation';
    constructor(private http:HttpClient){}
    getUserConversations(userId:number):Observable<Conversation[]>{
        console.log('calling',`${this.baseUrl}/user/${userId}`)
        return this.http.get<Conversation[]>(`${this.baseUrl}/user/${userId}`)
    }
    getConversationDetails(id: number): Observable<Conversation> {
  return this.http.get<Conversation>(`http://localhost:7145/api/Conversation/${id}`);

}

}