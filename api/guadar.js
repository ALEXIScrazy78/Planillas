import { createClient } from '@supabase/supabase-js';

// Vercel inyectará estas variables desde sus ajustes privados de entorno
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  // Configurar cabeceras CORS para permitir peticiones
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    const formData = req.body;

    if (!formData || !formData.codigo_foto) {
      return res.status(400).json({ error: 'El campo "codigo_foto" es obligatorio.' });
    }

    const { data, error } = await supabase
      .from('estructuras_desmontaje')
      .insert([formData])
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error en Supabase:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}