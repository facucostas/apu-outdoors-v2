(function () {
  "use strict";
  var data = window.__BRAND__ || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function safe(fn, n){ try{ fn(); }catch(e){ console.warn("["+n+"]", e); } }
  function waLink(msg){ return (data.waBase || "https://wa.me/?text=") + encodeURIComponent(msg || "Hola Apu Outdoors, quiero hacer una consulta."); }

  function docProgress(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function initLinks(){
    $$("[data-wa]").forEach(function(a){ a.setAttribute("href", waLink()); a.setAttribute("target","_blank"); a.setAttribute("rel","noopener"); });
    $$("[data-ig]").forEach(function(a){ if (data.instagram && data.instagram !== "#"){ a.setAttribute("href", data.instagram); a.setAttribute("target","_blank"); a.setAttribute("rel","noopener"); } });
  }

  function initSplash(){
    var s = $("[data-splash]"); if(!s) return;
    var hide = function(){ s.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 700);
    else window.addEventListener("load", function(){ setTimeout(hide, 500); });
    setTimeout(hide, 4200);
  }

  function initNav(){
    var nav = $("[data-nav]"); if(!nav) return;
    var on = function(){ if (scrollY > 60) nav.classList.add("is-scrolled"); else nav.classList.remove("is-scrolled"); };
    on(); window.addEventListener("scroll", on, {passive:true});
    var t = $("[data-nav-toggle]"), m = $("[data-nav-menu]");
    if (t && m){
      t.addEventListener("click", function(){ var o = m.classList.toggle("is-open"); t.classList.toggle("is-open", o); t.setAttribute("aria-expanded", o?"true":"false"); });
      m.addEventListener("click", function(e){ if (e.target.closest("a")){ m.classList.remove("is-open"); t.classList.remove("is-open"); t.setAttribute("aria-expanded","false"); } });
    }
  }

  function initAnchors(){
    document.addEventListener("click", function(e){
      var a = e.target.closest('a[href^="#"]'); if(!a) return;
      var id = a.getAttribute("href"); if(!id || id === "#") return;
      var el = document.querySelector(id); if(!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 60, behavior: reduced ? "auto":"smooth" });
    });
  }

  function initReveals(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-revealed"); io.unobserve(e.target); } });
    }, { threshold:.04, rootMargin:"0px 0px -3% 0px" });
    $$("[data-reveal]").forEach(function(el){ io.observe(el); });
    setTimeout(function(){ $$("[data-reveal]:not(.is-revealed)").forEach(function(el){ if(el.getBoundingClientRect().top < innerHeight) el.classList.add("is-revealed"); }); }, 6000);
  }

  // ===== Fondo montaña día->noche scrubbed por scroll de toda la página =====
  function initSky(){
    var sky = $("[data-sky]"); if(!sky) return;
    var video = $("[data-sky-video]");
    var night = $(".sky-night");
    var altFill = $("[data-alt-fill]"), altDot = $("[data-alt-dot]"), altVal = $("[data-alt-value]");
    var hint = $("[data-scroll-hint]");
    var BASE = 1187, PEAK = 6380;

    var useVideo = false, duration = 0, targetT = 0, curT = 0;

    if (video){
      video.addEventListener("loadedmetadata", function(){ duration = video.duration || 0; if (duration > 0){ useVideo = true; sky.classList.add("has-video"); } });
      video.addEventListener("error", function(){ sky.classList.add("no-video"); });
      video.play().then(function(){ video.pause(); }).catch(function(){});
      // if metadata never loads in 4s, fall back to images
      setTimeout(function(){ if(!useVideo){ sky.classList.add("no-video"); } }, 4000);
    } else {
      sky.classList.add("no-video");
    }

    function update(){
      var p = docProgress();
      // video scrub target OR night image opacity
      targetT = duration * p;
      if (!useVideo && night){ night.style.opacity = p; }
      // altimeter
      var alt = Math.round(BASE + p*(PEAK-BASE));
      if (altVal) altVal.textContent = alt.toLocaleString("es-AR");
      if (altFill) altFill.style.height = (p*100).toFixed(1)+"%";
      if (altDot) altDot.style.bottom = (p*100).toFixed(1)+"%";
      if (hint) hint.style.opacity = p > 0.03 ? 0 : 1;
    }
    function raf(){
      if (useVideo){
        curT += (targetT - curT) * 0.1;
        if (Math.abs(targetT - curT) > 0.01){ try{ if (video.readyState >= 2) video.currentTime = curT; }catch(e){} }
      }
      requestAnimationFrame(raf);
    }
    window.addEventListener("scroll", update, {passive:true});
    window.addEventListener("resize", update);
    update();
    requestAnimationFrame(raf);
  }

  // ===== Configurador =====
  function initConfig(){
    var wrap = $("#pedido"); if(!wrap) return;
    var groups = $$("[data-config-group]", wrap);
    var readout = $("[data-config-readout]");
    var cta = $("[data-config-cta]");
    var state = { pieza:"Bolsa de dormir", uso:"Montañismo", color:"Rojo" };
    function render(){
      if (readout) readout.textContent = state.pieza + " · " + state.uso + " · " + state.color;
      if (cta){ var msg = "Hola Apu Outdoors, quiero pedir: " + state.pieza + " para " + state.uso + ", color " + state.color + ". ¿Me pasás precio y plazo?";
        cta.setAttribute("href", waLink(msg)); cta.setAttribute("target","_blank"); cta.setAttribute("rel","noopener"); }
    }
    groups.forEach(function(g){
      var key = g.getAttribute("data-config-group");
      g.addEventListener("click", function(e){
        var b = e.target.closest(".opt"); if(!b) return;
        $$(".opt", g).forEach(function(o){ o.classList.remove("is-active"); });
        b.classList.add("is-active"); state[key] = b.getAttribute("data-value"); render();
      });
    });
    render();
  }

  function initForm(){
    var form = $("[data-contact-form]"); if(!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault(); if(!form.reportValidity()) return;
      var nombre=(form.elements.nombre.value||"").trim(), salida=(form.elements.salida.value||"").trim(), msg=(form.elements.mensaje.value||"").trim();
      var text = "Hola Apu Outdoors, soy " + (nombre||"—") + ". " + (salida?("Salida: "+salida+". "):"") + msg;
      window.open(waLink(text), "_blank", "noopener");
    });
  }

  function boot(){
    safe(initLinks,"links"); safe(initSplash,"splash"); safe(initNav,"nav"); safe(initAnchors,"anchors");
    safe(initReveals,"reveals"); safe(initSky,"sky"); safe(initConfig,"config"); safe(initForm,"form");
    document.documentElement.classList.add("is-ready");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
