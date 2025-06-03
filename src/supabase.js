import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wtkyazyvsgazthiyertk.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0a3lhenl2c2dhenRoaXllcnRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQzMjEzMiwiZXhwIjoyMDY0MDA4MTMyfQ.eiQYKk2Wj8rVvDvvDKu-NS6vkJmeihGsLhYmQmNCGd8"; // Replace with your Supabase anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };   
