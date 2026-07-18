(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function clamp(v,a,b){ return Math.min(b, Math.max(a, v)); }
  function docProgress(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  }
  var ZONES = ["Río · Pesca", "Pared · Escalada", "Campamento", "Cumbre · Montañismo"];
  var ALTS = ["1.187", "4.200", "5.100", "6.380"];

  // ===== Cámara que viaja: dolly + fundido corto entre escenas =====
  // Se maneja directo desde el scroll (sin rAF) para funcionar siempre,
  // incluso con la pestaña en segundo plano. Una transición CSS corta suaviza.
  function initStage(){
    var scenes = $$(".scene");
    var N = scenes.length;                 // 4
    scenes.forEach(function(sc){ sc.style.transition = "opacity .18s linear, transform .18s linear"; });
    function apply(p){
      var camPos = p * (N - 1);            // 0..N-1 posición continua de la cámara
      scenes.forEach(function(sc, i){
        var d = camPos - i;                // <0 = por delante, >0 = ya pasada
        var ad = Math.abs(d);
        var op = clamp(1 - (ad - 0.5) / 0.35, 0, 1);            // fundido corto
        var scale = 1.04 + 0.20 * clamp(d + 0.5, 0, 1.4);       // dolly: cámara se mete
        var ty = d * -2.2;                                       // parallax vertical (vh)
        sc.style.opacity = op.toFixed(3);
        sc.style.transform = "translateY(" + ty.toFixed(2) + "vh) scale(" + scale.toFixed(3) + ")";
      });
    }
    return { set: apply, start: function(){ apply(0); } };
  }

  // ===== Ruta de ascenso: nodos + etiquetas + marcador =====
  function initRoute(){
    var path = $("[data-route]"), fill = $("[data-route-fill]"), marker = $("[data-route-marker]");
    var nodesG = $("[data-route-nodes]"), labelsWrap = $("[data-route-labels]");
    if (!path) return function(){};
    var len = path.getTotalLength();
    fill.style.strokeDasharray = len; fill.style.strokeDashoffset = len;
    var svg = path.ownerSVGElement;
    var nodeT = [0.02, 0.35, 0.67, 0.99];
    var nodePts = nodeT.map(function(t){ return path.getPointAtLength(len * t); });
    nodePts.forEach(function(pt, i){
      var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); c.setAttribute("r", 4.2);
      c.setAttribute("fill","none"); c.setAttribute("stroke","rgba(226,181,106,.65)"); c.setAttribute("stroke-width","2");
      c.setAttribute("data-node", i); nodesG.appendChild(c);
      // etiqueta (posicion en % relativo al viewBox 1000 alto)
      var s = document.createElement("span");
      s.textContent = ALTS[i] + " m";
      s.style.top = (pt.y / 1000 * 100) + "%";
      labelsWrap.appendChild(s);
    });
    var labels = $$("span", labelsWrap);
    var nodeCircles = $$("[data-node]", nodesG);
    function update(p){
      var pt = path.getPointAtLength(len * p);
      marker.setAttribute("cx", pt.x); marker.setAttribute("cy", pt.y);
      fill.style.strokeDashoffset = (len * (1 - p)).toFixed(1);
      var zi = clamp(Math.round(p * (ALTS.length - 1)), 0, ALTS.length - 1);
      labels.forEach(function(l, i){ l.classList.toggle("is-active", i === zi); });
      nodeCircles.forEach(function(c, i){
        c.setAttribute("r", i <= zi ? 5.4 : 4.2);
        c.setAttribute("stroke", i <= zi ? "#e2b56a" : "rgba(226,181,106,.5)");
      });
    }
    update(0);
    return update;
  }

  function initHud(){
    var navZone = $("[data-nav-zone]"), hint = $("[data-hint]");
    return function(p){
      var zi = clamp(Math.round(p * (ZONES.length - 1)), 0, ZONES.length - 1);
      if (navZone) navZone.textContent = ZONES[zi];
      if (hint) hint.style.opacity = p > 0.03 ? 0 : 1;
    };
  }

  function initCards(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) e.target.classList.add("is-in"); });
    }, { threshold:.2 });
    $$(".card").forEach(function(c){ io.observe(c); });
  }

  function boot(){
    var stage = initStage();
    var updRoute = initRoute();
    var updHud = initHud();
    initCards();
    function onScroll(){
      var p = docProgress();
      stage.set(p); updRoute(p); updHud(p);
    }
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", onScroll);
    onScroll();
    stage.start();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
