import { formatDistance, parseISO } from "date-fns";
import imageCompression from "browser-image-compression";
// import { differenceInDays } from "date-fns/esm";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1: string, dateStr2: string) =>
  new Date(dateStr1).getTime() - new Date(dateStr2).getTime();
// differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options: { end?: boolean } = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

// Returns YYYY-MM-DD string for comparison with Supabase 'date' type
export const getTodayDateOnly = () => new Date().toISOString().split("T")[0];

// Enforces the "Free Early Check-in" policy (starting at 08:00 AM on the startDate)
export const isWithinCheckinWindow = (startDate: string) => {
  const today = getTodayDateOnly();
  if (startDate > today) return false; // Early check-in not allowed for future dates
  if (startDate < today) return true; // Already past check-in date

  // If it's today, check if it's after 08:00 AM
  const currentHour = new Date().getHours();
  return currentHour >= 8;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Image compression error:", error);
    return file; // Fallback to original file
  }
};
