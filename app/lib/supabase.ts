import { createClient } from '@supabase/supabase-js'

// Tempel yang kamu salin tadi di sini
const supabaseUrl = 'https://scbxnzkwohxpvnqvtqqu.supabase.co'
const supabaseKey = 'sb_publishable__V2cQZG5M0aOY93l5KwDlQ_7_OC-3XV'

export const supabase = createClient(supabaseUrl, supabaseKey)
