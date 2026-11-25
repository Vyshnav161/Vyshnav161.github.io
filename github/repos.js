(function(){
  var USER='Vyshnav161';
  var HIDE=['calltracker-web'];
  var DESC={trackpad:'Use an Android phone as a wireless trackpad and keyboard for a Mac or Windows computer (Flutter app and .NET desktop agent).'};
  /* snapshot used only if the GitHub API is unavailable or rate limited */
  var FALLBACK=[
    {name:'vm_machine',description:'Run Linux/Windows virtual machines on Android with QEMU (Flutter app)',language:'Dart',stargazers_count:0,pushed_at:'2026-11-24T08:45:29Z'},
    {name:'trackpad',description:'Use an Android phone as a wireless trackpad and keyboard for a Mac or Windows computer (Flutter app and .NET desktop agent).',language:'Dart',stargazers_count:0,pushed_at:'2026-11-25T07:39:11Z'},
    {name:'vyra-nexus',description:'A private, cross-platform, offline-first AI assistant built with Flutter. Run local AI models, have voice conversations, manage models, benchmark device performance, and automate tasks while keeping your data on-device.',language:null,stargazers_count:0,pushed_at:'2026-11-03T05:27:38Z'},
    {name:'Whatsapp_zip_reader',description:'View and explore WhatsApp chat exports (ZIP) with messages and media in a familiar WhatsApp-like UI.',language:'Dart',stargazers_count:4,pushed_at:'2026-11-18T06:57:18Z',homepage:'/wzipchat/'},
    {name:'Vyshnav161.github.io',description:null,language:'HTML',stargazers_count:0,pushed_at:'2026-11-19T07:04:52Z'}
  ];
  var grid=document.getElementById('gh-grid'),q=document.getElementById('gh-q'),langBox=document.getElementById('gh-langs');
  var repos=[],lang='';
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  function ago(iso){
    var d=Math.floor((Date.now()-new Date(iso).getTime())/864e5);
    if(d<1)return 'today';if(d<31)return d+'d ago';
    if(d<365)return Math.floor(d/30)+'mo ago';return Math.floor(d/365)+'y ago';
  }
  function card(r){
    var a=el('a','card gh-card');a.href=r.html_url;a.target='_blank';a.rel='noopener';
    a.appendChild(el('h4',null,r.name));
    a.appendChild(el('p',null,r.description||'No description yet.'));
    var meta=el('div','gh-meta');
    if(r.language)meta.appendChild(el('span','tag',r.language));
    if(r.fork)meta.appendChild(el('span','tag',"Fork"));
    meta.appendChild(el('span','gh-stat','\u2605 '+r.stargazers_count));
    meta.appendChild(el('span','gh-stat','Updated '+ago(r.pushed_at)));
    a.appendChild(meta);
    a.appendChild(el('span','more','View on GitHub \u2192'));
    return a;
  }
  function render(){
    var term=q.value.trim().toLowerCase();
    var list=repos.filter(function(r){
      return (!lang||r.language===lang)&&(!term||(r.name+' '+(r.description||'')).toLowerCase().indexOf(term)>-1);
    });
    grid.textContent='';
    if(!list.length){grid.appendChild(el('p','gh-msg','No repositories match.'));return}
    list.forEach(function(r){grid.appendChild(card(r))});
  }
  function langs(){
    var set={};repos.forEach(function(r){if(r.language)set[r.language]=1});
    ['All'].concat(Object.keys(set).sort()).forEach(function(l){
      var b=el('button','gh-chip'+(l==='All'?' on':''),l);b.type='button';
      b.onclick=function(){
        lang=l==='All'?'':l;
        [].forEach.call(langBox.children,function(c){c.classList.toggle('on',c===b)});
        render();
      };
      langBox.appendChild(b);
    });
  }
  function use(data,live){
    repos=data.filter(function(r){return HIDE.indexOf(r.name)<0}).map(function(r){
      if(!r.description&&DESC[r.name])r.description=DESC[r.name];
      r.html_url=r.html_url||'https://github.com/'+USER+'/'+r.name;return r;
    }).sort(function(a,b){return new Date(b.pushed_at)-new Date(a.pushed_at)});
    langs();render();
    if(!live){var n=el('p','gh-msg','Showing a saved list because GitHub could not be reached.');grid.parentNode.insertBefore(n,grid)}
  }
  q.addEventListener('input',render);
  fetch('https://api.github.com/users/'+USER+'/repos?per_page=100&sort=pushed')
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(d){use(d,true)})
    .catch(function(){use(FALLBACK,false)});
})();
