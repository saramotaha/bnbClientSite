import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { BookingService } from '../../../Booking/Service/booking-service';
import { Router } from '@angular/router';
import { IbookingCreate } from '../../../Booking/Model/ibooking-create';




import { BookingPaymentService } from '../../../Booking/Service/booking-payment-service';
import { FormsModule } from '@angular/forms';
import { PropertydetailsCalendar } from '../propertydetails-calendar/propertydetails-calendar';
import { IPropertyList } from '../../../../Core/Models/iproperty-list';
import { PropertyDetailsService } from '../../property-details/property-details-service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../Pages/Auth/auth.service';
@Component({
  selector: 'app-propertybookingcard' ,

  imports: [PropertydetailsCalendar, FormsModule, CommonModule ],

templateUrl: './propertybookingcard.html',
  styleUrl: './propertybookingcard.css'
})
export class Propertybookingcard {
  // Inputs and Outputs from your reference
  @Input() bookingDetails!: IbookingCreate // Added as per reference
  @Input() propertyId !: number // Added as per reference
  @Output() datesSelected = new EventEmitter<{ checkIn: string; checkOut: string }>() // Added as per reference
  @Input() selectedCheckIn: string = ''
  @Input() selectedCheckOut: string = ''

  // Calendar state from reference
  propertyDetails!: IPropertyList
  checkInDate: Date | null = null
  checkOutDate: Date | null = null
  guestInputError: string = "";

  totalPrice = 0 // Matches reference variable name
  rangeUnavailableMessage: string | null = null
  currentMonth1: Date = new Date()
  currentMonth2: Date = new Date(new Date().setMonth(new Date().getMonth() + 1))
  days1: (Date | null)[][] = []
  days2: (Date | null)[][] = []

  // Booking card specific state (kept for existing UI functionality)
  activeInput: "checkin" | "checkout" = "checkin"
  guestCount = 1
  showCalendar = false
  finalPriceDisplay = 0 // This is for the top-level price display

  availableDatesMap: Map<string, boolean> = new Map()

  constructor(
    private PropertyDetails: PropertyDetailsService,
    private bookingService: BookingService,
    private bookingPaymentService: BookingPaymentService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private AutProService: AuthService
  ) {}

  ngOnInit() {
    // Normalize initial months to start of day
    this.currentMonth1.setHours(0, 0, 0, 0)
    this.currentMonth2.setHours(0, 0, 0, 0)

    this.PropertyDetails.getPropertyDetailsById(this.propertyId).subscribe({
      next: (data) => {
        this.propertyDetails = data
        this.mapAvailabilityDates()
        this.generateCalendar()
        
        console.log("Property Details AvailabilityDates:", this.propertyDetails.availabilityDates) // Added console.log as per reference
        this.cdr.detectChanges() // Ensure the view updates with new data
      },
      error: (err) => {
        console.error("Error fetching property details:", err)
        // Fallback to ensure propertyDetails is defined, preventing errors in other functions

        this.mapAvailabilityDates() // Try to map even if empty
        this.generateCalendar() // Regenerate calendar with fallback data
        this.cdr.detectChanges()
      },
    })

    this.updateGuestDisplay()
    this.updateDisplays() // Initialize date displays and close button state
    this.calculateFinalPrice() // Calculate initial price
  }

  ngOnChanges(): void {
    // Added ngOnChanges as per reference
    if (this.propertyDetails?.availabilityDates) {
      this.mapAvailabilityDates()
    }
  }


  // @HostListener("document:click", ["$event"])
  // onClick(event: MouseEvent) {
  //   const calendarDropdown = document.getElementById("calendar-dropdown")
  //   const dateInputsSection = document.querySelector(".date-inputs-section")

  //   // If calendar is open and click is outside the date inputs and calendar itself
  //   if (
  //     this.showCalendar &&
  //     dateInputsSection &&
  //     calendarDropdown &&
  //     !dateInputsSection.contains(event.target as Node) &&
  //     !calendarDropdown.contains(event.target as Node)
  //   ) {

      
  //     // this.closeCalendar(); 
  //     // Reverted to close only if both dates are selected, to match reference's close button disabled state
  //     if (this.checkInDate && this.checkOutDate) {
  //       this.closeCalendar()
  //     } else {
  //       // Optionally, you can still alert or prevent closing if dates are not selected
  //       // alert("Please select both check-in and check-out dates before closing.");
  //     } 
     
