export type HeroSupportImage = {
  id: string;
  image: string;
  alt: string;
};

export type Hero = {
  backgroundImage: string;
  backgroundAlt: string;
  supportImages: HeroSupportImage[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  description: string;
  linkedin?: string;
  order: number;
  showInHero: boolean;
};

export type Brand = {
  id: string;
  name: string;
  logo: string;
  order: number;
};

export type TeamGalleryImage = {
  id: string;
  image: string;
  alt: string;
  order: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ServiceHighlight = {
  title: string;
  description: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  order: number;
};

export type Service = {
  id: string;
  slug: string;
  category: string;
  title: string;
  shortDescription: string;
  description: string;
  intro: string;
  content: string;
  highlights: ServiceHighlight[];
  relatedServiceId?: string;
  image: string;
  imageAlt: string;
  icon: string;
  labels: string[];
  keywords: string;
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  order: number;
};

export type Faq = {
  id: string;
  serviceId?: string;
  question: string;
  answer: string;
  order: number;
};

export type SiteSettings = {
  contactEmail: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  heroEyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroSubheading: string;
  heroParagraph: string;
  homeSeoTitle: string;
  homeSeoDescription: string;
  trustTitle: string;
  contactAddress: string;
  contactAddressUrl: string;
  contactEmailProposed: string;
};

export type LeadStatus = "new" | "read";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  createdAt: string;
  status: LeadStatus;
};

export type Content = {
  hero: Hero;
  team: TeamMember[];
  brands: Brand[];
  teamGallery: TeamGalleryImage[];
  posts: BlogPost[];
  services: Service[];
  serviceCategories: ServiceCategory[];
  faqs: Faq[];
  settings: SiteSettings;
  leads: Lead[];
};
