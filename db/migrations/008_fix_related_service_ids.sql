UPDATE services
SET related_service_id = 'service-safety'
WHERE related_service_id = 'service-inocuidad-alimentaria'
  AND EXISTS (SELECT 1 FROM (SELECT id FROM services WHERE id = 'service-safety') AS target);
