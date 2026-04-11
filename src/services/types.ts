export interface Cabin {
  id: string;
  created_at: string;
  name: string;
  max_capacity: number;
  regular_price: number;
  discount: number;
  description: string;
  image: string;
}

export interface NewCabin {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: File | string;
}

export interface Guest {
  id: string;
  fullName: string;
  email: string;
  nationality: string;
  countryFlag: string;
  nationalID: string;
}

export interface Booking {
  id: string;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: "unconfirmed" | "checked-in" | "checked-out";
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinId: string;
  guestId: string;
  cabins: { name: string };
  guests: { fullName: string; email: string };
}

// Supabase join responses can sometimes return arrays depending on RLS/relationships
export interface BookingSummary extends Omit<Partial<Booking>, "cabins" | "guests"> {
  id: string;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  status: "unconfirmed" | "checked-in" | "checked-out";
  totalPrice: number;
  cabins: { name: string } | { name: string }[];
  guests: { fullName: string; email: string } | { fullName: string; email: string }[];
}

export interface Settings {
  id: number;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
}
