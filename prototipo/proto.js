(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function initNav(){
    var nav = $("[data-nav]"); if(!nav) return;
    var on = function(){ nav.classList.toggle("scrolled", window.scrollY > 60); };
    on(); window.addEventListener("scroll", on, { passive:true });
    var b = $("[data-burger]"), m = $("[data-menu]");
    if (b && m){
      b.addEventListener("click", function(){
        var open = m.classList.toggle("open"); b.classList.toggle("open", open);
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
      m.addEventListener("click", function(e){ if (e.target.closest("a")){ m.classList.remove("open"); b.classList.remove("open"); b.setAttribute("aria-expanded","false"); } });
    }
  }

  function initReveal(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold:.18, rootMargin:"0px 0px -5% 0px" });
    $$("[data-reveal]").forEach(function(el){ io.observe(el); });
    setTimeout(function(){ $$("[data-reveal]:not(.is-in)").forEach(function(el){ if(el.getBoundingClientRect().top < innerHeight) el.classList.add("is-in"); }); }, 5000);
  }

  function boot(){ initNav(); initReveal(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
