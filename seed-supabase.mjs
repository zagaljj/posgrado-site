import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

import { DIPLOMADOS_DATA } from './data/diplomados.js';

async function seed() {
  console.log("Iniciando migración de datos...");
  for (const dip of DIPLOMADOS_DATA) {
    const slug = dip.titulo.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data, error } = await supabase.from('programas').insert({
      slug: slug,
      titulo: dip.titulo,
      area: dip.area,
      modalidad: dip.modalidad,
      precio: dip.precio,
      estado_academico: dip.estadoAcademico,
      duracion: dip.duracion,
      horas: dip.horas,
      inicio: dip.inicio,
      descripcion: dip.descripcion,
      objetivos: dip.objetivos,
      docentes: dip.docentes,
      destacado: dip.destacado,
      activo: dip.activo,
      arte_url: dip.arte || null,
      brochure_url: dip.brochure || null,
      tipo: dip.tipo || 'Diplomado'
    });

    if (error) {
      console.error(`Error insertando ${dip.titulo}:`, error.message);
    } else {
      console.log(`✅ Insertado: ${dip.titulo}`);
    }
  }
  console.log("Migración completada.");
}

seed();
