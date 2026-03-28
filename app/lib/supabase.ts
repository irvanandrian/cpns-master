import { createClient as supabaseCreateClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://scbxnzkwohxpvnqvtqqu.supabase.co'
const supabaseKey = 'sb_publishable__V2cQZG5M0aOY93l5KwDlQ_7_OC-3XV'

// Kita export dua cara supaya halaman lama (login) dan baru (ujian) tidak eror
export const supabase = supabaseCreateClient(supabaseUrl, supabaseKey)
export const createClient = () => supabaseCreateClient(supabaseUrl, supabaseKey)