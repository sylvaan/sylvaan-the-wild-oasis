import supabase from "./supabase";
import type { Settings } from "./types";

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

// We expect a partial object to update only changed fields
export async function updateSetting(newSetting: Partial<Settings>) {
  // There is only one row of settings, and it has ID=1
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }

  return data;
}
