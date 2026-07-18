(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function clamp(v,a,b){ return Math.min(b, Math.max(a, v)); }
  function docProgress(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  }

  // ===== Fondo: video montaña día->noche scrubbed por scroll + dron (scale/pan) =====
  function initSky(){
    var sky = $("[data-sky]"); if(!sky) return function(){};
    var video = $("[data-sky-video]"), night = $(".sky-night");
    var altFill = $("[data-alt-fill]"), altVal = $("[data-alt-value]"), hint = $("[data-hint]");
    var BASE = 1187, PEAK = 6380;
    var useVideo = false, duration = 0;

    if (video){
      video.addEventListener("loadedmetadata", function(){ duration = video.duration || 0; if(duration>0){ useVideo=true; sky.classList.add("has-video"); } });
      video.addEventListener("error", function(){ sky.classList.add("no-video"); });
      video.play().then(function(){ video.pause(); }).catch(function(){});
      setTimeout(function(){ if(!useVideo) sky.classList.add("no-video"); }, 4000);
    } else { sky.classList.add("no-video"); }

    return function(p){
      // día->noche: scrub video (o fallback opacidad de la imagen noche)
      if (useVideo && duration){ try{ if(video.readyState>=1) video.currentTime = duration * p; }catch(e){} }
      if (!useVideo && night){ night.style.opacity = p; }
      // dron: se mete lentamente + leve paneo mientras subís
      var scale = (1.05 + p * 0.16).toFixed(3);
      var ty = (p * -3).toFixed(2);
      var tx = (Math.sin(p * Math.PI) * 1.5).toFixed(2);
      var tf = "translate(" + tx + "%," + ty + "%) scale(" + scale + ")";
      if (video) video.style.transform = tf;
      $$(".sky-fallback").forEach(function(im){ im.style.transform = tf; });
      // altímetro
      var alt = Math.round(BASE + p*(PEAK-BASE));
      if (altVal) altVal.textContent = alt.toLocaleString("es-AR");
      if (altFill) altFill.style.height = (p*100).toFixed(1)+"%";
      if (hint) hint.style.opacity = p > 0.03 ? 0 : 1;
    };
  }

  // ===== Secciones acordeón (click para abrir/expandir) =====
  function initSections(){
    var secs = $$("[data-sec]");
    secs.forEach(function(sec){
      var head = $("[data-sec-toggle]", sec);
      head.addEventListener("click", function(){
        var open = sec.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
        if (open){
          // cerrar las demás (acordeón de a una)
          secs.forEach(function(o){ if(o!==sec){ o.classList.remove("is-open"); var h=$("[data-sec-toggle]",o); if(h) h.setAttribute("aria-expanded","false"); } });
          // llevar la sección abierta a una posición cómoda
          setTimeout(function(){
            var top = sec.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top: top, behavior: "smooth" });
          }, 60);
        }
      });
    });
  }

  function boot(){
    var updSky = initSky();
    initSections();
    function onScroll(){ updSky(docProgress()); }
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
