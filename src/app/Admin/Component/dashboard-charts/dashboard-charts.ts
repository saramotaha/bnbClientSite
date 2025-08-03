import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { Chart,  registerables,ChartConfiguration, ChartType } from 'chart.js'
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';

Chart.register(...registerables);

interface ReviewStatsResponse {
  totalReviews: number
  avgRating: number
  reviewsPerMonth: Array<{
    year: number
    month: number
    count: number
  }>
}

interface BookingStatsResponse {
  totalBookings: number
  monthlyBookings: Array<{
    year: number
    month: number
    count: number
  }>
}

interface IncomeStatsResponse {
  income: number
  monthlyIncome: Array<{
    year: number
    month: number
    income: number
  }>
}
@Component({
  selector: 'app-dashboard-charts',
  standalone:true,
  imports: [CommonModule],
templateUrl: './dashboard-charts.html',
  styleUrl: './dashboard-charts.css'

})
export class DashboardCharts implements OnInit, AfterViewInit {
  @ViewChild("bookingsChartCanvas") bookingsChartCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("incomeChartCanvas") incomeChartCanvas!: ElementRef<HTMLCanvasElement>
  @ViewChild("donutChartCanvas") donutChartCanvas!: ElementRef<HTMLCanvasElement>

  isLoading = false
  totalBookings = 8426
  totalIncome = 2847650
  distributionData = [
    { label: "Jan 2024", value: 680 },
    { label: "Feb 2024", value: 750 },
    { label: "Mar 2024", value: 820 },
    { label: "Apr 2024", value: 950 },
    { label: "May 2024", value: 1100 },
    { label: "Jun 2024", value: 1250 },
    { label: "Jul 2024", value: 1400 },
  ]

  private bookingsChart?: Chart
  private incomeChart?: Chart
  private donutChart?: Chart

  // Mock data for immediate display
  private mockBookingData = [
    { year: 2024, month: 1, count: 680 },
    { year: 2024, month: 2, count: 750 },
    { year: 2024, month: 3, count: 820 },
    { year: 2024, month: 4, count: 950 },
    { year: 2024, month: 5, count: 1100 },
    { year: 2024, month: 6, count: 1250 },
    { year: 2024, month: 7, count: 1400 },
  ]

  private mockIncomeData = [
    { year: 2024, month: 1, income: 285000 },
    { year: 2024, month: 2, income: 320000 },
    { year: 2024, month: 3, income: 380000 },
    { year: 2024, month: 4, income: 420000 },
    { year: 2024, month: 5, income: 485000 },
    { year: 2024, month: 6, income: 520000 },
    { year: 2024, month: 7, income: 580000 },
  ]

