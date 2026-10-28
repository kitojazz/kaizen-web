import type { ComponentType, SVGProps } from "react";
import {
  BadgeCheck,
  Building,
  CalendarCheck,
  FileText,
  Flask,
  Folder,
  Globe,
  GraduationCap,
  Layers,
  Leaf,
  ShieldCheck,
  Sparkle,
  Tag,
  Users,
} from "./icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const serviceIcons: Record<string, IconComponent> = {
  flask: Flask,
  file: FileText,
  tag: Tag,
  badge: BadgeCheck,
  shield: ShieldCheck,
  folder: Folder,
  calendar: CalendarCheck,
  users: Users,
  graduation: GraduationCap,
  globe: Globe,
  building: Building,
  layers: Layers,
  sparkle: Sparkle,
  leaf: Leaf,
};

export const serviceIconOptions = [
  { value: "flask", label: "Laboratorio / producto" },
  { value: "file", label: "Documento / regulatorio" },
  { value: "tag", label: "Etiqueta / rotulado" },
  { value: "badge", label: "Calidad / certificación" },
  { value: "shield", label: "Inocuidad / protección" },
  { value: "folder", label: "Documentación / archivo" },
  { value: "calendar", label: "Planes / seguimiento" },
  { value: "users", label: "Equipo / dirección" },
  { value: "graduation", label: "Capacitación" },
  { value: "globe", label: "Comercio exterior" },
  { value: "building", label: "Empresa / local" },
  { value: "layers", label: "Procesos / capas" },
  { value: "sparkle", label: "Destacado" },
  { value: "leaf", label: "Orgánico / ambiente" },
];

export function getServiceIcon(name: string): IconComponent {
  return serviceIcons[name] ?? Flask;
}