  //   }
  // }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
  const path = event.composedPath(); // handles shadow DOM, nested elements
  const isClickInside = path.some((el: any) => {
    return el?.id === 'calendar-dropdown' || el?.classList?.contains('date-inputs-section');
  });

  if (!isClickInside && this.showCalendar) {
    this.closeCalendar();
  }
}
  openCalendar(type: "checkin" | "checkout") {
    this.activeInput = type
    this.showCalendar = true
    this.updateInputStates()
    this.generateCalendar() // Re-generate calendar to ensure correct highlights
  }

  closeCalendar() {
    // Reverted to close only if both dates are selected, to match reference's close button disabled state
   /*  if (this.checkInDate|| this.checkOutDate) {
      this.showCalendar = false
      // this.updateInputStates()
    } else {
      alert("Please select both check-in and check-out dates")
    } */
    this.showCalendar = false
      this.updateInputStates()
  }

  updateInputStates() {
    const checkinContainer = document.getElementById("checkin-container")
    const checkoutContainer = document.getElementById("checkout-container")

    if (checkinContainer) checkinContainer.classList.toggle("active", this.activeInput === "checkin")
    if (checkoutContainer) checkoutContainer.classList.toggle("active", this.activeInput === "checkout")
  }

  updateCloseButton() {
    const closeBtn = document.getElementById("close-btn") as HTMLButtonElement
    if (closeBtn) {
      // Keep disabled state as per reference HTML's [disabled] binding
      closeBtn.disabled = !(this.checkInDate && this.checkOutDate)
      closeBtn.textContent = this.checkInDate && this.checkOutDate ? "Close" : "Select dates"
    }
  }



  changeGuests(change: number) {
  const maxGuests = this.propertyDetails?.maxGuests || 10; // fallback to 10 if undefined
  const newCount = this.guestCount + change;

  if (newCount >= 1 && newCount <= maxGuests) {
    this.guestCount = newCount;
    this.updateGuestDisplay();
    this.calculateFinalPrice();
        this.guestInputError = ''; // Clear error message on valid input

  }else {
    this.guestInputError = `Maximum allowed guests is ${maxGuests}.`;
  }
}
  /* setGuestsFromInput() {
    const input = document.getElementById("guest-input") as HTMLInputElement
    const value = Number.parseInt(input.value)

    if (value >= 1 && value <= 10) {
      this.guestCount = value
      this.updateGuestDisplay()
      this.calculateFinalPrice()
    } else {
      // Reset input to current valid value
      input.value = this.guestCount.toString()
    }
  } */
 setGuestsFromInput() {
  const input = document.getElementById("guest-input") as HTMLInputElement;
  const value = Number.parseInt(input.value);

  const maxGuests = this.propertyDetails?.maxGuests || 10; // fallback if undefined

  if (value >= 1 && value <= maxGuests) {
    this.guestCount = value;
    this.updateGuestDisplay();
    this.calculateFinalPrice();
    this.guestInputError = ''; // Clear error message on valid input
  } else {
     // Set error message
    this.guestInputError = `Maximum allowed guests is ${maxGuests}.`;
    // Reset input to current valid value if out of range
    input.value = this.guestCount.toString();
  }
}


  updateGuestDisplay() {
    const guestText = this.guestCount === 1 ? "1 guest" : `${this.guestCount} guests`
    const guestDisplay = document.getElementById("guest-display")
    const guestInput = document.getElementById("guest-input") as HTMLInputElement
    const guestMinusBtn = document.getElementById("guest-minus") as HTMLButtonElement
    const guestPlusBtn = document.getElementById("guest-plus") as HTMLButtonElement

    if (guestDisplay) guestDisplay.textContent = guestText
    if (guestInput) guestInput.value = this.guestCount.toString()

    if (guestMinusBtn) guestMinusBtn.disabled = this.guestCount <= 1
    if (guestPlusBtn) guestPlusBtn.disabled = this.guestCount >= 10
  }

  // --- Calendar Logic from Reference ---

  mapAvailabilityDates(): void {
    this.availableDatesMap.clear()
    const availabilityList = this.propertyDetails?.availabilityDates ?? []
    for (const entry of availabilityList) {
      const key = new Date(entry.date).toLocaleDateString("en-CA")
      // Mark explicitly blocked/unavailable dates
      if (!entry.isAvailable) {
        this.availableDatesMap.set(key, false) // only store blocked ones
      }
    }
  }

  generateCalendar() {
    const days1Flat = this.getMonthDays(this.currentMonth1)
    const days2Flat = this.getMonthDays(this.currentMonth2)
    this.days1 = this.chunkArray(days1Flat, 7)
    this.days2 = this.chunkArray(days2Flat, 7)
    console.log("Days for current month 1:", this.days1) // Debugging log
    console.log("Days for current month 2:", this.days2) // Debugging log
  }

  getMonthDays(monthDate: Date): (Date | null)[] {
    const days: (Date | null)[] = []
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const totalDays = new Date(year, month + 1, 0).getDate()
    const startDayOfWeek = firstDay.getDay()

    // Padding before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // Fill in actual days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d)
      date.setHours(0, 0, 0, 0) // Normalize date
      days.push(date)
    }
    return days
  }

  chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size))
    }
    return result
  }

  isAvailable(date: Date | null): boolean {
    if (!date) return false
    const key = date.toLocaleDateString("en-CA")
    // Default is available unless explicitly marked unavailable
    return this.availableDatesMap.get(key) !== false
  }

  selectDate(day: Date | null): void {
    if (!day || !this.isAvailable(day)) return // Do not select if null or unavailable

    day.setHours(0, 0, 0, 0) // Normalize selected day

    this.rangeUnavailableMessage = null

    if (!this.checkInDate || (this.checkInDate && this.checkOutDate)) {
      // Start a new selection or reset if both were already selected
      this.checkInDate = day
      this.checkOutDate = null
      this.activeInput = "checkout" // Move to selecting checkout
    } else if (this.checkInDate && !this.checkOutDate) {
      // Selecting check-out date
      if (day > this.checkInDate) {
        if (this.isRangeAvailable(this.checkInDate, day)) {
          this.checkOutDate = day
          this.totalPrice = this.getNights() * this.getNightlyRate() // Matches reference
          this.datesSelected.emit({
            checkIn: this.checkInDate.toLocaleDateString("en-CA"),
            checkOut: this.checkOutDate.toLocaleDateString("en-CA"),
            
          }) // Emitting as per reference
        } else {
          this.rangeUnavailableMessage = "Selected range includes unavailable dates. Please choose another range."
          this.checkInDate = null
          this.checkOutDate = null
          this.totalPrice = 0 // Reset total price
        }
      } else {
        // If selected day is before or same as check-in, make it the new check-in
        this.checkInDate = day
        this.checkOutDate = null
      }
    }
    this.showCalendar = true;
    this.updateDisplays() // Keep for UI update
    this.updateInputStates() // Keep for UI update
    this.updateCloseButton() // Keep for UI update
    this.calculateFinalPrice() // Keep for UI update of top-level price
    this.generateCalendar() // Re-generate calendar to update highlights
  }

 
  confirmSelection() {
    // This function exists in your reference, but its body is commented out.
    // Keeping it here for structural consistency.
    if (this.checkInDate && this.checkOutDate) {
      this.datesSelected.emit({
        checkIn: this.checkInDate.toLocaleDateString("en-CA"),
        checkOut: this.checkOutDate.toLocaleDateString("en-CA"),
      })
    }
  }

  isRangeAvailable(start: Date, end: Date): boolean {
    const current = new Date(start)
    current.setHours(0, 0, 0, 0) // Normalize
    current.setDate(current.getDate() + 1) // Skip check-in day

    while (current < end) {
      const dateStr = current.toLocaleDateString("en-CA")
      // ❗ Only block if date is **explicitly set to false**
      if (this.availableDatesMap.get(dateStr) === false) {
        return false // One or more days unavailable
      }
      current.setDate(current.getDate() + 1)
    }
    return true
  }

  isStartDate(date: Date | null): boolean {
    if (!date || !this.checkInDate) return false
    return date.getTime() === this.checkInDate.getTime()
  }

  isEndDate(date: Date | null): boolean {
    if (!date || !this.checkOutDate) return false
    return date.getTime() === this.checkOutDate.getTime()
  }

  isInRange(date: Date | null): boolean {
    if (!date || !this.checkInDate || !this.checkOutDate) return false
    const time = date.getTime()
    const startTime = this.checkInDate.getTime()
    const endTime = this.checkOutDate.getTime()
    if (time <= startTime || time >= endTime) return false
    const key = date.toLocaleDateString("en-CA")
    return this.availableDatesMap.get(key) !== false // ✅ not explicitly blocked
  }

  clearDates(): void {
    this.checkInDate = null
    this.checkOutDate = null
    this.totalPrice = 0
    this.rangeUnavailableMessage = null
    this.activeInput = "checkin" // Reset active input
    this.updateDisplays() // Keep for UI update
    this.updateInputStates() // Keep for UI update
    this.updateCloseButton() // Keep for UI update
    this.calculateFinalPrice() // Keep for UI update of top-level price
    this.generateCalendar() // Re-generate calendar to clear highlights
  }

  getNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0
    const diff = this.checkOutDate.getTime() - this.checkInDate.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  getNightlyRate(): number {
    return this.propertyDetails?.pricePerNight || 0 // Use propertyDetails price
  }

  prev(): void {
    this.currentMonth1 = new Date(this.currentMonth1.setMonth(this.currentMonth1.getMonth() - 1))
    this.currentMonth2 = new Date(this.currentMonth2.setMonth(this.currentMonth2.getMonth() - 1))
    this.generateCalendar()
  }

  next(): void {
    this.currentMonth1 = new Date(this.currentMonth1.setMonth(this.currentMonth1.getMonth() + 1))
    this.currentMonth2 = new Date(this.currentMonth2.setMonth(this.currentMonth2.getMonth() + 1))
    this.generateCalendar()
  }

  // --- End Calendar Logic from Reference ---

  updateDisplays() {
    const checkinDisplayEl = document.getElementById("checkin-display")
    const checkoutDisplayEl = document.getElementById("checkout-display")

    const checkinDisplay = this.checkInDate ? this.formatDate(this.checkInDate) : "Add date"
    const checkoutDisplay = this.checkOutDate ? this.formatDate(this.checkOutDate) : "Add date"

    if (checkinDisplayEl) checkinDisplayEl.textContent = checkinDisplay
    if (checkoutDisplayEl) checkoutDisplayEl.textContent = checkoutDisplay

    // Update nights count and date range
    const nightsCountEl = document.getElementById("nights-count")
    const dateRangeEl = document.getElementById("date-range")

    if (nightsCountEl && dateRangeEl) {
      if (this.checkInDate && this.checkOutDate) {
        const nights = this.getNights()
        nightsCountEl.textContent = `${nights} night${nights > 1 ? "s" : ""}`
        dateRangeEl.textContent = `${this.formatLongDate(this.checkInDate)} - ${this.formatLongDate(this.checkOutDate)}`
      } else if (this.checkInDate) {
        nightsCountEl.textContent = "Select checkout date"
        dateRangeEl.textContent = `${this.formatLongDate(this.checkInDate)} - Add checkout date`
      } else {
        nightsCountEl.textContent = "Select dates"
        dateRangeEl.textContent = "Add your travel dates for exact pricing"
      }
    }
  }

  formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  formatLongDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  calculateFinalPrice() {
    // This function updates the top-level finalPriceDisplay
    const nights = this.getNights()
    const nightlyRate = this.getNightlyRate()
    let calculatedPrice = 0

    if (nights > 0) {
      calculatedPrice = nightlyRate * nights + Math.max(0, this.guestCount - 1) * 20 // Assuming 20 is additional guest cost
    }

    // The totalPrice for the calendar header is updated directly in selectDate and clearDates.
    // This finalPriceDisplay is for the top of the card.
    this.finalPriceDisplay = calculatedPrice/* .toLocaleString("en-US", {
      style: "currency",
      currency: "$",
      minimumFractionDigits: 0,
    }) */
  }
reserve() {
  if (!this.checkInDate || !this.checkOutDate) {
    alert('Please select check-in and check-out dates');
    return;
  }

  // Validate amount
  if (this.finalPriceDisplay <= 0 || isNaN(this.finalPriceDisplay)) {
    alert('Invalid amount');
    return;
  }
  const userId =(this.AutProService.currentUser); // Assuming you have a method to get the current user's ID
  const paymentData = {
    guestId: (Number(userId)), // Assuming a static guest ID for now
    propertyId: this.propertyId,
    startDate: this.checkInDate.toISOString().split('T')[0],
    endDate: this.checkOutDate.toISOString().split('T')[0],
    totalGuests: this.guestCount,
    promotionId:  0,
    amount: this.finalPriceDisplay
  };

  console.log('Submitting payment data:', paymentData);

  this.bookingPaymentService.getPaymentUrl(paymentData).subscribe({
    next: (response) => {
      if (response?.url) {
        window.location.href = response.url;
      } else {
        alert('Payment URL not received');
      }
    },
    error: (err) => {
      console.error('Payment Error:', err);
      alert(`Payment failed: ${err.message}`);
    }
  });
}

}
