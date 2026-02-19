import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Trata preflight request do CORS (Essencial para evitar "Failed to send request")
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Fix: Access Deno via globalThis to avoid "Cannot find name 'Deno'" error
    const supabaseUrl = (globalThis as any).Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = (globalThis as any).Deno.env.get('SUP_ROLE_KEY') ?? ''
    
    if (!supabaseServiceKey) {
      throw new Error('A secret SUP_ROLE_KEY não foi configurada via "supabase secrets set".')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    })

    const body = await req.json()
    const { email, password, nome, role } = body

    // 2. Validações de segurança
    const allowedRoles = ['admin', 'user']
    if (!role || !allowedRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Papel inválido. Apenas "admin" ou "user" são permitidos.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!email || !password || !nome) {
      return new Response(
        JSON.stringify({ error: 'Dados obrigatórios ausentes.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // 3. Criar usuário no Auth (Admin API)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: nome, role: role }
    })

    if (authError) throw authError

    // 4. Inserir na tabela de perfis
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        nome: nome,
        role: role
      })

    if (profileError) {
      // Rollback se falhar ao criar perfil
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    return new Response(
      JSON.stringify({ success: true, userId: authData.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error('Erro na função create-user:', error.message)
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno no servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})