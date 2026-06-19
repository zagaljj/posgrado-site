"use client";

import { useState, useEffect } from "react";
import SectionLabel from "@/components/SectionLabel";
import { supabase } from "@/lib/supabase";

export default function AdminInscripciones() {
  const [inscripciones, setInscripciones] = useState([]);

  useEffect(() => {
    fetchInscripciones();
  }, []);

  const fetchInscripciones = async () => {
    const { data, error } = await supabase
      .from('inscripciones')
      .select('*, programas(titulo)')
      .order('fecha', { ascending: false });
    
    if (error) {
      console.error("Error fetching inscripciones:", error);
    } else {
      setInscripciones(data || []);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('inscripciones')
      .update({ estado: newStatus })
      .eq('id', id);
      
    if (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar estado");
    } else {
      fetchInscripciones();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta inscripción?")) {
      const { error } = await supabase
        .from('inscripciones')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting inscripcion:", error);
        alert("Error al eliminar");
      } else {
        fetchInscripciones();
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <SectionLabel n={2} label="Gestión de estudiantes" />
          <h1 className="font-montserrat font-black text-4xl text-udi-navy tracking-[-1px] uppercase m-0">
            Control de<br />
            <span className="text-udi-gray font-light italic">Inscripciones</span>
          </h1>
        </div>
      </div>

      <div className="bg-white border border-udi-border rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-udi-light border-b border-udi-border">
              <th className="p-6 font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-navy">Estudiante</th>
              <th className="p-6 font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-navy">Programa</th>
              <th className="p-6 font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-navy">Contacto</th>
              <th className="p-6 font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-navy">Fecha</th>
              <th className="p-6 font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-navy">Estado</th>
              <th className="p-6 font-montserrat font-bold text-[10px] tracking-[2px] uppercase text-udi-navy text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-udi-light">
            {inscripciones.length > 0 ? (
              inscripciones.map((ins) => {
                const date = new Date(ins.fecha).toLocaleString('es-BO', { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                });
                return (
                  <tr key={ins.id} className="hover:bg-udi-light/50 transition-colors">
                    <td className="p-6">
                      <div className="font-poppins text-sm font-bold text-udi-text">{ins.nombre}</div>
                      <div className="font-poppins text-[10px] text-udi-gray uppercase tracking-[0.5px]">ID: #{ins.id}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-poppins text-sm text-udi-navy max-w-[200px] truncate" title={ins.programas?.titulo}>
                        {ins.programas?.titulo || "Programa Eliminado"}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-poppins text-xs text-udi-text">{ins.email}</div>
                      <div className="font-poppins text-xs text-udi-gray">{ins.telefono}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-poppins text-xs text-udi-text">{date}</div>
                    </td>
                    <td className="p-6">
                      <select 
                        value={ins.estado?.toLowerCase() || 'nuevo'}
                        onChange={(e) => handleStatusChange(ins.id, e.target.value)}
                        className={`font-poppins text-[10px] font-bold uppercase tracking-[1px] px-3 py-1 rounded-sm outline-none border cursor-pointer ${
                          ins.estado?.toLowerCase() === "confirmado" 
                            ? "bg-[#2d6a4f15] text-[#2d6a4f] border-[#2d6a4f33]" 
                            : "bg-[#e67e2215] text-[#e67e22] border-[#e67e2233]"
                        }`}
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDelete(ins.id)}
                        className="text-[#c0392b] opacity-40 hover:opacity-100 transition-opacity p-2"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-20 text-center font-poppins text-udi-gray text-xs italic">
                  No hay inscripciones para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
