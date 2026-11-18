CREATE TABLE IF NOT EXISTS service_categories (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(80) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_service_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO service_categories (id, name, sort_order) VALUES
  ('category-habilitaciones', 'Habilitaciones', 1),
  ('category-registro-productos', 'Registro de Productos', 2),
  ('category-direccion-tecnica', 'Dirección Técnica', 3),
  ('category-producto-procesos', 'Producto y procesos', 4),
  ('category-regulatorios', 'Regulatorios', 5);

INSERT INTO service_categories (id, name, sort_order)
SELECT CONCAT('category-auto-', MD5(cat.name)), cat.name, 100
FROM (
  SELECT DISTINCT s.category AS name
  FROM services s
  WHERE s.category <> ''
) AS cat
WHERE NOT EXISTS (
  SELECT 1 FROM service_categories sc WHERE sc.name = cat.name
);
