// listings.routes.ts
import { Routes } from '@angular/router';
import { ListingStep1Component } from './listing-step1/listing-step1.component';
import { Step2Component } from './step2.component/step2.component';
import { Step3Component } from './step3.component/step3.component';
import { Step4Component } from './step4.component/step4.component';
import { Step5Component } from './step5.component/step5.component';
import { Step6Component } from './step6.component/step6.component';
import { Step7Component } from './step7.component/step7.component';
import { Step8Component } from './step8.component/step8.component';
import { Step9Component } from './step9.component/step9.component';
import { Step10Component } from './step10.component/step10.component';
import { Step11Component } from './step11.component/step11.component';
import { Step12Component } from './step12.component/step12.component';
import { Step13Component } from './step13.component/step13.component';
import { Step14Component } from './step14.component/step14.component';
import { Step15Component } from './step15.component/step15.component';
import { Step16Component } from './step16.component/step16.component';
import { PropertyListComponent } from '../property-list/property-list';
import { EditPropertyComponent } from '../edit-property.component/edit-property.component';

export const listingsRoutes: Routes = [
  {
    path: 'listings',
    children: [
      { path: '', component: PropertyListComponent },


      { path: 'edit/:id', component: EditPropertyComponent },


      // ✅ Create Routes
      { path: 'create-listing', redirectTo: 'create/step-1', pathMatch: 'full' },
      { path: 'create/step-1', component: ListingStep1Component },
      { path: 'create/step-2', component: Step2Component },
      { path: 'create/step3', component: Step3Component },
      { path: 'create/step4', component: Step4Component },
      { path: 'create/step5', component: Step5Component },
      { path: 'create/step6', component: Step6Component },
      { path: 'create/step7', component: Step7Component },
      { path: 'create/step8', component: Step8Component },
      { path: 'create/step9', component: Step9Component },
      { path: 'create/step10', component: Step10Component },
      { path: 'create/step11', component: Step11Component },
      { path: 'create/step12', component: Step12Component },
      { path: 'create/step13', component: Step13Component },
      { path: 'create/step14', component: Step14Component },
      { path: 'create/step15', component: Step15Component },
      { path: 'create/step16', component: Step16Component },

     
    ],
  },
];
