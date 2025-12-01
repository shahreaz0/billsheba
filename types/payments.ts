export type PaymentResponse = {
  code: number
  next: string | null
  previous: string | null
  count: number
  results: Payment[]
}

export type Payment = {
  id: number
  uid: string
  customer: Customer
  entry_by: EntryBy | null
  bill_amount: string
  amount: string
  billing_month: string
  payment_method: string
  paid: boolean
  transaction_id: string
  payment_date: Date | null
  note: string
  created_at: Date
  updated_at: Date
}

export type Customer = {
  id: number
  uid: string
  name: string
  email: string
  phone: string
  address: string
  nid: string
  is_free: boolean
  username: string
}

export type EntryBy = {
  id: number
  uid: string
  first_name: string
  last_name: string
  phone: string
  email: string
}

export type PaymentFilters = {
  year: string
}
