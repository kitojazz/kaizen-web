/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `hero` (
  `id` tinyint unsigned NOT NULL,
  `background_image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `background_alt` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `hero` DISABLE KEYS */;
INSERT INTO `hero` VALUES (1,'/images/hero-food-factory.webp','Operario supervisando una línea de producción en una planta alimentaria');
/*!40000 ALTER TABLE `hero` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `hero_support_images` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `hero_support_images` DISABLE KEYS */;
INSERT INTO `hero_support_images` VALUES ('hero-support-1','/images/team-rodrigo.webp','Rodrigo, dirección técnica y asuntos regulatorios',0),('hero-support-2','/images/team-bruno.webp','Bruno, calidad e inocuidad alimentaria',1),('hero-support-3','/images/team-adelina.webp','Adelina, ingeniería de alimentos',2);
/*!40000 ALTER TABLE `hero_support_images` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `leads` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `company` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `service` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('new','read') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `created_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_leads_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` varchar(600) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_alt` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_posts_slug` (`slug`),
  KEY `idx_posts_published` (`published`,`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES ('post-analisis','que-analizar-y-cada-cuanto-hacerlo','¿Qué analizar y cada cuánto hacerlo?','Planes de análisis','No hay una tabla única: la frecuencia combina requisitos normativos y criterio técnico.','Esta es, quizás, la pregunta que genera más incertidumbre: no hay una tabla única que diga “su producto se analiza cada tanto”. Lo que sí existe es un criterio para llegar a esa frecuencia, que combina los requisitos normativos de su categoría de producto y el criterio técnico: qué tan sensible es ese producto a variaciones, y qué tan grave sería un desvío no detectado a tiempo.\n\nDos empresas con productos parecidos pueden tener planes de análisis distintos, y las dos estar perfectamente en regla. Si hoy no tiene claro qué analizar ni cada cuánto, no está solo: es exactamente el tipo de definición para la que conviene un técnico que conozca su producto, no solo la norma en abstracto.','/images/blog/blog-analisis.webp','Análisis de laboratorio con microscopio',1,'2026-09-08 12:00:00.000','2026-09-08 12:00:00.000','2026-09-08 12:00:00.000'),('post-importaciones','antes-de-importar-que-revisar-del-producto','Antes de importar: ¿qué revisar del producto?','Importaciones','Origen, formulación, documentación y requisitos de ingreso. Revisarlo antes de comprar es, literalmente, gratis.','Traer un producto de afuera siempre tiene ese momento de “ojalá no se trabe en la aduana”. Y la verdad es que la mayoría de las trabas se evitan revisando cuatro cosas antes de que el contenedor salga del puerto de origen: origen, formulación, documentación y requisitos de ingreso puntuales de Uruguay.\n\nLo que vemos seguido es que estas cuatro cosas se revisan recién cuando el producto ya está en camino, y ahí cualquier ajuste sale más caro y más lento. Revisarlas antes de comprar o de cerrar el contrato con el proveedor es, literalmente, gratis.\n\nNo hace falta ser especialista en comercio exterior para hacer esta revisión. Hace falta saber qué preguntar, y a eso nos dedicamos: a acompañar esa revisión antes de que el producto esté en un barco, no después.','/images/blog/blog-importaciones.webp','Contenedores de carga apilados en un puerto',1,'2026-10-06 12:00:00.000','2026-10-06 12:00:00.000','2026-10-06 12:00:00.000'),('post-organicos','organicos-una-declaracion-que-necesita-respaldo','Orgánicos: una declaración que necesita respaldo.','Productos orgánicos','Documentación, certificación vigente y coherencia del rotulado son las tres patas.','Escribir “orgánico” en una etiqueta es fácil. Sostener esa palabra frente a un control, no tanto, porque no es un adjetivo más: es una declaración que la normativa exige poder respaldar en cualquier momento.\n\nEse respaldo tiene tres patas: documentación que acredite el origen orgánico del producto, certificación vigente emitida por quien corresponda, y coherencia del rotulado, para que la etiqueta diga exactamente lo que la certificación cubre.\n\nEl error más común no es la mala fe, es el desfasaje: una certificación que vence, un proveedor que cambia, un rótulo que no se actualiza al mismo ritmo. Si su producto se apoya en esta palabra para venderse, vale la pena revisar una vez al año que las tres patas sigan alineadas.','/images/blog/blog-organicos.webp','Verduras frescas de producción orgánica',1,'2026-08-25 12:00:00.000','2026-08-25 12:00:00.000','2026-08-25 12:00:00.000'),('post-residuos','residuos-no-perder-de-vista-las-obligaciones','Residuos: no perder de vista las obligaciones.','Ambiente y residuos','Plan de control de plagas, declaración jurada y documentación de seguimiento.','De todos los trámites, este es el que más se posterga, no porque sea complicado, sino porque no tiene la urgencia visible de una habilitación o un registro de producto. Y sin embargo, es parte de lo que se revisa en cualquier auditoría.\n\nLo que la normativa pide, en general, se resume en un plan de control de plagas activo, una declaración jurada de residuos, y la documentación de seguimiento que respalde ambos puntos en el tiempo.\n\nLa buena noticia es que, una vez que este circuito queda armado, no vuelve a demandar tiempo. Nuestra recomendación es simple: resolverlo en paralelo con la habilitación del local, no como un trámite aparte.','/images/blog/blog-residuos.webp','Contenedores para la clasificación de residuos',1,'2026-08-11 12:00:00.000','2026-08-11 12:00:00.000','2026-08-11 12:00:00.000'),('post-rotulado','su-etiqueta-dice-mucho-mas-que-los-datos-obligatorios','Su etiqueta dice mucho más que los datos obligatorios.','Rotulado','Texto, imágenes y diseño tienen que ser coherentes con lo que el producto realmente es.','Piense en la etiqueta como la carta de presentación de su producto: es lo primero, y a veces lo único, que el cliente lee antes de decidir. El rótulo tiene que ser coherente en tres planos a la vez: el texto, que declare exactamente lo que el producto es; las imágenes, que no sugieran algo que el producto no tiene; y el diseño, que sea legible y no esconda información relevante.\n\nUn ejemplo típico: una foto de fruta fresca en un producto que solo lleva saborizante. Ese tipo de detalle es justamente lo que un control revisa con más atención. La buena noticia es que esto se resuelve una sola vez, bien, y evita el ida y vuelta de reimprimir etiquetas. Nosotros revisamos el rótulo completo antes de que se mande a imprimir.','/images/blog/blog-rotulado.webp','Etiqueta nutricional de un producto envasado',1,'2026-09-22 12:00:00.000','2026-09-22 12:00:00.000','2026-09-22 12:00:00.000'),('post-runaev','empresa-local-producto-que-necesita-habilitar','Empresa, local y producto: ¿qué necesita habilitar?','RUNAEV','Son tres capas distintas y la confusión más común es pensar que con habilitar el local ya está todo resuelto.','Si alguna vez preguntó “¿qué tengo que habilitar?” y le devolvieron una lista interminable de siglas, no es solo a usted. Es de las preguntas que más nos hacen, y tiene una respuesta más simple de lo que parece.\n\nEn la práctica, hay tres cosas distintas que la normativa mira por separado: la empresa, como responsable de lo que produce o vende; el local, el espacio físico donde elabora, almacena o atiende; y el producto, que se registra en sí mismo, más allá de dónde se fabrique. La confusión más común es pensar que habilitando el local ya está todo resuelto. No es así: son trámites que corren en paralelo, y según su rubro puede necesitar uno, dos o los tres.\n\nSi recién está empezando, la buena noticia es que no hace falta resolverlo todo el primer día. Lo que sí ayuda es entender desde el principio cuáles de los tres le aplican. En Kaizen empezamos por ahí en cada primera consulta: separamos su caso en estas tres capas antes de hablar de plazos o de papeles.','/images/blog/blog-starbucks.webp','Fachada de un local de Starbucks',1,'2026-10-20 12:00:00.000','2026-10-20 12:00:00.000','2026-10-20 12:00:00.000');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `name` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `schema_migrations` DISABLE KEYS */;
INSERT INTO `schema_migrations` VALUES ('001_init.sql','2026-11-04 14:41:55.172'),('seed:content.json','2026-11-04 14:41:55.181');
/*!40000 ALTER TABLE `schema_migrations` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `services` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_alt` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'flask',
  `labels` json NOT NULL,
  `keywords` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `cta_label` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Consultar',
  `cta_href` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#contacto',
  `sort_order` int NOT NULL DEFAULT '99',
  PRIMARY KEY (`id`),
  KEY `idx_services_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES ('service-documentation','Gestión documental','Manuales, procedimientos y registros pensados para utilizarse.','Armamos manuales, procedimientos y registros simples de mantener. La documentación se diseña alrededor del proceso real para que el equipo pueda usarla todos los días.','/images/service-documentation.webp','Documentos de control sobre una caja de packaging','folder','[\"Documentación\"]','documental documentacion manuales procedimientos registros sistema expediente','Consultar','#contacto',6),('service-engineering','Ingeniería de alimentos','Desarrollo, reformulación y mejora de productos y procesos alimentarios.','Trabajamos en formulación, vida útil, escalado y transferencia a planta. El objetivo es que el producto sea viable técnica y comercialmente, con un proceso reproducible y documentado.','/images/service-engineering.webp','Elaboración de quesos en una planta alimentaria','flask','[\"Producto\", \"Proceso\"]','ingenieria alimentos desarrollo reformulacion producto proceso vida util escalado mermas formulacion','Consultar','#contacto',1),('service-labeling','Rotulado de alimentos','Información correcta y una presentación coherente con el producto real.','Revisamos declaraciones, ingredientes, alérgenos, nutrición, imágenes y legibilidad. La etiqueta debe cumplir la norma y sostener exactamente lo que el producto es.','/images/service-labeling.webp','Persona rotulando una caja con marcador','tag','[\"Rotulado\"]','rotulado etiqueta etiquetas rotulo declaracion nutricional ingredientes organicos organico','Consultar','#contacto',3),('service-quality','Calidad','Sistemas, auditorías y herramientas para controlar y mejorar su operación.','Diseñamos sistemas de gestión, auditorías internas, indicadores y tratamiento de desvíos. Buscamos controles útiles para la operación, no documentación de archivo.','/images/service-quality.webp','Control de calidad de envases de vidrio en una fábrica','badge','[\"Calidad\"]','calidad sistema gestion auditoria auditorias proveedores indicadores no conformidad reclamos mejora continua','Consultar','#contacto',4),('service-regulatory','Asuntos regulatorios','Habilitaciones, registros y gestiones ante los organismos que correspondan.','Ordenamos el expediente, revisamos requisitos y acompañamos la presentación y el seguimiento ante los organismos. Cubre empresa, local, producto, importación y exportación.','/images/service-regulatory.webp','Operario controlando una línea de procesamiento de alimentos','file','[\"RUNAEV\", \"Importar\"]','regulatorios runaev msp habilitacion registro empresa local producto importar importacion exportar certificacion sanitario documentacion','Consultar','#contacto',2),('service-safety','Inocuidad alimentaria','BPM, POES, HACCP y controles para prevenir peligros en los alimentos.','Implementamos BPM, POES y HACCP, revisamos peligros, trazabilidad, plagas y residuos. El foco está en prevenir y en poder demostrarlo con registros.','/images/service-safety.webp','Operaria verificando productos en una planta alimentaria','shield','[\"HACCP\", \"Residuos\"]','inocuidad bpm poes haccp residuos plagas trazabilidad control peligros capacitacion','Consultar','#contacto',5);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `linkedin` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `sort_order` int NOT NULL DEFAULT '99',
  PRIMARY KEY (`id`),
  KEY `idx_team_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` VALUES ('team-adelina','Adelina Rubio Galain','Ingeniería de alimentos','/images/team-adelina.webp','Aporta el conocimiento de producto y proceso: formulación, vida útil, escalado y coherencia técnica entre lo que se declara y lo que se elabora.','https://www.linkedin.com/in/adelina-rubio-galain-b683a32a2/',3),('team-bruno','Bruno Roggero Silva','Calidad e inocuidad alimentaria','/images/team-bruno.webp','Trabaja en sistemas de calidad, BPM, HACCP y auditorías, integrando los controles documentales con la operación real de la planta.','https://www.linkedin.com/in/bruno-roggero-silva-09a5772b2/',2),('team-rodrigo','Rodrigo Duran','Dirección técnica y asuntos regulatorios','/images/team-rodrigo.webp','Coordina los proyectos regulatorios y acompaña la relación con los organismos, desde el diagnóstico hasta la habilitación y el registro.','https://www.linkedin.com/in/rodrigo-duran-94201b83/',1),('team-vannina','Vannina Mirci','Ingeniería química y procesos','/images/team-vannina.webp','Aporta la mirada de ingeniería química y de procesos, con experiencia en la industria alimentaria, para que lo documentado refleje cómo se opera realmente.','https://www.linkedin.com/in/vannina-mirci-31a5a1191/',4);
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

