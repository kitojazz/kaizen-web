"use client";

import { useFormStatus } from "react-dom";
import { Trash } from "@/components/icons";

export default function DeleteButton({
  message = "¿Eliminar este registro? Esta acción no se puede deshacer.",
  label = "Eliminar",
}: {
  message?: string;
  label?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className="inline-flex items-center gap-2 rounded-full border border-[#f1c9c9] bg-[#fff7f7] px-3.5 py-2 text-[11px] font-bold text-[#a52a2a] transition hover:border-[#df9d9d] hover:bg-[#ffeded] disabled:opacity-50"
    >
      <Trash className="h-4 w-4" />
      {pending ? "Eliminando..." : label}
    </button>
  );
}
