import math
ST='fill="none" stroke="#C9A96E" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"'
def svg(cls,s,vb,body,r=None):
    rr=' data-r="%s"'%r if r else ''
    return '<svg class="px ob %s" data-s="%s"%s viewBox="%s" %s><g class="fl">%s</g></svg>'%(cls,s,rr,vb,ST,body)
def frame(w,h):
    return ('<rect x="1" y="1" width="%d" height="%d"/><rect x="8" y="8" width="%d" height="%d" opacity=".7"/>'%(w-2,h-2,w-16,h-16)+
            '<path d="M8 22V8h14M%d 22V8H%d M8 %dv14h14M%d %dv14H%d" opacity=".9"/>'%(w-8,w-22,h-22,w-8,h-22,w-22)+
            '<path d="M%d %d l5 5 -5 5 -5 -5z" opacity=".8"/>'%(w//2-0,h//2-5))
def column(h=160):
    return ('<rect x="2" y="0" width="36" height="4"/><circle cx="9" cy="11" r="6"/><circle cx="31" cy="11" r="6"/><path d="M9 5h22M9 17h22"/>'
            '<path d="M10 20v%d M15 20v%d M20 20v%d M25 20v%d M30 20v%d"/><rect x="6" y="%d" width="28" height="5"/><rect x="2" y="%d" width="36" height="6"/>'%(h-42,h-42,h-42,h-42,h-42,h-22,h-17))
def broken():
    return ('<rect x="2" y="0" width="36" height="4"/><circle cx="9" cy="11" r="6"/><circle cx="31" cy="11" r="6"/><path d="M9 5h22M9 17h22"/>'
            '<path d="M10 20v34l6 6 4-8 5 9 5-7 0-34 M15 20v28 M20 20v22 M25 20v26"/>'
            '<path d="M4 108l12-6 6 4 8-8 10 7v10H4z"/><rect x="2" y="116" width="36" height="6"/>')
def const(pts):
    d='M'+' L'.join('%d %d'%p for p in pts)
    c=''.join('<circle cx="%d" cy="%d" r="%s"/>'%(x,y,'3' if i==2 else '2') for i,(x,y) in enumerate(pts))
    return '<path d="%s" opacity=".55"/>%s'%(d,c)
def key(n=10):
    d=''
    for i in range(n):
        x=16*i
        d+='M%d 18V2H%d V14H%d V8 '%(x,x+14,x+6)
    return '<path d="%s"/>'%d.replace('V2H','V2 H').replace(' V14H',' V14 H')
def star8():
    pts=[]
    for i in range(16):
        r=30 if i%2==0 else 12; a=math.pi*i/8-math.pi/2
        pts.append('%.1f %.1f'%(34+r*math.cos(a),34+r*math.sin(a)))
    return '<path d="M%sz"/><circle cx="34" cy="34" r="33" opacity=".5"/><circle cx="34" cy="34" r="3"/>'%' L'.join(pts)
def lozenge():
    return '<path d="M20 1l19 19-19 19L1 20z"/><path d="M20 9l11 11-11 11-11-11z" opacity=".6"/>'
items=[
 svg('k-fr1',.28,'0 0 100 130',frame(100,130),.003),
 svg('k-fr2',.36,'0 0 70 90',frame(70,90),-.004),
 svg('k-fr3',.24,'0 0 130 84',frame(130,84),.002),
 svg('k-col1',.30,'0 0 40 160',column()),
 svg('k-col2',.34,'0 0 40 124',broken()),
 svg('k-st1',.32,'0 0 116 72',const([(5,52),(30,14),(58,34),(84,8),(110,40),(92,68)])),
 svg('k-st2',.27,'0 0 100 80',const([(4,60),(26,30),(50,48),(70,12),(96,26)])),
 svg('k-key',.22,'0 0 160 20',key()),
 svg('k-s8',.26,'0 0 68 68',star8(),.005),
 svg('k-lz1',.38,'0 0 40 40',lozenge(),.006),
 svg('k-lz2',.30,'0 0 40 40',lozenge(),-.005),
 svg('k-key k-key2',.34,'0 0 160 20',key()),
]
HTML='\n  '.join(items)
CSS='''.ob{opacity:.5;filter:none}
.k-fr1{left:5%;top:20%;width:92px}.k-fr2{right:7%;top:58%;width:66px}.k-fr3{left:46%;top:150%;width:118px}
.k-col1{right:4%;top:36%;width:38px;opacity:.42}.k-col2{left:3%;top:108%;width:42px;opacity:.42}
.k-st1{right:12%;top:12%;width:104px;opacity:.55}.k-st2{left:10%;top:82%;width:90px;opacity:.5}
.k-key{left:30%;top:122%;width:150px;opacity:.38}.k-key2{left:8%;top:200%;width:130px}
.k-s8{right:22%;top:96%;width:62px;opacity:.5}.k-lz1{left:24%;top:44%;width:30px}.k-lz2{right:30%;top:178%;width:34px}
.bg .orb,.bg .vl,.sales,.toast{display:none!important}
@media (min-width:700px){.k-fr1{left:7%;top:40%;width:120px}.k-fr2{right:10%;top:70%;width:90px}.k-col1{right:6%;top:30%;width:50px}.k-st1{right:16%;top:12%;width:150px}.k-st2{left:12%;top:76%;width:120px}.k-col2{left:5%;width:54px}.k-s8{right:30%;top:92%;width:80px}}
'''
