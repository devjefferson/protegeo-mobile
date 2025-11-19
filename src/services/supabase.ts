import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ymsqcnoszfxxdgdxlfii.supabase.co';

export const supabase = createClient(
  SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltc3Fjbm9zemZ4eGRnZHhsZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTg4NTcsImV4cCI6MjA3OTEzNDg1N30.-ew9gEa01bJv5fsAEvzCLyWnYKzlAkU_94NJHu5wFQc',
);
