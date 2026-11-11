/* ADF cube, WebGL renderer (no library). Draws the same six faces as the CSS cube, with a real key light,
   bevelled gold edges and a reflected studio softbox. Face artwork is painted from the DOM faces into one atlas,
   so text, language and glyphs have a single source. Returns null when WebGL is missing: the CSS cube stays. */
window.ADFCubeGL = function (stage, cubeEl, faces, FACE, rot, onLost) {
  var cv = document.createElement('canvas'), gl = null;
  try { gl = cv.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true }); } catch (e) {}
  if (!gl) return null;
  cv.className = 'cb-gl'; stage.insertBefore(cv, stage.firstChild);

  var VS = 'attribute vec3 aP,aN,aT,aB;attribute vec2 aUV;attribute float aTile;uniform mat3 uR;uniform vec3 uK;uniform float uPz;' +
    'varying vec3 vP,vN,vT,vB;varying vec2 vUV;varying float vTile;' +
    'void main(){vec3 p=aP;if(aTile>5.5)p.z+=uPz;vec3 w=uR*p;vP=w;vN=uR*aN;vT=uR*aT;vB=uR*aB;vUV=aUV;vTile=aTile;' +
    'float zc=uK.z-w.z,n=uK.z-1.6,f=uK.z+1.6;gl_Position=vec4(w.x*uK.x,-w.y*uK.y,((f+n)*zc-2.*f*n)/(f-n),zc);}';
  /* space: x right, y DOWN, z to the viewer (same as CSS), so the light and targets are shared with the CSS cube */
  var FS = 'precision highp float;uniform sampler2D uTex;uniform float uPlate;uniform vec3 uEye;' +
    'varying vec3 vP,vN,vT,vB;varying vec2 vUV;varying float vTile;' +
    'vec3 env(vec3 r){float up=-r.y;vec3 c=mix(vec3(.015),vec3(.09,.09,.10),smoothstep(-.3,1.,up));' +
    'c+=vec3(1.,.93,.80)*smoothstep(.80,.97,dot(r,normalize(vec3(.45,-.6,.66))))*1.5;' +          /* warm softbox, above right */
    'c+=vec3(.35,.40,.50)*smoothstep(.75,.98,dot(r,normalize(vec3(-.8,-.2,.1))))*.45;return c;}' + /* cool rim, left */
    'vec3 tile(float t,vec2 uv){return texture2D(uTex,(vec2(mod(t,4.),floor(t/4.))+uv)*vec2(.25,.5)).rgb;}' +
    'void main(){float t=floor(vTile+.5);bool plate=t>5.5;vec2 uv=clamp(vUV,.003,.997);vec3 alb=tile(t,uv);' +
    'if(t<.5)alb=mix(alb,tile(7.,uv),uPlate);' +                                                   /* DISCOVER hides under the plate */
    'float b=plate?.014:.02;float eu=smoothstep(1.-b,1.,vUV.x)-smoothstep(b,0.,vUV.x),ev=smoothstep(1.-b,1.,vUV.y)-smoothstep(b,0.,vUV.y);' +
    'vec3 n=normalize(vN+vT*eu*.85+vB*ev*.85);float e=max(abs(eu),abs(ev));' +                     /* bevel: bend the normal at the edges */
    'alb=mix(alb,vec3(.79,.66,.43)*.55,e*.85);' +                                                  /* gold edge */
    'vec3 V=normalize(uEye-vP),L=normalize(vec3(.45,-.6,.66));float dif=max(dot(n,L),0.);' +
    'float fr=.05+.95*pow(1.-max(dot(n,V),0.),5.);float sp=pow(max(dot(n,normalize(L+V)),0.),60.)*(.25+e*1.2);' +
    'vec3 c=alb*(plate?.84+dif*.3:.22+dif*1.05)+env(reflect(-V,n))*fr*(plate?.5:.9)+vec3(1.,.93,.8)*sp;' +
    'float a=plate?uPlate:1.;gl_FragColor=vec4(c*a,a);}';
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
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ix), gl.STATIC_DRAW);
  [['aP', 3, 0], ['aN', 3, 3], ['aT', 3, 6], ['aB', 3, 9], ['aUV', 2, 12], ['aTile', 1, 14]].forEach(function (a) {
    var l = gl.getAttribLocation(pr, a[0]); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, a[1], gl.FLOAT, false, 60, a[2] * 4); });
  var U = {}; ['uR', 'uK', 'uPz', 'uPlate', 'uEye', 'uTex'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
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
  function paint() {
    faces.forEach(function (f, i) {
      var x = (i % 4) * S, y = (i >> 2) * S, p = S * .085; blank(x, y);
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

  var lastQ = null, lastP = 1;
  function draw(q, plate) {
    lastQ = q; lastP = plate;
    var dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(stage.clientWidth * dpr), H = Math.round(stage.clientHeight * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var x = q[0], y = q[1], z = q[2], w = q[3], s = cubeEl.offsetWidth * dpr;
    gl.uniformMatrix3fv(U.uR, false, [1-2*(y*y+z*z), 2*(x*y+z*w), 2*(x*z-y*w), 2*(x*y-z*w), 1-2*(x*x+z*z), 2*(y*z+x*w), 2*(x*z+y*w), 2*(y*z-x*w), 1-2*(x*x+y*y)]);
    gl.uniform3f(U.uK, 8.4 * s / W, 8.4 * s / H, 4.7);                                              /* same perspective as the CSS cube: 4.2 x size */
    gl.uniform1f(U.uPlate, plate); gl.uniform1f(U.uPz, .004 + .034 * plate);
    gl.disable(gl.BLEND); gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    if (plate > .01) { gl.enable(gl.BLEND); gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 72); }
  }
  function redraw() { if (lastQ) draw(lastQ, lastP); }

  logo.onload = paint; logo.src = stage.getAttribute('data-logo');
  paint();
  if (document.fonts && document.fonts.load) Promise.all(['500 64px "Noto Serif Display"', '500 22px Manrope', '400 20px Marcellus'].map(function (f) { return document.fonts.load(f, 'AaΑα01'); })).then(paint, paint);
  if (window.ResizeObserver) new ResizeObserver(redraw).observe(stage);
  cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cv.remove(); onLost(); });
  return { draw: draw, retex: paint };
};
