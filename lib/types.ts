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

export type Service = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: string;
  labels: string[];
  keywords: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
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
  posts: BlogPost[];
  services: Service[];
  leads: Lead[];
};
