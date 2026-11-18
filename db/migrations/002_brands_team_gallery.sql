-- Marcas que confiaron (carrusel de la home) y galería de fotos del equipo.

CREATE TABLE brands (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  logo VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 99,
  KEY idx_brands_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE team_gallery (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  alt VARCHAR(300) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 99,
  KEY idx_team_gallery_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
