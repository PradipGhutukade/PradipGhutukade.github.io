(function(){
  var nav=document.querySelector('.nav'),tg=document.querySelector('.nav__toggle');
  tg.addEventListener('click',function(){var o=nav.classList.toggle('open');tg.setAttribute('aria-expanded',o)});
  document.querySelectorAll('.nav__links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});
  document.getElementById('yr').textContent=new Date().getFullYear();

  // project cards: hover preview on desktop (muted), click opens the project modal
  var modal=document.getElementById('modal'),mv=modal.querySelector('video');
  document.querySelectorAll('.card').forEach(function(c){
    var v=c.querySelector('video'),src=c.dataset.video;
    c.setAttribute('tabindex','0');c.setAttribute('role','button');
    c.addEventListener('mouseenter',function(){
      if(!v.src){v.src=src}
      v.play().then(function(){c.classList.add('is-playing')}).catch(function(){});
    });
    c.addEventListener('mouseleave',function(){v.pause();c.classList.remove('is-playing')});
    function open(){
      v.pause();c.classList.remove('is-playing');
      mv.src=src;mv.poster=c.querySelector('img')?c.querySelector('img').getAttribute('src'):'';
      modal.hidden=false;modal.scrollTop=0;document.body.classList.add('modal-open');
      mv.play().catch(function(){});
    }
    c.addEventListener('click',open);
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  });
  function close(){mv.pause();mv.removeAttribute('src');mv.load();modal.hidden=true;document.body.classList.remove('modal-open')}
  modal.addEventListener('click',function(e){if(e.target===modal||e.target.classList.contains('modal__close')||e.target.classList.contains('modal__inner'))close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)close()});

  // scroll reveal
  var els=document.querySelectorAll('.projects h2,.projects__frame,.about__text,.about__photo,.skills,.contact__box');
  els.forEach(function(e){e.classList.add('reveal')});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});
    els.forEach(function(e){io.observe(e)});
  }else els.forEach(function(e){e.classList.add('in')});
})();