  // Airbnb Color Palette
  private readonly airbnbColors = {
    rausch: "#FF5A5F",
    babu: "#00A699",
    arches: "#FC642D",
    hof: "#484848",
    foggy: "#767676",
    pink: "#FF385C",
    teal: "#008489",
    orange: "#FD5861",
    purple: "#9C4DCC",
    blue: "#0F7488",
    donutColors: ["#FF5A5F", "#00A699", "#FC642D", "#FF385C", "#008489", "#FD5861", "#9C4DCC", "#0F7488"],
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log("Component initialized with Airbnb styling")
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createAllCharts()
      this.loadRealData()
    }, 100)
  }

  private createAllCharts(): void {
    console.log("Creating Airbnb-styled charts...")
    this.createBookingsChart(this.mockBookingData)
    this.createIncomeChart(this.mockIncomeData)
    this.createDonutChart(this.distributionData)
  }

  private loadRealData(): void {
    this.http.get<BookingStatsResponse>("http://localhost:7145/api/Dashboard/bookingStats").subscribe({
      next: (res) => {
        console.log("Real booking data loaded:", res)
        this.totalBookings = res.totalBookings
        this.createBookingsChart(res.monthlyBookings)

        this.distributionData = res.monthlyBookings.map((item) => ({
          label: this.getMonthName(item.month, item.year),
          value: item.count,
        }))
        this.createDonutChart(this.distributionData)
      },
      error: (error) => {
        console.log("Using mock data for bookings:", error)
      },
    })

    this.http.get<IncomeStatsResponse>("http://localhost:7145/api/Dashboard/hostingIncome").subscribe({
      next: (res) => {
        console.log("Real income data loaded:", res)
        this.totalIncome = res.income
        this.createIncomeChart(res.monthlyIncome)
      },
      error: (error) => {
        console.log("Using mock data for income:", error)
      },
    })
  }

  private getMonthName(month: number, year: number): string {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${monthNames[month - 1]} ${year}`
  }

  private createBookingsChart(data: Array<{ year: number; month: number; count: number }>): void {
    if (!this.bookingsChartCanvas?.nativeElement) return

    const ctx = this.bookingsChartCanvas.nativeElement.getContext("2d")
    if (!ctx) return

    if (this.bookingsChart) {
      this.bookingsChart.destroy()
    }

    const labels = data.map((m) => this.getMonthName(m.month, m.year))
    const values = data.map((m) => m.count)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    gradient.addColorStop(0, this.airbnbColors.rausch)
    gradient.addColorStop(1, this.airbnbColors.pink)

    this.bookingsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Monthly Bookings",
            data: values,
            backgroundColor: gradient,
            borderColor: this.airbnbColors.rausch,
            borderWidth: 0,
            borderRadius: 12,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(34, 34, 34, 0.95)",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",
            borderColor: this.airbnbColors.rausch,
            borderWidth: 2,
            cornerRadius: 12,
            displayColors: false,
            titleFont: {
              size: 14,
              weight: "normal",
            },
            bodyFont: {
              size: 13,
              weight: "normal",
            },
            callbacks: {
              title: (context) => `${context[0].label}`,
              label: (context) => `${context.parsed.y.toLocaleString()} bookings`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#767676",
              font: {
                size: 12,
                weight: "normal",
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(235, 235, 235, 0.5)",
            },
            ticks: {
              color: "#767676",
              font: {
                size: 12,
                weight: "normal",
              },
              callback: (value) => (typeof value === "number" ? value.toLocaleString() : value),
            },
          },
        },
        animation: {
          duration: 1200,
          easing: "easeOutQuart",
        },
      },
    })
  }

  private createIncomeChart(data: Array<{ year: number; month: number; income: number }>): void {
    if (!this.incomeChartCanvas?.nativeElement) return

    const ctx = this.incomeChartCanvas.nativeElement.getContext("2d")
    if (!ctx) return

    if (this.incomeChart) {
      this.incomeChart.destroy()
    }

    const labels = data.map((m) => this.getMonthName(m.month, m.year))
    const values = data.map((m) => m.income)

    // Create gradient for area fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    gradient.addColorStop(0, this.airbnbColors.babu + "30")
    gradient.addColorStop(0.5, this.airbnbColors.babu + "15")
    gradient.addColorStop(1, this.airbnbColors.babu + "05")

    // Create line gradient
    const lineGradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    lineGradient.addColorStop(0, this.airbnbColors.babu)
    lineGradient.addColorStop(0.5, this.airbnbColors.teal)
    lineGradient.addColorStop(1, this.airbnbColors.babu)

    this.incomeChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Monthly Revenue",
            data: values,
            borderColor: lineGradient,
            backgroundColor: gradient,
            borderWidth: 4,
            fill: true,
            tension: 0.5, // Increased for smoother curve
            pointBackgroundColor: this.airbnbColors.babu,
            pointBorderColor: "#FFFFFF",
            pointBorderWidth: 4,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: this.airbnbColors.teal,
            pointHoverBorderWidth: 6,
            // Add shadow effect
            // shadowOffsetX: 3,
            // shadowOffsetY: 3,
            // shadowBlur: 10,
            // shadowColor: "rgba(0, 166, 153, 0.3)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(34, 34, 34, 0.95)",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",
            borderColor: this.airbnbColors.babu,
            borderWidth: 2,
            cornerRadius: 12,
            displayColors: true,
            titleFont: {
              size: 14,
              weight: "normal",
            },
            bodyFont: {
              size: 13,
              weight: "normal",
            },
            padding: 12,
            callbacks: {
              title: (context) => `${context[0].label}`,
              label: (context) => `$${(context.parsed.y / 1000).toFixed(0)}K revenue`,
              afterLabel: (context) => {
                const currentValue = context.parsed.y
                const previousValue = context.dataIndex > 0 ? values[context.dataIndex - 1] : currentValue
                const growth = (((currentValue - previousValue) / previousValue) * 100).toFixed(1)
                return context.dataIndex > 0 ? `Growth: +${growth}%` : ""
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#767676",
              font: {
                size: 12,
                weight: "normal",
              },
              maxTicksLimit: 6,
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              color: "rgba(235, 235, 235, 0.3)",
              lineWidth: 1,
            },
            ticks: {
              color: "#767676",
              font: {
                size: 12,
                weight: "normal",
              },
              callback: (value) => (typeof value === "number" ? `$${(value / 1000).toFixed(0)}K` : value),
              maxTicksLimit: 6,
            },
          },
        },
        elements: {
          line: {
            borderCapStyle: "round",
            borderJoinStyle: "round",
          },
          point: {
            hoverBorderWidth: 6,
          },
        },
        animation: {
          duration: 2000,
          easing: "easeInOutQuart",
          delay: (context) => {
            return context.type === "data" && context.mode === "default" ? context.dataIndex * 100 : 0
          },
        },
      },
    })
  }

  private createDonutChart(data: Array<{ label: string; value: number }>): void {
    if (!this.donutChartCanvas?.nativeElement) return

    const ctx = this.donutChartCanvas.nativeElement.getContext("2d")
    if (!ctx) return

    if (this.donutChart) {
      this.donutChart.destroy()
    }

    const labels = data.map((item) => item.label)
    const values = data.map((item) => item.value)
    const colors = this.airbnbColors.donutColors.slice(0, data.length)

    this.donutChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            label: "Bookings Distribution",
            data: values,
            backgroundColor: colors,
            borderColor: colors.map((color) => color + "80"),
            borderWidth: 3,
            hoverBorderWidth: 5,
            hoverOffset: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(34, 34, 34, 0.95)",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",
            borderWidth: 2,
            cornerRadius: 12,
            displayColors: true,
            titleFont: {
              size: 14,
              weight: "normal",
            },
            bodyFont: {
              size: 13,
              weight: "normal",
            },
            callbacks: {
              title: (context) => `${context[0].label}`,
              label: (context) => {
                const total = values.reduce((sum, val) => sum + val, 0)
                const percentage = ((context.parsed / total) * 100).toFixed(1)
                return `${context.parsed.toLocaleString()} bookings (${percentage}%)`
              },
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutQuart",
        },
      },
    })
  }

  getDonutColor(index: number): string {
    return this.airbnbColors.donutColors[index % this.airbnbColors.donutColors.length]
  }

  refreshData(): void {
    console.log("Refreshing data with Airbnb styling...")
    this.isLoading = true
    setTimeout(() => {
      this.loadRealData()
      this.isLoading = false
    }, 1000)
  }

  exportData(): void {
    console.log("Exporting Airbnb dashboard data...")
    const exportData = {
      totalBookings: this.totalBookings,
      totalIncome: this.totalIncome,
      distributionData: this.distributionData,
      timestamp: new Date().toISOString(),
      theme: "airbnb-professional",
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `airbnb-dashboard-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }
}

