import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://igpjoitxgkyimescyxex.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncGpvaXR4Z2t5aW1lc2N5eGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTEwNDQsImV4cCI6MjA4NTA4NzA0NH0.xzGSdVmh0UZkeSafXp986jKzBmtRiKOzp9gjl_wIH5A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCabins() {
  console.log('Fetching all cabins...');
  const { data, error } = await supabase
    .from('cabins')
    .select('id, name, image')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching cabins:', error.message);
    return;
  }

  console.log('Cabin Data:');
  data.forEach(cabin => {
    console.log(`- Name: "${cabin.name}" | ID: ${cabin.id} | Image: ${cabin.image}`);
  });
}

checkCabins();
