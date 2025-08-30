import{g as wt}from"./vendor-Dazix4UH.js";import{R as $n}from"./router-CGnu6c2M.js";function vn(a,n){var t=Object.keys(a);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(a);n&&(e=e.filter(function(r){return Object.getOwnPropertyDescriptor(a,r).enumerable})),t.push.apply(t,e)}return t}function u(a){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?vn(Object(t),!0).forEach(function(e){A(a,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(t)):vn(Object(t)).forEach(function(e){Object.defineProperty(a,e,Object.getOwnPropertyDescriptor(t,e))})}return a}function wa(a){"@babel/helpers - typeof";return wa=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},wa(a)}function Ct(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function At(a,n){for(var t=0;t<n.length;t++){var e=n[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(a,e.key,e)}}function zt(a,n,t){return n&&At(a.prototype,n),Object.defineProperty(a,"prototype",{writable:!1}),a}function A(a,n,t){return n in a?Object.defineProperty(a,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[n]=t,a}function Za(a,n){return St(a)||Lt(a,n)||Un(a,n)||Pt()}function ca(a){return Mt(a)||Ot(a)||Un(a)||Nt()}function Mt(a){if(Array.isArray(a))return Fa(a)}function St(a){if(Array.isArray(a))return a}function Ot(a){if(typeof Symbol<"u"&&a[Symbol.iterator]!=null||a["@@iterator"]!=null)return Array.from(a)}function Lt(a,n){var t=a==null?null:typeof Symbol<"u"&&a[Symbol.iterator]||a["@@iterator"];if(t!=null){var e=[],r=!0,i=!1,o,s;try{for(t=t.call(a);!(r=(o=t.next()).done)&&(e.push(o.value),!(n&&e.length===n));r=!0);}catch(c){i=!0,s=c}finally{try{!r&&t.return!=null&&t.return()}finally{if(i)throw s}}return e}}function Un(a,n){if(a){if(typeof a=="string")return Fa(a,n);var t=Object.prototype.toString.call(a).slice(8,-1);if(t==="Object"&&a.constructor&&(t=a.constructor.name),t==="Map"||t==="Set")return Array.from(a);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return Fa(a,n)}}function Fa(a,n){(n==null||n>a.length)&&(n=a.length);for(var t=0,e=new Array(n);t<n;t++)e[t]=a[t];return e}function Nt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Pt(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var dn=function(){},an={},Wn={},Bn=null,Gn={mark:dn,measure:dn};try{typeof window<"u"&&(an=window),typeof document<"u"&&(Wn=document),typeof MutationObserver<"u"&&(Bn=MutationObserver),typeof performance<"u"&&(Gn=performance)}catch{}var Ht=an.navigator||{},pn=Ht.userAgent,bn=pn===void 0?"":pn,R=an,h=Wn,gn=Bn,ua=Gn;R.document;var _=!!h.documentElement&&!!h.head&&typeof h.addEventListener=="function"&&typeof h.createElement=="function",Xn=~bn.indexOf("MSIE")||~bn.indexOf("Trident/"),ma,va,da,pa,ba,E="___FONT_AWESOME___",ja=16,qn="fa",Kn="svg-inline--fa",W="data-fa-i2svg",Da="data-fa-pseudo-element",Et="data-fa-pseudo-element-pending",nn="data-prefix",tn="data-icon",hn="fontawesome-i2svg",Tt="async",It=["HTML","HEAD","STYLE","SCRIPT"],Qn=(function(){try{return!0}catch{return!1}})(),g="classic",y="sharp",en=[g,y];function fa(a){return new Proxy(a,{get:function(t,e){return e in t?t[e]:t[g]}})}var ea=fa((ma={},A(ma,g,{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands",fak:"kit",fakd:"kit","fa-kit":"kit","fa-kit-duotone":"kit"}),A(ma,y,{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"}),ma)),ra=fa((va={},A(va,g,{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab",kit:"fak"}),A(va,y,{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"}),va)),ia=fa((da={},A(da,g,{fab:"fa-brands",fad:"fa-duotone",fak:"fa-kit",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"}),A(da,y,{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"}),da)),_t=fa((pa={},A(pa,g,{"fa-brands":"fab","fa-duotone":"fad","fa-kit":"fak","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"}),A(pa,y,{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"}),pa)),Vt=/fa(s|r|l|t|d|b|k|ss|sr|sl|st)?[\-\ ]/,Jn="fa-layers-text",Rt=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp|Kit)?.*/i,Ft=fa((ba={},A(ba,g,{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"}),A(ba,y,{900:"fass",400:"fasr",300:"fasl",100:"fast"}),ba)),Zn=[1,2,3,4,5,6,7,8,9,10],jt=Zn.concat([11,12,13,14,15,16,17,18,19,20]),Dt=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],$={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},oa=new Set;Object.keys(ra[g]).map(oa.add.bind(oa));Object.keys(ra[y]).map(oa.add.bind(oa));var Yt=[].concat(en,ca(oa),["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",$.GROUP,$.SWAP_OPACITY,$.PRIMARY,$.SECONDARY]).concat(Zn.map(function(a){return"".concat(a,"x")})).concat(jt.map(function(a){return"w-".concat(a)})),na=R.FontAwesomeConfig||{};function $t(a){var n=h.querySelector("script["+a+"]");if(n)return n.getAttribute(a)}function Ut(a){return a===""?!0:a==="false"?!1:a==="true"?!0:a}if(h&&typeof h.querySelector=="function"){var Wt=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];Wt.forEach(function(a){var n=Za(a,2),t=n[0],e=n[1],r=Ut($t(t));r!=null&&(na[e]=r)})}var at={styleDefault:"solid",familyDefault:"classic",cssPrefix:qn,replacementClass:Kn,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};na.familyPrefix&&(na.cssPrefix=na.familyPrefix);var J=u(u({},at),na);J.autoReplaceSvg||(J.observeMutations=!1);var v={};Object.keys(at).forEach(function(a){Object.defineProperty(v,a,{enumerable:!0,set:function(t){J[a]=t,ta.forEach(function(e){return e(v)})},get:function(){return J[a]}})});Object.defineProperty(v,"familyPrefix",{enumerable:!0,set:function(n){J.cssPrefix=n,ta.forEach(function(t){return t(v)})},get:function(){return J.cssPrefix}});R.FontAwesomeConfig=v;var ta=[];function Bt(a){return ta.push(a),function(){ta.splice(ta.indexOf(a),1)}}var G=ja,H={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Gt(a){if(!(!a||!_)){var n=h.createElement("style");n.setAttribute("type","text/css"),n.innerHTML=a;for(var t=h.head.childNodes,e=null,r=t.length-1;r>-1;r--){var i=t[r],o=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(e=i)}return h.head.insertBefore(n,e),a}}var Xt="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function sa(){for(var a=12,n="";a-- >0;)n+=Xt[Math.random()*62|0];return n}function Z(a){for(var n=[],t=(a||[]).length>>>0;t--;)n[t]=a[t];return n}function rn(a){return a.classList?Z(a.classList):(a.getAttribute("class")||"").split(" ").filter(function(n){return n})}function nt(a){return"".concat(a).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function qt(a){return Object.keys(a||{}).reduce(function(n,t){return n+"".concat(t,'="').concat(nt(a[t]),'" ')},"").trim()}function Ma(a){return Object.keys(a||{}).reduce(function(n,t){return n+"".concat(t,": ").concat(a[t].trim(),";")},"")}function on(a){return a.size!==H.size||a.x!==H.x||a.y!==H.y||a.rotate!==H.rotate||a.flipX||a.flipY}function Kt(a){var n=a.transform,t=a.containerWidth,e=a.iconWidth,r={transform:"translate(".concat(t/2," 256)")},i="translate(".concat(n.x*32,", ").concat(n.y*32,") "),o="scale(".concat(n.size/16*(n.flipX?-1:1),", ").concat(n.size/16*(n.flipY?-1:1),") "),s="rotate(".concat(n.rotate," 0 0)"),c={transform:"".concat(i," ").concat(o," ").concat(s)},l={transform:"translate(".concat(e/2*-1," -256)")};return{outer:r,inner:c,path:l}}function Qt(a){var n=a.transform,t=a.width,e=t===void 0?ja:t,r=a.height,i=r===void 0?ja:r,o="";return Xn?o+="translate(".concat(n.x/G-e/2,"em, ").concat(n.y/G-i/2,"em) "):o+="translate(calc(-50% + ".concat(n.x/G,"em), calc(-50% + ").concat(n.y/G,"em)) "),o+="scale(".concat(n.size/G*(n.flipX?-1:1),", ").concat(n.size/G*(n.flipY?-1:1),") "),o+="rotate(".concat(n.rotate,"deg) "),o}var Jt=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Solid";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Regular";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Light";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Thin";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  -webkit-transform: scale(var(--fa-counter-scale, 0.25));
          transform: scale(var(--fa-counter-scale, 0.25));
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: bottom right;
          transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: bottom left;
          transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: top left;
          transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(var(--fa-li-width, 2em) * -1);
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  -webkit-animation-name: fa-beat;
          animation-name: fa-beat;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);
          animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  -webkit-animation-name: fa-bounce;
          animation-name: fa-bounce;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  -webkit-animation-name: fa-fade;
          animation-name: fa-fade;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  -webkit-animation-name: fa-beat-fade;
          animation-name: fa-beat-fade;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  -webkit-animation-name: fa-flip;
          animation-name: fa-flip;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);
          animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  -webkit-animation-name: fa-shake;
          animation-name: fa-shake;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, linear);
          animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  -webkit-animation-name: fa-spin;
          animation-name: fa-spin;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 2s);
          animation-duration: var(--fa-animation-duration, 2s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, linear);
          animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  -webkit-animation-name: fa-spin;
          animation-name: fa-spin;
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));
          animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    -webkit-animation-delay: -1ms;
            animation-delay: -1ms;
    -webkit-animation-duration: 1ms;
            animation-duration: 1ms;
    -webkit-animation-iteration-count: 1;
            animation-iteration-count: 1;
    -webkit-transition-delay: 0s;
            transition-delay: 0s;
    -webkit-transition-duration: 0s;
            transition-duration: 0s;
  }
}
@-webkit-keyframes fa-beat {
  0%, 90% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  45% {
    -webkit-transform: scale(var(--fa-beat-scale, 1.25));
            transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-beat {
  0%, 90% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  45% {
    -webkit-transform: scale(var(--fa-beat-scale, 1.25));
            transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@-webkit-keyframes fa-bounce {
  0% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  10% {
    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  100% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-bounce {
  0% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  10% {
    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  100% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
}
@-webkit-keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@-webkit-keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));
            transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));
            transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@-webkit-keyframes fa-flip {
  50% {
    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-flip {
  50% {
    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@-webkit-keyframes fa-shake {
  0% {
    -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
  }
  4% {
    -webkit-transform: rotate(15deg);
            transform: rotate(15deg);
  }
  8%, 24% {
    -webkit-transform: rotate(-18deg);
            transform: rotate(-18deg);
  }
  12%, 28% {
    -webkit-transform: rotate(18deg);
            transform: rotate(18deg);
  }
  16% {
    -webkit-transform: rotate(-22deg);
            transform: rotate(-22deg);
  }
  20% {
    -webkit-transform: rotate(22deg);
            transform: rotate(22deg);
  }
  32% {
    -webkit-transform: rotate(-12deg);
            transform: rotate(-12deg);
  }
  36% {
    -webkit-transform: rotate(12deg);
            transform: rotate(12deg);
  }
  40%, 100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
}
@keyframes fa-shake {
  0% {
    -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
  }
  4% {
    -webkit-transform: rotate(15deg);
            transform: rotate(15deg);
  }
  8%, 24% {
    -webkit-transform: rotate(-18deg);
            transform: rotate(-18deg);
  }
  12%, 28% {
    -webkit-transform: rotate(18deg);
            transform: rotate(18deg);
  }
  16% {
    -webkit-transform: rotate(-22deg);
            transform: rotate(-22deg);
  }
  20% {
    -webkit-transform: rotate(22deg);
            transform: rotate(22deg);
  }
  32% {
    -webkit-transform: rotate(-12deg);
            transform: rotate(-12deg);
  }
  36% {
    -webkit-transform: rotate(12deg);
            transform: rotate(12deg);
  }
  40%, 100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
}
@-webkit-keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
@keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
}

.fa-rotate-180 {
  -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
}

.fa-rotate-270 {
  -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
}

.fa-flip-horizontal {
  -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
}

.fa-flip-vertical {
  -webkit-transform: scale(1, -1);
          transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  -webkit-transform: scale(-1, -1);
          transform: scale(-1, -1);
}

.fa-rotate-by {
  -webkit-transform: rotate(var(--fa-rotate-angle, 0));
          transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse,
.fa-duotone.fa-inverse {
  color: var(--fa-inverse, #fff);
}`;function tt(){var a=qn,n=Kn,t=v.cssPrefix,e=v.replacementClass,r=Jt;if(t!==a||e!==n){var i=new RegExp("\\.".concat(a,"\\-"),"g"),o=new RegExp("\\--".concat(a,"\\-"),"g"),s=new RegExp("\\.".concat(n),"g");r=r.replace(i,".".concat(t,"-")).replace(o,"--".concat(t,"-")).replace(s,".".concat(e))}return r}var yn=!1;function Pa(){v.autoAddCss&&!yn&&(Gt(tt()),yn=!0)}var Zt={mixout:function(){return{dom:{css:tt,insertCss:Pa}}},hooks:function(){return{beforeDOMElementCreation:function(){Pa()},beforeI2svg:function(){Pa()}}}},T=R||{};T[E]||(T[E]={});T[E].styles||(T[E].styles={});T[E].hooks||(T[E].hooks={});T[E].shims||(T[E].shims=[]);var N=T[E],et=[],ae=function a(){h.removeEventListener("DOMContentLoaded",a),Ca=1,et.map(function(n){return n()})},Ca=!1;_&&(Ca=(h.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(h.readyState),Ca||h.addEventListener("DOMContentLoaded",ae));function ne(a){_&&(Ca?setTimeout(a,0):et.push(a))}function la(a){var n=a.tag,t=a.attributes,e=t===void 0?{}:t,r=a.children,i=r===void 0?[]:r;return typeof a=="string"?nt(a):"<".concat(n," ").concat(qt(e),">").concat(i.map(la).join(""),"</").concat(n,">")}function kn(a,n,t){if(a&&a[n]&&a[n][t])return{prefix:n,iconName:t,icon:a[n][t]}}var Ha=function(n,t,e,r){var i=Object.keys(n),o=i.length,s=t,c,l,f;for(e===void 0?(c=1,f=n[i[0]]):(c=0,f=e);c<o;c++)l=i[c],f=s(f,n[l],l,n);return f};function te(a){for(var n=[],t=0,e=a.length;t<e;){var r=a.charCodeAt(t++);if(r>=55296&&r<=56319&&t<e){var i=a.charCodeAt(t++);(i&64512)==56320?n.push(((r&1023)<<10)+(i&1023)+65536):(n.push(r),t--)}else n.push(r)}return n}function Ya(a){var n=te(a);return n.length===1?n[0].toString(16):null}function ee(a,n){var t=a.length,e=a.charCodeAt(n),r;return e>=55296&&e<=56319&&t>n+1&&(r=a.charCodeAt(n+1),r>=56320&&r<=57343)?(e-55296)*1024+r-56320+65536:e}function xn(a){return Object.keys(a).reduce(function(n,t){var e=a[t],r=!!e.icon;return r?n[e.iconName]=e.icon:n[t]=e,n},{})}function $a(a,n){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},e=t.skipHooks,r=e===void 0?!1:e,i=xn(n);typeof N.hooks.addPack=="function"&&!r?N.hooks.addPack(a,xn(n)):N.styles[a]=u(u({},N.styles[a]||{}),i),a==="fas"&&$a("fa",n)}var ga,ha,ya,X=N.styles,re=N.shims,ie=(ga={},A(ga,g,Object.values(ia[g])),A(ga,y,Object.values(ia[y])),ga),sn=null,rt={},it={},ot={},st={},ct={},oe=(ha={},A(ha,g,Object.keys(ea[g])),A(ha,y,Object.keys(ea[y])),ha);function se(a){return~Yt.indexOf(a)}function ce(a,n){var t=n.split("-"),e=t[0],r=t.slice(1).join("-");return e===a&&r!==""&&!se(r)?r:null}var ft=function(){var n=function(i){return Ha(X,function(o,s,c){return o[c]=Ha(s,i,{}),o},{})};rt=n(function(r,i,o){if(i[3]&&(r[i[3]]=o),i[2]){var s=i[2].filter(function(c){return typeof c=="number"});s.forEach(function(c){r[c.toString(16)]=o})}return r}),it=n(function(r,i,o){if(r[o]=o,i[2]){var s=i[2].filter(function(c){return typeof c=="string"});s.forEach(function(c){r[c]=o})}return r}),ct=n(function(r,i,o){var s=i[2];return r[o]=o,s.forEach(function(c){r[c]=o}),r});var t="far"in X||v.autoFetchSvg,e=Ha(re,function(r,i){var o=i[0],s=i[1],c=i[2];return s==="far"&&!t&&(s="fas"),typeof o=="string"&&(r.names[o]={prefix:s,iconName:c}),typeof o=="number"&&(r.unicodes[o.toString(16)]={prefix:s,iconName:c}),r},{names:{},unicodes:{}});ot=e.names,st=e.unicodes,sn=Sa(v.styleDefault,{family:v.familyDefault})};Bt(function(a){sn=Sa(a.styleDefault,{family:v.familyDefault})});ft();function cn(a,n){return(rt[a]||{})[n]}function fe(a,n){return(it[a]||{})[n]}function U(a,n){return(ct[a]||{})[n]}function lt(a){return ot[a]||{prefix:null,iconName:null}}function le(a){var n=st[a],t=cn("fas",a);return n||(t?{prefix:"fas",iconName:t}:null)||{prefix:null,iconName:null}}function F(){return sn}var fn=function(){return{prefix:null,iconName:null,rest:[]}};function Sa(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=n.family,e=t===void 0?g:t,r=ea[e][a],i=ra[e][a]||ra[e][r],o=a in N.styles?a:null;return i||o||null}var wn=(ya={},A(ya,g,Object.keys(ia[g])),A(ya,y,Object.keys(ia[y])),ya);function Oa(a){var n,t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=t.skipLookups,r=e===void 0?!1:e,i=(n={},A(n,g,"".concat(v.cssPrefix,"-").concat(g)),A(n,y,"".concat(v.cssPrefix,"-").concat(y)),n),o=null,s=g;(a.includes(i[g])||a.some(function(l){return wn[g].includes(l)}))&&(s=g),(a.includes(i[y])||a.some(function(l){return wn[y].includes(l)}))&&(s=y);var c=a.reduce(function(l,f){var m=ce(v.cssPrefix,f);if(X[f]?(f=ie[s].includes(f)?_t[s][f]:f,o=f,l.prefix=f):oe[s].indexOf(f)>-1?(o=f,l.prefix=Sa(f,{family:s})):m?l.iconName=m:f!==v.replacementClass&&f!==i[g]&&f!==i[y]&&l.rest.push(f),!r&&l.prefix&&l.iconName){var d=o==="fa"?lt(l.iconName):{},b=U(l.prefix,l.iconName);d.prefix&&(o=null),l.iconName=d.iconName||b||l.iconName,l.prefix=d.prefix||l.prefix,l.prefix==="far"&&!X.far&&X.fas&&!v.autoFetchSvg&&(l.prefix="fas")}return l},fn());return(a.includes("fa-brands")||a.includes("fab"))&&(c.prefix="fab"),(a.includes("fa-duotone")||a.includes("fad"))&&(c.prefix="fad"),!c.prefix&&s===y&&(X.fass||v.autoFetchSvg)&&(c.prefix="fass",c.iconName=U(c.prefix,c.iconName)||c.iconName),(c.prefix==="fa"||o==="fa")&&(c.prefix=F()||"fas"),c}var ue=(function(){function a(){Ct(this,a),this.definitions={}}return zt(a,[{key:"add",value:function(){for(var t=this,e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];var o=r.reduce(this._pullDefinitions,{});Object.keys(o).forEach(function(s){t.definitions[s]=u(u({},t.definitions[s]||{}),o[s]),$a(s,o[s]);var c=ia[g][s];c&&$a(c,o[s]),ft()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(t,e){var r=e.prefix&&e.iconName&&e.icon?{0:e}:e;return Object.keys(r).map(function(i){var o=r[i],s=o.prefix,c=o.iconName,l=o.icon,f=l[2];t[s]||(t[s]={}),f.length>0&&f.forEach(function(m){typeof m=="string"&&(t[s][m]=l)}),t[s][c]=l}),t}}]),a})(),Cn=[],q={},Q={},me=Object.keys(Q);function ve(a,n){var t=n.mixoutsTo;return Cn=a,q={},Object.keys(Q).forEach(function(e){me.indexOf(e)===-1&&delete Q[e]}),Cn.forEach(function(e){var r=e.mixout?e.mixout():{};if(Object.keys(r).forEach(function(o){typeof r[o]=="function"&&(t[o]=r[o]),wa(r[o])==="object"&&Object.keys(r[o]).forEach(function(s){t[o]||(t[o]={}),t[o][s]=r[o][s]})}),e.hooks){var i=e.hooks();Object.keys(i).forEach(function(o){q[o]||(q[o]=[]),q[o].push(i[o])})}e.provides&&e.provides(Q)}),t}function Ua(a,n){for(var t=arguments.length,e=new Array(t>2?t-2:0),r=2;r<t;r++)e[r-2]=arguments[r];var i=q[a]||[];return i.forEach(function(o){n=o.apply(null,[n].concat(e))}),n}function B(a){for(var n=arguments.length,t=new Array(n>1?n-1:0),e=1;e<n;e++)t[e-1]=arguments[e];var r=q[a]||[];r.forEach(function(i){i.apply(null,t)})}function I(){var a=arguments[0],n=Array.prototype.slice.call(arguments,1);return Q[a]?Q[a].apply(null,n):void 0}function Wa(a){a.prefix==="fa"&&(a.prefix="fas");var n=a.iconName,t=a.prefix||F();if(n)return n=U(t,n)||n,kn(ut.definitions,t,n)||kn(N.styles,t,n)}var ut=new ue,de=function(){v.autoReplaceSvg=!1,v.observeMutations=!1,B("noAuto")},pe={i2svg:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return _?(B("beforeI2svg",n),I("pseudoElements2svg",n),I("i2svg",n)):Promise.reject("Operation requires a DOM of some kind.")},watch:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=n.autoReplaceSvgRoot;v.autoReplaceSvg===!1&&(v.autoReplaceSvg=!0),v.observeMutations=!0,ne(function(){ge({autoReplaceSvgRoot:t}),B("watch",n)})}},be={icon:function(n){if(n===null)return null;if(wa(n)==="object"&&n.prefix&&n.iconName)return{prefix:n.prefix,iconName:U(n.prefix,n.iconName)||n.iconName};if(Array.isArray(n)&&n.length===2){var t=n[1].indexOf("fa-")===0?n[1].slice(3):n[1],e=Sa(n[0]);return{prefix:e,iconName:U(e,t)||t}}if(typeof n=="string"&&(n.indexOf("".concat(v.cssPrefix,"-"))>-1||n.match(Vt))){var r=Oa(n.split(" "),{skipLookups:!0});return{prefix:r.prefix||F(),iconName:U(r.prefix,r.iconName)||r.iconName}}if(typeof n=="string"){var i=F();return{prefix:i,iconName:U(i,n)||n}}}},L={noAuto:de,config:v,dom:pe,parse:be,library:ut,findIconDefinition:Wa,toHtml:la},ge=function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=n.autoReplaceSvgRoot,e=t===void 0?h:t;(Object.keys(N.styles).length>0||v.autoFetchSvg)&&_&&v.autoReplaceSvg&&L.dom.i2svg({node:e})};function La(a,n){return Object.defineProperty(a,"abstract",{get:n}),Object.defineProperty(a,"html",{get:function(){return a.abstract.map(function(e){return la(e)})}}),Object.defineProperty(a,"node",{get:function(){if(_){var e=h.createElement("div");return e.innerHTML=a.html,e.children}}}),a}function he(a){var n=a.children,t=a.main,e=a.mask,r=a.attributes,i=a.styles,o=a.transform;if(on(o)&&t.found&&!e.found){var s=t.width,c=t.height,l={x:s/c/2,y:.5};r.style=Ma(u(u({},i),{},{"transform-origin":"".concat(l.x+o.x/16,"em ").concat(l.y+o.y/16,"em")}))}return[{tag:"svg",attributes:r,children:n}]}function ye(a){var n=a.prefix,t=a.iconName,e=a.children,r=a.attributes,i=a.symbol,o=i===!0?"".concat(n,"-").concat(v.cssPrefix,"-").concat(t):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:u(u({},r),{},{id:o}),children:e}]}]}function ln(a){var n=a.icons,t=n.main,e=n.mask,r=a.prefix,i=a.iconName,o=a.transform,s=a.symbol,c=a.title,l=a.maskId,f=a.titleId,m=a.extra,d=a.watchable,b=d===void 0?!1:d,x=e.found?e:t,S=x.width,w=x.height,z=r==="fak",k=[v.replacementClass,i?"".concat(v.cssPrefix,"-").concat(i):""].filter(function(V){return m.classes.indexOf(V)===-1}).filter(function(V){return V!==""||!!V}).concat(m.classes).join(" "),C={children:[],attributes:u(u({},m.attributes),{},{"data-prefix":r,"data-icon":i,class:k,role:m.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(S," ").concat(w)})},O=z&&!~m.classes.indexOf("fa-fw")?{width:"".concat(S/w*16*.0625,"em")}:{};b&&(C.attributes[W]=""),c&&(C.children.push({tag:"title",attributes:{id:C.attributes["aria-labelledby"]||"title-".concat(f||sa())},children:[c]}),delete C.attributes.title);var M=u(u({},C),{},{prefix:r,iconName:i,main:t,mask:e,maskId:l,transform:o,symbol:s,styles:u(u({},O),m.styles)}),D=e.found&&t.found?I("generateAbstractMask",M)||{children:[],attributes:{}}:I("generateAbstractIcon",M)||{children:[],attributes:{}},Y=D.children,Na=D.attributes;return M.children=Y,M.attributes=Na,s?ye(M):he(M)}function An(a){var n=a.content,t=a.width,e=a.height,r=a.transform,i=a.title,o=a.extra,s=a.watchable,c=s===void 0?!1:s,l=u(u(u({},o.attributes),i?{title:i}:{}),{},{class:o.classes.join(" ")});c&&(l[W]="");var f=u({},o.styles);on(r)&&(f.transform=Qt({transform:r,width:t,height:e}),f["-webkit-transform"]=f.transform);var m=Ma(f);m.length>0&&(l.style=m);var d=[];return d.push({tag:"span",attributes:l,children:[n]}),i&&d.push({tag:"span",attributes:{class:"sr-only"},children:[i]}),d}function ke(a){var n=a.content,t=a.title,e=a.extra,r=u(u(u({},e.attributes),t?{title:t}:{}),{},{class:e.classes.join(" ")}),i=Ma(e.styles);i.length>0&&(r.style=i);var o=[];return o.push({tag:"span",attributes:r,children:[n]}),t&&o.push({tag:"span",attributes:{class:"sr-only"},children:[t]}),o}var Ea=N.styles;function Ba(a){var n=a[0],t=a[1],e=a.slice(4),r=Za(e,1),i=r[0],o=null;return Array.isArray(i)?o={tag:"g",attributes:{class:"".concat(v.cssPrefix,"-").concat($.GROUP)},children:[{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat($.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat($.PRIMARY),fill:"currentColor",d:i[1]}}]}:o={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:n,height:t,icon:o}}var xe={found:!1,width:512,height:512};function we(a,n){!Qn&&!v.showMissingIcons&&a&&console.error('Icon with name "'.concat(a,'" and prefix "').concat(n,'" is missing.'))}function Ga(a,n){var t=n;return n==="fa"&&v.styleDefault!==null&&(n=F()),new Promise(function(e,r){if(I("missingIconAbstract"),t==="fa"){var i=lt(a)||{};a=i.iconName||a,n=i.prefix||n}if(a&&n&&Ea[n]&&Ea[n][a]){var o=Ea[n][a];return e(Ba(o))}we(a,n),e(u(u({},xe),{},{icon:v.showMissingIcons&&a?I("missingIconAbstract")||{}:{}}))})}var zn=function(){},Xa=v.measurePerformance&&ua&&ua.mark&&ua.measure?ua:{mark:zn,measure:zn},aa='FA "6.5.2"',Ce=function(n){return Xa.mark("".concat(aa," ").concat(n," begins")),function(){return mt(n)}},mt=function(n){Xa.mark("".concat(aa," ").concat(n," ends")),Xa.measure("".concat(aa," ").concat(n),"".concat(aa," ").concat(n," begins"),"".concat(aa," ").concat(n," ends"))},un={begin:Ce,end:mt},ka=function(){};function Mn(a){var n=a.getAttribute?a.getAttribute(W):null;return typeof n=="string"}function Ae(a){var n=a.getAttribute?a.getAttribute(nn):null,t=a.getAttribute?a.getAttribute(tn):null;return n&&t}function ze(a){return a&&a.classList&&a.classList.contains&&a.classList.contains(v.replacementClass)}function Me(){if(v.autoReplaceSvg===!0)return xa.replace;var a=xa[v.autoReplaceSvg];return a||xa.replace}function Se(a){return h.createElementNS("http://www.w3.org/2000/svg",a)}function Oe(a){return h.createElement(a)}function vt(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=n.ceFn,e=t===void 0?a.tag==="svg"?Se:Oe:t;if(typeof a=="string")return h.createTextNode(a);var r=e(a.tag);Object.keys(a.attributes||[]).forEach(function(o){r.setAttribute(o,a.attributes[o])});var i=a.children||[];return i.forEach(function(o){r.appendChild(vt(o,{ceFn:e}))}),r}function Le(a){var n=" ".concat(a.outerHTML," ");return n="".concat(n,"Font Awesome fontawesome.com "),n}var xa={replace:function(n){var t=n[0];if(t.parentNode)if(n[1].forEach(function(r){t.parentNode.insertBefore(vt(r),t)}),t.getAttribute(W)===null&&v.keepOriginalSource){var e=h.createComment(Le(t));t.parentNode.replaceChild(e,t)}else t.remove()},nest:function(n){var t=n[0],e=n[1];if(~rn(t).indexOf(v.replacementClass))return xa.replace(n);var r=new RegExp("".concat(v.cssPrefix,"-.*"));if(delete e[0].attributes.id,e[0].attributes.class){var i=e[0].attributes.class.split(" ").reduce(function(s,c){return c===v.replacementClass||c.match(r)?s.toSvg.push(c):s.toNode.push(c),s},{toNode:[],toSvg:[]});e[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?t.removeAttribute("class"):t.setAttribute("class",i.toNode.join(" "))}var o=e.map(function(s){return la(s)}).join(`
`);t.setAttribute(W,""),t.innerHTML=o}};function Sn(a){a()}function dt(a,n){var t=typeof n=="function"?n:ka;if(a.length===0)t();else{var e=Sn;v.mutateApproach===Tt&&(e=R.requestAnimationFrame||Sn),e(function(){var r=Me(),i=un.begin("mutate");a.map(r),i(),t()})}}var mn=!1;function pt(){mn=!0}function qa(){mn=!1}var Aa=null;function On(a){if(gn&&v.observeMutations){var n=a.treeCallback,t=n===void 0?ka:n,e=a.nodeCallback,r=e===void 0?ka:e,i=a.pseudoElementsCallback,o=i===void 0?ka:i,s=a.observeMutationsRoot,c=s===void 0?h:s;Aa=new gn(function(l){if(!mn){var f=F();Z(l).forEach(function(m){if(m.type==="childList"&&m.addedNodes.length>0&&!Mn(m.addedNodes[0])&&(v.searchPseudoElements&&o(m.target),t(m.target)),m.type==="attributes"&&m.target.parentNode&&v.searchPseudoElements&&o(m.target.parentNode),m.type==="attributes"&&Mn(m.target)&&~Dt.indexOf(m.attributeName))if(m.attributeName==="class"&&Ae(m.target)){var d=Oa(rn(m.target)),b=d.prefix,x=d.iconName;m.target.setAttribute(nn,b||f),x&&m.target.setAttribute(tn,x)}else ze(m.target)&&r(m.target)})}}),_&&Aa.observe(c,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Ne(){Aa&&Aa.disconnect()}function Pe(a){var n=a.getAttribute("style"),t=[];return n&&(t=n.split(";").reduce(function(e,r){var i=r.split(":"),o=i[0],s=i.slice(1);return o&&s.length>0&&(e[o]=s.join(":").trim()),e},{})),t}function He(a){var n=a.getAttribute("data-prefix"),t=a.getAttribute("data-icon"),e=a.innerText!==void 0?a.innerText.trim():"",r=Oa(rn(a));return r.prefix||(r.prefix=F()),n&&t&&(r.prefix=n,r.iconName=t),r.iconName&&r.prefix||(r.prefix&&e.length>0&&(r.iconName=fe(r.prefix,a.innerText)||cn(r.prefix,Ya(a.innerText))),!r.iconName&&v.autoFetchSvg&&a.firstChild&&a.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=a.firstChild.data)),r}function Ee(a){var n=Z(a.attributes).reduce(function(r,i){return r.name!=="class"&&r.name!=="style"&&(r[i.name]=i.value),r},{}),t=a.getAttribute("title"),e=a.getAttribute("data-fa-title-id");return v.autoA11y&&(t?n["aria-labelledby"]="".concat(v.replacementClass,"-title-").concat(e||sa()):(n["aria-hidden"]="true",n.focusable="false")),n}function Te(){return{iconName:null,title:null,titleId:null,prefix:null,transform:H,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Ln(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},t=He(a),e=t.iconName,r=t.prefix,i=t.rest,o=Ee(a),s=Ua("parseNodeAttributes",{},a),c=n.styleParser?Pe(a):[];return u({iconName:e,title:a.getAttribute("title"),titleId:a.getAttribute("data-fa-title-id"),prefix:r,transform:H,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:i,styles:c,attributes:o}},s)}var Ie=N.styles;function bt(a){var n=v.autoReplaceSvg==="nest"?Ln(a,{styleParser:!1}):Ln(a);return~n.extra.classes.indexOf(Jn)?I("generateLayersText",a,n):I("generateSvgReplacementMutation",a,n)}var j=new Set;en.map(function(a){j.add("fa-".concat(a))});Object.keys(ea[g]).map(j.add.bind(j));Object.keys(ea[y]).map(j.add.bind(j));j=ca(j);function Nn(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!_)return Promise.resolve();var t=h.documentElement.classList,e=function(m){return t.add("".concat(hn,"-").concat(m))},r=function(m){return t.remove("".concat(hn,"-").concat(m))},i=v.autoFetchSvg?j:en.map(function(f){return"fa-".concat(f)}).concat(Object.keys(Ie));i.includes("fa")||i.push("fa");var o=[".".concat(Jn,":not([").concat(W,"])")].concat(i.map(function(f){return".".concat(f,":not([").concat(W,"])")})).join(", ");if(o.length===0)return Promise.resolve();var s=[];try{s=Z(a.querySelectorAll(o))}catch{}if(s.length>0)e("pending"),r("complete");else return Promise.resolve();var c=un.begin("onTree"),l=s.reduce(function(f,m){try{var d=bt(m);d&&f.push(d)}catch(b){Qn||b.name==="MissingIcon"&&console.error(b)}return f},[]);return new Promise(function(f,m){Promise.all(l).then(function(d){dt(d,function(){e("active"),e("complete"),r("pending"),typeof n=="function"&&n(),c(),f()})}).catch(function(d){c(),m(d)})})}function _e(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;bt(a).then(function(t){t&&dt([t],n)})}function Ve(a){return function(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=(n||{}).icon?n:Wa(n||{}),r=t.mask;return r&&(r=(r||{}).icon?r:Wa(r||{})),a(e,u(u({},t),{},{mask:r}))}}var Re=function(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=t.transform,r=e===void 0?H:e,i=t.symbol,o=i===void 0?!1:i,s=t.mask,c=s===void 0?null:s,l=t.maskId,f=l===void 0?null:l,m=t.title,d=m===void 0?null:m,b=t.titleId,x=b===void 0?null:b,S=t.classes,w=S===void 0?[]:S,z=t.attributes,k=z===void 0?{}:z,C=t.styles,O=C===void 0?{}:C;if(n){var M=n.prefix,D=n.iconName,Y=n.icon;return La(u({type:"icon"},n),function(){return B("beforeDOMElementCreation",{iconDefinition:n,params:t}),v.autoA11y&&(d?k["aria-labelledby"]="".concat(v.replacementClass,"-title-").concat(x||sa()):(k["aria-hidden"]="true",k.focusable="false")),ln({icons:{main:Ba(Y),mask:c?Ba(c.icon):{found:!1,width:null,height:null,icon:{}}},prefix:M,iconName:D,transform:u(u({},H),r),symbol:o,title:d,maskId:f,titleId:x,extra:{attributes:k,styles:O,classes:w}})})}},Fe={mixout:function(){return{icon:Ve(Re)}},hooks:function(){return{mutationObserverCallbacks:function(t){return t.treeCallback=Nn,t.nodeCallback=_e,t}}},provides:function(n){n.i2svg=function(t){var e=t.node,r=e===void 0?h:e,i=t.callback,o=i===void 0?function(){}:i;return Nn(r,o)},n.generateSvgReplacementMutation=function(t,e){var r=e.iconName,i=e.title,o=e.titleId,s=e.prefix,c=e.transform,l=e.symbol,f=e.mask,m=e.maskId,d=e.extra;return new Promise(function(b,x){Promise.all([Ga(r,s),f.iconName?Ga(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(S){var w=Za(S,2),z=w[0],k=w[1];b([t,ln({icons:{main:z,mask:k},prefix:s,iconName:r,transform:c,symbol:l,maskId:m,title:i,titleId:o,extra:d,watchable:!0})])}).catch(x)})},n.generateAbstractIcon=function(t){var e=t.children,r=t.attributes,i=t.main,o=t.transform,s=t.styles,c=Ma(s);c.length>0&&(r.style=c);var l;return on(o)&&(l=I("generateAbstractTransformGrouping",{main:i,transform:o,containerWidth:i.width,iconWidth:i.width})),e.push(l||i.icon),{children:e,attributes:r}}}},je={mixout:function(){return{layer:function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.classes,i=r===void 0?[]:r;return La({type:"layer"},function(){B("beforeDOMElementCreation",{assembler:t,params:e});var o=[];return t(function(s){Array.isArray(s)?s.map(function(c){o=o.concat(c.abstract)}):o=o.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(v.cssPrefix,"-layers")].concat(ca(i)).join(" ")},children:o}]})}}}},De={mixout:function(){return{counter:function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.title,i=r===void 0?null:r,o=e.classes,s=o===void 0?[]:o,c=e.attributes,l=c===void 0?{}:c,f=e.styles,m=f===void 0?{}:f;return La({type:"counter",content:t},function(){return B("beforeDOMElementCreation",{content:t,params:e}),ke({content:t.toString(),title:i,extra:{attributes:l,styles:m,classes:["".concat(v.cssPrefix,"-layers-counter")].concat(ca(s))}})})}}}},Ye={mixout:function(){return{text:function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.transform,i=r===void 0?H:r,o=e.title,s=o===void 0?null:o,c=e.classes,l=c===void 0?[]:c,f=e.attributes,m=f===void 0?{}:f,d=e.styles,b=d===void 0?{}:d;return La({type:"text",content:t},function(){return B("beforeDOMElementCreation",{content:t,params:e}),An({content:t,transform:u(u({},H),i),title:s,extra:{attributes:m,styles:b,classes:["".concat(v.cssPrefix,"-layers-text")].concat(ca(l))}})})}}},provides:function(n){n.generateLayersText=function(t,e){var r=e.title,i=e.transform,o=e.extra,s=null,c=null;if(Xn){var l=parseInt(getComputedStyle(t).fontSize,10),f=t.getBoundingClientRect();s=f.width/l,c=f.height/l}return v.autoA11y&&!r&&(o.attributes["aria-hidden"]="true"),Promise.resolve([t,An({content:t.innerHTML,width:s,height:c,transform:i,title:r,extra:o,watchable:!0})])}}},$e=new RegExp('"',"ug"),Pn=[1105920,1112319];function Ue(a){var n=a.replace($e,""),t=ee(n,0),e=t>=Pn[0]&&t<=Pn[1],r=n.length===2?n[0]===n[1]:!1;return{value:Ya(r?n[0]:n),isSecondary:e||r}}function Hn(a,n){var t="".concat(Et).concat(n.replace(":","-"));return new Promise(function(e,r){if(a.getAttribute(t)!==null)return e();var i=Z(a.children),o=i.filter(function(Y){return Y.getAttribute(Da)===n})[0],s=R.getComputedStyle(a,n),c=s.getPropertyValue("font-family").match(Rt),l=s.getPropertyValue("font-weight"),f=s.getPropertyValue("content");if(o&&!c)return a.removeChild(o),e();if(c&&f!=="none"&&f!==""){var m=s.getPropertyValue("content"),d=~["Sharp"].indexOf(c[2])?y:g,b=~["Solid","Regular","Light","Thin","Duotone","Brands","Kit"].indexOf(c[2])?ra[d][c[2].toLowerCase()]:Ft[d][l],x=Ue(m),S=x.value,w=x.isSecondary,z=c[0].startsWith("FontAwesome"),k=cn(b,S),C=k;if(z){var O=le(S);O.iconName&&O.prefix&&(k=O.iconName,b=O.prefix)}if(k&&!w&&(!o||o.getAttribute(nn)!==b||o.getAttribute(tn)!==C)){a.setAttribute(t,C),o&&a.removeChild(o);var M=Te(),D=M.extra;D.attributes[Da]=n,Ga(k,b).then(function(Y){var Na=ln(u(u({},M),{},{icons:{main:Y,mask:fn()},prefix:b,iconName:C,extra:D,watchable:!0})),V=h.createElementNS("http://www.w3.org/2000/svg","svg");n==="::before"?a.insertBefore(V,a.firstChild):a.appendChild(V),V.outerHTML=Na.map(function(xt){return la(xt)}).join(`
`),a.removeAttribute(t),e()}).catch(r)}else e()}else e()})}function We(a){return Promise.all([Hn(a,"::before"),Hn(a,"::after")])}function Be(a){return a.parentNode!==document.head&&!~It.indexOf(a.tagName.toUpperCase())&&!a.getAttribute(Da)&&(!a.parentNode||a.parentNode.tagName!=="svg")}function En(a){if(_)return new Promise(function(n,t){var e=Z(a.querySelectorAll("*")).filter(Be).map(We),r=un.begin("searchPseudoElements");pt(),Promise.all(e).then(function(){r(),qa(),n()}).catch(function(){r(),qa(),t()})})}var Ge={hooks:function(){return{mutationObserverCallbacks:function(t){return t.pseudoElementsCallback=En,t}}},provides:function(n){n.pseudoElements2svg=function(t){var e=t.node,r=e===void 0?h:e;v.searchPseudoElements&&En(r)}}},Tn=!1,Xe={mixout:function(){return{dom:{unwatch:function(){pt(),Tn=!0}}}},hooks:function(){return{bootstrap:function(){On(Ua("mutationObserverCallbacks",{}))},noAuto:function(){Ne()},watch:function(t){var e=t.observeMutationsRoot;Tn?qa():On(Ua("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}},In=function(n){var t={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return n.toLowerCase().split(" ").reduce(function(e,r){var i=r.toLowerCase().split("-"),o=i[0],s=i.slice(1).join("-");if(o&&s==="h")return e.flipX=!0,e;if(o&&s==="v")return e.flipY=!0,e;if(s=parseFloat(s),isNaN(s))return e;switch(o){case"grow":e.size=e.size+s;break;case"shrink":e.size=e.size-s;break;case"left":e.x=e.x-s;break;case"right":e.x=e.x+s;break;case"up":e.y=e.y-s;break;case"down":e.y=e.y+s;break;case"rotate":e.rotate=e.rotate+s;break}return e},t)},qe={mixout:function(){return{parse:{transform:function(t){return In(t)}}}},hooks:function(){return{parseNodeAttributes:function(t,e){var r=e.getAttribute("data-fa-transform");return r&&(t.transform=In(r)),t}}},provides:function(n){n.generateAbstractTransformGrouping=function(t){var e=t.main,r=t.transform,i=t.containerWidth,o=t.iconWidth,s={transform:"translate(".concat(i/2," 256)")},c="translate(".concat(r.x*32,", ").concat(r.y*32,") "),l="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),f="rotate(".concat(r.rotate," 0 0)"),m={transform:"".concat(c," ").concat(l," ").concat(f)},d={transform:"translate(".concat(o/2*-1," -256)")},b={outer:s,inner:m,path:d};return{tag:"g",attributes:u({},b.outer),children:[{tag:"g",attributes:u({},b.inner),children:[{tag:e.icon.tag,children:e.icon.children,attributes:u(u({},e.icon.attributes),b.path)}]}]}}}},Ta={x:0,y:0,width:"100%",height:"100%"};function _n(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return a.attributes&&(a.attributes.fill||n)&&(a.attributes.fill="black"),a}function Ke(a){return a.tag==="g"?a.children:[a]}var Qe={hooks:function(){return{parseNodeAttributes:function(t,e){var r=e.getAttribute("data-fa-mask"),i=r?Oa(r.split(" ").map(function(o){return o.trim()})):fn();return i.prefix||(i.prefix=F()),t.mask=i,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides:function(n){n.generateAbstractMask=function(t){var e=t.children,r=t.attributes,i=t.main,o=t.mask,s=t.maskId,c=t.transform,l=i.width,f=i.icon,m=o.width,d=o.icon,b=Kt({transform:c,containerWidth:m,iconWidth:l}),x={tag:"rect",attributes:u(u({},Ta),{},{fill:"white"})},S=f.children?{children:f.children.map(_n)}:{},w={tag:"g",attributes:u({},b.inner),children:[_n(u({tag:f.tag,attributes:u(u({},f.attributes),b.path)},S))]},z={tag:"g",attributes:u({},b.outer),children:[w]},k="mask-".concat(s||sa()),C="clip-".concat(s||sa()),O={tag:"mask",attributes:u(u({},Ta),{},{id:k,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[x,z]},M={tag:"defs",children:[{tag:"clipPath",attributes:{id:C},children:Ke(d)},O]};return e.push(M,{tag:"rect",attributes:u({fill:"currentColor","clip-path":"url(#".concat(C,")"),mask:"url(#".concat(k,")")},Ta)}),{children:e,attributes:r}}}},Je={provides:function(n){var t=!1;R.matchMedia&&(t=R.matchMedia("(prefers-reduced-motion: reduce)").matches),n.missingIconAbstract=function(){var e=[],r={fill:"currentColor"},i={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};e.push({tag:"path",attributes:u(u({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var o=u(u({},i),{},{attributeName:"opacity"}),s={tag:"circle",attributes:u(u({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return t||s.children.push({tag:"animate",attributes:u(u({},i),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:u(u({},o),{},{values:"1;0;1;1;0;1;"})}),e.push(s),e.push({tag:"path",attributes:u(u({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:t?[]:[{tag:"animate",attributes:u(u({},o),{},{values:"1;0;0;0;0;1;"})}]}),t||e.push({tag:"path",attributes:u(u({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:u(u({},o),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:e}}}},Ze={hooks:function(){return{parseNodeAttributes:function(t,e){var r=e.getAttribute("data-fa-symbol"),i=r===null?!1:r===""?!0:r;return t.symbol=i,t}}}},ar=[Zt,Fe,je,De,Ye,Ge,Xe,qe,Qe,Je,Ze];ve(ar,{mixoutsTo:L});L.noAuto;L.config;L.library;L.dom;var Ka=L.parse;L.findIconDefinition;L.toHtml;var nr=L.icon;L.layer;L.text;L.counter;var Ia={exports:{}},_a,Vn;function tr(){if(Vn)return _a;Vn=1;var a="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return _a=a,_a}var Va,Rn;function er(){if(Rn)return Va;Rn=1;var a=tr();function n(){}function t(){}return t.resetWarningCache=n,Va=function(){function e(o,s,c,l,f,m){if(m!==a){var d=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw d.name="Invariant Violation",d}}e.isRequired=e;function r(){return e}var i={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:r,element:e,elementType:e,instanceOf:r,node:e,objectOf:r,oneOf:r,oneOfType:r,shape:r,exact:r,checkPropTypes:t,resetWarningCache:n};return i.PropTypes=i,i},Va}var Fn;function rr(){return Fn||(Fn=1,Ia.exports=er()()),Ia.exports}var ir=rr();const p=wt(ir);function jn(a,n){var t=Object.keys(a);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(a);n&&(e=e.filter(function(r){return Object.getOwnPropertyDescriptor(a,r).enumerable})),t.push.apply(t,e)}return t}function P(a){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?jn(Object(t),!0).forEach(function(e){K(a,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(t)):jn(Object(t)).forEach(function(e){Object.defineProperty(a,e,Object.getOwnPropertyDescriptor(t,e))})}return a}function za(a){"@babel/helpers - typeof";return za=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},za(a)}function K(a,n,t){return n in a?Object.defineProperty(a,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[n]=t,a}function or(a,n){if(a==null)return{};var t={},e=Object.keys(a),r,i;for(i=0;i<e.length;i++)r=e[i],!(n.indexOf(r)>=0)&&(t[r]=a[r]);return t}function sr(a,n){if(a==null)return{};var t=or(a,n),e,r;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(a);for(r=0;r<i.length;r++)e=i[r],!(n.indexOf(e)>=0)&&Object.prototype.propertyIsEnumerable.call(a,e)&&(t[e]=a[e])}return t}function Qa(a){return cr(a)||fr(a)||lr(a)||ur()}function cr(a){if(Array.isArray(a))return Ja(a)}function fr(a){if(typeof Symbol<"u"&&a[Symbol.iterator]!=null||a["@@iterator"]!=null)return Array.from(a)}function lr(a,n){if(a){if(typeof a=="string")return Ja(a,n);var t=Object.prototype.toString.call(a).slice(8,-1);if(t==="Object"&&a.constructor&&(t=a.constructor.name),t==="Map"||t==="Set")return Array.from(a);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return Ja(a,n)}}function Ja(a,n){(n==null||n>a.length)&&(n=a.length);for(var t=0,e=new Array(n);t<n;t++)e[t]=a[t];return e}function ur(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function mr(a){var n,t=a.beat,e=a.fade,r=a.beatFade,i=a.bounce,o=a.shake,s=a.flash,c=a.spin,l=a.spinPulse,f=a.spinReverse,m=a.pulse,d=a.fixedWidth,b=a.inverse,x=a.border,S=a.listItem,w=a.flip,z=a.size,k=a.rotation,C=a.pull,O=(n={"fa-beat":t,"fa-fade":e,"fa-beat-fade":r,"fa-bounce":i,"fa-shake":o,"fa-flash":s,"fa-spin":c,"fa-spin-reverse":f,"fa-spin-pulse":l,"fa-pulse":m,"fa-fw":d,"fa-inverse":b,"fa-border":x,"fa-li":S,"fa-flip":w===!0,"fa-flip-horizontal":w==="horizontal"||w==="both","fa-flip-vertical":w==="vertical"||w==="both"},K(n,"fa-".concat(z),typeof z<"u"&&z!==null),K(n,"fa-rotate-".concat(k),typeof k<"u"&&k!==null&&k!==0),K(n,"fa-pull-".concat(C),typeof C<"u"&&C!==null),K(n,"fa-swap-opacity",a.swapOpacity),n);return Object.keys(O).map(function(M){return O[M]?M:null}).filter(function(M){return M})}function vr(a){return a=a-0,a===a}function gt(a){return vr(a)?a:(a=a.replace(/[\-_\s]+(.)?/g,function(n,t){return t?t.toUpperCase():""}),a.substr(0,1).toLowerCase()+a.substr(1))}var dr=["style"];function pr(a){return a.charAt(0).toUpperCase()+a.slice(1)}function br(a){return a.split(";").map(function(n){return n.trim()}).filter(function(n){return n}).reduce(function(n,t){var e=t.indexOf(":"),r=gt(t.slice(0,e)),i=t.slice(e+1).trim();return r.startsWith("webkit")?n[pr(r)]=i:n[r]=i,n},{})}function ht(a,n){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof n=="string")return n;var e=(n.children||[]).map(function(c){return ht(a,c)}),r=Object.keys(n.attributes||{}).reduce(function(c,l){var f=n.attributes[l];switch(l){case"class":c.attrs.className=f,delete n.attributes.class;break;case"style":c.attrs.style=br(f);break;default:l.indexOf("aria-")===0||l.indexOf("data-")===0?c.attrs[l.toLowerCase()]=f:c.attrs[gt(l)]=f}return c},{attrs:{}}),i=t.style,o=i===void 0?{}:i,s=sr(t,dr);return r.attrs.style=P(P({},r.attrs.style),o),a.apply(void 0,[n.tag,P(P({},r.attrs),s)].concat(Qa(e)))}var yt=!1;try{yt=!0}catch{}function gr(){if(!yt&&console&&typeof console.error=="function"){var a;(a=console).error.apply(a,arguments)}}function Dn(a){if(a&&za(a)==="object"&&a.prefix&&a.iconName&&a.icon)return a;if(Ka.icon)return Ka.icon(a);if(a===null)return null;if(a&&za(a)==="object"&&a.prefix&&a.iconName)return a;if(Array.isArray(a)&&a.length===2)return{prefix:a[0],iconName:a[1]};if(typeof a=="string")return{prefix:"fas",iconName:a}}function Ra(a,n){return Array.isArray(n)&&n.length>0||!Array.isArray(n)&&n?K({},a,n):{}}var Yn={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1},kt=$n.forwardRef(function(a,n){var t=P(P({},Yn),a),e=t.icon,r=t.mask,i=t.symbol,o=t.className,s=t.title,c=t.titleId,l=t.maskId,f=Dn(e),m=Ra("classes",[].concat(Qa(mr(t)),Qa((o||"").split(" ")))),d=Ra("transform",typeof t.transform=="string"?Ka.transform(t.transform):t.transform),b=Ra("mask",Dn(r)),x=nr(f,P(P(P(P({},m),d),b),{},{symbol:i,title:s,titleId:c,maskId:l}));if(!x)return gr("Could not find icon",f),null;var S=x.abstract,w={ref:n};return Object.keys(t).forEach(function(z){Yn.hasOwnProperty(z)||(w[z]=t[z])}),hr(S[0],w)});kt.displayName="FontAwesomeIcon";kt.propTypes={beat:p.bool,border:p.bool,beatFade:p.bool,bounce:p.bool,className:p.string,fade:p.bool,flash:p.bool,mask:p.oneOfType([p.object,p.array,p.string]),maskId:p.string,fixedWidth:p.bool,inverse:p.bool,flip:p.oneOf([!0,!1,"horizontal","vertical","both"]),icon:p.oneOfType([p.object,p.array,p.string]),listItem:p.bool,pull:p.oneOf(["right","left"]),pulse:p.bool,rotation:p.oneOf([0,90,180,270]),shake:p.bool,size:p.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:p.bool,spinPulse:p.bool,spinReverse:p.bool,symbol:p.oneOfType([p.bool,p.string]),title:p.string,titleId:p.string,transform:p.oneOfType([p.string,p.object]),swapOpacity:p.bool};var hr=ht.bind(null,$n.createElement),yr={prefix:"fas",iconName:"file-lines",icon:[384,512,[128441,128462,61686,"file-alt","file-text"],"f15c","M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"]},Rr=yr,kr={prefix:"fas",iconName:"calendar-days",icon:[448,512,["calendar-alt"],"f073","M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"]},Fr=kr,xr={prefix:"fas",iconName:"right-from-bracket",icon:[512,512,["sign-out-alt"],"f2f5","M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"]},jr=xr,Dr={prefix:"fas",iconName:"comments",icon:[640,512,[128490,61670],"f086","M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"]},Yr={prefix:"fas",iconName:"clipboard-list",icon:[384,512,[],"f46d","M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM72 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm104-16H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm88 0c0-8.8 7.2-16 16-16H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16z"]},$r={prefix:"fas",iconName:"user-check",icon:[640,512,[],"f4fc","M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM625 177L497 305c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L591 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"]},Ur={prefix:"fas",iconName:"bars",icon:[448,512,["navicon"],"f0c9","M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"]},wr={prefix:"fas",iconName:"pen-to-square",icon:[512,512,["edit"],"f044","M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"]},Wr=wr,Br={prefix:"fas",iconName:"users",icon:[640,512,[],"f0c0","M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"]},Gr={prefix:"fas",iconName:"eye-slash",icon:[640,512,[],"f070","M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"]},Xr={prefix:"fas",iconName:"user",icon:[448,512,[128100,62144],"f007","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"]},qr={prefix:"fas",iconName:"key",icon:[512,512,[128273],"f084","M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"]},Kr={prefix:"fas",iconName:"star",icon:[576,512,[11088,61446],"f005","M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"]},Qr={prefix:"fas",iconName:"chart-bar",icon:[512,512,["bar-chart"],"f080","M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zm96 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32zm32 64H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"]},Cr={prefix:"fas",iconName:"circle-check",icon:[512,512,[61533,"check-circle"],"f058","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"]},Jr=Cr,Zr={prefix:"fas",iconName:"palette",icon:[512,512,[127912],"f53f","M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]},Ar={prefix:"fas",iconName:"arrows-rotate",icon:[512,512,[128472,"refresh","sync"],"f021","M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"]},ai=Ar,zr={prefix:"fas",iconName:"shield-halved",icon:[512,512,["shield-alt"],"f3ed","M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"]},ni=zr,ti={prefix:"fas",iconName:"chart-line",icon:[512,512,["line-chart"],"f201","M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"]},ei={prefix:"fas",iconName:"arrow-right",icon:[448,512,[8594],"f061","M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"]},ri={prefix:"fas",iconName:"file-image",icon:[384,512,[128443],"f1c5","M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z"]},ii={prefix:"fas",iconName:"eye",icon:[576,512,[128065],"f06e","M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"]},Mr={prefix:"fas",iconName:"floppy-disk",icon:[448,512,[128190,128426,"save"],"f0c7","M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"]},oi=Mr,si={prefix:"fas",iconName:"phone",icon:[512,512,[128222,128379],"f095","M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"]},ci={prefix:"fas",iconName:"arrow-left",icon:[448,512,[8592],"f060","M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"]},fi={prefix:"fas",iconName:"envelope",icon:[512,512,[128386,9993,61443],"f0e0","M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"]},li={prefix:"fas",iconName:"camera",icon:[512,512,[62258,"camera-alt"],"f030","M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"]},Sr={prefix:"fas",iconName:"gear",icon:[512,512,[9881,"cog"],"f013","M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"]},ui=Sr,mi={prefix:"fas",iconName:"clock",icon:[512,512,[128339,"clock-four"],"f017","M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]},vi={prefix:"fas",iconName:"download",icon:[512,512,[],"f019","M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"]},di={prefix:"fas",iconName:"id-card",icon:[576,512,[62147,"drivers-license"],"f2c2","M0 96l576 0c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96zm0 32V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128H0zM64 405.3c0-29.5 23.9-53.3 53.3-53.3H234.7c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7H74.7c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16z"]},Or={prefix:"fas",iconName:"house",icon:[576,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]},pi=Or,bi={prefix:"fas",iconName:"upload",icon:[512,512,[],"f093","M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"]},gi={prefix:"fas",iconName:"sun",icon:[512,512,[9728],"f185","M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"]},hi={prefix:"fas",iconName:"medal",icon:[512,512,[127941],"f5a2","M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0H133.9c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0H487.4C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z"]},yi={prefix:"fas",iconName:"bell",icon:[448,512,[128276,61602],"f0f3","M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"]},Lr={prefix:"fas",iconName:"location-dot",icon:[384,512,["map-marker-alt"],"f3c5","M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"]},ki=Lr,Nr={prefix:"fas",iconName:"magnifying-glass",icon:[512,512,[128269,"search"],"f002","M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]},xi=Nr,Pr={prefix:"fas",iconName:"list-check",icon:[512,512,["tasks"],"f0ae","M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"]},wi=Pr,Ci={prefix:"fas",iconName:"user-graduate",icon:[448,512,[],"f501","M219.3 .5c3.1-.6 6.3-.6 9.4 0l200 40C439.9 42.7 448 52.6 448 64s-8.1 21.3-19.3 23.5L352 102.9V160c0 70.7-57.3 128-128 128s-128-57.3-128-128V102.9L48 93.3v65.1l15.7 78.4c.9 4.7-.3 9.6-3.3 13.3s-7.6 5.9-12.4 5.9H16c-4.8 0-9.3-2.1-12.4-5.9s-4.3-8.6-3.3-13.3L16 158.4V86.6C6.5 83.3 0 74.3 0 64C0 52.6 8.1 42.7 19.3 40.5l200-40zM111.9 327.7c10.5-3.4 21.8 .4 29.4 8.5l71 75.5c6.3 6.7 17 6.7 23.3 0l71-75.5c7.6-8.1 18.9-11.9 29.4-8.5C401 348.6 448 409.4 448 481.3c0 17-13.8 30.7-30.7 30.7H30.7C13.8 512 0 498.2 0 481.3c0-71.9 47-132.7 111.9-153.6z"]},Ai={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"]},Hr={prefix:"fas",iconName:"chalkboard-user",icon:[640,512,["chalkboard-teacher"],"f51c","M160 64c0-35.3 28.7-64 64-64H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H336.8c-11.8-25.5-29.9-47.5-52.4-64H384V320c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h64V64L224 64v49.1C205.2 102.2 183.3 96 160 96V64zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352h53.3C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7H26.7C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"]},zi=Hr,Mi={prefix:"fas",iconName:"trophy",icon:[576,512,[127942],"f091","M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"]},Si={prefix:"fas",iconName:"spinner",icon:[512,512,[],"f110","M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"]},Oi={prefix:"fas",iconName:"award",icon:[384,512,[],"f559","M173.8 5.5c11-7.3 25.4-7.3 36.4 0L228 17.2c6 3.9 13 5.8 20.1 5.4l21.3-1.3c13.2-.8 25.6 6.4 31.5 18.2l9.6 19.1c3.2 6.4 8.4 11.5 14.7 14.7L344.5 83c11.8 5.9 19 18.3 18.2 31.5l-1.3 21.3c-.4 7.1 1.5 14.2 5.4 20.1l11.8 17.8c7.3 11 7.3 25.4 0 36.4L366.8 228c-3.9 6-5.8 13-5.4 20.1l1.3 21.3c.8 13.2-6.4 25.6-18.2 31.5l-19.1 9.6c-6.4 3.2-11.5 8.4-14.7 14.7L301 344.5c-5.9 11.8-18.3 19-31.5 18.2l-21.3-1.3c-7.1-.4-14.2 1.5-20.1 5.4l-17.8 11.8c-11 7.3-25.4 7.3-36.4 0L156 366.8c-6-3.9-13-5.8-20.1-5.4l-21.3 1.3c-13.2 .8-25.6-6.4-31.5-18.2l-9.6-19.1c-3.2-6.4-8.4-11.5-14.7-14.7L39.5 301c-11.8-5.9-19-18.3-18.2-31.5l1.3-21.3c.4-7.1-1.5-14.2-5.4-20.1L5.5 210.2c-7.3-11-7.3-25.4 0-36.4L17.2 156c3.9-6 5.8-13 5.4-20.1l-1.3-21.3c-.8-13.2 6.4-25.6 18.2-31.5l19.1-9.6C65 70.2 70.2 65 73.4 58.6L83 39.5c5.9-11.8 18.3-19 31.5-18.2l21.3 1.3c7.1 .4 14.2-1.5 20.1-5.4L173.8 5.5zM272 192a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM1.3 441.8L44.4 339.3c.2 .1 .3 .2 .4 .4l9.6 19.1c11.7 23.2 36 37.3 62 35.8l21.3-1.3c.2 0 .5 0 .7 .2l17.8 11.8c5.1 3.3 10.5 5.9 16.1 7.7l-37.6 89.3c-2.3 5.5-7.4 9.2-13.3 9.7s-11.6-2.2-14.8-7.2L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6s-4.3-10.7-2.1-16zm248 60.4L211.7 413c5.6-1.8 11-4.3 16.1-7.7l17.8-11.8c.2-.1 .4-.2 .7-.2l21.3 1.3c26 1.5 50.3-12.6 62-35.8l9.6-19.1c.1-.2 .2-.3 .4-.4l43.2 102.5c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7z"]},Li={prefix:"fas",iconName:"building",icon:[384,512,[127970,61687],"f1ad","M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z"]},Ni={prefix:"fas",iconName:"moon",icon:[384,512,[127769,9214],"f186","M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"]},Pi={prefix:"fas",iconName:"calendar",icon:[448,512,[128197,128198],"f133","M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"]},Hi={prefix:"fas",iconName:"desktop",icon:[576,512,[128421,61704,"desktop-alt"],"f390","M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V288H64V64H512z"]},Ei={prefix:"fas",iconName:"briefcase",icon:[512,512,[128188],"f0b1","M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z"]},Ti={prefix:"fas",iconName:"book-open",icon:[576,512,[128214,128366],"f518","M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z"]},Er={prefix:"fas",iconName:"triangle-exclamation",icon:[512,512,[9888,"exclamation-triangle","warning"],"f071","M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},Ii=Er,_i={prefix:"fas",iconName:"paper-plane",icon:[512,512,[61913],"f1d8","M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"]},Tr={prefix:"fas",iconName:"circle-xmark",icon:[512,512,[61532,"times-circle","xmark-circle"],"f057","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"]},Vi=Tr,Ir={prefix:"fas",iconName:"building-columns",icon:[512,512,["bank","institution","museum","university"],"f19c","M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24H456c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224H64V420.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512H480c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1V224H384V416H344V224H280V416H232V224H168V416H128V224zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]},Ri=Ir,Fi={prefix:"fas",iconName:"graduation-cap",icon:[640,512,[127891,"mortar-board"],"f19d","M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"]};export{qr as $,ai as A,ci as B,Li as C,xi as D,di as E,kt as F,oi as G,Ai as H,ki as I,ii as J,Wr as K,bi as L,vi as M,Mi as N,Kr as O,hi as P,si as Q,Oi as R,Ei as S,Ri as T,ni as U,_i as V,ri as W,Zr as X,li as Y,Hi as Z,Gr as _,Ni as a,Si as a0,$r as a1,Vi as a2,Ur as b,zi as c,pi as d,Ci as e,gi as f,Yr as g,Fr as h,Rr as i,wi as j,fi as k,yi as l,Xr as m,ui as n,jr as o,Br as p,mi as q,ti as r,Jr as s,Ti as t,Dr as u,Ii as v,Pi as w,Fi as x,ei as y,Qr as z};
//# sourceMappingURL=ui-BE1NG-gw.js.map
