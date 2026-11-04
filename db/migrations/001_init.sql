-- Esquema inicial de Kaizen. Charset utf8mb4 para acentos y emojis.

CREATE TABLE hero (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  background_image VARCHAR(500) NOT NULL,
  background_alt VARCHAR(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hero_support_images (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  alt VARCHAR(300) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE team_members (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(160) NOT NULL,
  photo VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  linkedin VARCHAR(300) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 99,
  KEY idx_team_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE services (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  short_description VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  image_alt VARCHAR(300) NOT NULL,
  icon VARCHAR(40) NOT NULL DEFAULT 'flask',
  labels JSON NOT NULL,
  keywords VARCHAR(500) NOT NULL DEFAULT '',
  cta_label VARCHAR(80) NOT NULL DEFAULT 'Consultar',
  cta_href VARCHAR(500) NOT NULL DEFAULT '#contacto',
  sort_order INT NOT NULL DEFAULT 99,
  KEY idx_services_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE posts (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  slug VARCHAR(200) NOT NULL,
  title VARCHAR(300) NOT NULL,
  tag VARCHAR(80) NOT NULL,
  excerpt VARCHAR(600) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  cover_image VARCHAR(500) NOT NULL,
  cover_alt VARCHAR(300) NOT NULL,
  published TINYINT(1) NOT NULL DEFAULT 0,
  published_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_published (published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE leads (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(60) NOT NULL DEFAULT '',
  company VARCHAR(160) NOT NULL DEFAULT '',
  service VARCHAR(120) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status ENUM('new','read') NOT NULL DEFAULT 'new',
  created_at DATETIME(3) NOT NULL,
  KEY idx_leads_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
