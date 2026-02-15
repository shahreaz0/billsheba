export type CustomerResponse = {
  code: number
  next: string
  previous: null
  count: number
  results: Customer[]
}

export type Customer = {
  id: number
  uid: string
  name: string
  email: string | null
  phone: string
  address: string
  nid: string
  is_free: boolean
  package: Package
  connection_start_date: string | null
  subscription_end_date: string | null
  is_active: boolean
  ip_address: string
  mac_address: string
  username: string
  password: string
  connection_type: "DHCP" | "STATIC" | "PPPoE"
  credentials: Credentials
}

export type Credentials = object

export type Package = {
  id: number
  uid: string
  name: string
  speed_mbps: number
  price: string
  description: string | null
}

export type CreateCustomer = {
  name: string
  phone?: string
  address?: string
  nid?: string
  is_free?: boolean
  is_active?: boolean
  ip_address?: string
  mac_address?: string
  username?: string
  password?: string
  connection_type?: "DHCP" | "STATIC" | "PPPoE"
  email?: string | undefined
  package_id?: number | undefined
  connection_start_date?: string | null | undefined
  credentials?: any
}
