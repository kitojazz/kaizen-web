"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImageIcon, Trash } from "@/components/icons";

export default function ImageField({
  name,
  label,
  current = "",
  help,
  required = false,
  allowRemove = false,
  aspect = "aspect-[16/9]",
}: {
  name: string;
  label: string;
  current?: string;
  help?: string;
  required?: boolean;
  allowRemove?: boolean;
  aspect?: string;
}) {
  const hiddenName = `current${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  const inputId = `image-${useId().replace(/:/g, "")}`;
  const [hidden, setHidden] = useState(current);
  const [preview, setPreview] = useState(current);
  const [objectUrl, setObjectUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  return (
    <div>
      <label htmlFor={inputId} className="field-label">
        {label}
        {required && !hidden ? <span className="text-blue-text"> *</span> : null}
      </label>
      <input type="hidden" name={hiddenName} value={hidden} />
      <div className="overflow-hidden rounded-2xl border border-line bg-[#f8fbfe]">
        <div className={`relative ${aspect} w-full bg-[#eaf2fa]`}>
          {preview ? (
            <img
              src={preview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-[#8aa0b8]">
              <div className="text-center">
                <ImageIcon className="mx-auto h-8 w-8" />
                <span className="mt-1 block text-[10.5px] font-semibold">
                  Sin imagen
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-white p-3">
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required={required && !hidden}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setPreview(hidden);
                return;
              }
              if (objectUrl) URL.revokeObjectURL(objectUrl);
              const url = URL.createObjectURL(file);
              setObjectUrl(url);
              setPreview(url);
            }}
            className="min-w-0 flex-1 text-[11.5px] text-body file:mr-3 file:rounded-full file:border-0 file:bg-mist file:px-3 file:py-2 file:text-[11px] file:font-bold file:text-blue-text hover:file:bg-[#dcecff]"
          />
          {allowRemove && preview ? (
            <button
              type="button"
              onClick={() => {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
                setObjectUrl("");
                setPreview("");
                setHidden("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#f1c9c9] bg-[#fff7f7] px-2.5 py-1.5 text-[10.5px] font-bold text-[#a52a2a] transition hover:bg-[#ffeded]"
            >
              <Trash className="h-3.5 w-3.5" />
              Quitar
            </button>
          ) : null}
        </div>
      </div>
      <p className="mt-1.5 text-[10.5px] leading-4 text-muted">
        {help ?? "JPG, PNG, WebP o AVIF · máximo 12 MB. Se optimiza a WebP automáticamente."}
      </p>
    </div>
  );
}
