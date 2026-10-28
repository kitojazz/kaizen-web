"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "./icons";

export default function ContactForm({
  serviceOptions,
}: {
  serviceOptions: string[];
}) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      service: String(data.get("service") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };

    setPending(true);
    setStatus("");
    setError(false);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setError(true);
        setStatus(result.error || "No pudimos enviar la consulta.");
        return;
      }

      setStatus(
        result.message ||
          "Recibimos tu consulta. Te vamos a responder a la brevedad.",
      );
      form.reset();
    } catch {
      setError(true);
      setStatus(
        "No pudimos enviar la consulta. Revisá tu conexión o escribinos por WhatsApp.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      id="contact-form"
      className="grid gap-4 rounded-[24px] border border-line bg-white p-5 shadow-card sm:grid-cols-2 sm:p-7"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="name" className="field-label">
          Nombre y apellido <span className="text-blue-text">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          placeholder="Su nombre"
          className="field-input"
        />
      </div>
      <div>
        <label htmlFor="company" className="field-label">
          Empresa
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={160}
          placeholder="Nombre de la empresa"
          className="field-input"
        />
      </div>
      <div>
        <label htmlFor="email" className="field-label">
          Correo electrónico <span className="text-blue-text">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={180}
          placeholder="nombre@empresa.com"
          className="field-input"
        />
      </div>
      <div>
        <label htmlFor="phone" className="field-label">
          Teléfono / WhatsApp
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={60}
          placeholder="Opcional"
          className="field-input"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="service" className="field-label">
          Tema de consulta
        </label>
        <select id="service" name="service" className="field-input">
          <option value="">Seleccione un tema</option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="field-label">
          Mensaje <span className="text-blue-text">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          maxLength={4000}
          placeholder="Cuéntenos brevemente en qué etapa está y qué necesita resolver."
          aria-describedby="form-note form-status"
          className="field-input resize-y"
        />
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Enviando..." : "Enviar consulta"}
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
        <p className="max-w-[340px] text-[11.5px] leading-5 text-muted">
          La consulta queda registrada en nuestra bandeja interna para que el
          equipo pueda darle seguimiento.
        </p>
      </div>
      <p
        id="form-status"
        role="status"
        aria-live="polite"
        className={`min-h-[18px] text-[11.5px] font-semibold leading-5 sm:col-span-2 ${
          error ? "text-[#a52a2a]" : "text-[#0b7a3b]"
        }`}
      >
        {status}
      </p>
    </form>
  );
}
