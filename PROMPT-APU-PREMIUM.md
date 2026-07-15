# Prompt adaptado — Sitio premium APU OUTDOORS (v2, desde cero)

> Adaptación del prompt "Sitios Web Premium" (DominIA Academy) a la marca Apu Outdoors,
> con el concepto propio del cliente: **el scroll es el ascenso al nevado, campamento
> por campamento, hasta la cumbre**.

### Identidad del proyecto

En el resto del prompt, ten en cuenta estos valores donde corresponde.

* **MARCA:** APU OUTDOORS
* **PRODUCTO O SERVICIO:** Equipo de montaña fabricado a pedido (bolsas de dormir, magnesieras, colchonetas) y ropa outdoor
* **MODELO O NOMBRE DEL PRODUCTO:** Bolsa de dormir APU a medida (pieza insignia del hero)
* **SECTOR:** Equipo outdoor artesanal / montañismo, senderismo, escalada y pesca (Salta, Argentina)
* **CONCEPTO VISUAL DEL HERO:** Un ascenso cinematográfico al nevado controlado por el scroll: la toma arranca al pie de la montaña en la puna dorada al amanecer y la cámara sube por la ladera atravesando nubes; a medida que el usuario scrollea se pasa por el Campamento Base, el Campamento 1 y el Campamento de Altura hasta coronar la cumbre nevada bajo un cielo que vira del día a la noche estrellada con la Cruz del Sur. En cada campamento el ascenso "se detiene" y aparece una parada de catálogo.
* **FRASE PRINCIPAL:** «Se cose acá. Se prueba allá arriba.»
* **COLOR DE ACENTO:** Ocre andino (#c98a3f) sobre azul noche profundo (#0c1119) y crema (#f0e9d8) — paleta ya definida por el logo de la marca

### Modelos de inteligencia artificial

* **MODELO PARA GENERAR IMÁGENES:** Nano Banana Pro
* **RESOLUCIÓN DE LAS IMÁGENES:** 4K
* **MODELO PARA GENERAR EL VÍDEO DEL HERO:** Kling 3.0 (imagen → video, nunca texto → video)
* **RESOLUCIÓN DEL VÍDEO:** 4K nativo (mínimo 1080p)
* **RESOLUCIÓN FINAL TRAS EL UPSCALING:** 4K (bajar a 2K si el peso compromete el scrubbing)
* **FORMATO DEL VÍDEO:** 16:9 (generar además variante 9:16 o recorte seguro para móvil)
* **HERRAMIENTA O MODELO DE UPSCALING:** Upscaler de Higgsfield
* **PLATAFORMA DE GENERACIÓN:** Higgsfield
* **MÉTODO DE ACCESO:** MCP de Higgsfield desde Claude Code

---

# 1. OBJETIVO DEL PROYECTO

Construye un sitio web cinematográfico, premium y visualmente espectacular para
**Apu Outdoors**, marca salteña de equipo de montaña fabricado a pedido.

La prioridad absoluta es el hero: **el ascenso scrolleado al nevado**. Debe producir
impacto inmediato y sostener toda la narrativa del sitio: subir la página = subir la
montaña. El resto del sitio conserva la misma dirección artística usando solo
imágenes estáticas generadas con IA (para no quemar créditos) más las fotos reales
del producto donde la fidelidad importa.

El resultado debe parecer una campaña internacional de outdoor premium
(Arc'teryx, Patagonia, Norrøna), no una plantilla.

# 2. TECNOLOGÍAS WEB

* HTML + CSS + JavaScript vanilla (patrón IIFE, sin módulos ES).
* GSAP + ScrollTrigger para el scrubbing y las apariciones por campamento.
* Sin React/Vue/Angular ni plantillas SaaS.
* Ejecutable en localhost y desplegable en hosting compartido (GitHub Pages hoy;
  Hostinger si el cliente compra dominio): nombres en minúsculas, rutas relativas,
  `.htaccess` con MIME de video/fuentes (`mp4`, `webm`, `woff2`) y `Accept-Ranges bytes`
  para el scrubbing, respaldo CDN de librerías, ZIP final listo para `public_html`.

# 3. GENERACIÓN DE RECURSOS MEDIANTE HIGGSFIELD MCP

Todos los **escenarios, fondos y tomas de montaña** se generan desde Claude Code vía
MCP de Higgsfield. Nada de bancos de imágenes ni stock.

⚠️ **Adaptación importante para Apu (producto artesanal real):** las piezas que vende
Fran existen físicamente y tienen costuras, correas y materiales concretos. Para las
imágenes donde aparece el producto, usar **image-to-image con las fotos reales como
referencia** (carpeta `fotos fran/`), de modo que la IA mejore fondo, luz y puesta en
escena SIN inventar un producto que no existe. La IA genera el mundo; el producto es
el real.

Estructura de assets:

```
assets/
  hero/        ← imagen maestra + video del ascenso + poster + versión móvil
  images/      ← escenarios por campamento, editoriales, texturas
  products/    ← fotos reales retocadas / image-to-image con referencia
  variants/    ← variantes del configurador (colores/talles)
  textures/    ← grano, piedra, tela técnica
```

# 4. FLUJO OBLIGATORIO PARA EL HERO

1. **Imagen maestra** (Nano Banana Pro, 4K): vista aérea cinematográfica del nevado
   salteño al amanecer — pico solitario tipo Nevado de Cachi, puna dorada con coirones
   en la base, roca oscura y nieve arriba, cielo limpio con nubes bajas a media ladera.
   Debe definir: geometría de la montaña, posición de los 3 campamentos (visibles como
   pequeños puntos de carpa con luz cálida), iluminación, paleta (ocre/azul noche/crema),
   dirección artística. Sin texto, sin logos, sin marcas de agua.
2. **Video desde la imagen maestra** (Kling 3.0, 16:9, 4K nativo): la cámara asciende
   en un solo movimiento continuo desde la base hasta la cumbre (ver §5).
3. **Upscaling** con el Upscaler de Higgsfield a 4K.
4. **Optimización web**: MP4 H.264 con GOP corto y keyframes frecuentes (scrubbing),
   WebM de respaldo, versión móvil ~720p, poster JPG del primer frame.
5. **Integración scroll-scrubbed** (ver §6).

# 5. DIRECCIÓN DEL VÍDEO DEL HERO

Secuencia: **el ascenso**. La cámara parte a ras de la puna (coirones moviéndose con
el viento), inclina hacia arriba revelando la magnitud del nevado, y asciende por la
ladera: pasa el Campamento Base (2.900 m), atraviesa un banco de nubes, pasa el
Campamento 1 (4.200 m) donde la luz vira a atardecer, sigue al Campamento de Altura
(5.100 m) ya con las primeras estrellas, y corona la cumbre (6.380 m) de noche cerrada,
cielo estrellado con la Cruz del Sur y la nieve iluminada por la luna. Al final la
cámara supera la cumbre y mira el horizonte — conexión con la siguiente sección.

* Movimiento de dron real: cambio de escala, perspectiva, paralaje entre planos
  (coirones/rocas en primer plano, montaña en segundo, cielo al fondo), oclusión al
  atravesar nubes, profundidad de campo.
* Luz que evoluciona amanecer → atardecer → noche estrellada durante el ascenso
  (la transición día/noche que ya es firma de la marca).
* Elegante, físicamente creíble, sin estética de videojuego, sin partículas excesivas.
* **Debe funcionar hacia delante y hacia atrás** (el usuario scrollea en ambos sentidos).

# 6. CONTROL DEL HERO MEDIANTE SCROLL

* Sección sticky larga (≈500–600vh) — el video scrubbea con la posición del scroll.
* Bajar = ascender; subir = descender; detenerse = frame congelado.
* GSAP + ScrollTrigger; nunca asignar `currentTime` en seco: tiempo objetivo +
  interpolación con `requestAnimationFrame` (lerp ~0.08–0.12).
* Precarga con estado de carga, poster inicial, fallback visual (la foto maestra con
  el efecto CSS día/noche actual como plan B si el video no carga).
* **Paradas de campamento:** en 4 puntos del progreso (0.12 / 0.38 / 0.64 / 0.92) el
  scroll "pesa" levemente (snap suave de ScrollTrigger) y aparece el overlay del
  campamento:
  - **Campamento Base — Senderismo** (2.900 m): mochilas y salidas de día. Foto/render + copy + link.
  - **Campamento 1 — Escalada** (4.200 m): magnesieras artesanales (foto real retocada).
  - **Campamento de Altura — Montañismo** (5.100 m): bolsas de dormir y colchonetas a medida.
  - **Cumbre — Fabricación a pedido** (6.380 m): «Vos elegís la salida. Nosotros cosemos
    el resto.» + CTA a WhatsApp.
* Cada overlay: altitud en mono (estética altímetro, ya es firma del sitio v1),
  categoría en display serif, 1 imagen, 1 línea de copy, 1 link. Aparecen con máscaras
  y desenfoques suaves, se retiran al seguir subiendo.
* HUD permanente: altímetro lateral que marca los metros en tiempo real durante todo
  el ascenso (reutilizar concepto v1: 1.187 m → 6.380 m).

# 7. CONTENIDO DEL HERO

* **APU OUTDOORS** (serif/display editorial — coherente con el sello del logo)
* **Equipo a medida** (sans técnica)
* **«Se cose acá. Se prueba allá arriba.»**
* Texto marfil sobre el paisaje; la montaña pasa por delante/detrás de las letras
  según los planos (oclusión con capas + máscaras).
* Mucho espacio negativo; animaciones discretas.

# 8. RECURSOS DEL RESTO DEL SITIO

Solo imágenes estáticas (Nano Banana Pro 4K → WebP/AVIF optimizado):

* Escenarios de puna, roca, nieve y taller para fondos de sección.
* Editoriales de campamento (carpas iluminadas de noche, vivac al amanecer).
* Texturas: tela ripstop, pluma, grano de piedra.
* **Producto: siempre image-to-image sobre las fotos reales de Fran** (magnesieras,
  bolsas de dormir, colchonetas). Si una imagen cambia costuras/correas/colores del
  producto real, se regenera.
* Coherencia total de dirección de arte; conservar originales 4K + servir WebP.

# 9. ESTRUCTURA DEL SITIO (después del hero-ascenso)

1. **Introducción** — quiénes somos (esencia outdoor de Fran), 3 datos destacados
   (fabricación a pedido · Salta · probado en montaña).
2. **El taller** — la Singer, las manos, los materiales; detalle técnico de costura.
3. **Diferencial: a medida** — comparador interactivo "de catálogo vs. a tu medida"
   (selector de temperatura de confort / talle que actualiza la pieza).
4. **Vista detallada** — bolsa de dormir con etiquetas técnicas sobre imagen macro
   (relleno, cierre, capucha, largo).
5. **Configurador de pedido** — pieza (bolsa/magnesiera/colchoneta) → talle/medidas →
   color → extras. Actualiza imagen, specs y precio estimado (⚠️ precios reales los
   define Fran — placeholder claro hasta tenerlos). El resultado arma el mensaje de
   WhatsApp con la configuración elegida (el sitio no cobra: cierra por WhatsApp).
6. **Edición Cumbre** *(propuesta a validar con Fran)* — serie limitada numerada con
   los colores del logo; certificado cosido. NO publicar como real hasta que él apruebe.
7. **Formulario** — nombre, contacto, salida prevista, pieza, mensaje; validación JS
   real y confirmación; envía a WhatsApp como el v1.

# 10. DIRECCIÓN ARTÍSTICA

Lujo silencioso de montaña — precisión, oficio, frío y noche andina:

* Paleta: azul noche profundo (#0c1119), carbón, grafito, marfil (#f0e9d8),
  ocre andino (#c98a3f) como único acento + verde coirón apagado (#7c8a63) de apoyo.
* Grano cinematográfico sutil, líneas técnicas finas (estética topográfica: curvas de
  nivel como motivo gráfico), desenfoques y máscaras, composiciones asimétricas.
* Tipografías: display condensada tipo Big Shoulders (ya en uso) o serif editorial;
  sans técnica (Inter); mono (JetBrains) para altitudes y datos.
* Evitar: SaaS, neón, gradientes genéricos, gaming, sombras duras, exceso de texto.

# 11. RESPONSIVE Y RENDIMIENTO

* El hero scrubbed se mantiene en móvil con versión de video ~720p y menos capas;
  si iOS bloquea el scrubbing fluido, degradar a secuencia de imágenes (canvas) o al
  fallback CSS día/noche del v1 — la experiencia nunca se rompe.
* WebP/AVIF + lazy loading, preload solo del hero, `transform`/`opacity` únicamente,
  pausar efectos fuera de viewport, sin overflow horizontal, hovers → tap.

---

## Estado / pendientes para ejecutar esto

1. **Conectar el MCP de Higgsfield a Claude Code** (no está disponible en la sesión
   actual — sin él no se pueden generar los assets).
2. Con el MCP conectado: generar imagen maestra → video → upscale → construir.
3. Datos que faltan del cliente: precios (configurador), Instagram, aprobación de la
   "Edición Cumbre".
4. El sitio v1 queda en línea en https://facucostas.github.io/apu-outdoors/ hasta que
   el v2 esté listo; el v2 se construye en `proyect/apu-outdoors-v2/`.
