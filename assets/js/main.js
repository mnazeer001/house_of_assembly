/* ==========================================================================
   Gombe State House of Assembly — site scripts
   Vanilla JavaScript only. No libraries, no build step, no network calls.
   --------------------------------------------------------------------------
   1. Mobile navigation      5. Members directory (search + filters)
   2. Sticky header shadow   6. Bills tracker (search + status filter)
   3. Reveal on scroll       7. News filter + load more
   4. Counters               8. Gallery lightbox
                             9. Accordion  10. Forms  11. Back to top
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. Mobile navigation ---------- */
    var toggle   = $('.nav-toggle');
    var nav      = $('.main-nav');
    var backdrop = $('.nav-backdrop');

    function setNav(open) {
      if (!nav || !toggle) return;
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (backdrop) backdrop.classList.toggle('show', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    if (toggle) toggle.addEventListener('click', function () {
      setNav(nav.classList.contains('open') === false);
    });
    if (backdrop) backdrop.addEventListener('click', function () { setNav(false); });
    $$('.main-nav a').forEach(function (a) {
      a.addEventListener('click', function () { if (window.innerWidth <= 1020) setNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setNav(false); closeLightbox(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020) setNav(false); });

    /* ---------- 2. Sticky header shadow ---------- */
    var header = $('.site-header');
    var toTop  = $('.to-top');
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('scrolled', y > 8);
      if (toTop)  toTop.classList.toggle('show', y > 520);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 3. Reveal on scroll ---------- */
    var reveals = $$('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
      reveals.forEach(function (el, i) {
        el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + 'ms';
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- 4. Animated counters ---------- */
    var counters = $$('[data-count]');
    if (counters.length) {
      var run = function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dec    = (target % 1 !== 0) ? 2 : 0;
        var start  = null, dur = 1500;
        function frame(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      };
      if ('IntersectionObserver' in window) {
        var co = new IntersectionObserver(function (es) {
          es.forEach(function (en) { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { co.observe(el); });
      } else { counters.forEach(run); }
    }

    /* ---------- 5. Members directory ---------- */
    var memberGrid = $('#member-grid');
    if (memberGrid) {
      var members   = $$('.member', memberGrid);
      var qInput    = $('#member-search');
      var lgaSelect = $('#member-lga');
      var partyBtns = $$('[data-party]');
      var countEl   = $('#member-count');
      var emptyEl   = $('#member-empty');
      var party     = 'all';

      function applyMembers() {
        var q   = (qInput && qInput.value || '').trim().toLowerCase();
        var lga = (lgaSelect && lgaSelect.value) || 'all';
        var shown = 0;
        members.forEach(function (m) {
          var hay = (m.getAttribute('data-search') || '').toLowerCase();
          var ok = (q === '' || hay.indexOf(q) !== -1) &&
                   (lga === 'all' || m.getAttribute('data-lga') === lga) &&
                   (party === 'all' || m.getAttribute('data-party') === party);
          m.hidden = !ok;
          if (ok) shown++;
        });
        if (countEl) countEl.textContent = shown + (shown === 1 ? ' member' : ' members') + ' shown';
        if (emptyEl) emptyEl.hidden = shown !== 0;
      }
      if (qInput)    qInput.addEventListener('input', applyMembers);
      if (lgaSelect) lgaSelect.addEventListener('change', applyMembers);
      partyBtns.forEach(function (b) {
        b.addEventListener('click', function () {
          partyBtns.forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          party = b.getAttribute('data-party');
          applyMembers();
        });
      });
      applyMembers();
    }

    /* ---------- 6. Bills tracker ---------- */
    var billsBody = $('#bills-body');
    if (billsBody) {
      var rows      = $$('tr', billsBody);
      var bq        = $('#bill-search');
      var statusBtn = $$('[data-status]');
      var bCount    = $('#bill-count');
      var bEmpty    = $('#bill-empty');
      var status    = 'all';

      function applyBills() {
        var q = (bq && bq.value || '').trim().toLowerCase();
        var shown = 0;
        rows.forEach(function (r) {
          var hay = (r.getAttribute('data-search') || '').toLowerCase();
          var ok = (q === '' || hay.indexOf(q) !== -1) &&
                   (status === 'all' || r.getAttribute('data-status') === status);
          r.hidden = !ok;
          if (ok) shown++;
        });
        if (bCount) bCount.textContent = shown + (shown === 1 ? ' bill' : ' bills') + ' shown';
        if (bEmpty) bEmpty.hidden = shown !== 0;
      }
      if (bq) bq.addEventListener('input', applyBills);
      statusBtn.forEach(function (b) {
        b.addEventListener('click', function () {
          statusBtn.forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          status = b.getAttribute('data-status');
          applyBills();
        });
      });
      applyBills();
    }

    /* ---------- 7. News filter + load more ---------- */
    var newsGrid = $('#news-grid');
    if (newsGrid) {
      var posts    = $$('.post', newsGrid);
      var catBtns  = $$('[data-cat]');
      var moreBtn  = $('#load-more');
      var nEmpty   = $('#news-empty');
      var cat      = 'all';
      var step     = 6;
      var limit    = step;

      function applyNews() {
        var matched = posts.filter(function (p) {
          return cat === 'all' || p.getAttribute('data-cat') === cat;
        });
        posts.forEach(function (p) { p.hidden = true; });
        matched.slice(0, limit).forEach(function (p) { p.hidden = false; });
        if (moreBtn) moreBtn.hidden = matched.length <= limit;
        if (nEmpty)  nEmpty.hidden  = matched.length !== 0;
      }
      catBtns.forEach(function (b) {
        b.addEventListener('click', function () {
          catBtns.forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          cat = b.getAttribute('data-cat');
          limit = step;
          applyNews();
        });
      });
      if (moreBtn) moreBtn.addEventListener('click', function () { limit += step; applyNews(); });
      applyNews();
    }

    /* ---------- 8. Gallery lightbox ---------- */
    var lb    = $('#lightbox');
    var lbImg = lb ? $('img', lb) : null;
    var lbCap = lb ? $('.cap', lb) : null;
    var lastFocus = null;

    function openLightbox(src, cap) {
      if (!lb) return;
      lastFocus = document.activeElement;
      lbImg.src = src; lbImg.alt = cap || '';
      if (lbCap) lbCap.textContent = cap || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      var btn = $('button', lb); if (btn) btn.focus();
    }
    function closeLightbox() {
      if (!lb || !lb.classList.contains('open')) return;
      lb.classList.remove('open');
      lbImg.src = '';
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    $$('.gitem').forEach(function (fig) {
      fig.addEventListener('click', function () {
        var img = $('img', fig);
        var cap = $('figcaption', fig);
        openLightbox(img.getAttribute('src'), cap ? cap.textContent.trim() : img.alt);
      });
    });
    if (lb) {
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
      var close = $('button', lb);
      if (close) close.addEventListener('click', closeLightbox);
    }

    /* gallery category filter */
    var galleryGrid = $('#gallery-grid');
    if (galleryGrid) {
      var items  = $$('.gitem', galleryGrid);
      var gBtns  = $$('[data-gcat]');
      gBtns.forEach(function (b) {
        b.addEventListener('click', function () {
          gBtns.forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          var c = b.getAttribute('data-gcat');
          items.forEach(function (it) {
            it.hidden = !(c === 'all' || it.getAttribute('data-gcat') === c);
          });
        });
      });
    }

    /* ---------- 9. Accordion ---------- */
    $$('.acc-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item  = btn.closest('.acc-item');
        var panel = (item && item.querySelector('.acc-panel')) || btn.nextElementSibling;
        var open  = btn.getAttribute('aria-expanded') === 'true';
        var group = btn.closest('.accordion');
        if (group) {
          $$('.acc-btn', group).forEach(function (other) {
            if (other !== btn) {
              other.setAttribute('aria-expanded', 'false');
              var oi = other.closest('.acc-item');
              var op = (oi && oi.querySelector('.acc-panel')) || other.nextElementSibling;
              if (op) op.style.maxHeight = null;
            }
          });
        }
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        panel.style.maxHeight = open ? null : panel.scrollHeight + 'px';
      });
    });

    /* ---------- 10. Forms (client-side only) ---------- */
    $$('form[data-validate]').forEach(function (form) {
      var alertBox = $('.alert', form);

      form.addEventListener('submit', function (e) {
        e.preventDefault();                       // static site: nothing is transmitted
        var ok = true;

        if (form.querySelector('.hp') && form.querySelector('.hp').value !== '') return;

        $$('[required]', form).forEach(function (input) {
          var field = input.closest('.field') || input.parentElement;
          var valid = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';
          if (valid && input.type === 'email') {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
          }
          if (valid && input.dataset.phone !== undefined) {
            valid = /^[0-9+()\-\s]{7,20}$/.test(input.value.trim());
          }
          field.classList.toggle('invalid', !valid);
          if (!valid && ok) { input.focus(); ok = false; }
        });
        if (!ok) return;

        var ref = 'GSHA/' + new Date().getFullYear() + '/' + Math.floor(1000 + Math.random() * 8999);
        if (alertBox) {
          alertBox.innerHTML =
            '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
            '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>' +
            '<div><strong>Submission received.</strong> Your reference number is <b>' + ref + '</b>. ' +
            'The Office of the Clerk acknowledges petitions within five working days. ' +
            '<em>Demonstration site — this form is not connected to a server, so nothing was sent or stored.</em></div>';
          alertBox.classList.add('show');
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        $$('.invalid', form).forEach(function (f) { f.classList.remove('invalid'); });
      });

      $$('input,select,textarea', form).forEach(function (i) {
        i.addEventListener('input', function () {
          var f = i.closest('.field');
          if (f) f.classList.remove('invalid');
        });
      });
    });

    /* ---------- 11. Back to top + footer year + sitting day ---------- */
    if (toTop) toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var flag = $('#sitting-flag');
    if (flag) {
      var day   = new Date().getDay();                    // 0 Sun … 6 Sat
      var names = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var sitting = (day >= 2 && day <= 4);               // Tue, Wed, Thu
      flag.innerHTML = sitting
        ? '<span class="led"></span> Plenary sitting today — ' + names[day] + ', 10:00am'
        : '<span class="led"></span> Next plenary: Tuesday, 10:00am';
    }
  });
})();
