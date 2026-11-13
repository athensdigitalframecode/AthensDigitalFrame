/* ADF cube, WebGL renderer (no library). Draws the same six faces as the CSS cube, with a real key light,
   bevelled gold edges and a reflected studio softbox. It also draws the page-open intro (the fold, see cube.js). Face artwork is painted from the DOM faces into one atlas,
   so text, language and glyphs have a single source. Returns null when WebGL is missing: the CSS cube stays. */
window.ADFCubeGL = function (stage, cubeEl, faces, FACE, rot, onLost) {
  var cv = document.createElement('canvas'), gl = null;
  try { gl = cv.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true }); } catch (e) {}
  if (!gl) return null;
  cv.className = 'cb-gl';
  stage.insertBefore(cv, stage.firstChild);

  var VS = 'attribute vec3 aP,aN,aT,aB;attribute vec2 aUV;attribute float aTile;uniform mat3 uR,uM;uniform vec3 uK,uO;uniform vec2 uVp;uniform float uPz,uPop,uMode,uLw;' +
    'varying vec3 vP,vN,vT,vB;varying vec2 vUV;varying float vTile;' +
    'void main(){float n=uK.z-1.6,f=uK.z+1.6;vUV=aUV;vTile=aTile;' +
    /* tesseract cage (uMode 3): each edge is a thin quad. aP = this end, aN = the other end (cube space), aUV.x = which side;
       it is widened in screen pixels and pulled a hair towards the eye so it sits on the cube's edges when it collapses */
    'if(uMode>2.5){vec3 a=uR*aP,b=uR*aN;float za=uK.z-a.z,zb=uK.z-b.z;' +
    'vec2 sa=vec2(a.x*uK.x,-a.y*uK.y)/za,sb=vec2(b.x*uK.x,-b.y*uK.y)/zb,dd=(sb-sa)*uVp;float l=length(dd);' +
    'vec2 o=l>1e-3?vec2(-dd.y,dd.x)/l*aUV.x*uLw*2./uVp:vec2(0.);vP=a;vN=aN;vT=aT;vB=aB;' +
    'gl_Position=vec4((sa+o)*za,((f+n)*za-2.*f*n)/(f-n)-.004*za,za);return;}' +
    'vec3 p=aP,c=aN*.5;if(aTile>5.5){p=c+(p-c)*uPop;p.z+=uPz;}' +
    'if(uMode>1.5)p=c+(p-c)*2.6+aN*.006;' +                                                        /* lock ripple (uMode 2): the face quad grown about its centre */
    'vec3 w=uR*(uM*p+uO);vP=w;vN=uR*(uM*aN);vT=uR*(uM*aT);vB=uR*(uM*aB);' +                        /* uM, uO: where a face is while it folds in (identity, 0 once locked) */
    'float zc=uK.z-w.z;gl_Position=vec4(w.x*uK.x,-w.y*uK.y,((f+n)*zc-2.*f*n)/(f-n),zc);}';
  /* space: x right, y DOWN, z to the viewer (same as CSS), so the light and targets are shared with the CSS cube */
  var FS = 'precision highp float;uniform sampler2D uTex;uniform float uPlate,uCover,uT,uMode,uH,uA,uGlow,uSw,uRip;uniform vec3 uEye,uLp;' +
    'const vec3 AU=vec3(.79,.66,.43);' +                                                           /* the brand gold, #C9A96E */
    'varying vec3 vP,vN,vT,vB;varying vec2 vUV;varying float vTile;' +
    'vec3 env(vec3 r){float up=-r.y;vec3 c=mix(vec3(.015),vec3(.09,.09,.10),smoothstep(-.3,1.,up));' +
    'c+=vec3(1.,.93,.80)*smoothstep(.80,.97,dot(r,normalize(vec3(.45,-.6,.66))))*1.5;' +          /* warm softbox, above right */
    'c+=vec3(.35,.40,.50)*smoothstep(.75,.98,dot(r,normalize(vec3(-.8,-.2,.1))))*.45;return c;}' + /* cool rim, left */
    'vec3 tile(float t,vec2 uv){return texture2D(uTex,(vec2(mod(t,4.),floor(t/4.))+uv)*vec2(.25,.5)).rgb;}' +
    'void main(){' +
    /* tesseract cage edge: soft across its width; vUV.y carries the 4D depth cue and the fade */
    'if(uMode>2.5){float a=(1.-vT.x*vT.x)*vUV.y;gl_FragColor=vec4(AU*1.15*a,a*.8);return;}' +
    /* lock ripple: one thin ring leaving the seam of the face that just locked, in that face's plane */
    'if(uMode>1.5){float r=length(vUV-.5)*2.6,a=exp(-pow((r-mix(.52,.98,uRip))/.022,2.))*pow(1.-uRip,1.8)*.2*smoothstep(1.2,.95,r);' +
    'gl_FragColor=vec4(AU*1.2*a,a*.7);return;}' +
    'float row=uH-gl_FragCoord.y;' +
    'float t=floor(vTile+.5);bool plate=t>5.5;vec2 uv=clamp(vUV,.003,.997);vec3 alb=tile(t,uv);' +
    /* a face seen from behind (only while it folds in, or hidden at the back of the cube) is plain dark glass with its gold seam:
       no mirrored artwork, and none of the lighting work below */
    'if(dot(vN,uEye-vP)<0.){float sb=smoothstep(.02,0.,min(min(vUV.x,1.-vUV.x),min(vUV.y,1.-vUV.y))),ab=plate?uPlate:uA;' +
    'gl_FragColor=vec4((vec3(.03,.03,.034)+AU*sb*(.3+uGlow))*ab,ab);return;}' +
    'if(t<.5)alb=mix(alb,tile(7.,uv),uCover);' +                                                   /* DISCOVER hides under the plate */
    'float b=plate?.014:.02;float eu=smoothstep(1.-b,1.,vUV.x)-smoothstep(b,0.,vUV.x),ev=smoothstep(1.-b,1.,vUV.y)-smoothstep(b,0.,vUV.y);' +
    'vec3 n=normalize(vN+vT*eu*.85+vB*ev*.85);float e=max(abs(eu),abs(ev));' +                     /* bevel: bend the normal at the edges */
    'alb=mix(alb,vec3(.79,.66,.43)*.55,e*.85);' +                                                  /* gold edge */
    'vec3 V=normalize(uEye-vP),L=normalize(vec3(.45,-.6,.66));float dif=max(dot(n,L),0.);' +
    'float fr=.05+.95*pow(1.-max(dot(n,V),0.),5.);float sp=pow(max(dot(n,normalize(L+V)),0.),60.)*(.25+e*1.2);' +
    'vec3 c=alb*(plate?.84+dif*.3:.22+dif*1.05)+env(reflect(-V,n))*fr*(plate?.5:.9)+vec3(1.,.93,.8)*sp;' +
    /* living logo: light only where the mark is (its own luminance), so shape and colours stay the original's. A faint, steady gold
       halo comes from a blurred copy; once every 11-17 s one soft reflection crosses it (uT = 0..1 while it travels, -1 = off). */
    'if(plate){float L=dot(tile(6.,uv),vec3(.3,.59,.11));' +
    'float Bl=dot(texture2D(uTex,(vec2(2.,1.)+uv)*vec2(.25,.5),3.5).rgb,vec3(.3,.59,.11));float H=max(Bl-L*.65,0.);' +
    'float sw=uT>=0.?exp(-pow((uv.x*.8+uv.y*.6-mix(-.6,2.1,smoothstep(0.,1.,uT)))/.085,2.)):0.;' +
    'c+=vec3(1.,.93,.8)*sw*L*.55+vec3(.79,.66,.43)*H*.3;}' +
    'c+=AU*e*uGlow;' +                                                                             /* assembly: gold filaments along the seams in transit, a short flash at the lock */
    'if(uSw>=0.)c+=vec3(1.,.93,.8)*exp(-pow((dot(vP,vec3(.62,-.55,.25))-mix(1.15,-1.15,uSw))/.17,2.))*(.04+e*.85);' +   /* one rim light across the finished cube */
    /* light that follows the cursor: a soft gloss under the pointer slides across the faces, stronger on the gold bevel
       and on faces turned to the viewer (uLp: pointer in canvas pixels from the top left, z = on) */
    'if(uLp.z>0.){float q=length(vec2(gl_FragCoord.x,row)-uLp.xy)/(uH*.22);' +
    'c+=vec3(1.,.93,.8)*exp(-q*q)*(.07+.13*max(dot(n,V),0.)+e*.35)*uLp.z*(plate?.5:1.);}' +
    'float a=plate?uPlate:uA;gl_FragColor=vec4(c*a,a);}';
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  var pr = gl.createProgram();
  try { gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr)); }
  catch (e) { console.warn('ADF cube: WebGL shader failed, using the CSS cube.', e); cv.remove(); return null; }
  gl.useProgram(pr);

  /* geometry: six quads turned by the same FACE rotations as the stylesheet, plus the logo plate in front of face 0 */
  var v = [], ix = [];
  function quad(F, half, tileNo) {
    var o = v.length / 15, N = rot(F, [0, 0, 1]), T = rot(F, [1, 0, 0]), B = rot(F, [0, 1, 0]);
    [[-1, -1, 0, 0], [1, -1, 1, 0], [1, 1, 1, 1], [-1, 1, 0, 1]].forEach(function (c) {
      var p = rot(F, [c[0] * half, c[1] * half, .5]); v.push(p[0], p[1], p[2], N[0], N[1], N[2], T[0], T[1], T[2], B[0], B[1], B[2], c[2], c[3], tileNo); });
    ix.push(o, o + 1, o + 2, o, o + 2, o + 3);
  }
  FACE.forEach(function (F, i) { quad(F, .5, i); }); quad(FACE[0], .39, 6);
  /* tesseract cage (intro only): 16 vertices in {-1,+1}^4, 32 edges (vertices one bit apart), drawn as thin quads appended to the
     same buffers. Per vertex: aP = this end, aN = the other end, aT.x = -1..1 across the line, aUV.x = side to widen to,
     aUV.y = brightness. Only the positions and the brightness are rewritten each frame (cage()). */
  var NV = v.length / 15, CAGE0 = ix.length, CGV = new Float32Array(32 * 4 * 15), ED = [], P3 = new Float32Array(48), PI = new Float32Array(16);
  for (var ea = 0; ea < 16; ea++) for (var eb = 0; eb < 4; eb++) if (!(ea >> eb & 1)) ED.push(ea, ea | 1 << eb);
  for (var ee = 0; ee < 32; ee++) {
    for (var ej = 0; ej < 4; ej++) { var eo = (ee * 4 + ej) * 15; CGV[eo + 6] = ej % 2 ? -1 : 1; CGV[eo + 12] = ej === 0 || ej === 3 ? 1 : -1; CGV[eo + 14] = 10; }
    ix.push(NV + ee * 4, NV + ee * 4 + 1, NV + ee * 4 + 2, NV + ee * 4 + 1, NV + ee * 4 + 3, NV + ee * 4 + 2);
  }
  var VB = new Float32Array(v.length + CGV.length); VB.set(v); VB.set(CGV, v.length);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, VB, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ix), gl.STATIC_DRAW);
  /* g: a, b = rotation in the XW and ZW planes (rad), flat = how much of the 4th dimension is left (1..0), k = size, al = brightness.
     Each vertex is rotated in 4D, then projected to 3D by perspective along w: scale = D / (D - w). With flat = 0 and a = b = 0
     the two nested cubes of the projection coincide with the real cube's twelve edges exactly. */
  function cage(g) {
    var ca = Math.cos(g.a), sa = Math.sin(g.a), cb = Math.cos(g.b), sb = Math.sin(g.b), i, j;
    for (i = 0; i < 16; i++) {
      var x = i & 1 ? 1 : -1, y = i & 2 ? 1 : -1, z = i & 4 ? 1 : -1, w = i & 8 ? 1 : -1;
      var x1 = x * ca - w * sa, w1 = x * sa + w * ca, z1 = z * cb - w1 * sb, w2 = (z * sb + w1 * cb) * g.flat, sc = 4 / (4 - w2) * .5 * g.k;
      P3[i * 3] = x1 * sc; P3[i * 3 + 1] = y * sc; P3[i * 3 + 2] = z1 * sc; PI[i] = g.al * (.4 + .6 * Math.min(1, Math.max(0, w2 / 3.5 + .5)));
    }
    for (i = 0; i < 32; i++) for (j = 0; j < 4; j++) {
      var a = ED[i * 2 + (j < 2 ? 0 : 1)] * 3, b = ED[i * 2 + (j < 2 ? 1 : 0)] * 3, o = (i * 4 + j) * 15;
      CGV[o] = P3[a]; CGV[o + 1] = P3[a + 1]; CGV[o + 2] = P3[a + 2]; CGV[o + 3] = P3[b]; CGV[o + 4] = P3[b + 1]; CGV[o + 5] = P3[b + 2]; CGV[o + 13] = PI[a / 3];
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, NV * 60, CGV);
  }
  [['aP', 3, 0], ['aN', 3, 3], ['aT', 3, 6], ['aB', 3, 9], ['aUV', 2, 12], ['aTile', 1, 14]].forEach(function (a) {
    var l = gl.getAttribLocation(pr, a[0]); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, a[1], gl.FLOAT, false, 60, a[2] * 4); });
  var U = {}; ['uR', 'uK', 'uPz', 'uPlate', 'uCover', 'uEye', 'uTex', 'uT', 'uPop', 'uMode', 'uH', 'uLp', 'uM', 'uO', 'uA', 'uGlow', 'uSw', 'uRip', 'uVp', 'uLw'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
  gl.enable(gl.DEPTH_TEST); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.uniform3f(U.uEye, 0, 0, 4.7); gl.uniform1i(U.uTex, 0);

  /* atlas: 4x2 tiles of 512 px. 0-5 service faces, 6 logo plate, 7 blank face */
  var S = 512, at = document.createElement('canvas'), c = at.getContext('2d'), logo = new Image(), tex = gl.createTexture();
  at.width = 4 * S; at.height = 2 * S;
  var GOLD = '#C9A96E', CREAM = '#F5F1E8';
  function blank(x, y) {
    var g = c.createLinearGradient(x, y, x + S, y + S); g.addColorStop(0, '#2b2b2e'); g.addColorStop(.7, '#1b1b1d'); c.fillStyle = g; c.fillRect(x, y, S, S);
    c.fillStyle = GOLD; c.globalAlpha = .85; var m = S * .04, l = S * .045;                       /* crop marks */
    [[m, m, 1, 1], [S - m, m, -1, 1], [m, S - m, 1, -1], [S - m, S - m, -1, -1]].forEach(function (k) {
      c.fillRect(x + k[0], y + k[1], l * k[2], 2 * k[3]); c.fillRect(x + k[0], y + k[1], 2 * k[2], l * k[3]); });
    c.globalAlpha = 1;
  }
  var full = false;
  function paint() {
    faces.forEach(function (f, i) {
      var x = (i % 4) * S, y = (i >> 2) * S, p = S * .085; blank(x, y);
      if (!full) return;
      c.textBaseline = 'alphabetic'; c.textAlign = 'left';
      if ('letterSpacing' in c) c.letterSpacing = '3px';
      c.fillStyle = GOLD; c.font = '500 22px Manrope,sans-serif'; c.fillText(f.querySelector('.cb-n').textContent, x + p, y + p + 20);
      c.fillStyle = 'rgba(245,241,232,.62)'; c.font = '400 20px Marcellus,serif'; c.textAlign = 'right'; c.fillText('ADF', x + S - p, y + p + 20);
      if ('letterSpacing' in c) c.letterSpacing = '0px';
      c.textAlign = 'left'; c.fillStyle = CREAM; c.font = '500 64px "Noto Serif Display",serif'; c.fillText(f.querySelector('.cb-t').textContent, x + p, y + S - p - 8);
      c.save(); c.translate(x + S * .31, y + S * .27); c.scale(S * .38 / 100, S * .38 / 100); c.lineWidth = 1.3;
      [].forEach.call(f.querySelectorAll('svg path'), function (n) { var d = new Path2D(n.getAttribute('d')), cl = n.getAttribute('class');
        c.strokeStyle = cl ? GOLD : CREAM; if (cl === 'fill') { c.fillStyle = GOLD; c.fill(d); } c.stroke(d); });
      c.restore();
    });
    var x = 2 * S, y = S; c.fillStyle = '#0e0e10'; c.fillRect(x, y, S, S);                          /* plate: the official mark, uncropped colours, on its own black */
    if (logo.naturalWidth) { var k = logo.naturalWidth / 1024; c.drawImage(logo, 230 * k, 230 * k, 564 * k, 564 * k, x, y, S, S); }
    blank(3 * S, S);
    gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, at); gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    var an = gl.getExtension('EXT_texture_filter_anisotropic');                                     /* keeps text sharp on faces seen at an angle */
    if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
    redraw();
  }

  var lastQ = null, lastO = null, RM = new Float32Array(9), ID = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]), ZC = new Float32Array(6), ORD = [0, 1, 2, 3, 4, 5];
  var NZ = FACE.map(function (f) { return rot(f, [0, 0, 1]); });
  /* o: plate (rest state 0..1), pa (plate alpha), pop (plate scale), lt (logo light 0..1, -1 off), lp (cursor light).
     During the intro also zoom (camera dolly), sweep (rim light 0..1, -1 off) and fold: per face m (3x3) and o (offset) = where
     it is, a (alpha), g (seam glow), r (lock ripple 0..1, -1 off), plus cage (see cage(); null = no cage) */
  function draw(q, o) {
    lastQ = q; lastO = o; var plate = o.plate, F = o.fold, i, k;
    var dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(stage.clientWidth * dpr), H = Math.round(stage.clientHeight * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var x = q[0], y = q[1], z = q[2], w = q[3], s = cubeEl.offsetWidth * dpr * (o.zoom || 1);
    RM[0] = 1-2*(y*y+z*z); RM[1] = 2*(x*y+z*w); RM[2] = 2*(x*z-y*w); RM[3] = 2*(x*y-z*w); RM[4] = 1-2*(x*x+z*z); RM[5] = 2*(y*z+x*w); RM[6] = 2*(x*z+y*w); RM[7] = 2*(y*z-x*w); RM[8] = 1-2*(x*x+y*y);
    gl.uniformMatrix3fv(U.uR, false, RM);
    gl.uniform3f(U.uK, 8.4 * s / W, 8.4 * s / H, 4.7);                                              /* same perspective as the CSS cube: 4.2 x size */
    gl.uniform1f(U.uPlate, plate * o.pa); gl.uniform1f(U.uCover, plate); gl.uniform1f(U.uPz, .004 + .034 * plate); gl.uniform1f(U.uT, o.lt);
    gl.uniform1f(U.uPop, o.pop); gl.uniform1f(U.uMode, 0); gl.uniform1f(U.uH, H); gl.uniform1f(U.uSw, o.sweep == null ? -1 : o.sweep);
    var lp = o.lp || [0, 0, 0]; gl.uniform3f(U.uLp, (lp[0] + 1) / 2 * W, (lp[1] + 1) / 2 * H, lp[2]);
    gl.uniformMatrix3fv(U.uM, false, ID); gl.uniform3f(U.uO, 0, 0, 0); gl.uniform1f(U.uA, 1); gl.uniform1f(U.uGlow, 0);
    if (!F) { gl.disable(gl.BLEND); gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0); }
    else {
      for (i = 0; i < 6; i++) { var m = F.m[i], n = NZ[i], t = F.o[i];                              /* view depth of each face's centre: far faces are drawn first */
        ZC[i] = RM[2] * ((m[0]*n[0] + m[3]*n[1] + m[6]*n[2]) * .5 + t[0]) + RM[5] * ((m[1]*n[0] + m[4]*n[1] + m[7]*n[2]) * .5 + t[1]) + RM[8] * ((m[2]*n[0] + m[5]*n[1] + m[8]*n[2]) * .5 + t[2]); }
      for (i = 1; i < 6; i++) { var cur = ORD[i]; for (k = i - 1; k >= 0 && ZC[ORD[k]] > ZC[cur]; k--) ORD[k + 1] = ORD[k]; ORD[k + 1] = cur; }
      gl.enable(gl.BLEND);
      for (k = 0; k < 6; k++) { i = ORD[k]; if (F.a[i] < .004) continue;
        gl.uniformMatrix3fv(U.uM, false, F.m[i]); gl.uniform3fv(U.uO, F.o[i]); gl.uniform1f(U.uA, F.a[i]); gl.uniform1f(U.uGlow, F.g[i]);
        gl.depthMask(F.a[i] > .985); gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 12); }   /* half-clear faces do not hide what is behind them */
      gl.uniformMatrix3fv(U.uM, false, ID); gl.uniform3f(U.uO, 0, 0, 0); gl.uniform1f(U.uA, 1); gl.uniform1f(U.uGlow, 0);
      gl.depthMask(false); gl.blendFunc(gl.ONE, gl.ONE);                                            /* light is added on top: rings, then the cage */
      for (i = 0; i < 6; i++) if (F.r[i] >= 0) { gl.uniform1f(U.uMode, 2); gl.uniform1f(U.uRip, F.r[i]); gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 12); }
      if (F.cage && F.cage.al > .003) { cage(F.cage); gl.uniform1f(U.uMode, 3); gl.uniform2f(U.uVp, W, H); gl.uniform1f(U.uLw, 1.1 * dpr);
        gl.depthFunc(gl.LEQUAL); gl.drawElements(gl.TRIANGLES, 192, gl.UNSIGNED_SHORT, CAGE0 * 2); gl.depthFunc(gl.LESS); }
      gl.depthMask(true); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.uniform1f(U.uMode, 0);
    }
    if (plate * o.pa > .01) { gl.enable(gl.BLEND); gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 72); }
  }
  function redraw() { if (lastQ) draw(lastQ, lastO); }

  /* blank faces now, so the intro can start on the first frames; labels and the logo are painted when they are ready */
  paint(); stage.classList.add('is-gl');
  var ready = function () { full = true; paint(); };
  var logoReady = new Promise(function (r) { logo.onload = logo.onerror = r; });
  logo.src = stage.getAttribute('data-logo');
  var fontsReady = document.fonts && document.fonts.load ? Promise.all(['500 64px "Noto Serif Display"', '500 22px Manrope', '400 20px Marcellus'].map(function (f) { return document.fonts.load(f, 'AaΑα01'); })) : Promise.resolve();
  Promise.all([logoReady, fontsReady.catch(function () {})]).then(ready);
  if (window.ResizeObserver) new ResizeObserver(redraw).observe(stage);
  cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cv.remove(); onLost(); });
  return { draw: draw, retex: paint };
};
