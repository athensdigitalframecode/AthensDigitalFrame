<script>
(function(){
var f=document.getElementById('leadform');if(!f)return;
var EN=!!window.EN,WA='306981862732',MAIL='athens.digitalframe@gmail.com';
f.querySelectorAll('[data-el]').forEach(function(e){e.textContent=EN?e.getAttribute('data-en'):e.getAttribute('data-el')});
f.querySelectorAll('[data-pel]').forEach(function(e){e.placeholder=EN?e.getAttribute('data-pen'):e.getAttribute('data-pel')});
var err=document.getElementById('lf-err');
function val(){
  var n=f.n.value.trim(),b=f.b.value.trim(),p=f.p.value.trim();
  if(n.length<2){err.textContent=EN?'Please add your name.':'Γράψε το όνομά σου.';err.hidden=false;f.n.focus();return null}
  if(p.replace(/\D/g,'').length<8){err.textContent=EN?'Please add a valid phone number.':'Γράψε ένα έγκυρο τηλέφωνο.';err.hidden=false;f.p.focus();return null}
  err.hidden=true;
  var msg=EN?('Hi! I\'m '+n+(b?' ('+b+')':'')+'. I\'d like a free demo. My phone: '+p)
           :('Γεια σας! Είμαι ο/η '+n+(b?' ('+b+')':'')+'. Θέλω ένα δωρεάν demo. Τηλέφωνο: '+p);
  return{n:n,b:b,p:p,msg:msg}
}
function ev(n){if(window.va){try{window.va('event',{name:n})}catch(x){}}}
f.addEventListener('submit',function(e){e.preventDefault();var v=val();if(!v)return;ev('form_whatsapp');
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(v.msg),'_blank','noopener')});
document.getElementById('lf-mail').addEventListener('click',function(){var v=val();if(!v)return;ev('form_email');
  location.href='mailto:'+MAIL+'?subject='+encodeURIComponent(EN?'Free demo request':'Αίτημα για δωρεάν demo')+'&body='+encodeURIComponent(v.msg)});
})();
</script>
