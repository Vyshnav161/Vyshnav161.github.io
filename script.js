(function(){
  var d=document,root=d.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $=function(s,c){return (c||d).querySelector(s)};
  var $$=function(s,c){return [].slice.call((c||d).querySelectorAll(s))};
  var mx=-999,my=-999;

  /* split headings into words */
  $$('.split').forEach(function(el){
    var t=el.textContent.trim();
    el.setAttribute('aria-label',t);
    el.innerHTML=t.split(/\s+/).map(function(w,i){return '<span class="w" aria-hidden="true"><span style="--i:'+i+'">'+w+'</span></span>'}).join(' ');
  });

  /* reveal on scroll */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){
      var el=e.target;el.classList.add('in');io.unobserve(el);
      if(el.classList.contains('reveal'))setTimeout(function(){el.classList.add('done')},1300);
    }});},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  $$('.reveal,.split').forEach(function(el){io.observe(el)});

  /* counters */
  function runCount(el){
    var dec=+el.dataset.dec||0,pre=el.dataset.prefix||'',suf=el.dataset.suffix||'';
    var target=el.dataset.since?Math.floor((Date.now()-new Date(el.dataset.since+'-01').getTime())/31557600000):+el.dataset.count;
    var fmt=function(v){return pre+(dec?v.toFixed(dec):Math.round(v))+suf};
    if(reduce){el.textContent=fmt(target);return}
    var t0=null;
    (function step(t){t0=t0||t;var p=Math.min(1,(t-t0)/1500),e=1-Math.pow(1-p,3);el.textContent=fmt(target*e);if(p<1)requestAnimationFrame(step)})(performance.now());
  }
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){runCount(e.target);co.unobserve(e.target)}})},{threshold:.5});
  $$('[data-count],[data-since]').forEach(function(el){co.observe(el)});

  /* progress, scroll vars, timeline, back to top */
  var bar=$('#progress'),topBtn=$('#top'),tl=$('#timeline'),fill=$('#fill');
  var ticking=false;
  function onScroll(){
    var h=root.scrollHeight-innerHeight;
    if(bar)bar.style.width=(h>0?scrollY/h*100:0)+'%';
    if(topBtn)topBtn.classList.toggle('show',scrollY>600);
    root.style.setProperty('--sy',scrollY);
    if(tl&&fill){var r=tl.getBoundingClientRect(),p=(innerHeight*.6-r.top)/r.height;fill.style.height=Math.max(0,Math.min(1,p))*(r.height-12)+'px'}
    stack();
    ticking=false;
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  if(topBtn)topBtn.onclick=function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})};

  /* stacked project cards */
  var cards=$$('.pcard');
  function stack(){
    if(!cards.length)return;
    if(innerWidth<=900){cards.forEach(function(c){c.style.transform='';c.style.setProperty('--cover',0)});return}
    cards.forEach(function(c,i){
      var n=cards[i+1];if(!n){return}
      var cr=c.getBoundingClientRect(),nr=n.getBoundingClientRect();
      var cover=Math.max(0,Math.min(1,(cr.bottom-nr.top)/cr.height));
      c.style.setProperty('--cover',cover.toFixed(3));
      c.style.transform='scale('+(1-cover*.06).toFixed(4)+')';
    });
  }

  /* nav: scroll-spy + sliding indicator */
  var nav=$('nav');
  if(nav){
    var ind=d.createElement('span');ind.className='ind';nav.insertBefore(ind,nav.firstChild);
    var links=$$('a[href^="#"]',nav),cur=links[0],hov=false;
    var move=function(a){if(!a)return;ind.style.width=a.offsetWidth+'px';ind.style.transform='translateX('+a.offsetLeft+'px)';ind.style.opacity=1};
    links.forEach(function(a){a.addEventListener('mouseenter',function(){hov=true;move(a)})});
    nav.addEventListener('mouseleave',function(){hov=false;move(cur)});
    var secs=links.map(function(a){return $(a.getAttribute('href'))});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
      var i=secs.indexOf(e.target);if(i<0)return;cur=links[i];
      links.forEach(function(l,j){l.classList.toggle('active',i===j)});
      if(!hov)move(cur);
    }})},{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){if(s)so.observe(s)});
    var place=function(){move(cur)};
    addEventListener('resize',place);addEventListener('load',place);setTimeout(place,300);
  }

  /* typing */
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

  /* spotlight, tilt, magnetic buttons */
  $$('.spot').forEach(function(c){
    c.addEventListener('mousemove',function(e){
      var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
      if(fine&&!reduce&&c.classList.contains('tilt')){
        c.style.transform='perspective(900px) rotateX('+(((y/r.height)-.5)*-9)+'deg) rotateY('+(((x/r.width)-.5)*9)+'deg) translateY(-5px)';
      }
    });
    c.addEventListener('mouseleave',function(){c.style.transform=''});
  });
  if(fine&&!reduce){
    $$('.btn').forEach(function(b){
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.28)+'px,'+((e.clientY-r.top-r.height/2)*.4)+'px)'});
      b.addEventListener('mouseleave',function(){b.style.transform=''});
    });
  }

  /* hero orbit tilt + phone tilt + floating chip parallax */
  var orbit=$('.orbit'),ph=$('#phone'),chips=$$('.fchip'),phHover=false;
  if(ph){ph.addEventListener('mouseenter',function(){phHover=true;ph.style.transform='rotateY(0deg) rotateX(0deg)'});ph.addEventListener('mouseleave',function(){phHover=false})}
  if(fine&&!reduce){
    addEventListener('mousemove',function(e){
      var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
      if(orbit){orbit.style.setProperty('--ry',(x*22)+'deg');orbit.style.setProperty('--rx',(-y*18)+'deg')}
      if(ph&&!phHover)ph.style.transform='rotateY('+(-12+x*16)+'deg) rotateX('+(5-y*12)+'deg)';
      chips.forEach(function(c,i){var k=(i%2?1:-1)*(14+i*6);c.style.setProperty('--px',(x*k)+'px');c.style.setProperty('--py',(y*k)+'px')});
    });
  }

  /* phone demo */
  if(ph){
    var tabs=$$('.tab',ph),views=$$('.view',ph),idx=0,timer,over=false;
    var show=function(i){idx=i;tabs.forEach(function(b,j){b.classList.toggle('on',j===i)});views.forEach(function(v,j){v.classList.toggle('on',j===i)})};
    var auto=function(){clearInterval(timer);if(!reduce&&!over)timer=setInterval(function(){show((idx+1)%views.length)},5200)};
    tabs.forEach(function(b,i){b.addEventListener('click',function(){show(i);auto()})});
    ph.addEventListener('mouseenter',function(){over=true;clearInterval(timer)});
    ph.addEventListener('mouseleave',function(){over=false;auto()});
    show(0);auto();
  }

  /* copy email */
  var toast=null;
  $$('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var done=function(){
        if(!toast){toast=d.createElement('div');toast.id='toast';d.body.appendChild(toast)}
        toast.textContent='Email copied to clipboard';toast.classList.add('show');
        setTimeout(function(){toast.classList.remove('show')},1800);
      };
      if(navigator.clipboard)navigator.clipboard.writeText(b.dataset.copy).then(done,function(){});
    });
  });

  /* cursor glow + ring */
  if(fine&&!reduce){
    var g=d.createElement('div');g.id='glow';var r=d.createElement('div');r.id='ring';
    d.body.appendChild(g);d.body.appendChild(r);
    var tx=innerWidth/2,ty=innerHeight/2,gx=tx,gy=ty,rx=tx,ry=ty;
    addEventListener('mousemove',function(e){tx=mx=e.clientX;ty=my=e.clientY;d.body.classList.add('moved')},{passive:true});
    d.addEventListener('mouseover',function(e){r.classList.toggle('big',!!e.target.closest('a,button,summary,.spot,.tab'))});
    (function loop(){
      if(!d.hidden){
        gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;rx+=(tx-rx)*.22;ry+=(ty-ry)*.22;
        g.style.transform='translate3d('+(gx-260)+'px,'+(gy-260)+'px,0)';
        r.style.transform='translate3d('+(rx-10)+'px,'+(ry-10)+'px,0)';
      }
      requestAnimationFrame(loop);
    })();
  }

  /* particle constellation */
  if(!reduce){
    var c=d.createElement('canvas');c.id='fx';c.setAttribute('aria-hidden','true');
    var bg=$('.bg');if(bg&&bg.parentNode)bg.parentNode.insertBefore(c,bg.nextSibling);else d.body.insertBefore(c,d.body.firstChild);
    var ctx=c.getContext('2d'),W=0,H=0,DPR=Math.min(devicePixelRatio||1,2),P=[],cols=['255,143,199','167,139,250','92,200,255'];
    var size=function(){
      W=innerWidth;H=innerHeight;c.width=W*DPR;c.height=H*DPR;c.style.width=W+'px';c.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0);
      var n=Math.min(85,Math.floor(W*H/(W<700?26000:17000)));P=[];
      for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.8+.7,c:cols[i%3]});
    };
    size();var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(size,200)});
    (function frame(){
      if(!d.hidden){
        ctx.clearRect(0,0,W,H);
        for(var i=0;i<P.length;i++){
          var p=P[i];
          var dx=mx-p.x,dy=my-p.y,dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<110&&dist>0){p.vx-=dx/dist*.02;p.vy-=dy/dist*.02}
          p.vx*=.995;p.vy*=.995;
          var sp=Math.sqrt(p.vx*p.vx+p.vy*p.vy);if(sp>1.1){p.vx*=1.1/sp;p.vy*=1.1/sp}
          p.x+=p.vx;p.y+=p.vy;
          if(p.x<-10)p.x=W+10;else if(p.x>W+10)p.x=-10;
          if(p.y<-10)p.y=H+10;else if(p.y>H+10)p.y=-10;
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.2832);ctx.fillStyle='rgba('+p.c+',.85)';ctx.fill();
          for(var j=i+1;j<P.length;j++){
            var q=P[j],ax=p.x-q.x,ay=p.y-q.y,dd=ax*ax+ay*ay;
            if(dd<16900){ctx.strokeStyle='rgba('+p.c+','+((1-Math.sqrt(dd)/130)*.32).toFixed(3)+')';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}
          }
          if(dist<190){ctx.strokeStyle='rgba(255,143,199,'+((1-dist/190)*.55).toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mx,my);ctx.stroke()}
        }
      }
      requestAnimationFrame(frame);
    })();
  }

  onScroll();
})();
