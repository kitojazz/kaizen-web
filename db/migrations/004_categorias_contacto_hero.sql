-- Cambios incrementales de la segunda etapa. Idempotente y compatible con la estructura existente.

ALTER TABLE team_members
  ADD COLUMN show_in_hero TINYINT(1) NOT NULL DEFAULT 0 AFTER linkedin;

ALTER TABLE services
  ADD COLUMN category VARCHAR(80) NOT NULL DEFAULT '' AFTER slug,
  ADD KEY idx_services_category (category);

-- Los integrantes actuales conservan su presencia en el hero hasta que se editen desde el panel.
UPDATE team_members SET show_in_hero = 1
  WHERE id IN ('team-adelina', 'team-bruno', 'team-rodrigo', 'team-vannina');

-- Categorías visibles en el catálogo. Habilitaciones va antes que Registro de Productos.
UPDATE services SET category = 'Habilitaciones'
  WHERE id IN ('service-habilitacion-locales', 'service-latu-sigla-vehiculos');
UPDATE services SET category = 'Registro de Productos'
  WHERE id = 'service-registro-productos';
UPDATE services SET category = 'Dirección Técnica'
  WHERE id = 'service-direccion-tecnica';
UPDATE services SET category = 'Producto y procesos'
  WHERE id IN ('service-engineering', 'service-quality', 'service-safety',
               'service-documentation', 'service-labeling');
UPDATE services SET category = 'Regulatorios'
  WHERE id = 'service-ambiente-residuos';

INSERT INTO site_settings (setting_key, setting_value)
  SELECT 'contact_address', 'Av. Gral. Paz 1481, Montevideo'
  WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_address');

INSERT INTO site_settings (setting_key, setting_value)
  SELECT 'contact_address_url',
         'https://www.google.com/maps/search/?api=1&query=Av.%20Gral.%20Paz%201481%2C%20Montevideo%2C%20Uruguay'
  WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_address_url');

-- Correo propuesto: queda editable en el panel, NO se usa todavía en la web pública.
INSERT INTO site_settings (setting_key, setting_value)
  SELECT 'contact_email_proposed', 'info@kaizen.com.uy'
  WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_email_proposed');
