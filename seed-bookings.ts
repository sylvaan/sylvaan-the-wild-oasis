import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { isFuture, isPast, isToday } from "date-fns";
import { subtractDates } from "./src/utils/helpers";

// Read Supabase URL and Key from .env
const envPath = path.resolve(process.cwd(), ".env");
let envContent = "";
try {
  envContent = fs.readFileSync(envPath, "utf8");
} catch (e) {
  console.log("Could not read .env");
  process.exit(1);
}

const supabaseUrl =
  envContent.match(/VITE_SUPABASE_URL\s*=\s*(.*)/)?.[1]?.trim() || "";
const supabaseKey =
  envContent.match(/VITE_SUPABASE_KEY\s*=\s*(.*)/)?.[1]?.trim() || "";

if (!supabaseUrl || !supabaseKey) {
  console.log("Supabase credentials not found in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const guests = [
  {
    fullName: "Jonas Schmedtmann",
    email: "hello@jonas.io",
    nationality: "Portugal",
    nationalID: "3525436345",
    countryFlag: "https://flagcdn.com/pt.svg",
  },
  {
    fullName: "Jonathan Smith",
    email: "johnsmith@test.eu",
    nationality: "Great Britain",
    nationalID: "4534593454",
    countryFlag: "https://flagcdn.com/gb.svg",
  },
  {
    fullName: "Jon Snow",
    email: "snow@example.com",
    nationality: "Bolivia",
    nationalID: "109283465",
    countryFlag: "https://flagcdn.com/bo.svg",
  },
];

async function seedBookings() {
  console.log("Seeding guests and bookings...");

  // 1. Insert Guests
  const { data: insertedGuests, error: guestsError } = await supabase
    .from("guests")
    .insert(guests)
    .select();

  if (guestsError || !insertedGuests) {
    console.error("Error inserting guests:", guestsError);
    return;
  }

  console.log("Successfully seeded 3 guests!");

  // 2. Fetch Cabins to get their IDs
  const { data: cabins, error: cabinsError } = await supabase
    .from("cabins")
    .select("id, regular_price, discount");

  if (cabinsError || !cabins) {
    console.error("Error fetching cabins:", cabinsError);
    return;
  }

  if (cabins.length === 0) {
    console.error("No cabins found in the database. Please seed cabins first.");
    return;
  }

  // 3. Create Bookings data linking to guests and cabins
  const bookingsData = [
    // FUTURE booking (unconfirmed) for testing Optional Breakfast
    {
      created_at: new Date(
        new Date().setDate(new Date().getDate() - 1),
      ).toISOString(),
      startDate: new Date(
        new Date().setDate(new Date().getDate() + 2),
      ).toISOString(),
      endDate: new Date(
        new Date().setDate(new Date().getDate() + 7),
      ).toISOString(),
      cabinId: cabins[2].id,
      guestId: insertedGuests[0].id,
      hasBreakfast: false,
      observations: "We want to test the optional breakfast feature.",
      isPaid: false,
      numGuests: 2,
      status: "unconfirmed",
    },
  ];

  // Calculate prices based on dates and cabin price
  const fullyCalculatedBookings = bookingsData.map((booking: any) => {
    const numNights = Math.round(
      subtractDates(booking.endDate, booking.startDate) / (1000 * 60 * 60 * 24),
    );
    const cabin = cabins.find((c) => c.id === booking.cabinId);
    if (!cabin) throw new Error("Cabin not found");
    const cabinPrice = numNights * (cabin.regular_price - cabin.discount);
    // Hardcode breakfast price mapping for dummy data
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0;
    const totalPrice = cabinPrice + extrasPrice;

    return {
      ...booking,
      numNights,
      cabinPrice,
      extrasPrice,
      totalPrice,
    };
  });

  const { error: bookingsError } = await supabase
    .from("bookings")
    .insert(fullyCalculatedBookings);

  if (bookingsError) {
    console.error("Error inserting bookings:", bookingsError);
  } else {
    console.log("Successfully seeded 3 bookings!");
  }
}

seedBookings();
