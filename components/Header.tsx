import { getContent } from "@/lib/content";
import { whatsappHref } from "@/lib/utils";
import HeaderShell from "./HeaderShell";

const WHATSAPP_MESSAGE =
  "Hola, quisiera consultar por los servicios de Kaizen.";

export default async function Header() {
  const { settings } = await getContent();

  return (
    <HeaderShell
      email={settings.contactEmail}
      whatsapp={whatsappHref(settings.whatsappNumber, WHATSAPP_MESSAGE)}
      whatsappDisplay={settings.whatsappDisplay}
    />
  );
}
