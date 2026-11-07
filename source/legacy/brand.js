<script>
(function(){
var b=document.querySelector('.hero:not(.herotxt) .brand');if(!b)return;
var txt=b.textContent;b.setAttribute('aria-label',txt);b.textContent='';
var n=0;
txt.split('').forEach(function(ch){
  var s=document.createElement('span');s.setAttribute('aria-hidden','true');
  if(ch===' '){s.className='bsp';s.innerHTML='&nbsp;'}else{s.className='bl';s.textContent=ch;s.setAttribute('data-t',ch);s.style.setProperty('--i',n++)}
  b.appendChild(s);
});
})();
</script>
