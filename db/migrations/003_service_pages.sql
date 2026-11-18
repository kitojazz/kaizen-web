-- Fichas individuales de servicio, preguntas frecuentes y textos editables del sitio.

ALTER TABLE services
  ADD COLUMN slug VARCHAR(200) NOT NULL DEFAULT '' AFTER id,
  ADD COLUMN intro TEXT NULL AFTER short_description,
  ADD COLUMN content MEDIUMTEXT NULL AFTER description,
  ADD COLUMN highlights JSON NULL AFTER content,
  ADD COLUMN related_service_id VARCHAR(64) NULL AFTER highlights,
  ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0 AFTER cta_href,
  ADD COLUMN seo_title VARCHAR(200) NOT NULL DEFAULT '' AFTER featured,
  ADD COLUMN seo_description VARCHAR(400) NOT NULL DEFAULT '' AFTER seo_title;

-- Slugs para los servicios existentes.
UPDATE services SET slug = 'ingenieria-de-alimentos' WHERE id = 'service-engineering';
UPDATE services SET slug = 'rotulado-de-alimentos' WHERE id = 'service-labeling';
UPDATE services SET slug = 'calidad' WHERE id = 'service-quality';
UPDATE services SET slug = 'inocuidad-alimentaria' WHERE id = 'service-safety';
UPDATE services SET slug = 'gestion-documental' WHERE id = 'service-documentation';

-- El servicio paraguas "Asuntos regulatorios" se conserva para no borrar contenido existente.

-- Cualquier otro servicio creado desde el panel recibe un slug provisorio único.
UPDATE services SET slug = CONCAT('servicio-', LEFT(id, 40)) WHERE slug = '';

ALTER TABLE services ADD UNIQUE KEY uq_services_slug (slug);

CREATE TABLE faqs (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  service_id VARCHAR(64) NULL,
  question VARCHAR(300) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 99,
  KEY idx_faqs_service (service_id, sort_order),
  CONSTRAINT fk_faqs_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_settings (
  setting_key VARCHAR(80) NOT NULL PRIMARY KEY,
  setting_value TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
