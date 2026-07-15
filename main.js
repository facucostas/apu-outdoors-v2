(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function safe(fn, n){ try{ fn(); }catch(e){ console.warn("["+n+"]", e); } }

  function waLink(msg){
    return (data.waBase || "https://wa.me/?text=") + encodeURIComponent(msg || "Hola Apu Outdoors, quiero hacer una consulta.");
  }

  // ---- WhatsApp / IG links ----
  function initLinks(){
    $$("[data-wa]").forEach(function(a){ a.setAttribute("href", waLink()); a.setAttribute("target","_blank"); a.setAttribute("rel","noopener"); });
    $$("[data-ig]").forEach(function(a){ if (data.instagram && data.instagram !== "#"){ a.setAttribute("href", data.instagram); a.setAttribute("target","_blank"); a.setAttribute("rel","noopener"); } });
  }

  // ---- Splash ----
  function initSplash(){
    var s = $("[data-splash]"); if(!s) return;
    var hide = function(){ s.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 700);
    else window.addEventListener("load", function(){ setTimeout(hide, 500); });
    setTimeout(hide, 4200);
  }

  // ---- Nav ----
  function initNav(){
    var nav = $("[data-nav]"); if(!nav) return;
    var on = function(){ if (scrollY > 60) nav.classList.add("is-scrolled"); else nav.classList.remove("is-scrolled"); };
    on(); window.addEventListener("scroll", on, {passive:true});
    var t = $("[data-nav-toggle]"), m = $("[data-nav-menu]");
    if (t && m){
      t.addEventListener("click", function(){
        var open = m.classList.toggle("is-open"); t.classList.toggle("is-open", open);
        t.setAttribute("aria-expanded", open ? "true":"false");
      });
      m.addEventListener("click", function(e){ if (e.target.closest("a")){ m.classList.remove("is-open"); t.classList.remove("is-open"); t.setAttribute("aria-expanded","false"); } });
    }
  }

  // ---- Smooth anchors ----
  function initAnchors(){
    document.addEventListener("click", function(e){
      var a = e.target.closest('a[href^="#"]'); if(!a) return;
      var id = a.getAttribute("href"); if(!id || id === "#") return;
      var el = document.querySelector(id); if(!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: reduced ? "auto":"smooth" });
    });
  }

  // ---- Reveals ----
  function initReveals(){
    var els = $$("[data-reveal]");
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-revealed"); io.unobserve(e.target); } });
    }, { threshold:.04, rootMargin:"0px 0px -3% 0px" });
    els.forEach(function(el){ io.observe(el); });
    setTimeout(function(){ $$("[data-reveal]:not(.is-revealed)").forEach(function(el){ if(el.getBoundingClientRect().top < innerHeight) el.classList.add("is-revealed"); }); }, 6000);
  }

  // ---- ASCENT: scroll-scrubbed video + waypoints + altimeter ----
  function initAscent(){
    var section = $("[data-ascent]");
    var video = $("[data-ascent-video]");
    if(!section || !video) return;

    var intro = $('[data-ascent-layer="intro"]');
    var hint = $("[data-ascent-hint]");
    var waypoints = $$(".waypoint");
    var altFill = $("[data-alt-fill]"), altDot = $("[data-alt-dot]"), altVal = $("[data-alt-value]");
    var BASE = 1187, PEAK = 6380;

    var duration = 0;
    var targetTime = 0, currentTime = 0;
    var progress = 0;

    video.addEventListener("loadedmetadata", function(){ duration = video.duration || 0; });
    // Try to nudge decoding on iOS/Safari
    video.play().then(function(){ video.pause(); }).catch(function(){});

    // Waypoint windows (progress ranges where each shows)
    var WPS = [
      { c:0.14, w:0.09 },
      { c:0.40, w:0.09 },
      { c:0.64, w:0.09 },
      { c:0.90, w:0.10 }
    ];

    function updateFromScroll(){
      var rect = section.getBoundingClientRect();
      var total = section.offsetHeight - innerHeight;
      var scrolled = Math.min(Math.max(-rect.top, 0), total);
      progress = total > 0 ? scrolled / total : 0;
      targetTime = duration * progress;

      // altimeter
      var alt = Math.round(BASE + progress * (PEAK - BASE));
      if (altVal) altVal.textContent = alt.toLocaleString("es-AR");
      if (altFill) altFill.style.height = (progress*100).toFixed(1) + "%";
      if (altDot) altDot.style.bottom = (progress*100).toFixed(1) + "%";

      // intro fade (first 12%)
      if (intro){
        var iv = Math.max(0, 1 - progress/0.12);
        intro.style.opacity = iv;
        intro.style.transform = "translateY(" + (-progress*80) + "px)";
        intro.style.pointerEvents = iv < 0.05 ? "none" : "";
      }
      if (hint){ hint.style.opacity = progress > 0.02 ? 0 : 1; }

      // waypoints
      waypoints.forEach(function(wp, i){
        var cfg = WPS[i]; if(!cfg) return;
        var d = Math.abs(progress - cfg.c);
        var vis = d < cfg.w;
        var op = vis ? (1 - d/cfg.w) : 0;
        op = Math.max(0, Math.min(1, op*1.4));
        wp.style.opacity = op;
        wp.style.visibility = op > 0.01 ? "visible" : "hidden";
        var inner = wp.firstElementChild;
        if (inner){ inner.style.transform = "translateY(" + ((1-op)*34) + "px)"; }
      });
    }

    // rAF lerp toward target video time (smooth scrubbing)
    function raf(){
      currentTime += (targetTime - currentTime) * 0.12;
      if (duration && Math.abs(targetTime - currentTime) > 0.01){
        try { if (video.readyState >= 2) video.currentTime = currentTime; } catch(e){}
      }
      requestAnimationFrame(raf);
    }

    window.addEventListener("scroll", updateFromScroll, {passive:true});
    window.addEventListener("resize", updateFromScroll);
    updateFromScroll();
    requestAnimationFrame(raf);
  }

  // ---- Configurador ----
  function initConfig(){
    var section = $(".config"); if(!section) return;
    var groups = $$("[data-config-group]", section);
    var readout = $("[data-config-readout]");
    var img = $("[data-config-img]");
    var cta = $("[data-config-cta]");
    var state = { pieza:"Bolsa de dormir", uso:"Montañismo", color:"Rojo" };
    var imgMap = {
      "Bolsa de dormir":"assets/products/bolsa-pro.webp",
      "Magnesiera":"assets/products/magnesiera-pro.webp",
      "Colchoneta":"assets/images/camp-base.webp"
    };
    function render(){
      if (readout) readout.textContent = state.pieza + " · " + state.uso + " · " + state.color;
      if (img && imgMap[state.pieza]) img.setAttribute("src", imgMap[state.pieza]);
      if (cta){
        var msg = "Hola Apu Outdoors, quiero pedir: " + state.pieza + " para " + state.uso + ", color " + state.color + ". ¿Me pasás precio y plazo?";
        cta.setAttribute("href", waLink(msg)); cta.setAttribute("target","_blank"); cta.setAttribute("rel","noopener");
      }
    }
    groups.forEach(function(g){
      var key = g.getAttribute("data-config-group");
      g.addEventListener("click", function(e){
        var b = e.target.closest(".opt"); if(!b) return;
        $$(".opt", g).forEach(function(o){ o.classList.remove("is-active"); });
        b.classList.add("is-active");
        state[key] = b.getAttribute("data-value");
        render();
      });
    });
    render();
  }

  // ---- Contact form -> WhatsApp ----
  function initForm(){
    var form = $("[data-contact-form]"); if(!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if(!form.reportValidity()) return;
      var nombre = (form.elements.nombre.value||"").trim();
      var salida = (form.elements.salida.value||"").trim();
      var msg = (form.elements.mensaje.value||"").trim();
      var text = "Hola Apu Outdoors, soy " + (nombre||"—") + ". " + (salida ? ("Salida: " + salida + ". ") : "") + (msg||"");
      window.open(waLink(text), "_blank", "noopener");
    });
  }

  function boot(){
    safe(initLinks, "links");
    safe(initSplash, "splash");
    safe(initNav, "nav");
    safe(initAnchors, "anchors");
    safe(initReveals, "reveals");
    safe(initAscent, "ascent");
    safe(initConfig, "config");
    safe(initForm, "form");
    document.documentElement.classList.add("is-ready");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
