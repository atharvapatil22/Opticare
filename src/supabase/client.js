import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://kbqnwhezriybxbtbyqer.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticW53aGV6cml5YnhidGJ5cWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE3OTA3NzMsImV4cCI6MjAwNzM2Njc3M30.jzbkBuJeayHfpoK8BpxsdiXRef1pxQ81EZvEklXjDHg"
);
