(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function docProgress(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  var ZONE_NAMES = ["Río · Pesca", "Pared · Escalada", "Campamento", "Cumbre · Montañismo"];

  // ---- Fondo: crossfade entre 4 capas segun progreso ----
  function initBg(){
    var layers = $$(".bg-layer");
    var n = layers.length;                 // 4
    function update(p){
      // posicion continua 0..(n-1)
      var pos = p * (n - 1);
      layers.forEach(function(img, i){
        var d = Math.abs(pos - i);
        var op = Math.max(0, 1 - d);        // triangular: 1 en su punto, 0 a distancia 1
        img.style.opacity = op.toFixed(3);
      });
    }
    return update;
  }

  // ---- Sendero SVG: dibuja + marcador ----
  function initTrail(){
    var path = $("[data-trail]");
    var fill = $("[data-trail-fill]");
    var marker = $("[data-marker]");
    var wpGroup = $("[data-waypoints]");
    if (!path) return function(){};
    var len = path.getTotalLength();
    fill.style.strokeDasharray = len;
    fill.style.strokeDashoffset = len;
    // waypoints en 4 puntos a lo largo del path (el path empieza en la base/abajo)
    [0.02, 0.36, 0.68, 0.98].forEach(function(t){
      var pt = path.getPointAtLength(len * t);
      var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); c.setAttribute("r", 5);
      c.setAttribute("fill","none"); c.setAttribute("stroke","rgba(224,186,118,.7)"); c.setAttribute("stroke-width","2");
      wpGroup.appendChild(c);
    });
    function update(p){
      // el marcador sube: p=0 en la base (inicio del path, abajo), p=1 en la cumbre (fin, arriba)
      var pt = path.getPointAtLength(len * p);
      marker.setAttribute("cx", pt.x); marker.setAttribute("cy", pt.y);
      // dibuja desde la base hasta el marcador
      fill.style.strokeDashoffset = (len * (1 - p)).toFixed(1);
    }
    update(0);
    return update;
  }

  // ---- Altímetro + nav zone ----
  function initHud(){
    var altFill = $("[data-alt-fill]"), altVal = $("[data-alt-value]"), navZone = $("[data-nav-zone]"), hint = $("[data-hint]");
    var BASE = 1187, PEAK = 6380;
    return function(p){
      var alt = Math.round(BASE + p*(PEAK-BASE));
      if (altVal) altVal.textContent = alt.toLocaleString("es-AR");
      if (altFill) altFill.style.height = (p*100).toFixed(1)+"%";
      if (navZone){ var zi = Math.min(3, Math.round(p*(4-1))); navZone.textContent = ZONE_NAMES[zi]; }
      if (hint) hint.style.opacity = p > 0.03 ? 0 : 1;
    };
  }

  // ---- Paneles reveal ----
  function initPanels(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) e.target.classList.add("is-in"); });
    }, { threshold:.25 });
    $$(".panel").forEach(function(p){ io.observe(p); });
  }

  function boot(){
    var updBg = initBg();
    var updTrail = initTrail();
    var updHud = initHud();
    initPanels();
    function onScroll(){
      var p = docProgress();
      updBg(p); updTrail(p); updHud(p);
    }
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
