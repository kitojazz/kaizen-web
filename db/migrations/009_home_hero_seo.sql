INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('hero_title', 'Ingeniería y consultoría'),
  ('hero_title_accent', 'alimentaria en Uruguay'),
  ('hero_subheading', 'Que su producto llegue a góndola, sin sorpresas.'),
  ('hero_paragraph', 'Brindamos soluciones integrales para la industria alimentaria, acompañando a su empresa en dirección técnica, habilitaciones bromatológicas, registro de productos, calidad e inocuidad alimentaria'),
  ('home_seo_title', 'Ingeniería y Consultoría Alimentaria en Uruguay | Kaizen'),
  ('home_seo_description', 'Consultoría alimentaria en Uruguay. Especialistas en habilitaciones bromatológicas, registro de productos, dirección técnica, calidad e inocuidad.')
ON DUPLICATE KEY UPDATE setting_value = setting_value;
