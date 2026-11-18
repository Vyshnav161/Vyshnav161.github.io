(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s){return document.querySelector(s)};

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  var bar=$('#progress'),topBtn=$('#top'),tl=$('#timeline'),fill=$('#fill');
  function onScroll(){
    var h=document.documentElement.scrollHeight-innerHeight;
    bar.style.width=(h>0?scrollY/h*100:0)+'%';
    topBtn.classList.toggle('show',scrollY>600);
    if(tl&&fill){var r=tl.getBoundingClientRect(),p=(innerHeight*.6-r.top)/r.height;fill.style.height=Math.max(0,Math.min(1,p))*(r.height-12)+'px'}
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  topBtn.onclick=function(){scrollTo({top:0,behavior:'smooth'})};

  // scroll-spy for in-page links
  var links=[].slice.call(document.querySelectorAll('nav a[href^="#"]'));
  if(links.length){
    var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var i=secs.indexOf(e.target);links.forEach(function(l,j){l.classList.toggle('active',i===j)})}})},{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){if(s)so.observe(s)});
  }

  // typing effect
  var t=$('#typed');
  if(t){
    var words=['Flutter apps','healthcare software','medical machine integrations','things people use daily'],wi=0,ci=0,del=false;
    if(reduce){t.textContent=words[0];t.style.animation='none';t.style.border='0'}
    else (function tick(){
      var w=words[wi];t.textContent=w.slice(0,ci);
      if(!del&&ci===w.length){del=true;return setTimeout(tick,1600)}
      if(del&&ci===0){del=false;wi=(wi+1)%words.length}
      ci+=del?-1:1;setTimeout(tick,del?35:70);
    })();
  }

  if(!reduce&&matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.card').forEach(function(c){
      c.addEventListener('mousemove',function(e){
        var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
        c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
        if(c.classList.contains('tilt')){
          var rx=((y/r.height)-.5)*-8,ry=((x/r.width)-.5)*8;
          c.style.transform='perspective(800px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)';
        }
      });
      c.addEventListener('mouseleave',function(){c.style.transform=''});
    });
    var ph=$('#phone');
    if(ph)addEventListener('mousemove',function(e){
      var x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
      ph.style.transform='rotateY('+(-14+x*14)+'deg) rotateX('+(6-y*10)+'deg)';
    });
  }
})();
