"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePaymentsStore } from "@/stores/payments-store"
import { years } from "../data/data"

export function PaymentsYearSelect() {
  const { paymentFilters, setPaymentFilters } = usePaymentsStore()

  return (
    <Select
      value={paymentFilters.year}
      onValueChange={(value) => setPaymentFilters((prev) => ({ ...prev, year: value }))}
    >
      <SelectTrigger className="w-[100px]" size="sm">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Years</SelectLabel>
          {years.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
