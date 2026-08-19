document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ app.js cargado e inicializado.");

  const form = document.getElementById('redesForm');
  const statusMsg = document.getElementById('statusMsg');

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
      poste_anio: getStrValue('poste_anio'),
      poste_terreno: getStrValue('poste_terreno'),
      poste_estado: getStrValue('poste_estado'),
      armado_funcion_primaria: getStrValue('armado_funcion_primaria'),
      armado_funcion_secundaria: getStrValue('armado_funcion_secundaria'),
      armado_configuracion: getStrValue('armado_configuracion'),
      cruceta_material: getStrValue('cruceta_material'),
      cruceta_cant: getNumValue('cruceta_cant'),
      cruceta_longitud: getStrValue('cruceta_longitud'),
      cruceta_tipo: getStrValue('cruceta_tipo'),
      cruceta_estado: getStrValue('cruceta_estado'),
      aislador_pin_material: getStrValue('aislador_pin_material'),
      aislador_pin_cant: getNumValue('aislador_pin_cant'),
      aislador_pin_estado: getStrValue('aislador_pin_estado'),
      aislador_susp_material: getStrValue('aislador_susp_material'),
      aislador_susp_cant: getNumValue('aislador_susp_cant'),
      aislador_susp_estado: getStrValue('aislador_susp_estado'),
      retenida_cant: getNumValue('retenida_cant'),
      retenida_tipo: getStrValue('retenida_tipo'),
      retenida_estado: getStrValue('retenida_estado')
    };

    try {
      // Petición al endpoint de Vercel
      const response = await fetch('/api/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar la solicitud');
      }

      alert("¡Registro guardado exitosamente!");

      if (statusMsg) {
        statusMsg.textContent = '¡Registro guardado correctamente!';
        statusMsg.classList.add('success');
        statusMsg.style.display = 'block';
      }

      form.reset();

    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error al guardar: " + err.message);

      if (statusMsg) {
        statusMsg.textContent = 'Error: ' + err.message;
        statusMsg.classList.add('error');
        statusMsg.style.display = 'block';
      }
    }
  });
});