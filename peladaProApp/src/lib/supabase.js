import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhksitebuwpboocgtksw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa3NpdGVidXdwYm9vY2d0a3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNzc3NzUsImV4cCI6MjA0Njc1Mzc3NX0.kp66vHO0Ito0AVKdFLQ5Ep6qpybElyisHi3nX1mh67g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})