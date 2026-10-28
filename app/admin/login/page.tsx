import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import AdminNotice from "@/components/admin/AdminNotice";
import SubmitButton from "@/components/admin/SubmitButton";
import { ArrowRight, ShieldCheck } from "@/components/icons";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ingreso al panel | Kaizen",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { notice?: string; message?: string };
}) {
  if (isAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#eaf4ff_0%,#f8fbff_52%,#e5f0fc_100%)] px-5 py-10">
      <div className="w-full max-w-[430px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-[22px] border border-white bg-white shadow-[0_20px_45px_-30px_rgba(12,20,34,.55)]">
            <Image
              src="/images/kaizen-symbol.png"
              alt="Kaizen"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
          </span>
          <p className="mt-4 font-display text-[24px] font-extrabold tracking-[-0.045em] text-ink">
            Kaizen
          </p>
          <p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted">
            Panel de administración
          </p>
        </div>

        <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_34px_80px_-56px_rgba(12,20,34,.55)] sm:p-8">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-mist text-blue">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-[23px] font-extrabold leading-tight tracking-[-0.035em] text-ink">
                Acceso privado
              </h1>
              <p className="mt-1 text-[12px] leading-5 text-body">
                Ingresá con las credenciales del equipo Kaizen.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <AdminNotice
              notice={searchParams?.notice}
              message={searchParams?.message}
            />
          </div>

          <form action={loginAction} className="mt-5 space-y-4">
            <div>
              <label htmlFor="email" className="field-label">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="nombre@kaizen.com.uy"
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Tu contraseña"
                className="field-input"
              />
            </div>
            <SubmitButton
              className="btn btn-primary w-full"
              pendingText="Ingresando..."
            >
              Ingresar al panel
              <ArrowRight className="h-[18px] w-[18px]" />
            </SubmitButton>
          </form>

          <p className="mt-5 text-center text-[10.5px] leading-5 text-muted">
            Este acceso está reservado para el equipo autorizado.
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-body transition hover:text-blue-text"
          >
            Volver al sitio
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
