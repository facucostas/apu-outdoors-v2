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

  // ===== Mapa lateral: nodos + etiquetas + marcador =====
  function initRoute(){
    var path = $("[data-route]"), fill = $("[data-route-fill]"), marker = $("[data-route-marker]");
    var nodesG = $("[data-route-nodes]"), labelsWrap = $("[data-route-labels]");
    if (!path) return function(){};
    var len = path.getTotalLength();
    fill.style.strokeDasharray = len; fill.style.strokeDashoffset = len;
    var nodeT = [0.02, 0.35, 0.67, 0.99];
    var nodePts = nodeT.map(function(t){ return path.getPointAtLength(len * t); });
    nodePts.forEach(function(pt, i){
      var c = document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); c.setAttribute("r", 4.2);
      c.setAttribute("fill","none"); c.setAttribute("stroke","rgba(185,205,130,.6)"); c.setAttribute("stroke-width","2");
      c.setAttribute("data-node", i); nodesG.appendChild(c);
      var s = document.createElement("span"); s.textContent = ALTS[i] + " m";
      s.style.top = (pt.y / 1000 * 100) + "%"; labelsWrap.appendChild(s);
    });
    var labels = $$("span", labelsWrap), nodeCircles = $$("[data-node]", nodesG);
    return function(p){
      var pt = path.getPointAtLength(len * p);
      marker.setAttribute("cx", pt.x); marker.setAttribute("cy", pt.y);
      fill.style.strokeDashoffset = (len * (1 - p)).toFixed(1);
      var zi = clamp(Math.round(p * (ALTS.length - 1)), 0, ALTS.length - 1);
      labels.forEach(function(l, i){ l.classList.toggle("is-active", i === zi); });
      nodeCircles.forEach(function(c, i){
        c.setAttribute("r", i <= zi ? 5.4 : 4.2);
        c.setAttribute("stroke", i <= zi ? "#b9cd82" : "rgba(185,205,130,.45)");
      });
    };
  }

  function initHud(){
    var altFill = $("[data-alt-fill]"), altVal = $("[data-alt-value]"), navZone = $("[data-nav-zone]"), hint = $("[data-hint]");
    var BASE = 1187, PEAK = 6380;
    return function(p){
      var alt = Math.round(BASE + p*(PEAK-BASE));
      if (altVal) altVal.textContent = alt.toLocaleString("es-AR");
      if (altFill) altFill.style.height = (p*100).toFixed(1)+"%";
      var zi = clamp(Math.round(p*(ZONES.length-1)),0,ZONES.length-1);
      if (navZone) navZone.textContent = ZONES[zi];
      if (hint) hint.style.opacity = p > 0.03 ? 0 : 1;
    };
  }

  function initReveal(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) e.target.classList.add("is-in"); });
    }, { threshold:.25 });
    $$("[data-reveal]").forEach(function(el){ io.observe(el); });
  }

  function boot(){
    var updRoute = initRoute(), updHud = initHud();
    initReveal();
    function onScroll(){ var p = docProgress(); updRoute(p); updHud(p); }
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
