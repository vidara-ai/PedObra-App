
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

/**
 * IMPORTANTE: No backend (Node.js), estas variáveis devem estar no .env
 * O supabaseAdmin ignora RLS e permite gerenciar usuários do AUTH.
 */
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

router.post('/create-user', async (req, res) => {
  const { email, password, nome, role } = req.body;

  // Validação estrita de roles permitidas
  const allowedRoles = ['admin', 'user'];
  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Role inválida. Apenas "admin" ou "user" são permitidos.' });
  }

  if (!email || !password || !nome) {
    return res.status(400).json({ error: 'Dados incompletos para criação do usuário.' });
  }

  try {
    // 1. Cria o usuário no Supabase Auth usando a Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Usuário já nasce com email confirmado
      user_metadata: { name: nome, role: role }
    });

    if (authError) throw authError;

    // 2. Insere o registro na tabela de profiles para gerenciar o Role no sistema
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        nome: nome,
        role: role
      });

    if (profileError) {
      // Rollback manual: deletar o usuário do auth se o profile falhar (opcional mas recomendado)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    res.json({ 
      success: true, 
      user: { 
        id: authData.user.id, 
        email: authData.user.email 
      } 
    });

  } catch (err: any) {
    console.error('Erro ao criar usuário:', err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
