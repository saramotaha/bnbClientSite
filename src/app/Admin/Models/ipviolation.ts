import { IPReporterOfViolation } from "./ipreporter-of-violation"
import { IPropertyOfViolation } from "./iproperty-of-violation"

export interface IPViolation {
    id: number
  violationType: string
  status: string
  description: string
  createdAt: string
  updatedAt: string
  resolvedAt: any
  adminNotes: any
  reporter: IPReporterOfViolation
  host: any
  property: IPropertyOfViolation
}
