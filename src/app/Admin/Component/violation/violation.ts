import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViolationService } from '../../Services/violation-service';
import { IPViolation } from '../../Models/ipviolation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-violation',
  imports: [CommonModule],
  templateUrl: './violation.html',
  styleUrl: './violation.css'
})
export class Violation implements OnInit {

   AllViolation: IPViolation[] = [];
   ViolationById?: IPViolation ;
   ViolationState?: IPViolation ;
  constructor(private violationService: ViolationService , private cdr:ChangeDetectorRef) { }

  GetDetails(id: number) {
    this.violationService.GetViolationById(id).subscribe({
      next: (response) => {
        this.ViolationById = response;
        this.cdr.detectChanges();
      }
    })





  }

  Reject(id: number, state: string) {
    const Status = JSON.stringify(state);

    this.violationService.EditViolationStatus(id, Status).subscribe({
      next: (response) => {
        console.log(response);

        this.cdr.detectChanges();
      }
    })

  }


  UnderReview(id: number, state: string) {
    const status = JSON.stringify(state);

    this.violationService.EditViolationStatus(id, status).subscribe({
      next: () => {
        this.cdr.detectChanges();
      }
    })

  }

  StatusToResolved(id: number, state: string) {
      const stringifiedState = JSON.stringify(state);


    this.violationService.EditViolationStatus(id,stringifiedState).subscribe({
      next: (response) => {
        // console.log(response);
        this.cdr.detectChanges();




      }
    })



  }



  ngOnInit(): void {
    this.violationService.GetAllViolations().subscribe({
      next: (response) => {
        this.AllViolation = response;
        this.cdr.detectChanges();

      }
    });



  }







}
