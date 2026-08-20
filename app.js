document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ app.js cargado e inicializado.");

  const SUPABASE_URL = 'https://zhcwqkuotstqlhtoelft.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoY3dxa3VvdHN0cWxodG9lbGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5OTg2NTYsImV4cCI6MjEwMjU3NDY1Nn0.J62qBZ0H1x3Aea9DWVnMkpd39zZac_7E5uZ6hcNXZps'; 

  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const form = document.getElementById('redesForm');
  const statusMsg = document.getElementById('statusMsg');
  const guiaCodigo = document.getElementById('guia_ultimo_codigo');

  // --- FUNCIÓN PARA CONSULTAR EL ÚLTIMO CÓDIGO REGISTRADO ---
  const obtenerUltimoCodigo = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('estructuras_desmontaje')
        .select('codigo_foto')
        .order('id', { ascending: false }) // Si no tienes columna 'id', usa 'created_at'
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0 && data[0].codigo_foto) {
        if (guiaCodigo) {
          guiaCodigo.textContent = `📌 Último código registrado: ${data[0].codigo_foto}`;
        }
      } else {
        if (guiaCodigo) {
          guiaCodigo.textContent = `📌 No hay registros previos.`;
        }
      }
    } catch (err) {
      console.warn("⚠️ No se pudo obtener el último código:", err.message);
      if (guiaCodigo) {
        guiaCodigo.textContent = `📌 Último código: No disponible`;
      }
    }
  };

  // Cargar el último código al abrir la aplicación
  obtenerUltimoCodigo();

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (statusMsg) {
      statusMsg.className = 'status-message';
      statusMsg.style.display = 'none';
      statusMsg.textContent = '';
    }

    const getNumValue = (id) => {
      const el = document.getElementById(id);
      return el && el.value.trim() !== '' ? Number(el.value) : null;
    };

    const getStrValue = (id) => {
      const el = document.getElementById(id);
      return el && el.value.trim() !== '' ? el.value.trim() : null;
    };

    const formData = {
      codigo_foto: getStrValue('codigo_foto'),
      poste_cant: getNumValue('poste_cant'),
      poste_codigo_ntce: getStrValue('poste_codigo_ntce'),
      poste_denominacion: getStrValue('poste_denominacion'),
      poste_anio: '0',
      poste_terreno: getStrValue('poste_terreno'),
      
      // Estado por defecto BD
      poste_estado: 'BD',

      armado_funcion_primaria: getStrValue('armado_funcion_primaria'),
      armado_funcion_secundaria: getStrValue('armado_funcion_secundaria'),
      armado_configuracion: getStrValue('armado_configuracion'),

      cruceta_material: getStrValue('cruceta_material'),
      cruceta_cant: getNumValue('cruceta_cant'),
      cruceta_longitud: getStrValue('cruceta_longitud'),
      cruceta_tipo: getStrValue('cruceta_tipo'),
      
      // Estado por defecto BD
      cruceta_estado: 'BD',

      aislador_pin_material: getStrValue('aislador_pin_material'),
      aislador_pin_cant: getNumValue('aislador_pin_cant'),
      
      // Estado por defecto BD
      aislador_pin_estado: 'BD',

      aislador_susp_material: getStrValue('aislador_susp_material'),
      aislador_susp_cant: getNumValue('aislador_susp_cant'),
      
      // Estado por defecto BD
      aislador_susp_estado: 'BD',

      retenida_cant: getNumValue('retenida_cant'),
      retenida_tipo: getStrValue('retenida_tipo'),

      // Estado por defecto BD
      retenida_estado: 'BD'
    };

    try {
      const { data, error } = await supabaseClient
        .from('estructuras_desmontaje')
        .insert([formData])
        .select();

      if (error) throw error;

      alert("¡Registro guardado exitosamente en Supabase!");

      if (statusMsg) {
        statusMsg.textContent = '¡Registro guardado correctamente!';
        statusMsg.classList.add('success');
        statusMsg.style.display = 'block';
      }

      form.reset();

    } catch (err) {
      console.error("❌ Error Supabase:", err);
      alert("Error al guardar: " + (err.message || JSON.stringify(err)));

      if (statusMsg) {
        statusMsg.textContent = 'Error: ' + (err.message || 'No se pudo guardar');
        statusMsg.classList.add('error');
        statusMsg.style.display = 'block';
      }
    }
  });
});