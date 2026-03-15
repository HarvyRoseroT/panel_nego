"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { createProducto, updateProducto } from "@/services/productoService";
import type { Producto } from "@/services/productoService";
import type { Seccion } from "@/services/seccionService";
import { getStoredToken } from "@/services/authService";

interface Props {
  open: boolean;
  seccion: Seccion | null;
  producto?: Producto | null;
  onClose: () => void;
  onSuccess?: (producto: Producto) => void;
}

const tallasRopa = ["XS","S","M","L","XL","XXL","AJUSTABLE"];
const tallasPantalon = ["28","30","32","34","36","38","40","42","AJUSTABLE"];
const tallasZapato = ["35","36","37","38","39","40","41","42","43","44","AJUSTABLE"];

export default function ModalCrearEditarProducto({
  open,
  seccion,
  producto,
  onClose,
  onSuccess,
}: Props) {

  const [tipoEstablecimiento,setTipoEstablecimiento] = useState<string | null>(null);

  const [nombre,setNombre] = useState("");
  const [descripcion,setDescripcion] = useState("");
  const [precio,setPrecio] = useState("");
  const [marca,setMarca] = useState("");
  const [talla,setTalla] = useState("");
  const [activo,setActivo] = useState(true);
  const [errors,setErrors] = useState<{nombre?:string;precio?:string}>({});

  useEffect(() => {
    const saved = localStorage.getItem("establecimiento");
    if (!saved) return;

    const est = JSON.parse(saved);
    setTipoEstablecimiento(est.tipo_establecimiento);
  }, []);

  const esRopa = tipoEstablecimiento === "clothing_store";

  useEffect(()=>{
    if(!open) return;

    if(producto){
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || "");
      setPrecio(producto.precio ? String(producto.precio) : "");
      setMarca(producto.marca || "");
      setTalla(producto.talla || "");
      setActivo(producto.activo);
    }else{
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setMarca("");
      setTalla("");
      setActivo(true);
    }

    setErrors({});
  },[producto,open]);

  if(!open || !seccion) return null;

  const validate=()=>{
    const newErrors:{nombre?:string;precio?:string}={};

    if(!nombre.trim()){
      newErrors.nombre="El nombre es obligatorio";
    }

    if(!precio.trim()){
      newErrors.precio="El precio es obligatorio";
    }else if(isNaN(Number(precio))){
      newErrors.precio="El precio debe ser numérico";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length===0;
  };

  const generateSku=()=>{
    const base = nombre.replace(/\s+/g,"").substring(0,4).toUpperCase();
    const rand = Math.floor(1000 + Math.random()*9000);
    return `${base}-${rand}`;
  };

  const handleSave=async()=>{
    if(!validate()) return;

    const token = getStoredToken();
    if(!token) return;

    const payload={
      nombre,
      descripcion: esRopa ? "" : descripcion,
      precio:Number(precio),
      marca:esRopa ? marca || undefined : undefined,
      talla:esRopa ? talla || undefined : undefined,
      sku:generateSku(),
      activo
    };

    let savedProducto:Producto;

    if(producto){
      savedProducto=await updateProducto(producto.id,payload,token);
    }else{
      savedProducto=await createProducto(
        {
          ...payload,
          seccion_id:seccion.id
        },
        token
      );
    }

    onSuccess?.(savedProducto);
    onClose();
  };

  const sizeButton=(value:string)=>(
    <button
      key={value}
      type="button"
      onClick={()=>setTalla(value)}
      className={`px-3 py-2 rounded-lg border text-sm transition
      ${talla===value
        ? "bg-[#72eb15]/20 border-[#72eb15] text-[#3fa10a] font-semibold"
        : "bg-white border-gray-200 hover:bg-gray-50"}`}
    >
      {value}
    </button>
  );

  const nombreTipo = tipoEstablecimiento
    ? tipoEstablecimiento.replace("_"," ").toUpperCase()
    : "DESCONOCIDO";

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-lg text-gray-800">
              {producto ? "Editar producto" : "Crear producto"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Tipo de establecimiento: <span className="font-semibold text-gray-700">{nombreTipo}</span>
            </p>
          </div>

          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <FiX/>
          </button>
        </div>

        <div className="p-6 space-y-6">

          <div>
            <label className="text-xs text-gray-500">Nombre *</label>
            <input
              value={nombre}
              onChange={(e)=>setNombre(e.target.value)}
              placeholder="Ej: Producto"
              className={`mt-1 w-full rounded-lg bg-gray-50 border px-3 py-2 text-sm
              ${errors.nombre ? "border-red-400":"border-gray-200"}`}
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          {!esRopa && (
            <div>
              <label className="text-xs text-gray-500">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e)=>setDescripcion(e.target.value)}
                placeholder="Descripción del producto"
                className="mt-1 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                rows={3}
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500">Precio *</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
              <input
                type="text"
                value={precio}
                onChange={(e)=>setPrecio(e.target.value)}
                placeholder="120000"
                className={`w-full pl-7 rounded-lg border px-3 py-2 text-sm
                ${errors.precio ? "border-red-400":"border-gray-200"}`}
              />
            </div>
            {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
          </div>

          {esRopa && (
            <>
              <div>
                <label className="text-xs text-gray-500">Marca</label>
                <input
                  value={marca}
                  onChange={(e)=>setMarca(e.target.value)}
                  placeholder="Ej: Nike"
                  className="mt-1 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Tallas de camisa / saco</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tallasRopa.map(sizeButton)}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Tallas de pantalón</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tallasPantalon.map(sizeButton)}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Tallas de zapato</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tallasZapato.map(sizeButton)}
                </div>
              </div>
            </>
          )}

          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e)=>setActivo(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Producto activo
          </label>

        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-[#72eb15]/20 text-[#3fa10a] font-semibold text-sm hover:bg-[#72eb15]/30"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}