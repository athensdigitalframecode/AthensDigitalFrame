/* runs in <head> before first paint: switch to the JS layout at once so the hero does not change height after load (no inline scripts under the CSP) */
document.documentElement.className = document.documentElement.className.replace('nojs', 'js');
