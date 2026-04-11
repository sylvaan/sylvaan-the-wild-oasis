import { getToday, getTodayDateOnly } from "../utils/helpers";
import supabase from "./supabase";
import type { Booking, BookingSummary } from "./types";

interface BookingParams {
  filter: { field: string; value: string; method?: string } | null;
  sortBy: { field: string; direction: string };
  page: number;
}

export async function getBookings({
  filter,
  sortBy,
  page,
}: BookingParams): Promise<{ data: BookingSummary[]; count: number | null }> {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)",
      { count: "exact" },
    );

  // 1. FILTER
  if (filter)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = (query as any)[filter.method || "eq"](filter.field, filter.value);

  // 2. SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  // 3. PAGINATION
  if (page) {
    const from = (page - 1) * 10; // PAGE_SIZE hardcoded to 10 for now
    const to = from + 10 - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return { data: data as unknown as BookingSummary[], count };
}

export async function getBooking(id: string): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date: string): Promise<Pick<Booking, "created_at" | "totalPrice" | "extrasPrice">[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getTodayDateOnly());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const today = getTodayDateOnly();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${today}),and(status.eq.checked-in,endDate.eq.${today})`,
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id: string, obj: Partial<Booking>): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data as Booking;
}

export async function deleteBooking(id: string) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
