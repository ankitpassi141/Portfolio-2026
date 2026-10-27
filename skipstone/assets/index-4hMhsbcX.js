var Iu=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports);var ix=Iu((sx,Jn)=>{(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2010-2021 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yl="128",Fu=0,_o=1,Nu=2,jl=1,zu=2,or=3,Ss=0,lt=1,Nn=2,Zl=1,Rn=0,cr=1,wo=2,Mo=3,bo=4,Bu=5,Mi=100,ku=101,Ou=102,So=103,To=104,Hu=200,Gu=201,Uu=202,Vu=203,Jl=204,Ql=205,Wu=206,qu=207,Xu=208,Yu=209,ju=210,Zu=0,Ju=1,Qu=2,Ra=3,$u=4,Ku=5,eh=6,th=7,Ts=0,nh=1,ih=2,Ai=0,rh=1,sh=2,ah=3,$l=4,oh=5,Kl=300,qa=301,Xa=302,Eo=303,Ao=304,Es=306,Ya=307,hs=1e3,jt=1001,Pa=1002,dt=1003,Lo=1004,Co=1005,zt=1006,lh=1007,ja=1008,_r=1009,ch=1010,uh=1011,ds=1012,hh=1013,ss=1014,gn=1015,fs=1016,dh=1017,fh=1018,ph=1019,ur=1020,mh=1021,Zn=1022,Ft=1023,gh=1024,vh=1025,xh=Ft,Li=1026,fr=1027,yh=1028,_h=1029,wh=1030,Mh=1031,bh=1032,Sh=1033,Ro=33776,Po=33777,Do=33778,Io=33779,Fo=35840,No=35841,zo=35842,Bo=35843,Th=36196,ko=37492,Oo=37496,Eh=37808,Ah=37809,Lh=37810,Ch=37811,Rh=37812,Ph=37813,Dh=37814,Ih=37815,Fh=37816,Nh=37817,zh=37818,Bh=37819,kh=37820,Oh=37821,Hh=36492,Gh=37840,Uh=37841,Vh=37842,Wh=37843,qh=37844,Xh=37845,Yh=37846,jh=37847,Zh=37848,Jh=37849,Qh=37850,$h=37851,Kh=37852,ed=37853,td=2200,nd=2201,id=2202,ps=2300,ms=2301,qs=2302,Si=2400,Ti=2401,gs=2402,Za=2500,ec=2501,rd=0,Ct=3e3,ki=3001,Ja=3007,Qa=3002,sd=3003,tc=3004,nc=3005,ic=3006,ad=3200,od=3201,Oi=0,ld=1,Xs=7680,cd=519,pr=35044,vs=35048,Ho="300 es";class $n{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const gt=[];for(let r=0;r<256;r++)gt[r]=(r<16?"0":"")+r.toString(16);const Ys=Math.PI/180,Da=180/Math.PI;function rn(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(gt[r&255]+gt[r>>8&255]+gt[r>>16&255]+gt[r>>24&255]+"-"+gt[e&255]+gt[e>>8&255]+"-"+gt[e>>16&15|64]+gt[e>>24&255]+"-"+gt[t&63|128]+gt[t>>8&255]+"-"+gt[t>>16&255]+gt[t>>24&255]+gt[n&255]+gt[n>>8&255]+gt[n>>16&255]+gt[n>>24&255]).toUpperCase()}function At(r,e,t){return Math.max(e,Math.min(t,r))}function ud(r,e){return(r%e+e)%e}function js(r,e,t){return(1-t)*r+t*e}function Go(r){return(r&r-1)===0&&r!==0}function hd(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function dd(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}class se{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this)}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this)}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector2: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}}se.prototype.isVector2=!0;class yt{constructor(){this.elements=[1,0,0,0,1,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.")}set(e,t,n,i,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],m=n[8],v=i[0],y=i[3],g=i[6],p=i[1],R=i[4],A=i[7],L=i[2],_=i[5],F=i[8];return s[0]=a*v+o*p+l*L,s[3]=a*y+o*R+l*_,s[6]=a*g+o*A+l*F,s[1]=c*v+u*p+h*L,s[4]=c*y+u*R+h*_,s[7]=c*g+u*A+h*F,s[2]=d*v+f*p+m*L,s[5]=d*y+f*R+m*_,s[8]=d*g+f*A+m*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*s,f=c*s-a*l,m=t*h+n*d+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return e[0]=h*v,e[1]=(i*c-u*n)*v,e[2]=(o*n-i*a)*v,e[3]=d*v,e[4]=(u*t-i*l)*v,e[5]=(i*s-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=t,n[4]*=t,n[7]*=t,this}rotate(e){const t=Math.cos(e),n=Math.sin(e),i=this.elements,s=i[0],a=i[3],o=i[6],l=i[1],c=i[4],u=i[7];return i[0]=t*s+n*l,i[3]=t*a+n*c,i[6]=t*o+n*u,i[1]=-n*s+t*l,i[4]=-n*a+t*c,i[7]=-n*o+t*u,this}translate(e,t){const n=this.elements;return n[0]+=e*n[2],n[3]+=e*n[5],n[6]+=e*n[8],n[1]+=t*n[2],n[4]+=t*n[5],n[7]+=t*n[8],this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}yt.prototype.isMatrix3=!0;let ti;class Hi{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ti===void 0&&(ti=document.createElementNS("http://www.w3.org/1999/xhtml","canvas")),ti.width=e.width,ti.height=e.height;const n=ti.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ti}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}}let fd=0;class _t extends $n{constructor(e=_t.DEFAULT_IMAGE,t=_t.DEFAULT_MAPPING,n=jt,i=jt,s=zt,a=ja,o=Ft,l=_r,c=1,u=Ct){super(),Object.defineProperty(this,"id",{value:fd++}),this.uuid=rn(),this.name="",this.image=e,this.mipmaps=[],this.mapping=t,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=u,this.version=0,this.onUpdate=null}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.image=e.image,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.5,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(this.image!==void 0){const i=this.image;if(i.uuid===void 0&&(i.uuid=rn()),!t&&e.images[i.uuid]===void 0){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Zs(i[a].image)):s.push(Zs(i[a]))}else s=Zs(i);e.images[i.uuid]={uuid:i.uuid,url:s}}n.image=i.uuid}return t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Kl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case hs:e.x=e.x-Math.floor(e.x);break;case jt:e.x=e.x<0?0:1;break;case Pa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case hs:e.y=e.y-Math.floor(e.y);break;case jt:e.y=e.y<0?0:1;break;case Pa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&this.version++}}_t.DEFAULT_IMAGE=void 0;_t.DEFAULT_MAPPING=Kl;_t.prototype.isTexture=!0;function Zs(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Hi.getDataURL(r):r.data?{data:Array.prototype.slice.call(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}class qe{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],m=l[9],v=l[2],y=l[6],g=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(m-y)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(m+y)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const R=(c+1)/2,A=(f+1)/2,L=(g+1)/2,_=(u+d)/4,F=(h+v)/4,D=(m+y)/4;return R>A&&R>L?R<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(R),i=_/n,s=F/n):A>L?A<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(A),n=_/i,s=D/i):L<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(L),n=F/s,i=D/s),this.set(n,i,s,t),this}let p=Math.sqrt((y-m)*(y-m)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(p)<.001&&(p=1),this.x=(y-m)/p,this.y=(h-v)/p,this.z=(d-u)/p,this.w=Math.acos((c+f+g-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector4: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}}qe.prototype.isVector4=!0;class Pn extends $n{constructor(e,t,n){super(),this.width=e,this.height=t,this.depth=1,this.scissor=new qe(0,0,e,t),this.scissorTest=!1,this.viewport=new qe(0,0,e,t),n=n||{},this.texture=new _t(void 0,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.image={},this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:zt,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null}setTexture(e){e.image={width:this.width,height:this.height,depth:this.depth},this.texture=e}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}Pn.prototype.isWebGLRenderTarget=!0;class pd extends Pn{constructor(e,t,n){super(e,t,n),this.samples=4}copy(e){return super.copy.call(this,e),this.samples=e.samples,this}}pd.prototype.isWebGLMultisampleRenderTarget=!0;class St{constructor(e=0,t=0,n=0,i=1){this._x=e,this._y=t,this._z=n,this._w=i}static slerp(e,t,n,i){return console.warn("THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead."),n.slerpQuaternions(e,t,i)}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3];const d=s[a+0],f=s[a+1],m=s[a+2],v=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=v;return}if(h!==v||l!==d||c!==f||u!==m){let y=1-o;const g=l*d+c*f+u*m+h*v,p=g>=0?1:-1,R=1-g*g;if(R>Number.EPSILON){const L=Math.sqrt(R),_=Math.atan2(L,g*p);y=Math.sin(y*_)/L,o=Math.sin(o*_)/L}const A=o*p;if(l=l*y+d*A,c=c*y+f*A,u=u*y+m*A,h=h*y+v*A,y===1-o){const L=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=L,c*=L,u*=L,h*=L}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=s[a],d=s[a+1],f=s[a+2],m=s[a+3];return e[t]=o*m+u*h+l*f-c*d,e[t+1]=l*m+u*d+c*h-o*f,e[t+2]=c*m+u*f+o*d-l*h,e[t+3]=u*m-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){if(!(e&&e.isEuler))throw new Error("THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.");const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),h=o(s/2),d=l(n/2),f=l(i/2),m=l(s/2);switch(a){case"XYZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"YXZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"ZXY":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"ZYX":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"YZX":this._x=d*u*h+c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h-d*f*m;break;case"XZY":this._x=d*u*h-c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(a-i)*f}else if(n>o&&n>h){const f=2*Math.sqrt(1+n-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(s+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-n-h);this._w=(s-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-o);this._w=(a-i)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(At(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e,t){return t!==void 0?(console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),this.multiplyQuaternions(e,t)):this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-s*l,this._y=i*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*s+t*this._z,this.normalize(),this._onChangeCallback(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=a*h+this._w*d,this._x=n*h+this._x*d,this._y=i*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){this.copy(e).slerp(t,n)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}}St.prototype.isQuaternion=!0;class M{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e,t){return t!==void 0?(console.warn("THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(e,t)):(this.x+=e.x,this.y+=e.y,this.z+=e.z,this)}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e,t){return t!==void 0?(console.warn("THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(e,t)):(this.x-=e.x,this.y-=e.y,this.z-=e.z,this)}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(e,t)):(this.x*=e.x,this.y*=e.y,this.z*=e.z,this)}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return e&&e.isEuler||console.error("THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order."),this.applyQuaternion(Uo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Uo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=l*t+a*i-o*n,u=l*n+o*t-s*i,h=l*i+s*n-a*t,d=-s*t-a*n-o*i;return this.x=c*l+d*-s+u*-o-h*-a,this.y=u*l+d*-a+h*-s-c*-o,this.z=h*l+d*-o+c*-a-u*-s,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e,t){return t!==void 0?(console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(e,t)):this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Js.copy(this).projectOnVector(e),this.sub(Js)}reflect(e){return this.sub(Js.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(At(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn("THREE.Vector3: offset has been removed from .fromBufferAttribute()."),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}}M.prototype.isVector3=!0;const Js=new M,Uo=new St;class Gt{constructor(e=new M(1/0,1/0,1/0),t=new M(-1/0,-1/0,-1/0)){this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=1/0,n=1/0,i=1/0,s=-1/0,a=-1/0,o=-1/0;for(let l=0,c=e.length;l<c;l+=3){const u=e[l],h=e[l+1],d=e[l+2];u<t&&(t=u),h<n&&(n=h),d<i&&(i=d),u>s&&(s=u),h>a&&(a=h),d>o&&(o=d)}return this.min.set(t,n,i),this.max.set(s,a,o),this}setFromBufferAttribute(e){let t=1/0,n=1/0,i=1/0,s=-1/0,a=-1/0,o=-1/0;for(let l=0,c=e.count;l<c;l++){const u=e.getX(l),h=e.getY(l),d=e.getZ(l);u<t&&(t=u),h<n&&(n=h),d<i&&(i=d),u>s&&(s=u),h>a&&(a=h),d>o&&(o=d)}return this.min.set(t,n,i),this.max.set(s,a,o),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ji.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e){return this.makeEmpty(),this.expandByObject(e)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return e===void 0&&(console.warn("THREE.Box3: .getCenter() target is now required"),e=new M),this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return e===void 0&&(console.warn("THREE.Box3: .getSize() target is now required"),e=new M),this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e){e.updateWorldMatrix(!1,!1);const t=e.geometry;t!==void 0&&(t.boundingBox===null&&t.computeBoundingBox(),Qs.copy(t.boundingBox),Qs.applyMatrix4(e.matrixWorld),this.union(Qs));const n=e.children;for(let i=0,s=n.length;i<s;i++)this.expandByObject(n[i]);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t===void 0&&(console.warn("THREE.Box3: .getParameter() target is now required"),t=new M),t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Ji),Ji.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qi),Ar.subVectors(this.max,Qi),ni.subVectors(e.a,Qi),ii.subVectors(e.b,Qi),ri.subVectors(e.c,Qi),wn.subVectors(ii,ni),Mn.subVectors(ri,ii),Vn.subVectors(ni,ri);let t=[0,-wn.z,wn.y,0,-Mn.z,Mn.y,0,-Vn.z,Vn.y,wn.z,0,-wn.x,Mn.z,0,-Mn.x,Vn.z,0,-Vn.x,-wn.y,wn.x,0,-Mn.y,Mn.x,0,-Vn.y,Vn.x,0];return!$s(t,ni,ii,ri,Ar)||(t=[1,0,0,0,1,0,0,0,1],!$s(t,ni,ii,ri,Ar))?!1:(Lr.crossVectors(wn,Mn),t=[Lr.x,Lr.y,Lr.z],$s(t,ni,ii,ri,Ar))}clampPoint(e,t){return t===void 0&&(console.warn("THREE.Box3: .clampPoint() target is now required"),t=new M),t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return Ji.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return e===void 0&&console.error("THREE.Box3: .getBoundingSphere() target is now required"),this.getCenter(e.center),e.radius=this.getSize(Ji).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(un),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}Gt.prototype.isBox3=!0;const un=[new M,new M,new M,new M,new M,new M,new M,new M],Ji=new M,Qs=new Gt,ni=new M,ii=new M,ri=new M,wn=new M,Mn=new M,Vn=new M,Qi=new M,Ar=new M,Lr=new M,Wn=new M;function $s(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Wn.fromArray(r,s);const o=i.x*Math.abs(Wn.x)+i.y*Math.abs(Wn.y)+i.z*Math.abs(Wn.z),l=e.dot(Wn),c=t.dot(Wn),u=n.dot(Wn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const md=new Gt,Vo=new M,Ks=new M,ea=new M;class Gi{constructor(e=new M,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):md.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t===void 0&&(console.warn("THREE.Sphere: .clampPoint() target is now required"),t=new M),t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return e===void 0&&(console.warn("THREE.Sphere: .getBoundingBox() target is now required"),e=new Gt),this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){ea.subVectors(e,this.center);const t=ea.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.add(ea.multiplyScalar(i/n)),this.radius+=i}return this}union(e){return Ks.subVectors(e.center,this.center).normalize().multiplyScalar(e.radius),this.expandByPoint(Vo.copy(e.center).add(Ks)),this.expandByPoint(Vo.copy(e.center).sub(Ks)),this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hn=new M,ta=new M,Cr=new M,bn=new M,na=new M,Rr=new M,ia=new M;class Ui{constructor(e=new M,t=new M(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t===void 0&&(console.warn("THREE.Ray: .at() target is now required"),t=new M),t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t===void 0&&(console.warn("THREE.Ray: .closestPointToPoint() target is now required"),t=new M),t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(n).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.direction).multiplyScalar(t).add(this.origin),hn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ta.copy(e).add(t).multiplyScalar(.5),Cr.copy(t).sub(e).normalize(),bn.copy(this.origin).sub(ta);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Cr),o=bn.dot(this.direction),l=-bn.dot(Cr),c=bn.lengthSq(),u=Math.abs(1-a*a);let h,d,f,m;if(u>0)if(h=a*l-o,d=a*o-l,m=s*u,h>=0)if(d>=-m)if(d<=m){const v=1/u;h*=v,d*=v,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-m?(h=Math.max(0,-(-a*s+o)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=m?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(a*s+o)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=a>0?-s:s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.direction).multiplyScalar(h).add(this.origin),i&&i.copy(Cr).multiplyScalar(d).add(ta),f}intersectSphere(e,t){hn.subVectors(e.center,this.origin);const n=hn.dot(this.direction),i=hn.dot(hn)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return o<0&&l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),n>a||s>i||((s>n||n!==n)&&(n=s),(a<i||i!==i)&&(i=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,n,i,s){na.subVectors(t,e),Rr.subVectors(n,e),ia.crossVectors(na,Rr);let a=this.direction.dot(ia),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;bn.subVectors(this.origin,e);const l=o*this.direction.dot(Rr.crossVectors(bn,Rr));if(l<0)return null;const c=o*this.direction.dot(na.cross(bn));if(c<0||l+c>a)return null;const u=-o*bn.dot(ia);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Re{constructor(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],arguments.length>0&&console.error("THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.")}set(e,t,n,i,s,a,o,l,c,u,h,d,f,m,v,y){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=s,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=u,g[10]=h,g[14]=d,g[3]=f,g[7]=m,g[11]=v,g[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Re().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/si.setFromMatrixColumn(e,0).length(),s=1/si.setFromMatrixColumn(e,1).length(),a=1/si.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){e&&e.isEuler||console.error("THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=a*u,f=a*h,m=o*u,v=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+m*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,m=c*u,v=c*h;t[0]=d+v*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-m,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,m=c*u,v=c*h;t[0]=d-v*o,t[4]=-a*h,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*u,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,f=a*h,m=o*u,v=o*h;t[0]=l*u,t[4]=m*c-f,t[8]=d*c+v,t[1]=l*h,t[5]=v*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,m=o*l,v=o*c;t[0]=l*u,t[4]=v-d*h,t[8]=m*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+m,t[10]=d-v*h}else if(e.order==="XZY"){const d=a*l,f=a*c,m=o*l,v=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+v,t[5]=a*u,t[9]=f*h-m,t[2]=m*h-f,t[6]=o*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gd,e,vd)}lookAt(e,t,n){const i=this.elements;return Dt.subVectors(e,t),Dt.lengthSq()===0&&(Dt.z=1),Dt.normalize(),Sn.crossVectors(n,Dt),Sn.lengthSq()===0&&(Math.abs(n.z)===1?Dt.x+=1e-4:Dt.z+=1e-4,Dt.normalize(),Sn.crossVectors(n,Dt)),Sn.normalize(),Pr.crossVectors(Dt,Sn),i[0]=Sn.x,i[4]=Pr.x,i[8]=Dt.x,i[1]=Sn.y,i[5]=Pr.y,i[9]=Dt.y,i[2]=Sn.z,i[6]=Pr.z,i[10]=Dt.z,this}multiply(e,t){return t!==void 0?(console.warn("THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(e,t)):this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],m=n[2],v=n[6],y=n[10],g=n[14],p=n[3],R=n[7],A=n[11],L=n[15],_=i[0],F=i[4],D=i[8],B=i[12],U=i[1],N=i[5],z=i[9],S=i[13],E=i[2],C=i[6],b=i[10],V=i[14],te=i[3],$=i[7],he=i[11],oe=i[15];return s[0]=a*_+o*U+l*E+c*te,s[4]=a*F+o*N+l*C+c*$,s[8]=a*D+o*z+l*b+c*he,s[12]=a*B+o*S+l*V+c*oe,s[1]=u*_+h*U+d*E+f*te,s[5]=u*F+h*N+d*C+f*$,s[9]=u*D+h*z+d*b+f*he,s[13]=u*B+h*S+d*V+f*oe,s[2]=m*_+v*U+y*E+g*te,s[6]=m*F+v*N+y*C+g*$,s[10]=m*D+v*z+y*b+g*he,s[14]=m*B+v*S+y*V+g*oe,s[3]=p*_+R*U+A*E+L*te,s[7]=p*F+R*N+A*C+L*$,s[11]=p*D+R*z+A*b+L*he,s[15]=p*B+R*S+A*V+L*oe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],m=e[3],v=e[7],y=e[11],g=e[15];return m*(+s*l*h-i*c*h-s*o*d+n*c*d+i*o*f-n*l*f)+v*(+t*l*f-t*c*d+s*a*d-i*a*f+i*c*u-s*l*u)+y*(+t*c*h-t*o*f-s*a*h+n*a*f+s*o*u-n*c*u)+g*(-i*o*u-t*l*h+t*o*d+i*a*h-n*a*d+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],m=e[12],v=e[13],y=e[14],g=e[15],p=h*y*c-v*d*c+v*l*f-o*y*f-h*l*g+o*d*g,R=m*d*c-u*y*c-m*l*f+a*y*f+u*l*g-a*d*g,A=u*v*c-m*h*c+m*o*f-a*v*f-u*o*g+a*h*g,L=m*h*l-u*v*l-m*o*d+a*v*d+u*o*y-a*h*y,_=t*p+n*R+i*A+s*L;if(_===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/_;return e[0]=p*F,e[1]=(v*d*s-h*y*s-v*i*f+n*y*f+h*i*g-n*d*g)*F,e[2]=(o*y*s-v*l*s+v*i*c-n*y*c-o*i*g+n*l*g)*F,e[3]=(h*l*s-o*d*s-h*i*c+n*d*c+o*i*f-n*l*f)*F,e[4]=R*F,e[5]=(u*y*s-m*d*s+m*i*f-t*y*f-u*i*g+t*d*g)*F,e[6]=(m*l*s-a*y*s-m*i*c+t*y*c+a*i*g-t*l*g)*F,e[7]=(a*d*s-u*l*s+u*i*c-t*d*c-a*i*f+t*l*f)*F,e[8]=A*F,e[9]=(m*h*s-u*v*s-m*n*f+t*v*f+u*n*g-t*h*g)*F,e[10]=(a*v*s-m*o*s+m*n*c-t*v*c-a*n*g+t*o*g)*F,e[11]=(u*o*s-a*h*s-u*n*c+t*h*c+a*n*f-t*o*f)*F,e[12]=L*F,e[13]=(u*v*i-m*h*i+m*n*d-t*v*d-u*n*y+t*h*y)*F,e[14]=(m*o*i-a*v*i-m*n*l+t*v*l+a*n*y-t*o*y)*F,e[15]=(a*h*i-u*o*i+u*n*l-t*h*l-a*n*d+t*o*d)*F,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n){return this.set(1,t,n,0,e,1,n,0,e,t,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,h=o+o,d=s*c,f=s*u,m=s*h,v=a*u,y=a*h,g=o*h,p=l*c,R=l*u,A=l*h,L=n.x,_=n.y,F=n.z;return i[0]=(1-(v+g))*L,i[1]=(f+A)*L,i[2]=(m-R)*L,i[3]=0,i[4]=(f-A)*_,i[5]=(1-(d+g))*_,i[6]=(y+p)*_,i[7]=0,i[8]=(m+R)*F,i[9]=(y-p)*F,i[10]=(1-(d+v))*F,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=si.set(i[0],i[1],i[2]).length();const a=si.set(i[4],i[5],i[6]).length(),o=si.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],Vt.copy(this);const c=1/s,u=1/a,h=1/o;return Vt.elements[0]*=c,Vt.elements[1]*=c,Vt.elements[2]*=c,Vt.elements[4]*=u,Vt.elements[5]*=u,Vt.elements[6]*=u,Vt.elements[8]*=h,Vt.elements[9]*=h,Vt.elements[10]*=h,t.setFromRotationMatrix(Vt),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,a){a===void 0&&console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");const o=this.elements,l=2*s/(t-e),c=2*s/(n-i),u=(t+e)/(t-e),h=(n+i)/(n-i),d=-(a+s)/(a-s),f=-2*a*s/(a-s);return o[0]=l,o[4]=0,o[8]=u,o[12]=0,o[1]=0,o[5]=c,o[9]=h,o[13]=0,o[2]=0,o[6]=0,o[10]=d,o[14]=f,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,n,i,s,a){const o=this.elements,l=1/(t-e),c=1/(n-i),u=1/(a-s),h=(t+e)*l,d=(n+i)*c,f=(a+s)*u;return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-h,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-d,o[2]=0,o[6]=0,o[10]=-2*u,o[14]=-f,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}Re.prototype.isMatrix4=!0;const si=new M,Vt=new Re,gd=new M(0,0,0),vd=new M(1,1,1),Sn=new M,Pr=new M,Dt=new M,Wo=new Re,qo=new St;class Vi{constructor(e=0,t=0,n=0,i=Vi.DefaultOrder){this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._order=i||this._order,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t,n){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(t=t||this._order,t){case"XYZ":this._y=Math.asin(At(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-At(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(At(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-At(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(At(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-At(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n!==!1&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Wo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Wo,t,n)}setFromVector3(e,t){return this.set(e.x,e.y,e.z,t||this._order)}reorder(e){return qo.setFromEuler(this),this.setFromQuaternion(qo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}toVector3(e){return e?e.set(this._x,this._y,this._z):new M(this._x,this._y,this._z)}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}}Vi.prototype.isEuler=!0;Vi.DefaultOrder="XYZ";Vi.RotationOrders=["XYZ","YZX","ZXY","XZY","YXZ","ZYX"];class xd{constructor(){this.mask=1}set(e){this.mask=1<<e|0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}}let yd=0;const Xo=new M,ai=new St,dn=new Re,Dr=new M,$i=new M,_d=new M,wd=new St,Yo=new M(1,0,0),jo=new M(0,1,0),Zo=new M(0,0,1),Md={type:"added"},Jo={type:"removed"};class Je extends $n{constructor(){super(),Object.defineProperty(this,"id",{value:yd++}),this.uuid=rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Je.DefaultUp.clone();const e=new M,t=new Vi,n=new St,i=new M(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Re},normalMatrix:{value:new yt}}),this.matrix=new Re,this.matrixWorld=new Re,this.matrixAutoUpdate=Je.DefaultMatrixAutoUpdate,this.matrixWorldNeedsUpdate=!1,this.layers=new xd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ai.setFromAxisAngle(e,t),this.quaternion.multiply(ai),this}rotateOnWorldAxis(e,t){return ai.setFromAxisAngle(e,t),this.quaternion.premultiply(ai),this}rotateX(e){return this.rotateOnAxis(Yo,e)}rotateY(e){return this.rotateOnAxis(jo,e)}rotateZ(e){return this.rotateOnAxis(Zo,e)}translateOnAxis(e,t){return Xo.copy(e).applyQuaternion(this.quaternion),this.position.add(Xo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Yo,e)}translateY(e){return this.translateOnAxis(jo,e)}translateZ(e){return this.translateOnAxis(Zo,e)}localToWorld(e){return e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Dr.copy(e):Dr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),$i.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt($i,Dr,this.up):dn.lookAt(Dr,$i,this.up),this.quaternion.setFromRotationMatrix(dn),i&&(dn.extractRotation(i.matrixWorld),ai.setFromRotationMatrix(dn),this.quaternion.premultiply(ai.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Md)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jo)),this}clear(){for(let e=0;e<this.children.length;e++){const t=this.children[e];t.parent=null,t.dispatchEvent(Jo)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getWorldPosition(e){return e===void 0&&(console.warn("THREE.Object3D: .getWorldPosition() target is now required"),e=new M),this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return e===void 0&&(console.warn("THREE.Object3D: .getWorldQuaternion() target is now required"),e=new St),this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($i,e,_d),e}getWorldScale(e){return e===void 0&&(console.warn("THREE.Object3D: .getWorldScale() target is now required"),e=new M),this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($i,wd,e),e}getWorldDirection(e){e===void 0&&(console.warn("THREE.Object3D: .getWorldDirection() target is now required"),e=new M),this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{}},n.metadata={version:4.5,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),JSON.stringify(this.userData)!=="{}"&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Je.DefaultUp=new M(0,1,0);Je.DefaultMatrixAutoUpdate=!0;Je.prototype.isObject3D=!0;const ra=new M,bd=new M,Sd=new yt;class en{constructor(e=new M(1,0,0),t=0){this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ra.subVectors(n,t).cross(bd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t===void 0&&(console.warn("THREE.Plane: .projectPoint() target is now required"),t=new M),t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){t===void 0&&(console.warn("THREE.Plane: .intersectLine() target is now required"),t=new M);const n=e.delta(ra),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(n).multiplyScalar(s).add(e.start)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e===void 0&&(console.warn("THREE.Plane: .coplanarPoint() target is now required"),e=new M),e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Sd.getNormalMatrix(e),i=this.coplanarPoint(ra).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}en.prototype.isPlane=!0;const Wt=new M,fn=new M,sa=new M,pn=new M,oi=new M,li=new M,Qo=new M,aa=new M,oa=new M,la=new M;class ut{constructor(e=new M,t=new M,n=new M){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i===void 0&&(console.warn("THREE.Triangle: .getNormal() target is now required"),i=new M),i.subVectors(n,t),Wt.subVectors(e,t),i.cross(Wt);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Wt.subVectors(i,t),fn.subVectors(n,t),sa.subVectors(e,t);const a=Wt.dot(Wt),o=Wt.dot(fn),l=Wt.dot(sa),c=fn.dot(fn),u=fn.dot(sa),h=a*c-o*o;if(s===void 0&&(console.warn("THREE.Triangle: .getBarycoord() target is now required"),s=new M),h===0)return s.set(-2,-1,-1);const d=1/h,f=(c*l-o*u)*d,m=(a*u-o*l)*d;return s.set(1-f-m,m,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,pn),pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getUV(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,pn),l.set(0,0),l.addScaledVector(s,pn.x),l.addScaledVector(a,pn.y),l.addScaledVector(o,pn.z),l}static isFrontFacing(e,t,n,i){return Wt.subVectors(n,t),fn.subVectors(e,t),Wt.cross(fn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Wt.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),Wt.cross(fn).length()*.5}getMidpoint(e){return e===void 0&&(console.warn("THREE.Triangle: .getMidpoint() target is now required"),e=new M),e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ut.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e===void 0&&(console.warn("THREE.Triangle: .getPlane() target is now required"),e=new en),e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ut.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,s){return ut.getUV(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return ut.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ut.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){t===void 0&&(console.warn("THREE.Triangle: .closestPointToPoint() target is now required"),t=new M);const n=this.a,i=this.b,s=this.c;let a,o;oi.subVectors(i,n),li.subVectors(s,n),aa.subVectors(e,n);const l=oi.dot(aa),c=li.dot(aa);if(l<=0&&c<=0)return t.copy(n);oa.subVectors(e,i);const u=oi.dot(oa),h=li.dot(oa);if(u>=0&&h<=u)return t.copy(i);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(oi,a);la.subVectors(e,s);const f=oi.dot(la),m=li.dot(la);if(m>=0&&f<=m)return t.copy(s);const v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(li,o);const y=u*m-f*h;if(y<=0&&h-u>=0&&f-m>=0)return Qo.subVectors(s,i),o=(h-u)/(h-u+(f-m)),t.copy(i).addScaledVector(Qo,o);const g=1/(y+v+d);return a=v*g,o=d*g,t.copy(n).addScaledVector(oi,a).addScaledVector(li,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}let Td=0;function ft(){Object.defineProperty(this,"id",{value:Td++}),this.uuid=rn(),this.name="",this.type="Material",this.fog=!0,this.blending=cr,this.side=Ss,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.blendSrc=Jl,this.blendDst=Ql,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Ra,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xs,this.stencilZFail=Xs,this.stencilZPass=Xs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaTest=0,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0}ft.prototype=Object.assign(Object.create($n.prototype),{constructor:ft,isMaterial:!0,onBuild:function(){},onBeforeCompile:function(){},customProgramCacheKey:function(){return this.onBeforeCompile.toString()},setValues:function(r){if(r!==void 0)for(const e in r){const t=r[e];if(t===void 0){console.warn("THREE.Material: '"+e+"' parameter is undefined.");continue}if(e==="shading"){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=t===Zl;continue}const n=this[e];if(n===void 0){console.warn("THREE."+this.type+": '"+e+"' is not a property of this material.");continue}n&&n.isColor?n.set(t):n&&n.isVector3&&t&&t.isVector3?n.copy(t):this[e]=t}},toJSON:function(r){const e=r===void 0||typeof r=="string";e&&(r={textures:{},images:{}});const t={metadata:{version:4.5,type:"Material",generator:"Material.toJSON"}};t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),this.color&&this.color.isColor&&(t.color=this.color.getHex()),this.roughness!==void 0&&(t.roughness=this.roughness),this.metalness!==void 0&&(t.metalness=this.metalness),this.sheen&&this.sheen.isColor&&(t.sheen=this.sheen.getHex()),this.emissive&&this.emissive.isColor&&(t.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(t.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(t.specular=this.specular.getHex()),this.shininess!==void 0&&(t.shininess=this.shininess),this.clearcoat!==void 0&&(t.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(t.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(t.clearcoatMap=this.clearcoatMap.toJSON(r).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(t.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(r).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(t.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(r).uuid,t.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.map&&this.map.isTexture&&(t.map=this.map.toJSON(r).uuid),this.matcap&&this.matcap.isTexture&&(t.matcap=this.matcap.toJSON(r).uuid),this.alphaMap&&this.alphaMap.isTexture&&(t.alphaMap=this.alphaMap.toJSON(r).uuid),this.lightMap&&this.lightMap.isTexture&&(t.lightMap=this.lightMap.toJSON(r).uuid,t.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(t.aoMap=this.aoMap.toJSON(r).uuid,t.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(t.bumpMap=this.bumpMap.toJSON(r).uuid,t.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(t.normalMap=this.normalMap.toJSON(r).uuid,t.normalMapType=this.normalMapType,t.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(t.displacementMap=this.displacementMap.toJSON(r).uuid,t.displacementScale=this.displacementScale,t.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(t.roughnessMap=this.roughnessMap.toJSON(r).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(t.metalnessMap=this.metalnessMap.toJSON(r).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(t.emissiveMap=this.emissiveMap.toJSON(r).uuid),this.specularMap&&this.specularMap.isTexture&&(t.specularMap=this.specularMap.toJSON(r).uuid),this.envMap&&this.envMap.isTexture&&(t.envMap=this.envMap.toJSON(r).uuid,this.combine!==void 0&&(t.combine=this.combine)),this.envMapIntensity!==void 0&&(t.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(t.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(t.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(t.gradientMap=this.gradientMap.toJSON(r).uuid),this.size!==void 0&&(t.size=this.size),this.shadowSide!==null&&(t.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(t.sizeAttenuation=this.sizeAttenuation),this.blending!==cr&&(t.blending=this.blending),this.side!==Ss&&(t.side=this.side),this.vertexColors&&(t.vertexColors=!0),this.opacity<1&&(t.opacity=this.opacity),this.transparent===!0&&(t.transparent=this.transparent),t.depthFunc=this.depthFunc,t.depthTest=this.depthTest,t.depthWrite=this.depthWrite,t.colorWrite=this.colorWrite,t.stencilWrite=this.stencilWrite,t.stencilWriteMask=this.stencilWriteMask,t.stencilFunc=this.stencilFunc,t.stencilRef=this.stencilRef,t.stencilFuncMask=this.stencilFuncMask,t.stencilFail=this.stencilFail,t.stencilZFail=this.stencilZFail,t.stencilZPass=this.stencilZPass,this.rotation&&this.rotation!==0&&(t.rotation=this.rotation),this.polygonOffset===!0&&(t.polygonOffset=!0),this.polygonOffsetFactor!==0&&(t.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(t.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth&&this.linewidth!==1&&(t.linewidth=this.linewidth),this.dashSize!==void 0&&(t.dashSize=this.dashSize),this.gapSize!==void 0&&(t.gapSize=this.gapSize),this.scale!==void 0&&(t.scale=this.scale),this.dithering===!0&&(t.dithering=!0),this.alphaTest>0&&(t.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(t.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(t.premultipliedAlpha=this.premultipliedAlpha),this.wireframe===!0&&(t.wireframe=this.wireframe),this.wireframeLinewidth>1&&(t.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(t.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(t.wireframeLinejoin=this.wireframeLinejoin),this.morphTargets===!0&&(t.morphTargets=!0),this.morphNormals===!0&&(t.morphNormals=!0),this.skinning===!0&&(t.skinning=!0),this.flatShading===!0&&(t.flatShading=this.flatShading),this.visible===!1&&(t.visible=!1),this.toneMapped===!1&&(t.toneMapped=!1),JSON.stringify(this.userData)!=="{}"&&(t.userData=this.userData);function n(i){const s=[];for(const a in i){const o=i[a];delete o.metadata,s.push(o)}return s}if(e){const i=n(r.textures),s=n(r.images);i.length>0&&(t.textures=i),s.length>0&&(t.images=s)}return t},clone:function(){return new this.constructor().copy(this)},copy:function(r){this.name=r.name,this.fog=r.fog,this.blending=r.blending,this.side=r.side,this.vertexColors=r.vertexColors,this.opacity=r.opacity,this.transparent=r.transparent,this.blendSrc=r.blendSrc,this.blendDst=r.blendDst,this.blendEquation=r.blendEquation,this.blendSrcAlpha=r.blendSrcAlpha,this.blendDstAlpha=r.blendDstAlpha,this.blendEquationAlpha=r.blendEquationAlpha,this.depthFunc=r.depthFunc,this.depthTest=r.depthTest,this.depthWrite=r.depthWrite,this.stencilWriteMask=r.stencilWriteMask,this.stencilFunc=r.stencilFunc,this.stencilRef=r.stencilRef,this.stencilFuncMask=r.stencilFuncMask,this.stencilFail=r.stencilFail,this.stencilZFail=r.stencilZFail,this.stencilZPass=r.stencilZPass,this.stencilWrite=r.stencilWrite;const e=r.clippingPlanes;let t=null;if(e!==null){const n=e.length;t=new Array(n);for(let i=0;i!==n;++i)t[i]=e[i].clone()}return this.clippingPlanes=t,this.clipIntersection=r.clipIntersection,this.clipShadows=r.clipShadows,this.shadowSide=r.shadowSide,this.colorWrite=r.colorWrite,this.precision=r.precision,this.polygonOffset=r.polygonOffset,this.polygonOffsetFactor=r.polygonOffsetFactor,this.polygonOffsetUnits=r.polygonOffsetUnits,this.dithering=r.dithering,this.alphaTest=r.alphaTest,this.alphaToCoverage=r.alphaToCoverage,this.premultipliedAlpha=r.premultipliedAlpha,this.visible=r.visible,this.toneMapped=r.toneMapped,this.userData=JSON.parse(JSON.stringify(r.userData)),this},dispose:function(){this.dispatchEvent({type:"dispose"})}});Object.defineProperty(ft.prototype,"needsUpdate",{set:function(r){r===!0&&this.version++}});const rc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qt={h:0,s:0,l:0},Ir={h:0,s:0,l:0};function ca(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}function ua(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function ha(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}class xe{constructor(e,t,n){return t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e=="number"?this.setHex(e):typeof e=="string"&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,this}setRGB(e,t,n){return this.r=e,this.g=t,this.b=n,this}setHSL(e,t,n){if(e=ud(e,1),t=At(t,0,1),n=At(n,0,1),t===0)this.r=this.g=this.b=n;else{const i=n<=.5?n*(1+t):n+t-n*t,s=2*n-i;this.r=ca(s,i,e+1/3),this.g=ca(s,i,e),this.b=ca(s,i,e-1/3)}return this}setStyle(e){function t(i){i!==void 0&&parseFloat(i)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let i;const s=n[1],a=n[2];switch(s){case"rgb":case"rgba":if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return this.r=Math.min(255,parseInt(i[1],10))/255,this.g=Math.min(255,parseInt(i[2],10))/255,this.b=Math.min(255,parseInt(i[3],10))/255,t(i[4]),this;if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return this.r=Math.min(100,parseInt(i[1],10))/100,this.g=Math.min(100,parseInt(i[2],10))/100,this.b=Math.min(100,parseInt(i[3],10))/100,t(i[4]),this;break;case"hsl":case"hsla":if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)){const o=parseFloat(i[1])/360,l=parseInt(i[2],10)/100,c=parseInt(i[3],10)/100;return t(i[4]),this.setHSL(o,l,c)}break}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const i=n[1],s=i.length;if(s===3)return this.r=parseInt(i.charAt(0)+i.charAt(0),16)/255,this.g=parseInt(i.charAt(1)+i.charAt(1),16)/255,this.b=parseInt(i.charAt(2)+i.charAt(2),16)/255,this;if(s===6)return this.r=parseInt(i.charAt(0)+i.charAt(1),16)/255,this.g=parseInt(i.charAt(2)+i.charAt(3),16)/255,this.b=parseInt(i.charAt(4)+i.charAt(5),16)/255,this}return e&&e.length>0?this.setColorName(e):this}setColorName(e){const t=rc[e.toLowerCase()];return t!==void 0?this.setHex(t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copyGammaToLinear(e,t=2){return this.r=Math.pow(e.r,t),this.g=Math.pow(e.g,t),this.b=Math.pow(e.b,t),this}copyLinearToGamma(e,t=2){const n=t>0?1/t:1;return this.r=Math.pow(e.r,n),this.g=Math.pow(e.g,n),this.b=Math.pow(e.b,n),this}convertGammaToLinear(e){return this.copyGammaToLinear(this,e),this}convertLinearToGamma(e){return this.copyLinearToGamma(this,e),this}copySRGBToLinear(e){return this.r=ua(e.r),this.g=ua(e.g),this.b=ua(e.b),this}copyLinearToSRGB(e){return this.r=ha(e.r),this.g=ha(e.g),this.b=ha(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(){return this.r*255<<16^this.g*255<<8^this.b*255<<0}getHexString(){return("000000"+this.getHex().toString(16)).slice(-6)}getHSL(e){e===void 0&&(console.warn("THREE.Color: .getHSL() target is now required"),e={h:0,s:0,l:0});const t=this.r,n=this.g,i=this.b,s=Math.max(t,n,i),a=Math.min(t,n,i);let o,l;const c=(a+s)/2;if(a===s)o=0,l=0;else{const u=s-a;switch(l=c<=.5?u/(s+a):u/(2-s-a),s){case t:o=(n-i)/u+(n<i?6:0);break;case n:o=(i-t)/u+2;break;case i:o=(t-n)/u+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getStyle(){return"rgb("+(this.r*255|0)+","+(this.g*255|0)+","+(this.b*255|0)+")"}offsetHSL(e,t,n){return this.getHSL(qt),qt.h+=e,qt.s+=t,qt.l+=n,this.setHSL(qt.h,qt.s,qt.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(qt),e.getHSL(Ir);const n=js(qt.h,Ir.h,t),i=js(qt.s,Ir.s,t),s=js(qt.l,Ir.l,t);return this.setHSL(n,i,s),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),e.normalized===!0&&(this.r/=255,this.g/=255,this.b/=255),this}toJSON(){return this.getHex()}}xe.NAMES=rc;xe.prototype.isColor=!0;xe.prototype.r=1;xe.prototype.g=1;xe.prototype.b=1;class As extends ft{constructor(e){super(),this.type="MeshBasicMaterial",this.color=new xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ts,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.skinning=!1,this.morphTargets=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this}}As.prototype.isMeshBasicMaterial=!0;const et=new M,Fr=new se;class Ze{constructor(e,t,n){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n===!0,this.usage=pr,this.updateRange={offset:0,count:-1},this.version=0,this.onUploadCallback=function(){}}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}copyColorsArray(e){const t=this.array;let n=0;for(let i=0,s=e.length;i<s;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyColorsArray(): color is undefined",i),a=new xe),t[n++]=a.r,t[n++]=a.g,t[n++]=a.b}return this}copyVector2sArray(e){const t=this.array;let n=0;for(let i=0,s=e.length;i<s;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector2sArray(): vector is undefined",i),a=new se),t[n++]=a.x,t[n++]=a.y}return this}copyVector3sArray(e){const t=this.array;let n=0;for(let i=0,s=e.length;i<s;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector3sArray(): vector is undefined",i),a=new M),t[n++]=a.x,t[n++]=a.y,t[n++]=a.z}return this}copyVector4sArray(e){const t=this.array;let n=0;for(let i=0,s=e.length;i<s;i++){let a=e[i];a===void 0&&(console.warn("THREE.BufferAttribute.copyVector4sArray(): vector is undefined",i),a=new qe),t[n++]=a.x,t[n++]=a.y,t[n++]=a.z,t[n++]=a.w}return this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.applyMatrix3(e),this.setXY(t,Fr.x,Fr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)et.fromBufferAttribute(this,t),et.applyMatrix3(e),this.setXYZ(t,et.x,et.y,et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)et.x=this.getX(t),et.y=this.getY(t),et.z=this.getZ(t),et.applyMatrix4(e),this.setXYZ(t,et.x,et.y,et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)et.x=this.getX(t),et.y=this.getY(t),et.z=this.getZ(t),et.applyNormalMatrix(e),this.setXYZ(t,et.x,et.y,et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)et.x=this.getX(t),et.y=this.getY(t),et.z=this.getZ(t),et.transformDirection(e),this.setXYZ(t,et.x,et.y,et.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){return this.array[e*this.itemSize]}setX(e,t){return this.array[e*this.itemSize]=t,this}getY(e){return this.array[e*this.itemSize+1]}setY(e,t){return this.array[e*this.itemSize+1]=t,this}getZ(e){return this.array[e*this.itemSize+2]}setZ(e,t){return this.array[e*this.itemSize+2]=t,this}getW(e){return this.array[e*this.itemSize+3]}setW(e,t){return this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.prototype.slice.call(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==pr&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}}Ze.prototype.isBufferAttribute=!0;class sc extends Ze{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ac extends Ze{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ed extends Ze{constructor(e,t,n){super(new Uint16Array(e),t,n)}}Ed.prototype.isFloat16BufferAttribute=!0;class $e extends Ze{constructor(e,t,n){super(new Float32Array(e),t,n)}}function oc(r){if(r.length===0)return-1/0;let e=r[0];for(let t=1,n=r.length;t<n;++t)r[t]>e&&(e=r[t]);return e}let Ad=0;const $t=new Re,da=new Je,ci=new M,It=new Gt,Ki=new Gt,ht=new M;class Ve extends $n{constructor(){super(),Object.defineProperty(this,"id",{value:Ad++}),this.uuid=rn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(oc(e)>65535?ac:sc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new yt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return da.lookAt(e),da.updateMatrix(),this.applyMatrix4(da.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ci).negate(),this.translate(ci.x,ci.y,ci.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new $e(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Gt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new M(-1/0,-1/0,-1/0),new M(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];It.setFromBufferAttribute(s),this.morphTargetsRelative?(ht.addVectors(this.boundingBox.min,It.min),this.boundingBox.expandByPoint(ht),ht.addVectors(this.boundingBox.max,It.max),this.boundingBox.expandByPoint(ht)):(this.boundingBox.expandByPoint(It.min),this.boundingBox.expandByPoint(It.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new M,1/0);return}if(e){const n=this.boundingSphere.center;if(It.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Ki.setFromBufferAttribute(o),this.morphTargetsRelative?(ht.addVectors(It.min,Ki.min),It.expandByPoint(ht),ht.addVectors(It.max,Ki.max),It.expandByPoint(ht)):(It.expandByPoint(Ki.min),It.expandByPoint(Ki.max))}It.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)ht.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(ht));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)ht.fromBufferAttribute(o,c),l&&(ci.fromBufferAttribute(e,c),ht.add(ci)),i=Math.max(i,n.distanceToSquared(ht))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeFaceNormals(){}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,s=t.normal.array,a=t.uv.array,o=i.length/3;t.tangent===void 0&&this.setAttribute("tangent",new Ze(new Float32Array(4*o),4));const l=t.tangent.array,c=[],u=[];for(let U=0;U<o;U++)c[U]=new M,u[U]=new M;const h=new M,d=new M,f=new M,m=new se,v=new se,y=new se,g=new M,p=new M;function R(U,N,z){h.fromArray(i,U*3),d.fromArray(i,N*3),f.fromArray(i,z*3),m.fromArray(a,U*2),v.fromArray(a,N*2),y.fromArray(a,z*2),d.sub(h),f.sub(h),v.sub(m),y.sub(m);const S=1/(v.x*y.y-y.x*v.y);isFinite(S)&&(g.copy(d).multiplyScalar(y.y).addScaledVector(f,-v.y).multiplyScalar(S),p.copy(f).multiplyScalar(v.x).addScaledVector(d,-y.x).multiplyScalar(S),c[U].add(g),c[N].add(g),c[z].add(g),u[U].add(p),u[N].add(p),u[z].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:n.length}]);for(let U=0,N=A.length;U<N;++U){const z=A[U],S=z.start,E=z.count;for(let C=S,b=S+E;C<b;C+=3)R(n[C+0],n[C+1],n[C+2])}const L=new M,_=new M,F=new M,D=new M;function B(U){F.fromArray(s,U*3),D.copy(F);const N=c[U];L.copy(N),L.sub(F.multiplyScalar(F.dot(N))).normalize(),_.crossVectors(D,N);const S=_.dot(u[U])<0?-1:1;l[U*4]=L.x,l[U*4+1]=L.y,l[U*4+2]=L.z,l[U*4+3]=S}for(let U=0,N=A.length;U<N;++U){const z=A[U],S=z.start,E=z.count;for(let C=S,b=S+E;C<b;C+=3)B(n[C+0]),B(n[C+1]),B(n[C+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ze(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new M,s=new M,a=new M,o=new M,l=new M,c=new M,u=new M,h=new M;if(e)for(let d=0,f=e.count;d<f;d+=3){const m=e.getX(d+0),v=e.getX(d+1),y=e.getX(d+2);i.fromBufferAttribute(t,m),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,y),u.subVectors(a,s),h.subVectors(i,s),u.cross(h),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,y),o.add(u),l.add(u),c.add(u),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(y,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,s),h.subVectors(i,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(e,t){if(!(e&&e.isBufferGeometry)){console.error("THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.",e);return}t===void 0&&(t=0,console.warn("THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge."));const n=this.attributes;for(const i in n){if(e.attributes[i]===void 0)continue;const a=n[i].array,o=e.attributes[i],l=o.array,c=o.itemSize*t,u=Math.min(l.length,a.length-c);for(let h=0,d=c;h<u;h++,d++)a[d]=l[h]}return this}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ht.fromBufferAttribute(e,t),ht.normalize(),e.setXYZ(t,ht.x,ht.y,ht.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,m=0;for(let v=0,y=l.length;v<y;v++){f=l[v]*u;for(let g=0;g<u;g++)d[m++]=c[f++]}return new Ze(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ve,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.5,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(i[l]=u,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new Ve().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}Ve.prototype.isBufferGeometry=!0;const $o=new Re,ui=new Ui,fa=new Gi,Tn=new M,En=new M,An=new M,pa=new M,ma=new M,ga=new M,Nr=new M,zr=new M,Br=new M,kr=new se,Or=new se,Hr=new se,va=new M,Gr=new M;class Ye extends Je{constructor(e=new Ve,t=new As){super(),this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;if(i===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(s),e.ray.intersectsSphere(fa)===!1)||($o.copy(s).invert(),ui.copy(e.ray).applyMatrix4($o),n.boundingBox!==null&&ui.intersectsBox(n.boundingBox)===!1))return;let a;if(n.isBufferGeometry){const o=n.index,l=n.attributes.position,c=n.morphAttributes.position,u=n.morphTargetsRelative,h=n.attributes.uv,d=n.attributes.uv2,f=n.groups,m=n.drawRange;if(o!==null)if(Array.isArray(i))for(let v=0,y=f.length;v<y;v++){const g=f[v],p=i[g.materialIndex],R=Math.max(g.start,m.start),A=Math.min(g.start+g.count,m.start+m.count);for(let L=R,_=A;L<_;L+=3){const F=o.getX(L),D=o.getX(L+1),B=o.getX(L+2);a=Ur(this,p,e,ui,l,c,u,h,d,F,D,B),a&&(a.faceIndex=Math.floor(L/3),a.face.materialIndex=g.materialIndex,t.push(a))}}else{const v=Math.max(0,m.start),y=Math.min(o.count,m.start+m.count);for(let g=v,p=y;g<p;g+=3){const R=o.getX(g),A=o.getX(g+1),L=o.getX(g+2);a=Ur(this,i,e,ui,l,c,u,h,d,R,A,L),a&&(a.faceIndex=Math.floor(g/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(i))for(let v=0,y=f.length;v<y;v++){const g=f[v],p=i[g.materialIndex],R=Math.max(g.start,m.start),A=Math.min(g.start+g.count,m.start+m.count);for(let L=R,_=A;L<_;L+=3){const F=L,D=L+1,B=L+2;a=Ur(this,p,e,ui,l,c,u,h,d,F,D,B),a&&(a.faceIndex=Math.floor(L/3),a.face.materialIndex=g.materialIndex,t.push(a))}}else{const v=Math.max(0,m.start),y=Math.min(l.count,m.start+m.count);for(let g=v,p=y;g<p;g+=3){const R=g,A=g+1,L=g+2;a=Ur(this,i,e,ui,l,c,u,h,d,R,A,L),a&&(a.faceIndex=Math.floor(g/3),t.push(a))}}}else n.isGeometry&&console.error("THREE.Mesh.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}}Ye.prototype.isMesh=!0;function Ld(r,e,t,n,i,s,a,o){let l;if(e.side===lt?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side!==Nn,o),l===null)return null;Gr.copy(o),Gr.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(Gr);return c<t.near||c>t.far?null:{distance:c,point:Gr.clone(),object:r}}function Ur(r,e,t,n,i,s,a,o,l,c,u,h){Tn.fromBufferAttribute(i,c),En.fromBufferAttribute(i,u),An.fromBufferAttribute(i,h);const d=r.morphTargetInfluences;if(e.morphTargets&&s&&d){Nr.set(0,0,0),zr.set(0,0,0),Br.set(0,0,0);for(let m=0,v=s.length;m<v;m++){const y=d[m],g=s[m];y!==0&&(pa.fromBufferAttribute(g,c),ma.fromBufferAttribute(g,u),ga.fromBufferAttribute(g,h),a?(Nr.addScaledVector(pa,y),zr.addScaledVector(ma,y),Br.addScaledVector(ga,y)):(Nr.addScaledVector(pa.sub(Tn),y),zr.addScaledVector(ma.sub(En),y),Br.addScaledVector(ga.sub(An),y)))}Tn.add(Nr),En.add(zr),An.add(Br)}r.isSkinnedMesh&&e.skinning&&(r.boneTransform(c,Tn),r.boneTransform(u,En),r.boneTransform(h,An));const f=Ld(r,e,t,n,Tn,En,An,va);if(f){o&&(kr.fromBufferAttribute(o,c),Or.fromBufferAttribute(o,u),Hr.fromBufferAttribute(o,h),f.uv=ut.getUV(va,Tn,En,An,kr,Or,Hr,new se)),l&&(kr.fromBufferAttribute(l,c),Or.fromBufferAttribute(l,u),Hr.fromBufferAttribute(l,h),f.uv2=ut.getUV(va,Tn,En,An,kr,Or,Hr,new se));const m={a:c,b:u,c:h,normal:new M,materialIndex:0};ut.getNormal(Tn,En,An,m.normal),f.face=m}return f}class Ls extends Ve{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,s,0),m("z","y","x",1,-1,n,t,-e,a,s,1),m("x","z","y",1,1,e,n,t,i,a,2),m("x","z","y",1,-1,e,n,-t,i,a,3),m("x","y","z",1,-1,e,t,n,i,s,4),m("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new $e(c,3)),this.setAttribute("normal",new $e(u,3)),this.setAttribute("uv",new $e(h,2));function m(v,y,g,p,R,A,L,_,F,D,B){const U=A/F,N=L/D,z=A/2,S=L/2,E=_/2,C=F+1,b=D+1;let V=0,te=0;const $=new M;for(let he=0;he<b;he++){const oe=he*N-S;for(let Me=0;Me<C;Me++){const Ee=Me*U-z;$[v]=Ee*p,$[y]=oe*R,$[g]=E,c.push($.x,$.y,$.z),$[v]=0,$[y]=0,$[g]=_>0?1:-1,u.push($.x,$.y,$.z),h.push(Me/F),h.push(1-he/D),V+=1}}for(let he=0;he<D;he++)for(let oe=0;oe<F;oe++){const Me=d+oe+C*he,Ee=d+oe+C*(he+1),j=d+(oe+1)+C*(he+1),He=d+(oe+1)+C*he;l.push(Me,Ee,He),l.push(Ee,j,He),te+=6}o.addGroup(f,te,B),f+=te,d+=V}}}function Pi(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function wt(r){const e={};for(let t=0;t<r.length;t++){const n=Pi(r[t]);for(const i in n)e[i]=n[i]}return e}const Cd={clone:Pi,merge:wt};var Rd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Zt extends ft{constructor(e){super(),this.type="ShaderMaterial",this.defines={},this.uniforms={},this.vertexShader=Rd,this.fragmentShader=Pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&(e.attributes!==void 0&&console.error("THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead."),this.setValues(e))}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Pi(e.uniforms),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.lights=e.lights,this.clipping=e.clipping,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}Zt.prototype.isShaderMaterial=!0;class $a extends Je{constructor(){super(),this.type="Camera",this.matrixWorldInverse=new Re,this.projectionMatrix=new Re,this.projectionMatrixInverse=new Re}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){e===void 0&&(console.warn("THREE.Camera: .getWorldDirection() target is now required"),e=new M),this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}$a.prototype.isCamera=!0;class bt extends $a{constructor(e=50,t=1,n=.1,i=2e3){super(),this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Da*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ys*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Da*2*Math.atan(Math.tan(Ys*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ys*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}bt.prototype.isPerspectiveCamera=!0;const hi=90,di=1;class Ka extends Je{constructor(e,t,n){if(super(),this.type="CubeCamera",n.isWebGLCubeRenderTarget!==!0){console.error("THREE.CubeCamera: The constructor now expects an instance of WebGLCubeRenderTarget as third parameter.");return}this.renderTarget=n;const i=new bt(hi,di,e,t);i.layers=this.layers,i.up.set(0,-1,0),i.lookAt(new M(1,0,0)),this.add(i);const s=new bt(hi,di,e,t);s.layers=this.layers,s.up.set(0,-1,0),s.lookAt(new M(-1,0,0)),this.add(s);const a=new bt(hi,di,e,t);a.layers=this.layers,a.up.set(0,0,1),a.lookAt(new M(0,1,0)),this.add(a);const o=new bt(hi,di,e,t);o.layers=this.layers,o.up.set(0,0,-1),o.lookAt(new M(0,-1,0)),this.add(o);const l=new bt(hi,di,e,t);l.layers=this.layers,l.up.set(0,-1,0),l.lookAt(new M(0,0,1)),this.add(l);const c=new bt(hi,di,e,t);c.layers=this.layers,c.up.set(0,-1,0),c.lookAt(new M(0,0,-1)),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();const n=this.renderTarget,[i,s,a,o,l,c]=this.children,u=e.xr.enabled,h=e.getRenderTarget();e.xr.enabled=!1;const d=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,i),e.setRenderTarget(n,1),e.render(t,s),e.setRenderTarget(n,2),e.render(t,a),e.setRenderTarget(n,3),e.render(t,o),e.setRenderTarget(n,4),e.render(t,l),n.texture.generateMipmaps=d,e.setRenderTarget(n,5),e.render(t,c),e.setRenderTarget(h),e.xr.enabled=u}}class Cs extends _t{constructor(e,t,n,i,s,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:qa,o=o!==void 0?o:Zn,super(e,t,n,i,s,a,o,l,c,u),this._needsFlipEnvMap=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}Cs.prototype.isCubeTexture=!0;class lc extends Pn{constructor(e,t,n){Number.isInteger(t)&&(console.warn("THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )"),t=n),super(e,e,t),t=t||{},this.texture=new Cs(void 0,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:zt,this.texture._needsFlipEnvMap=!1}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.format=Ft,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ls(5,5,5),s=new Zt({name:"CubemapFromEquirect",uniforms:Pi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:lt,blending:Rn});s.uniforms.tEquirect.value=t;const a=new Ye(i,s),o=t.minFilter;return t.minFilter===ja&&(t.minFilter=zt),new Ka(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}lc.prototype.isWebGLCubeRenderTarget=!0;class eo extends _t{constructor(e,t,n,i,s,a,o,l,c,u,h,d){super(null,a,o,l,c,u,i,s,h,d),this.image={data:e||null,width:t||1,height:n||1},this.magFilter=c!==void 0?c:dt,this.minFilter=u!==void 0?u:dt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}eo.prototype.isDataTexture=!0;const fi=new Gi,Vr=new M;class Rs{constructor(e=new en,t=new en,n=new en,i=new en,s=new en,a=new en){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){const t=this.planes,n=e.elements,i=n[0],s=n[1],a=n[2],o=n[3],l=n[4],c=n[5],u=n[6],h=n[7],d=n[8],f=n[9],m=n[10],v=n[11],y=n[12],g=n[13],p=n[14],R=n[15];return t[0].setComponents(o-i,h-l,v-d,R-y).normalize(),t[1].setComponents(o+i,h+l,v+d,R+y).normalize(),t[2].setComponents(o+s,h+c,v+f,R+g).normalize(),t[3].setComponents(o-s,h-c,v-f,R-g).normalize(),t[4].setComponents(o-a,h-u,v-m,R-p).normalize(),t[5].setComponents(o+a,h+u,v+m,R+p).normalize(),this}intersectsObject(e){const t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),fi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(fi)}intersectsSprite(e){return fi.center.set(0,0,0),fi.radius=.7071067811865476,fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Vr.x=i.normal.x>0?e.max.x:e.min.x,Vr.y=i.normal.y>0?e.max.y:e.min.y,Vr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Vr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function cc(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Dd(r,e){const t=e.isWebGL2,n=new WeakMap;function i(c,u){const h=c.array,d=c.usage,f=r.createBuffer();r.bindBuffer(u,f),r.bufferData(u,h,d),c.onUploadCallback();let m=5126;return h instanceof Float32Array?m=5126:h instanceof Float64Array?console.warn("THREE.WebGLAttributes: Unsupported data buffer format: Float64Array."):h instanceof Uint16Array?c.isFloat16BufferAttribute?t?m=5131:console.warn("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2."):m=5123:h instanceof Int16Array?m=5122:h instanceof Uint32Array?m=5125:h instanceof Int32Array?m=5124:h instanceof Int8Array?m=5120:h instanceof Uint8Array&&(m=5121),{buffer:f,type:m,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version}}function s(c,u,h){const d=u.array,f=u.updateRange;r.bindBuffer(h,c),f.count===-1?r.bufferSubData(h,0,d):(t?r.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):r.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1)}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);u&&(r.deleteBuffer(u.buffer),n.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h===void 0?n.set(c,i(c,u)):h.version<c.version&&(s(h.buffer,c,u),h.version=c.version)}return{get:a,remove:o,update:l}}class uc extends Ve{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,h=e/o,d=t/l,f=[],m=[],v=[],y=[];for(let g=0;g<u;g++){const p=g*d-a;for(let R=0;R<c;R++){const A=R*h-s;m.push(A,-p,0),v.push(0,0,1),y.push(R/o),y.push(1-g/l)}}for(let g=0;g<l;g++)for(let p=0;p<o;p++){const R=p+c*g,A=p+c*(g+1),L=p+1+c*(g+1),_=p+1+c*g;f.push(R,A,_),f.push(A,L,_)}this.setIndex(f),this.setAttribute("position",new $e(m,3)),this.setAttribute("normal",new $e(v,3)),this.setAttribute("uv",new $e(y,2))}}var Id=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,Fd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nd=`#ifdef ALPHATEST
	if ( diffuseColor.a < ALPHATEST ) discard;
#endif`,zd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );
	#endif
#endif`,Bd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,kd="vec3 transformed = vec3( position );",Od=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hd=`vec2 integrateSpecularBRDF( const in float dotNV, const in float roughness ) {
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	return vec2( -1.04, 1.04 ) * a004 + r.zw;
}
float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
#if defined ( PHYSICALLY_CORRECT_LIGHTS )
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
#else
	if( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
		return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
	}
	return 1.0;
#endif
}
vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
	return ( 1.0 - specularColor ) * fresnel + specularColor;
}
vec3 F_Schlick_RoughnessDependent( const in vec3 F0, const in float dotNV, const in float roughness ) {
	float fresnel = exp2( ( -5.55473 * dotNV - 6.98316 ) * dotNV );
	vec3 Fr = max( vec3( 1.0 - roughness ), F0 ) - F0;
	return Fr * fresnel + F0;
}
float G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	return 1.0 / ( gl * gv );
}
float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( incidentLight.direction + viewDir );
	float dotNL = saturate( dot( normal, incidentLight.direction ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( G * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
vec3 BRDF_Specular_GGX_Environment( const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 brdf = integrateSpecularBRDF( dotNV, roughness );
	return specularColor * brdf.x + brdf.y;
}
void BRDF_Specular_Multiscattering_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
	vec3 F = F_Schlick_RoughnessDependent( specularColor, dotNV, roughness );
	vec2 brdf = integrateSpecularBRDF( dotNV, roughness );
	vec3 FssEss = F * brdf.x + brdf.y;
	float Ess = brdf.x + brdf.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
	return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
}
float BlinnExponentToGGXRoughness( const in float blinnExponent ) {
	return sqrt( 2.0 / ( blinnExponent + 2.0 ) );
}
#if defined( USE_SHEEN )
float D_Charlie(float roughness, float NoH) {
	float invAlpha = 1.0 / roughness;
	float cos2h = NoH * NoH;
	float sin2h = max(1.0 - cos2h, 0.0078125);	return (2.0 + invAlpha) * pow(sin2h, invAlpha * 0.5) / (2.0 * PI);
}
float V_Neubelt(float NoV, float NoL) {
	return saturate(1.0 / (4.0 * (NoL + NoV - NoL * NoV)));
}
vec3 BRDF_Specular_Sheen( const in float roughness, const in vec3 L, const in GeometricContext geometry, vec3 specularColor ) {
	vec3 N = geometry.normal;
	vec3 V = geometry.viewDir;
	vec3 H = normalize( V + L );
	float dotNH = saturate( dot( N, H ) );
	return specularColor * D_Charlie( roughness, dotNH ) * V_Neubelt( dot(N, V), dot(N, L) );
}
#endif`,Gd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );
		vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ud=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Vd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Yd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,jd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Zd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Jd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate(a) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float max3( vec3 v ) { return max( max( v.x, v.y ), v.z ); }
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float linearToRelativeLuminance( const in vec3 color ) {
	vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
	return dot( weights, color.rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}`,Qd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_maxMipLevel 8.0
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_maxTileSize 256.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		float texelSize = 1.0 / ( 3.0 * cubeUV_maxTileSize );
		vec2 uv = getUV( direction, face ) * ( faceSize - 1.0 );
		vec2 f = fract( uv );
		uv += 0.5 - f;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		if ( mipInt < cubeUV_maxMipLevel ) {
			uv.y += 2.0 * cubeUV_maxTileSize;
		}
		uv.y += filterInt * 2.0 * cubeUV_minTileSize;
		uv.x += 3.0 * max( 0.0, cubeUV_maxTileSize - 2.0 * faceSize );
		uv *= texelSize;
		vec3 tl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x += texelSize;
		vec3 tr = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.y += texelSize;
		vec3 br = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x -= texelSize;
		vec3 bl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		vec3 tm = mix( tl, tr, f.x );
		vec3 bm = mix( bl, br, f.x );
		return mix( tm, bm, f.y );
	}
	#define r0 1.0
	#define v0 0.339
	#define m0 - 2.0
	#define r1 0.8
	#define v1 0.276
	#define m1 - 1.0
	#define r4 0.4
	#define v4 0.046
	#define m4 2.0
	#define r5 0.305
	#define v5 0.016
	#define m5 3.0
	#define r6 0.21
	#define v6 0.0038
	#define m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= r1 ) {
			mip = ( r0 - roughness ) * ( m1 - m0 ) / ( r0 - r1 ) + m0;
		} else if ( roughness >= r4 ) {
			mip = ( r1 - roughness ) * ( m4 - m1 ) / ( r1 - r4 ) + m1;
		} else if ( roughness >= r5 ) {
			mip = ( r4 - roughness ) * ( m5 - m4 ) / ( r4 - r5 ) + m4;
		} else if ( roughness >= r6 ) {
			mip = ( r5 - roughness ) * ( m6 - m5 ) / ( r5 - r6 ) + m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), m0, cubeUV_maxMipLevel );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,$d=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Kd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ef=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,tf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,nf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rf="gl_FragColor = linearToOutputTexel( gl_FragColor );",sf=`
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( gammaFactor ) ), value.a );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
}
vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 RGBEToLinear( in vec4 value ) {
	return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
	float maxComponent = max( max( value.r, value.g ), value.b );
	float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
	return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * value.a * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float M = clamp( maxRGB / maxRange, 0.0, 1.0 );
	M = ceil( M * 255.0 ) / 255.0;
	return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float D = max( maxRange / maxRGB, 1.0 );
	D = clamp( floor( D ) / 255.0, 0.0, 1.0 );
	return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value ) {
	vec3 Xp_Y_XYZp = cLogLuvM * value.rgb;
	Xp_Y_XYZp = max( Xp_Y_XYZp, vec3( 1e-6, 1e-6, 1e-6 ) );
	vec4 vResult;
	vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
	float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
	vResult.w = fract( Le );
	vResult.z = ( Le - ( floor( vResult.w * 255.0 ) ) / 255.0 ) / 255.0;
	return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
	float Le = value.z * 255.0 + value.w;
	vec3 Xp_Y_XYZp;
	Xp_Y_XYZp.y = exp2( ( Le - 127.0 ) / 2.0 );
	Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
	Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
	vec3 vRGB = cLogLuvInverseM * Xp_Y_XYZp.rgb;
	return vec4( max( vRGB, 0.0 ), 1.0 );
}`,af=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 envColor = textureCubeUV( envMap, reflectVec, 0.0 );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifndef ENVMAP_TYPE_CUBE_UV
		envColor = envMapTexelToLinear( envColor );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,of=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform int maxMipLevel;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,lf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,cf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) ||defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,uf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hf=`#ifdef USE_FOG
	fogDepth = - mvPosition.z;
#endif`,df=`#ifdef USE_FOG
	varying float fogDepth;
#endif`,ff=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float fogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return texture2D( gradientMap, coord ).rgb;
	#else
		return ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );
	#endif
}`,gf=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel= texture2D( lightMap, vUv2 );
	reflectedLight.indirectDiffuse += PI * lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
#endif`,vf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xf=`vec3 diffuse = vec3( 1.0 );
GeometricContext geometry;
geometry.position = mvPosition.xyz;
geometry.normal = normalize( transformedNormal );
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );
GeometricContext backGeometry;
backGeometry.position = geometry.position;
backGeometry.normal = -geometry.normal;
backGeometry.viewDir = geometry.viewDir;
vLightFront = vec3( 0.0 );
vIndirectFront = vec3( 0.0 );
#ifdef DOUBLE_SIDED
	vLightBack = vec3( 0.0 );
	vIndirectBack = vec3( 0.0 );
#endif
IncidentLight directLight;
float dotNL;
vec3 directLightColor_Diffuse;
vIndirectFront += getAmbientLightIrradiance( ambientLightColor );
vIndirectFront += getLightProbeIrradiance( lightProbe, geometry );
#ifdef DOUBLE_SIDED
	vIndirectBack += getAmbientLightIrradiance( ambientLightColor );
	vIndirectBack += getLightProbeIrradiance( lightProbe, backGeometry );
#endif
#if NUM_POINT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		getPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_SPOT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		getSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_DIR_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		getDirectionalDirectLightIrradiance( directionalLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_HEMI_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
		vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
		#ifdef DOUBLE_SIDED
			vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );
		#endif
	}
	#pragma unroll_loop_end
#endif`,yf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in GeometricContext geometry ) {
	vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	return irradiance;
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		directLight.color = directionalLight.color;
		directLight.direction = directionalLight.direction;
		directLight.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		vec3 lVector = pointLight.position - geometry.position;
		directLight.direction = normalize( lVector );
		float lightDistance = length( lVector );
		directLight.color = pointLight.color;
		directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
		directLight.visible = ( directLight.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		vec3 lVector = spotLight.position - geometry.position;
		directLight.direction = normalize( lVector );
		float lightDistance = length( lVector );
		float angleCos = dot( directLight.direction, spotLight.direction );
		if ( angleCos > spotLight.coneCos ) {
			float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );
			directLight.color = spotLight.color;
			directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );
			directLight.visible = true;
		} else {
			directLight.color = vec3( 0.0 );
			directLight.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {
		float dotNL = dot( geometry.normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			irradiance *= PI;
		#endif
		return irradiance;
	}
#endif`,_f=`#if defined( USE_ENVMAP )
	#ifdef ENVMAP_MODE_REFRACTION
		uniform float refractionRatio;
	#endif
	vec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {
		vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
		#ifdef ENVMAP_TYPE_CUBE
			vec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );
			#else
				vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
		#else
			vec4 envMapColor = vec4( 0.0 );
		#endif
		return PI * envMapColor.rgb * envMapIntensity;
	}
	float getSpecularMIPLevel( const in float roughness, const in int maxMIPLevel ) {
		float maxMIPLevelScalar = float( maxMIPLevel );
		float sigma = PI * roughness * roughness / ( 1.0 + roughness );
		float desiredMIPLevel = maxMIPLevelScalar + log2( sigma );
		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
	}
	vec3 getLightProbeIndirectRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in int maxMIPLevel ) {
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( -viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
		#else
			vec3 reflectVec = refract( -viewDir, normal, refractionRatio );
		#endif
		reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
		float specularMIPLevel = getSpecularMIPLevel( roughness, maxMIPLevel );
		#ifdef ENVMAP_TYPE_CUBE
			vec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );
			#else
				vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
		#endif
		return envMapColor.rgb * envMapIntensity;
	}
#endif`,wf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mf=`varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
#define Material_LightProbeLOD( material )	(0)`,bf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Sf=`varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)`,Tf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.specularRoughness = max( roughnessFactor, 0.0525 );material.specularRoughness += geometryRoughness;
material.specularRoughness = min( material.specularRoughness, 1.0 );
#ifdef REFLECTIVITY
	material.specularColor = mix( vec3( MAXIMUM_SPECULAR_COEFFICIENT * pow2( reflectivity ) ), diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( DEFAULT_SPECULAR_COEFFICIENT ), diffuseColor.rgb, metalnessFactor );
#endif
#ifdef CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheen;
#endif`,Ef=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float specularRoughness;
	vec3 specularColor;
#ifdef CLEARCOAT
	float clearcoat;
	float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	vec3 sheenColor;
#endif
};
#define MAXIMUM_SPECULAR_COEFFICIENT 0.16
#define DEFAULT_SPECULAR_COEFFICIENT 0.04
float clearcoatDHRApprox( const in float roughness, const in float dotNL ) {
	return DEFAULT_SPECULAR_COEFFICIENT + ( 1.0 - DEFAULT_SPECULAR_COEFFICIENT ) * ( pow( 1.0 - dotNL, 5.0 ) * pow( 1.0 - roughness, 2.0 ) );
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.specularRoughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	#ifdef CLEARCOAT
		float ccDotNL = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = ccDotNL * directLight.color;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			ccIrradiance *= PI;
		#endif
		float clearcoatDHR = material.clearcoat * clearcoatDHRApprox( material.clearcoatRoughness, ccDotNL );
		reflectedLight.directSpecular += ccIrradiance * material.clearcoat * BRDF_Specular_GGX( directLight, geometry.viewDir, geometry.clearcoatNormal, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearcoatRoughness );
	#else
		float clearcoatDHR = 0.0;
	#endif
	#ifdef USE_SHEEN
		reflectedLight.directSpecular += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Specular_Sheen(
			material.specularRoughness,
			directLight.direction,
			geometry,
			material.sheenColor
		);
	#else
		reflectedLight.directSpecular += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Specular_GGX( directLight, geometry.viewDir, geometry.normal, material.specularColor, material.specularRoughness);
	#endif
	reflectedLight.directDiffuse += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef CLEARCOAT
		float ccDotNV = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		reflectedLight.indirectSpecular += clearcoatRadiance * material.clearcoat * BRDF_Specular_GGX_Environment( geometry.viewDir, geometry.clearcoatNormal, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearcoatRoughness );
		float ccDotNL = ccDotNV;
		float clearcoatDHR = material.clearcoat * clearcoatDHRApprox( material.clearcoatRoughness, ccDotNL );
	#else
		float clearcoatDHR = 0.0;
	#endif
	float clearcoatInv = 1.0 - clearcoatDHR;
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	BRDF_Specular_Multiscattering_Environment( geometry, material.specularColor, material.specularRoughness, singleScattering, multiScattering );
	vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );
	reflectedLight.indirectSpecular += clearcoatInv * radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Af=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointDirectLightIrradiance( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotDirectLightIrradiance( spotLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Lf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		vec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			lightMapIrradiance *= PI;
		#endif
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getLightProbeIndirectIrradiance( geometry, maxMipLevel );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getLightProbeIndirectRadiance( geometry.viewDir, geometry.normal, material.specularRoughness, maxMipLevel );
	#ifdef CLEARCOAT
		clearcoatRadiance += getLightProbeIndirectRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness, maxMipLevel );
	#endif
#endif`,Cf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,Rf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Df=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,If=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Ff=`#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif`,Nf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	vec4 mapTexel = texture2D( map, uv );
	diffuseColor *= mapTexelToLinear( mapTexel );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Bf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Of=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
	objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
	objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
	objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
#endif`,Gf=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifndef USE_MORPHNORMALS
		uniform float morphTargetInfluences[ 8 ];
	#else
		uniform float morphTargetInfluences[ 4 ];
	#endif
#endif`,Uf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	transformed += morphTarget0 * morphTargetInfluences[ 0 ];
	transformed += morphTarget1 * morphTargetInfluences[ 1 ];
	transformed += morphTarget2 * morphTargetInfluences[ 2 ];
	transformed += morphTarget3 * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
		transformed += morphTarget4 * morphTargetInfluences[ 4 ];
		transformed += morphTarget5 * morphTargetInfluences[ 5 ];
		transformed += morphTarget6 * morphTargetInfluences[ 6 ];
		transformed += morphTarget7 * morphTargetInfluences[ 7 ];
	#endif
#endif`,Vf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	#ifdef USE_TANGENT
		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );
		#ifdef DOUBLE_SIDED
			tangent = tangent * faceDirection;
			bitangent = bitangent * faceDirection;
		#endif
		#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )
			mat3 vTBN = mat3( tangent, bitangent, normal );
		#endif
	#endif
#endif
vec3 geometryNormal = normal;`,Wf=`#ifdef OBJECTSPACE_NORMALMAP
	normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( TANGENTSPACE_NORMALMAP )
	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	#ifdef USE_TANGENT
		normal = normalize( vTBN * mapN );
	#else
		normal = perturbNormal2Arb( -vViewPosition, normal, mapN, faceDirection );
	#endif
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,qf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef OBJECTSPACE_NORMALMAP
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
		return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
	}
#endif`,Xf=`#ifdef CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,Yf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,jf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,Zf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}`,Jf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Qf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$f=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Kf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,np=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
		bool frustumTest = all( frustumTestVec );
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,ip=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,rp=`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SPOT_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		vec4 shadowWorldPosition;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias, 0 );
		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
#endif`,sp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ap=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,op=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform highp sampler2D boneTexture;
		uniform int boneTextureSize;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );
			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif`,lp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,up=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,fp=`#ifndef saturate
#define saturate(a) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,pp=`#ifdef USE_TRANSMISSIONMAP
	totalTransmission *= texture2D( transmissionMap, vUv ).r;
#endif`,mp=`#ifdef USE_TRANSMISSIONMAP
	uniform sampler2D transmissionMap;
#endif`,gp=`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,vp=`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,xp=`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,yp=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,_p=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,wp=`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,Mp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,bp=`uniform sampler2D t2D;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Sp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tp=`#include <envmap_common_pars_fragment>
uniform float opacity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>
	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Ep=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ap=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Lp=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Cp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Rp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Pp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	vec4 texColor = texture2D( tEquirect, sampleUV );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,Dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ip=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Np=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
	
		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zp=`#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <skinbase_vertex>
	#ifdef USE_ENVMAP
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Bp=`uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <emissivemap_fragment>
	#ifdef DOUBLE_SIDED
		reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
	#else
		reflectedLight.indirectDiffuse += vIndirectFront;
	#endif
	#include <lightmap_fragment>
	reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );
	#ifdef DOUBLE_SIDED
		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
	#else
		reflectedLight.directDiffuse = vLightFront;
	#endif
	reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kp=`#define LAMBERT
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <bsdfs>
#include <lights_pars_begin>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <lights_lambert_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Op=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <fog_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
		matcapColor = matcapTexelToLinear( matcapColor );
	#else
		vec4 matcapColor = vec4( 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`#define MATCAP
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#ifndef FLAT_SHADED
		vNormal = normalize( transformedNormal );
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Gp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`#define TOON
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wp=`#define PHONG
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qp=`#define STANDARD
#ifdef PHYSICAL
	#define REFLECTIVITY
	#define CLEARCOAT
	#define TRANSMISSION
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef TRANSMISSION
	uniform float transmission;
#endif
#ifdef REFLECTIVITY
	uniform float reflectivity;
#endif
#ifdef CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <transmissionmap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#ifdef TRANSMISSION
		float totalTransmission = transmission;
	#endif
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <transmissionmap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#ifdef TRANSMISSION
		diffuseColor.a *= mix( saturate( 1. - totalTransmission + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) ), 1.0, metalness );
	#endif
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xp=`#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <packing>
#include <uv_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
}`,jp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Zp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Qp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,$p=`#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <begin_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,em=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`;const Ue={alphamap_fragment:Id,alphamap_pars_fragment:Fd,alphatest_fragment:Nd,aomap_fragment:zd,aomap_pars_fragment:Bd,begin_vertex:kd,beginnormal_vertex:Od,bsdfs:Hd,bumpmap_pars_fragment:Gd,clipping_planes_fragment:Ud,clipping_planes_pars_fragment:Vd,clipping_planes_pars_vertex:Wd,clipping_planes_vertex:qd,color_fragment:Xd,color_pars_fragment:Yd,color_pars_vertex:jd,color_vertex:Zd,common:Jd,cube_uv_reflection_fragment:Qd,defaultnormal_vertex:$d,displacementmap_pars_vertex:Kd,displacementmap_vertex:ef,emissivemap_fragment:tf,emissivemap_pars_fragment:nf,encodings_fragment:rf,encodings_pars_fragment:sf,envmap_fragment:af,envmap_common_pars_fragment:of,envmap_pars_fragment:lf,envmap_pars_vertex:cf,envmap_physical_pars_fragment:_f,envmap_vertex:uf,fog_vertex:hf,fog_pars_vertex:df,fog_fragment:ff,fog_pars_fragment:pf,gradientmap_pars_fragment:mf,lightmap_fragment:gf,lightmap_pars_fragment:vf,lights_lambert_vertex:xf,lights_pars_begin:yf,lights_toon_fragment:wf,lights_toon_pars_fragment:Mf,lights_phong_fragment:bf,lights_phong_pars_fragment:Sf,lights_physical_fragment:Tf,lights_physical_pars_fragment:Ef,lights_fragment_begin:Af,lights_fragment_maps:Lf,lights_fragment_end:Cf,logdepthbuf_fragment:Rf,logdepthbuf_pars_fragment:Pf,logdepthbuf_pars_vertex:Df,logdepthbuf_vertex:If,map_fragment:Ff,map_pars_fragment:Nf,map_particle_fragment:zf,map_particle_pars_fragment:Bf,metalnessmap_fragment:kf,metalnessmap_pars_fragment:Of,morphnormal_vertex:Hf,morphtarget_pars_vertex:Gf,morphtarget_vertex:Uf,normal_fragment_begin:Vf,normal_fragment_maps:Wf,normalmap_pars_fragment:qf,clearcoat_normal_fragment_begin:Xf,clearcoat_normal_fragment_maps:Yf,clearcoat_pars_fragment:jf,packing:Zf,premultiplied_alpha_fragment:Jf,project_vertex:Qf,dithering_fragment:$f,dithering_pars_fragment:Kf,roughnessmap_fragment:ep,roughnessmap_pars_fragment:tp,shadowmap_pars_fragment:np,shadowmap_pars_vertex:ip,shadowmap_vertex:rp,shadowmask_pars_fragment:sp,skinbase_vertex:ap,skinning_pars_vertex:op,skinning_vertex:lp,skinnormal_vertex:cp,specularmap_fragment:up,specularmap_pars_fragment:hp,tonemapping_fragment:dp,tonemapping_pars_fragment:fp,transmissionmap_fragment:pp,transmissionmap_pars_fragment:mp,uv_pars_fragment:gp,uv_pars_vertex:vp,uv_vertex:xp,uv2_pars_fragment:yp,uv2_pars_vertex:_p,uv2_vertex:wp,worldpos_vertex:Mp,background_frag:bp,background_vert:Sp,cube_frag:Tp,cube_vert:Ep,depth_frag:Ap,depth_vert:Lp,distanceRGBA_frag:Cp,distanceRGBA_vert:Rp,equirect_frag:Pp,equirect_vert:Dp,linedashed_frag:Ip,linedashed_vert:Fp,meshbasic_frag:Np,meshbasic_vert:zp,meshlambert_frag:Bp,meshlambert_vert:kp,meshmatcap_frag:Op,meshmatcap_vert:Hp,meshtoon_frag:Gp,meshtoon_vert:Up,meshphong_frag:Vp,meshphong_vert:Wp,meshphysical_frag:qp,meshphysical_vert:Xp,normal_frag:Yp,normal_vert:jp,points_frag:Zp,points_vert:Jp,shadow_frag:Qp,shadow_vert:$p,sprite_frag:Kp,sprite_vert:em},de={common:{diffuse:{value:new xe(15658734)},opacity:{value:1},map:{value:null},uvTransform:{value:new yt},uv2Transform:{value:new yt},alphaMap:{value:null}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},refractionRatio:{value:.98},maxMipLevel:{value:0}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotShadowMap:{value:[]},spotShadowMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new xe(15658734)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},uvTransform:{value:new yt}},sprite:{diffuse:{value:new xe(15658734)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},uvTransform:{value:new yt}}},tn={basic:{uniforms:wt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:wt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.fog,de.lights,{emissive:{value:new xe(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:wt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new xe(0)},specular:{value:new xe(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:wt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:wt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new xe(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:wt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:wt([de.points,de.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:wt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:wt([de.common,de.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:wt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.normal_vert,fragmentShader:Ue.normal_frag},sprite:{uniforms:wt([de.sprite,de.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new yt},t2D:{value:null}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},cube:{uniforms:wt([de.envmap,{opacity:{value:1}}]),vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:wt([de.common,de.displacementmap,{referencePosition:{value:new M},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:wt([de.lights,de.fog,{color:{value:new xe(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};tn.physical={uniforms:wt([tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new se(1,1)},clearcoatNormalMap:{value:null},sheen:{value:new xe(0)},transmission:{value:0},transmissionMap:{value:null}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};function tm(r,e,t,n,i){const s=new xe(0);let a=0,o,l,c=null,u=0,h=null;function d(m,v,y,g){let p=v.isScene===!0?v.background:null;p&&p.isTexture&&(p=e.get(p));const R=r.xr,A=R.getSession&&R.getSession();A&&A.environmentBlendMode==="additive"&&(p=null),p===null?f(s,a):p&&p.isColor&&(f(p,1),g=!0),(r.autoClear||g)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil),p&&(p.isCubeTexture||p.mapping===Es)?(l===void 0&&(l=new Ye(new Ls(1,1,1),new Zt({name:"BackgroundCubeMaterial",uniforms:Pi(tn.cube.uniforms),vertexShader:tn.cube.vertexShader,fragmentShader:tn.cube.fragmentShader,side:lt,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(L,_,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=p,l.material.uniforms.flipEnvMap.value=p.isCubeTexture&&p._needsFlipEnvMap?-1:1,(c!==p||u!==p.version||h!==r.toneMapping)&&(l.material.needsUpdate=!0,c=p,u=p.version,h=r.toneMapping),m.unshift(l,l.geometry,l.material,0,0,null)):p&&p.isTexture&&(o===void 0&&(o=new Ye(new uc(2,2),new Zt({name:"BackgroundMaterial",uniforms:Pi(tn.background.uniforms),vertexShader:tn.background.vertexShader,fragmentShader:tn.background.fragmentShader,side:Ss,depthTest:!1,depthWrite:!1,fog:!1})),o.geometry.deleteAttribute("normal"),Object.defineProperty(o.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(o)),o.material.uniforms.t2D.value=p,p.matrixAutoUpdate===!0&&p.updateMatrix(),o.material.uniforms.uvTransform.value.copy(p.matrix),(c!==p||u!==p.version||h!==r.toneMapping)&&(o.material.needsUpdate=!0,c=p,u=p.version,h=r.toneMapping),m.unshift(o,o.geometry,o.material,0,0,null))}function f(m,v){t.buffers.color.setClear(m.r,m.g,m.b,v,i)}return{getClearColor:function(){return s},setClearColor:function(m,v=1){s.set(m),a=v,f(s,a)},getClearAlpha:function(){return a},setClearAlpha:function(m){a=m,f(s,a)},render:d}}function nm(r,e,t,n){const i=r.getParameter(34921),s=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||s!==null,o={},l=v(null);let c=l;function u(S,E,C,b,V){let te=!1;if(a){const $=m(b,C,E);c!==$&&(c=$,d(c.object)),te=y(b,V),te&&g(b,V)}else{const $=E.wireframe===!0;(c.geometry!==b.id||c.program!==C.id||c.wireframe!==$)&&(c.geometry=b.id,c.program=C.id,c.wireframe=$,te=!0)}S.isInstancedMesh===!0&&(te=!0),V!==null&&t.update(V,34963),te&&(F(S,E,C,b),V!==null&&r.bindBuffer(34963,t.get(V).buffer))}function h(){return n.isWebGL2?r.createVertexArray():s.createVertexArrayOES()}function d(S){return n.isWebGL2?r.bindVertexArray(S):s.bindVertexArrayOES(S)}function f(S){return n.isWebGL2?r.deleteVertexArray(S):s.deleteVertexArrayOES(S)}function m(S,E,C){const b=C.wireframe===!0;let V=o[S.id];V===void 0&&(V={},o[S.id]=V);let te=V[E.id];te===void 0&&(te={},V[E.id]=te);let $=te[b];return $===void 0&&($=v(h()),te[b]=$),$}function v(S){const E=[],C=[],b=[];for(let V=0;V<i;V++)E[V]=0,C[V]=0,b[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:C,attributeDivisors:b,object:S,attributes:{},index:null}}function y(S,E){const C=c.attributes,b=S.attributes;let V=0;for(const te in b){const $=C[te],he=b[te];if($===void 0||$.attribute!==he||$.data!==he.data)return!0;V++}return c.attributesNum!==V||c.index!==E}function g(S,E){const C={},b=S.attributes;let V=0;for(const te in b){const $=b[te],he={};he.attribute=$,$.data&&(he.data=$.data),C[te]=he,V++}c.attributes=C,c.attributesNum=V,c.index=E}function p(){const S=c.newAttributes;for(let E=0,C=S.length;E<C;E++)S[E]=0}function R(S){A(S,0)}function A(S,E){const C=c.newAttributes,b=c.enabledAttributes,V=c.attributeDivisors;C[S]=1,b[S]===0&&(r.enableVertexAttribArray(S),b[S]=1),V[S]!==E&&((n.isWebGL2?r:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](S,E),V[S]=E)}function L(){const S=c.newAttributes,E=c.enabledAttributes;for(let C=0,b=E.length;C<b;C++)E[C]!==S[C]&&(r.disableVertexAttribArray(C),E[C]=0)}function _(S,E,C,b,V,te){n.isWebGL2===!0&&(C===5124||C===5125)?r.vertexAttribIPointer(S,E,C,V,te):r.vertexAttribPointer(S,E,C,b,V,te)}function F(S,E,C,b){if(n.isWebGL2===!1&&(S.isInstancedMesh||b.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;p();const V=b.attributes,te=C.getAttributes(),$=E.defaultAttributeValues;for(const he in te){const oe=te[he];if(oe>=0){const Me=V[he];if(Me!==void 0){const Ee=Me.normalized,j=Me.itemSize,He=t.get(Me);if(He===void 0)continue;const Oe=He.buffer,De=He.type,be=He.bytesPerElement;if(Me.isInterleavedBufferAttribute){const Ge=Me.data,Fe=Ge.stride,ze=Me.offset;Ge&&Ge.isInstancedInterleavedBuffer?(A(oe,Ge.meshPerAttribute),b._maxInstanceCount===void 0&&(b._maxInstanceCount=Ge.meshPerAttribute*Ge.count)):R(oe),r.bindBuffer(34962,Oe),_(oe,j,De,Ee,Fe*be,ze*be)}else Me.isInstancedBufferAttribute?(A(oe,Me.meshPerAttribute),b._maxInstanceCount===void 0&&(b._maxInstanceCount=Me.meshPerAttribute*Me.count)):R(oe),r.bindBuffer(34962,Oe),_(oe,j,De,Ee,0,0)}else if(he==="instanceMatrix"){const Ee=t.get(S.instanceMatrix);if(Ee===void 0)continue;const j=Ee.buffer,He=Ee.type;A(oe+0,1),A(oe+1,1),A(oe+2,1),A(oe+3,1),r.bindBuffer(34962,j),r.vertexAttribPointer(oe+0,4,He,!1,64,0),r.vertexAttribPointer(oe+1,4,He,!1,64,16),r.vertexAttribPointer(oe+2,4,He,!1,64,32),r.vertexAttribPointer(oe+3,4,He,!1,64,48)}else if(he==="instanceColor"){const Ee=t.get(S.instanceColor);if(Ee===void 0)continue;const j=Ee.buffer,He=Ee.type;A(oe,1),r.bindBuffer(34962,j),r.vertexAttribPointer(oe,3,He,!1,12,0)}else if($!==void 0){const Ee=$[he];if(Ee!==void 0)switch(Ee.length){case 2:r.vertexAttrib2fv(oe,Ee);break;case 3:r.vertexAttrib3fv(oe,Ee);break;case 4:r.vertexAttrib4fv(oe,Ee);break;default:r.vertexAttrib1fv(oe,Ee)}}}}L()}function D(){N();for(const S in o){const E=o[S];for(const C in E){const b=E[C];for(const V in b)f(b[V].object),delete b[V];delete E[C]}delete o[S]}}function B(S){if(o[S.id]===void 0)return;const E=o[S.id];for(const C in E){const b=E[C];for(const V in b)f(b[V].object),delete b[V];delete E[C]}delete o[S.id]}function U(S){for(const E in o){const C=o[E];if(C[S.id]===void 0)continue;const b=C[S.id];for(const V in b)f(b[V].object),delete b[V];delete C[S.id]}}function N(){z(),c!==l&&(c=l,d(c.object))}function z(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:N,resetDefaultState:z,dispose:D,releaseStatesOfGeometry:B,releaseStatesOfProgram:U,initAttributes:p,enableAttribute:R,disableUnusedAttributes:L}}function im(r,e,t,n){const i=n.isWebGL2;let s;function a(c){s=c}function o(c,u){r.drawArrays(s,c,u),t.update(u,s,1)}function l(c,u,h){if(h===0)return;let d,f;if(i)d=r,f="drawArraysInstanced";else if(d=e.get("ANGLE_instanced_arrays"),f="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[f](s,c,u,h),t.update(u,s,h)}this.setMode=a,this.render=o,this.renderInstances=l}function rm(r,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");n=r.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(_){if(_==="highp"){if(r.getShaderPrecisionFormat(35633,36338).precision>0&&r.getShaderPrecisionFormat(35632,36338).precision>0)return"highp";_="mediump"}return _==="mediump"&&r.getShaderPrecisionFormat(35633,36337).precision>0&&r.getShaderPrecisionFormat(35632,36337).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&r instanceof WebGL2RenderingContext||typeof WebGL2ComputeRenderingContext<"u"&&r instanceof WebGL2ComputeRenderingContext;let o=t.precision!==void 0?t.precision:"highp";const l=s(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=t.logarithmicDepthBuffer===!0,u=r.getParameter(34930),h=r.getParameter(35660),d=r.getParameter(3379),f=r.getParameter(34076),m=r.getParameter(34921),v=r.getParameter(36347),y=r.getParameter(36348),g=r.getParameter(36349),p=h>0,R=a||e.has("OES_texture_float"),A=p&&R,L=a?r.getParameter(36183):0;return{isWebGL2:a,getMaxAnisotropy:i,getMaxPrecision:s,precision:o,logarithmicDepthBuffer:c,maxTextures:u,maxVertexTextures:h,maxTextureSize:d,maxCubemapSize:f,maxAttributes:m,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:g,vertexTextures:p,floatFragmentTextures:R,floatVertexTextures:A,maxSamples:L}}function sm(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new en,o=new yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d,f){const m=h.length!==0||d||n!==0||i;return i=d,t=u(h,f,0),n=h.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1,c()},this.setState=function(h,d,f){const m=h.clippingPlanes,v=h.clipIntersection,y=h.clipShadows,g=r.get(h);if(!i||m===null||m.length===0||s&&!y)s?u(null):c();else{const p=s?0:n,R=p*4;let A=g.clippingState||null;l.value=A,A=u(m,d,R,f);for(let L=0;L!==R;++L)A[L]=t[L];g.clippingState=A,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=p}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,m){const v=h!==null?h.length:0;let y=null;if(v!==0){if(y=l.value,m!==!0||y===null){const g=f+v*4,p=d.matrixWorldInverse;o.getNormalMatrix(p),(y===null||y.length<g)&&(y=new Float32Array(g));for(let R=0,A=f;R!==v;++R,A+=4)a.copy(h[R]).applyMatrix4(p,o),a.normal.toArray(y,A),y[A+3]=a.constant}l.value=y,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,y}}function am(r){let e=new WeakMap;function t(a,o){return o===Eo?a.mapping=qa:o===Ao&&(a.mapping=Xa),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Eo||o===Ao)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=r.getRenderTarget(),u=new lc(l.height/2);return u.fromEquirectangularTexture(r,a),e.set(a,u),r.setRenderTarget(c),a.addEventListener("dispose",i),t(u.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}function om(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function lm(r,e,t,n){const i={},s=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete i[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const m in d)e.update(d[m],34962);const f=h.morphAttributes;for(const m in f){const v=f[m];for(let y=0,g=v.length;y<g;y++)e.update(v[y],34962)}}function c(h){const d=[],f=h.index,m=h.attributes.position;let v=0;if(f!==null){const p=f.array;v=f.version;for(let R=0,A=p.length;R<A;R+=3){const L=p[R+0],_=p[R+1],F=p[R+2];d.push(L,_,_,F,F,L)}}else{const p=m.array;v=m.version;for(let R=0,A=p.length/3-1;R<A;R+=3){const L=R+0,_=R+1,F=R+2;d.push(L,_,_,F,F,L)}}const y=new(oc(d)>65535?ac:sc)(d,1);y.version=v;const g=s.get(h);g&&e.remove(g),s.set(h,y)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function cm(r,e,t,n){const i=n.isWebGL2;let s;function a(d){s=d}let o,l;function c(d){o=d.type,l=d.bytesPerElement}function u(d,f){r.drawElements(s,f,o,d*l),t.update(f,s,1)}function h(d,f,m){if(m===0)return;let v,y;if(i)v=r,y="drawElementsInstanced";else if(v=e.get("ANGLE_instanced_arrays"),y="drawElementsInstancedANGLE",v===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}v[y](s,f,o,d*l,m),t.update(f,s,m)}this.setMode=a,this.setIndex=c,this.render=u,this.renderInstances=h}function um(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case 4:t.triangles+=o*(s/3);break;case 1:t.lines+=o*(s/2);break;case 3:t.lines+=o*(s-1);break;case 2:t.lines+=o*s;break;case 0:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.frame++,t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function hm(r,e){return r[0]-e[0]}function dm(r,e){return Math.abs(e[1])-Math.abs(r[1])}function fm(r){const e={},t=new Float32Array(8),n=[];for(let s=0;s<8;s++)n[s]=[s,0];function i(s,a,o,l){const c=s.morphTargetInfluences,u=c===void 0?0:c.length;let h=e[a.id];if(h===void 0){h=[];for(let y=0;y<u;y++)h[y]=[y,0];e[a.id]=h}for(let y=0;y<u;y++){const g=h[y];g[0]=y,g[1]=c[y]}h.sort(dm);for(let y=0;y<8;y++)y<u&&h[y][1]?(n[y][0]=h[y][0],n[y][1]=h[y][1]):(n[y][0]=Number.MAX_SAFE_INTEGER,n[y][1]=0);n.sort(hm);const d=o.morphTargets&&a.morphAttributes.position,f=o.morphNormals&&a.morphAttributes.normal;let m=0;for(let y=0;y<8;y++){const g=n[y],p=g[0],R=g[1];p!==Number.MAX_SAFE_INTEGER&&R?(d&&a.getAttribute("morphTarget"+y)!==d[p]&&a.setAttribute("morphTarget"+y,d[p]),f&&a.getAttribute("morphNormal"+y)!==f[p]&&a.setAttribute("morphNormal"+y,f[p]),t[y]=R,m+=R):(d&&a.hasAttribute("morphTarget"+y)===!0&&a.deleteAttribute("morphTarget"+y),f&&a.hasAttribute("morphNormal"+y)===!0&&a.deleteAttribute("morphNormal"+y),t[y]=0)}const v=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(r,"morphTargetBaseInfluence",v),l.getUniforms().setValue(r,"morphTargetInfluences",t)}return{update:i}}function pm(r,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);return i.get(h)!==c&&(e.update(h),i.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),t.update(l.instanceMatrix,34962),l.instanceColor!==null&&t.update(l.instanceColor,34962)),h}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class hc extends _t{constructor(e=null,t=1,n=1,i=1){super(null),this.image={data:e,width:t,height:n,depth:i},this.magFilter=dt,this.minFilter=dt,this.wrapR=jt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}hc.prototype.isDataTexture2DArray=!0;class dc extends _t{constructor(e=null,t=1,n=1,i=1){super(null),this.image={data:e,width:t,height:n,depth:i},this.magFilter=dt,this.minFilter=dt,this.wrapR=jt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}}dc.prototype.isDataTexture3D=!0;const fc=new _t,mm=new hc,gm=new dc,pc=new Cs,Ko=[],el=[],tl=new Float32Array(16),nl=new Float32Array(9),il=new Float32Array(4);function Wi(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=Ko[i];if(s===void 0&&(s=new Float32Array(i),Ko[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Tt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Mt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function mc(r,e){let t=el[e];t===void 0&&(t=new Int32Array(e),el[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function vm(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function xm(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;r.uniform2fv(this.addr,e),Mt(t,e)}}function ym(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;r.uniform3fv(this.addr,e),Mt(t,e)}}function _m(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;r.uniform4fv(this.addr,e),Mt(t,e)}}function wm(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(Tt(t,n))return;il.set(n),r.uniformMatrix2fv(this.addr,!1,il),Mt(t,n)}}function Mm(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(Tt(t,n))return;nl.set(n),r.uniformMatrix3fv(this.addr,!1,nl),Mt(t,n)}}function bm(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(Tt(t,n))return;tl.set(n),r.uniformMatrix4fv(this.addr,!1,tl),Mt(t,n)}}function Sm(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Tm(r,e){const t=this.cache;Tt(t,e)||(r.uniform2iv(this.addr,e),Mt(t,e))}function Em(r,e){const t=this.cache;Tt(t,e)||(r.uniform3iv(this.addr,e),Mt(t,e))}function Am(r,e){const t=this.cache;Tt(t,e)||(r.uniform4iv(this.addr,e),Mt(t,e))}function Lm(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Cm(r,e){const t=this.cache;Tt(t,e)||(r.uniform2uiv(this.addr,e),Mt(t,e))}function Rm(r,e){const t=this.cache;Tt(t,e)||(r.uniform3uiv(this.addr,e),Mt(t,e))}function Pm(r,e){const t=this.cache;Tt(t,e)||(r.uniform4uiv(this.addr,e),Mt(t,e))}function Dm(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.safeSetTexture2D(e||fc,i)}function Im(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||gm,i)}function Fm(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.safeSetTextureCube(e||pc,i)}function Nm(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||mm,i)}function zm(r){switch(r){case 5126:return vm;case 35664:return xm;case 35665:return ym;case 35666:return _m;case 35674:return wm;case 35675:return Mm;case 35676:return bm;case 5124:case 35670:return Sm;case 35667:case 35671:return Tm;case 35668:case 35672:return Em;case 35669:case 35673:return Am;case 5125:return Lm;case 36294:return Cm;case 36295:return Rm;case 36296:return Pm;case 35678:case 36198:case 36298:case 36306:case 35682:return Dm;case 35679:case 36299:case 36307:return Im;case 35680:case 36300:case 36308:case 36293:return Fm;case 36289:case 36303:case 36311:case 36292:return Nm}}function Bm(r,e){r.uniform1fv(this.addr,e)}function km(r,e){const t=Wi(e,this.size,2);r.uniform2fv(this.addr,t)}function Om(r,e){const t=Wi(e,this.size,3);r.uniform3fv(this.addr,t)}function Hm(r,e){const t=Wi(e,this.size,4);r.uniform4fv(this.addr,t)}function Gm(r,e){const t=Wi(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Um(r,e){const t=Wi(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Vm(r,e){const t=Wi(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Wm(r,e){r.uniform1iv(this.addr,e)}function qm(r,e){r.uniform2iv(this.addr,e)}function Xm(r,e){r.uniform3iv(this.addr,e)}function Ym(r,e){r.uniform4iv(this.addr,e)}function jm(r,e){r.uniform1uiv(this.addr,e)}function Zm(r,e){r.uniform2uiv(this.addr,e)}function Jm(r,e){r.uniform3uiv(this.addr,e)}function Qm(r,e){r.uniform4uiv(this.addr,e)}function $m(r,e,t){const n=e.length,i=mc(t,n);r.uniform1iv(this.addr,i);for(let s=0;s!==n;++s)t.safeSetTexture2D(e[s]||fc,i[s])}function Km(r,e,t){const n=e.length,i=mc(t,n);r.uniform1iv(this.addr,i);for(let s=0;s!==n;++s)t.safeSetTextureCube(e[s]||pc,i[s])}function eg(r){switch(r){case 5126:return Bm;case 35664:return km;case 35665:return Om;case 35666:return Hm;case 35674:return Gm;case 35675:return Um;case 35676:return Vm;case 5124:case 35670:return Wm;case 35667:case 35671:return qm;case 35668:case 35672:return Xm;case 35669:case 35673:return Ym;case 5125:return jm;case 36294:return Zm;case 36295:return Jm;case 36296:return Qm;case 35678:case 36198:case 36298:case 36306:case 35682:return $m;case 35680:case 36300:case 36308:case 36293:return Km}}function tg(r,e,t){this.id=r,this.addr=t,this.cache=[],this.setValue=zm(e.type)}function gc(r,e,t){this.id=r,this.addr=t,this.cache=[],this.size=e.size,this.setValue=eg(e.type)}gc.prototype.updateCache=function(r){const e=this.cache;r instanceof Float32Array&&e.length!==r.length&&(this.cache=new Float32Array(r.length)),Mt(e,r)};function vc(r){this.id=r,this.seq=[],this.map={}}vc.prototype.setValue=function(r,e,t){const n=this.seq;for(let i=0,s=n.length;i!==s;++i){const a=n[i];a.setValue(r,e[a.id],t)}};const xa=/(\w+)(\])?(\[|\.)?/g;function rl(r,e){r.seq.push(e),r.map[e.id]=e}function ng(r,e,t){const n=r.name,i=n.length;for(xa.lastIndex=0;;){const s=xa.exec(n),a=xa.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){rl(t,c===void 0?new tg(o,r,e):new gc(o,r,e));break}else{let h=t.map[o];h===void 0&&(h=new vc(o),rl(t,h)),t=h}}}function Dn(r,e){this.seq=[],this.map={};const t=r.getProgramParameter(e,35718);for(let n=0;n<t;++n){const i=r.getActiveUniform(e,n),s=r.getUniformLocation(e,i.name);ng(i,s,this)}}Dn.prototype.setValue=function(r,e,t,n){const i=this.map[e];i!==void 0&&i.setValue(r,t,n)};Dn.prototype.setOptional=function(r,e,t){const n=e[t];n!==void 0&&this.setValue(r,t,n)};Dn.upload=function(r,e,t,n){for(let i=0,s=e.length;i!==s;++i){const a=e[i],o=t[a.id];o.needsUpdate!==!1&&a.setValue(r,o.value,n)}};Dn.seqWithValue=function(r,e){const t=[];for(let n=0,i=r.length;n!==i;++n){const s=r[n];s.id in e&&t.push(s)}return t};function sl(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}let ig=0;function rg(r){const e=r.split(`
`);for(let t=0;t<e.length;t++)e[t]=t+1+": "+e[t];return e.join(`
`)}function xc(r){switch(r){case Ct:return["Linear","( value )"];case ki:return["sRGB","( value )"];case Qa:return["RGBE","( value )"];case tc:return["RGBM","( value, 7.0 )"];case nc:return["RGBM","( value, 16.0 )"];case ic:return["RGBD","( value, 256.0 )"];case Ja:return["Gamma","( value, float( GAMMA_FACTOR ) )"];case sd:return["LogLuv","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported encoding:",r),["Linear","( value )"]}}function al(r,e,t){const n=r.getShaderParameter(e,35713),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=r.getShaderSource(e);return"THREE.WebGLShader: gl.getShaderInfoLog() "+t+`
`+i+rg(s)}function er(r,e){const t=xc(e);return"vec4 "+r+"( vec4 value ) { return "+t[0]+"ToLinear"+t[1]+"; }"}function sg(r,e){const t=xc(e);return"vec4 "+r+"( vec4 value ) { return LinearTo"+t[0]+t[1]+"; }"}function ag(r,e){let t;switch(e){case rh:t="Linear";break;case sh:t="Reinhard";break;case ah:t="OptimizedCineon";break;case $l:t="ACESFilmic";break;case oh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function og(r){return[r.extensionDerivatives||r.envMapCubeUV||r.bumpMap||r.tangentSpaceNormalMap||r.clearcoatNormalMap||r.flatShading||r.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(r.extensionFragDepth||r.logarithmicDepthBuffer)&&r.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",r.extensionDrawBuffers&&r.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(r.extensionShaderTextureLOD||r.envMap)&&r.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(lr).join(`
`)}function lg(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function cg(r,e){const t={},n=r.getProgramParameter(e,35721);for(let i=0;i<n;i++){const a=r.getActiveAttrib(e,i).name;t[a]=r.getAttribLocation(e,a)}return t}function lr(r){return r!==""}function ol(r,e){return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ll(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ug=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ia(r){return r.replace(ug,hg)}function hg(r,e){const t=Ue[e];if(t===void 0)throw new Error("Can not resolve #include <"+e+">");return Ia(t)}const dg=/#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,fg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cl(r){return r.replace(fg,yc).replace(dg,pg)}function pg(r,e,t,n){return console.warn("WebGLProgram: #pragma unroll_loop shader syntax is deprecated. Please use #pragma unroll_loop_start syntax instead."),yc(r,e,t,n)}function yc(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function ul(r){let e="precision "+r.precision+` float;
precision `+r.precision+" int;";return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function mg(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===jl?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===zu?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===or&&(e="SHADOWMAP_TYPE_VSM"),e}function gg(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case qa:case Xa:e="ENVMAP_TYPE_CUBE";break;case Es:case Ya:e="ENVMAP_TYPE_CUBE_UV";break}return e}function vg(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Xa:case Ya:e="ENVMAP_MODE_REFRACTION";break}return e}function xg(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Ts:e="ENVMAP_BLENDING_MULTIPLY";break;case nh:e="ENVMAP_BLENDING_MIX";break;case ih:e="ENVMAP_BLENDING_ADD";break}return e}function yg(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=mg(t),c=gg(t),u=vg(t),h=xg(t),d=r.gammaFactor>0?r.gammaFactor:1,f=t.isWebGL2?"":og(t),m=lg(s),v=i.createProgram();let y,g,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=[m].filter(lr).join(`
`),y.length>0&&(y+=`
`),g=[f,m].filter(lr).join(`
`),g.length>0&&(g+=`
`)):(y=[ul(t),"#define SHADER_NAME "+t.shaderName,m,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.supportsVertexTextures?"#define VERTEX_TEXTURES":"","#define GAMMA_FACTOR "+d,"#define MAX_BONES "+t.maxBones,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.displacementMap&&t.supportsVertexTextures?"#define USE_DISPLACEMENTMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.useVertexTexture?"#define BONE_TEXTURE":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_MORPHTARGETS","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(lr).join(`
`),g=[f,ul(t),"#define SHADER_NAME "+t.shaderName,m,t.alphaTest?"#define ALPHATEST "+t.alphaTest+(t.alphaTest%1?"":".0"):"","#define GAMMA_FACTOR "+d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMap&&t.objectSpaceNormalMap?"#define OBJECTSPACE_NORMALMAP":"",t.normalMap&&t.tangentSpaceNormalMap?"#define TANGENTSPACE_NORMALMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.sheen?"#define USE_SHEEN":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.vertexTangents?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUvs?"#define USE_UV":"",t.uvsVertexOnly?"#define UVS_VERTEX_ONLY":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.physicallyCorrectLights?"#define PHYSICALLY_CORRECT_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"",(t.extensionShaderTextureLOD||t.envMap)&&t.rendererExtensionShaderTextureLod?"#define TEXTURE_LOD_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ai?"#define TONE_MAPPING":"",t.toneMapping!==Ai?Ue.tonemapping_pars_fragment:"",t.toneMapping!==Ai?ag("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",Ue.encodings_pars_fragment,t.map?er("mapTexelToLinear",t.mapEncoding):"",t.matcap?er("matcapTexelToLinear",t.matcapEncoding):"",t.envMap?er("envMapTexelToLinear",t.envMapEncoding):"",t.emissiveMap?er("emissiveMapTexelToLinear",t.emissiveMapEncoding):"",t.lightMap?er("lightMapTexelToLinear",t.lightMapEncoding):"",sg("linearToOutputTexel",t.outputEncoding),t.depthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(lr).join(`
`)),a=Ia(a),a=ol(a,t),a=ll(a,t),o=Ia(o),o=ol(o,t),o=ll(o,t),a=cl(a),o=cl(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,y=["#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,g=["#define varying in",t.glslVersion===Ho?"":"out highp vec4 pc_fragColor;",t.glslVersion===Ho?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const R=p+y+a,A=p+g+o,L=sl(i,35633,R),_=sl(i,35632,A);if(i.attachShader(v,L),i.attachShader(v,_),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v),r.debug.checkShaderErrors){const B=i.getProgramInfoLog(v).trim(),U=i.getShaderInfoLog(L).trim(),N=i.getShaderInfoLog(_).trim();let z=!0,S=!0;if(i.getProgramParameter(v,35714)===!1){z=!1;const E=al(i,L,"vertex"),C=al(i,_,"fragment");console.error("THREE.WebGLProgram: shader error: ",i.getError(),"35715",i.getProgramParameter(v,35715),"gl.getProgramInfoLog",B,E,C)}else B!==""?console.warn("THREE.WebGLProgram: gl.getProgramInfoLog()",B):(U===""||N==="")&&(S=!1);S&&(this.diagnostics={runnable:z,programLog:B,vertexShader:{log:U,prefix:y},fragmentShader:{log:N,prefix:g}})}i.deleteShader(L),i.deleteShader(_);let F;this.getUniforms=function(){return F===void 0&&(F=new Dn(i,v)),F};let D;return this.getAttributes=function(){return D===void 0&&(D=cg(i,v)),D},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.name=t.shaderName,this.id=ig++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=L,this.fragmentShader=_,this}function _g(r,e,t,n,i,s){const a=[],o=n.isWebGL2,l=n.logarithmicDepthBuffer,c=n.floatVertexTextures,u=n.maxVertexUniforms,h=n.vertexTextures;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"},m=["precision","isWebGL2","supportsVertexTextures","outputEncoding","instancing","instancingColor","map","mapEncoding","matcap","matcapEncoding","envMap","envMapMode","envMapEncoding","envMapCubeUV","lightMap","lightMapEncoding","aoMap","emissiveMap","emissiveMapEncoding","bumpMap","normalMap","objectSpaceNormalMap","tangentSpaceNormalMap","clearcoatMap","clearcoatRoughnessMap","clearcoatNormalMap","displacementMap","specularMap","roughnessMap","metalnessMap","gradientMap","alphaMap","combine","vertexColors","vertexAlphas","vertexTangents","vertexUvs","uvsVertexOnly","fog","useFog","fogExp2","flatShading","sizeAttenuation","logarithmicDepthBuffer","skinning","maxBones","useVertexTexture","morphTargets","morphNormals","premultipliedAlpha","numDirLights","numPointLights","numSpotLights","numHemiLights","numRectAreaLights","numDirLightShadows","numPointLightShadows","numSpotLightShadows","shadowMapEnabled","shadowMapType","toneMapping","physicallyCorrectLights","alphaTest","doubleSided","flipSided","numClippingPlanes","numClipIntersection","depthPacking","dithering","sheen","transmissionMap"];function v(_){const D=_.skeleton.bones;if(c)return 1024;{const U=Math.floor((u-20)/4),N=Math.min(U,D.length);return N<D.length?(console.warn("THREE.WebGLRenderer: Skeleton has "+D.length+" bones. This GPU supports "+N+"."),0):N}}function y(_){let F;return _&&_.isTexture?F=_.encoding:_&&_.isWebGLRenderTarget?(console.warn("THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead."),F=_.texture.encoding):F=Ct,F}function g(_,F,D,B,U){const N=B.fog,z=_.isMeshStandardMaterial?B.environment:null,S=e.get(_.envMap||z),E=f[_.type],C=U.isSkinnedMesh?v(U):0;_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));let b,V;if(E){const he=tn[E];b=he.vertexShader,V=he.fragmentShader}else b=_.vertexShader,V=_.fragmentShader;const te=r.getRenderTarget();return{isWebGL2:o,shaderID:E,shaderName:_.type,vertexShader:b,fragmentShader:V,defines:_.defines,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,instancing:U.isInstancedMesh===!0,instancingColor:U.isInstancedMesh===!0&&U.instanceColor!==null,supportsVertexTextures:h,outputEncoding:te!==null?y(te.texture):r.outputEncoding,map:!!_.map,mapEncoding:y(_.map),matcap:!!_.matcap,matcapEncoding:y(_.matcap),envMap:!!S,envMapMode:S&&S.mapping,envMapEncoding:y(S),envMapCubeUV:!!S&&(S.mapping===Es||S.mapping===Ya),lightMap:!!_.lightMap,lightMapEncoding:y(_.lightMap),aoMap:!!_.aoMap,emissiveMap:!!_.emissiveMap,emissiveMapEncoding:y(_.emissiveMap),bumpMap:!!_.bumpMap,normalMap:!!_.normalMap,objectSpaceNormalMap:_.normalMapType===ld,tangentSpaceNormalMap:_.normalMapType===Oi,clearcoatMap:!!_.clearcoatMap,clearcoatRoughnessMap:!!_.clearcoatRoughnessMap,clearcoatNormalMap:!!_.clearcoatNormalMap,displacementMap:!!_.displacementMap,roughnessMap:!!_.roughnessMap,metalnessMap:!!_.metalnessMap,specularMap:!!_.specularMap,alphaMap:!!_.alphaMap,gradientMap:!!_.gradientMap,sheen:!!_.sheen,transmissionMap:!!_.transmissionMap,combine:_.combine,vertexTangents:_.normalMap&&_.vertexTangents,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&U.geometry&&U.geometry.attributes.color&&U.geometry.attributes.color.itemSize===4,vertexUvs:!!_.map||!!_.bumpMap||!!_.normalMap||!!_.specularMap||!!_.alphaMap||!!_.emissiveMap||!!_.roughnessMap||!!_.metalnessMap||!!_.clearcoatMap||!!_.clearcoatRoughnessMap||!!_.clearcoatNormalMap||!!_.displacementMap||!!_.transmissionMap,uvsVertexOnly:!(_.map||_.bumpMap||_.normalMap||_.specularMap||_.alphaMap||_.emissiveMap||_.roughnessMap||_.metalnessMap||_.clearcoatNormalMap||_.transmissionMap)&&!!_.displacementMap,fog:!!N,useFog:_.fog,fogExp2:N&&N.isFogExp2,flatShading:!!_.flatShading,sizeAttenuation:_.sizeAttenuation,logarithmicDepthBuffer:l,skinning:_.skinning&&C>0,maxBones:C,useVertexTexture:c,morphTargets:_.morphTargets,morphNormals:_.morphNormals,numDirLights:F.directional.length,numPointLights:F.point.length,numSpotLights:F.spot.length,numRectAreaLights:F.rectArea.length,numHemiLights:F.hemi.length,numDirLightShadows:F.directionalShadowMap.length,numPointLightShadows:F.pointShadowMap.length,numSpotLightShadows:F.spotShadowMap.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:r.shadowMap.enabled&&D.length>0,shadowMapType:r.shadowMap.type,toneMapping:_.toneMapped?r.toneMapping:Ai,physicallyCorrectLights:r.physicallyCorrectLights,premultipliedAlpha:_.premultipliedAlpha,alphaTest:_.alphaTest,doubleSided:_.side===Nn,flipSided:_.side===lt,depthPacking:_.depthPacking!==void 0?_.depthPacking:!1,index0AttributeName:_.index0AttributeName,extensionDerivatives:_.extensions&&_.extensions.derivatives,extensionFragDepth:_.extensions&&_.extensions.fragDepth,extensionDrawBuffers:_.extensions&&_.extensions.drawBuffers,extensionShaderTextureLOD:_.extensions&&_.extensions.shaderTextureLOD,rendererExtensionFragDepth:o||t.has("EXT_frag_depth"),rendererExtensionDrawBuffers:o||t.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:o||t.has("EXT_shader_texture_lod"),customProgramCacheKey:_.customProgramCacheKey()}}function p(_){const F=[];if(_.shaderID?F.push(_.shaderID):(F.push(_.fragmentShader),F.push(_.vertexShader)),_.defines!==void 0)for(const D in _.defines)F.push(D),F.push(_.defines[D]);if(_.isRawShaderMaterial===!1){for(let D=0;D<m.length;D++)F.push(_[m[D]]);F.push(r.outputEncoding),F.push(r.gammaFactor)}return F.push(_.customProgramCacheKey),F.join()}function R(_){const F=f[_.type];let D;if(F){const B=tn[F];D=Cd.clone(B.uniforms)}else D=_.uniforms;return D}function A(_,F){let D;for(let B=0,U=a.length;B<U;B++){const N=a[B];if(N.cacheKey===F){D=N,++D.usedTimes;break}}return D===void 0&&(D=new yg(r,F,_,i),a.push(D)),D}function L(_){if(--_.usedTimes===0){const F=a.indexOf(_);a[F]=a[a.length-1],a.pop(),_.destroy()}}return{getParameters:g,getProgramCacheKey:p,getUniforms:R,acquireProgram:A,releaseProgram:L,programs:a}}function wg(){let r=new WeakMap;function e(s){let a=r.get(s);return a===void 0&&(a={},r.set(s,a)),a}function t(s){r.delete(s)}function n(s,a,o){r.get(s)[a]=o}function i(){r=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function Mg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.program!==e.program?r.program.id-e.program.id:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function bg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function hl(r){const e=[];let t=0;const n=[],i=[],s={id:-1};function a(){t=0,n.length=0,i.length=0}function o(d,f,m,v,y,g){let p=e[t];const R=r.get(m);return p===void 0?(p={id:d.id,object:d,geometry:f,material:m,program:R.program||s,groupOrder:v,renderOrder:d.renderOrder,z:y,group:g},e[t]=p):(p.id=d.id,p.object=d,p.geometry=f,p.material=m,p.program=R.program||s,p.groupOrder=v,p.renderOrder=d.renderOrder,p.z=y,p.group=g),t++,p}function l(d,f,m,v,y,g){const p=o(d,f,m,v,y,g);(m.transparent===!0?i:n).push(p)}function c(d,f,m,v,y,g){const p=o(d,f,m,v,y,g);(m.transparent===!0?i:n).unshift(p)}function u(d,f){n.length>1&&n.sort(d||Mg),i.length>1&&i.sort(f||bg)}function h(){for(let d=t,f=e.length;d<f;d++){const m=e[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.program=null,m.group=null}}return{opaque:n,transparent:i,init:a,push:l,unshift:c,finish:h,sort:u}}function Sg(r){let e=new WeakMap;function t(i,s){let a;return e.has(i)===!1?(a=new hl(r),e.set(i,[a])):s>=e.get(i).length?(a=new hl(r),e.get(i).push(a)):a=e.get(i)[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function Tg(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new M,color:new xe};break;case"SpotLight":t={position:new M,direction:new M,color:new xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new M,color:new xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new M,skyColor:new xe,groundColor:new xe};break;case"RectAreaLight":t={color:new xe,position:new M,halfWidth:new M,halfHeight:new M};break}return r[e.id]=t,t}}}function Eg(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let Ag=0;function Lg(r,e){return(e.castShadow?1:0)-(r.castShadow?1:0)}function Cg(r,e){const t=new Tg,n=Eg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotShadow:[],spotShadowMap:[],spotShadowMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[]};for(let u=0;u<9;u++)i.probe.push(new M);const s=new M,a=new Re,o=new Re;function l(u){let h=0,d=0,f=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let m=0,v=0,y=0,g=0,p=0,R=0,A=0,L=0;u.sort(Lg);for(let F=0,D=u.length;F<D;F++){const B=u[F],U=B.color,N=B.intensity,z=B.distance,S=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)h+=U.r*N,d+=U.g*N,f+=U.b*N;else if(B.isLightProbe)for(let E=0;E<9;E++)i.probe[E].addScaledVector(B.sh.coefficients[E],N);else if(B.isDirectionalLight){const E=t.get(B);if(E.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const C=B.shadow,b=n.get(B);b.shadowBias=C.bias,b.shadowNormalBias=C.normalBias,b.shadowRadius=C.radius,b.shadowMapSize=C.mapSize,i.directionalShadow[m]=b,i.directionalShadowMap[m]=S,i.directionalShadowMatrix[m]=B.shadow.matrix,R++}i.directional[m]=E,m++}else if(B.isSpotLight){const E=t.get(B);if(E.position.setFromMatrixPosition(B.matrixWorld),E.color.copy(U).multiplyScalar(N),E.distance=z,E.coneCos=Math.cos(B.angle),E.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),E.decay=B.decay,B.castShadow){const C=B.shadow,b=n.get(B);b.shadowBias=C.bias,b.shadowNormalBias=C.normalBias,b.shadowRadius=C.radius,b.shadowMapSize=C.mapSize,i.spotShadow[y]=b,i.spotShadowMap[y]=S,i.spotShadowMatrix[y]=B.shadow.matrix,L++}i.spot[y]=E,y++}else if(B.isRectAreaLight){const E=t.get(B);E.color.copy(U).multiplyScalar(N),E.halfWidth.set(B.width*.5,0,0),E.halfHeight.set(0,B.height*.5,0),i.rectArea[g]=E,g++}else if(B.isPointLight){const E=t.get(B);if(E.color.copy(B.color).multiplyScalar(B.intensity),E.distance=B.distance,E.decay=B.decay,B.castShadow){const C=B.shadow,b=n.get(B);b.shadowBias=C.bias,b.shadowNormalBias=C.normalBias,b.shadowRadius=C.radius,b.shadowMapSize=C.mapSize,b.shadowCameraNear=C.camera.near,b.shadowCameraFar=C.camera.far,i.pointShadow[v]=b,i.pointShadowMap[v]=S,i.pointShadowMatrix[v]=B.shadow.matrix,A++}i.point[v]=E,v++}else if(B.isHemisphereLight){const E=t.get(B);E.skyColor.copy(B.color).multiplyScalar(N),E.groundColor.copy(B.groundColor).multiplyScalar(N),i.hemi[p]=E,p++}}g>0&&(e.isWebGL2||r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):r.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=f;const _=i.hash;(_.directionalLength!==m||_.pointLength!==v||_.spotLength!==y||_.rectAreaLength!==g||_.hemiLength!==p||_.numDirectionalShadows!==R||_.numPointShadows!==A||_.numSpotShadows!==L)&&(i.directional.length=m,i.spot.length=y,i.rectArea.length=g,i.point.length=v,i.hemi.length=p,i.directionalShadow.length=R,i.directionalShadowMap.length=R,i.pointShadow.length=A,i.pointShadowMap.length=A,i.spotShadow.length=L,i.spotShadowMap.length=L,i.directionalShadowMatrix.length=R,i.pointShadowMatrix.length=A,i.spotShadowMatrix.length=L,_.directionalLength=m,_.pointLength=v,_.spotLength=y,_.rectAreaLength=g,_.hemiLength=p,_.numDirectionalShadows=R,_.numPointShadows=A,_.numSpotShadows=L,i.version=Ag++)}function c(u,h){let d=0,f=0,m=0,v=0,y=0;const g=h.matrixWorldInverse;for(let p=0,R=u.length;p<R;p++){const A=u[p];if(A.isDirectionalLight){const L=i.directional[d];L.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),L.direction.sub(s),L.direction.transformDirection(g),d++}else if(A.isSpotLight){const L=i.spot[m];L.position.setFromMatrixPosition(A.matrixWorld),L.position.applyMatrix4(g),L.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),L.direction.sub(s),L.direction.transformDirection(g),m++}else if(A.isRectAreaLight){const L=i.rectArea[v];L.position.setFromMatrixPosition(A.matrixWorld),L.position.applyMatrix4(g),o.identity(),a.copy(A.matrixWorld),a.premultiply(g),o.extractRotation(a),L.halfWidth.set(A.width*.5,0,0),L.halfHeight.set(0,A.height*.5,0),L.halfWidth.applyMatrix4(o),L.halfHeight.applyMatrix4(o),v++}else if(A.isPointLight){const L=i.point[f];L.position.setFromMatrixPosition(A.matrixWorld),L.position.applyMatrix4(g),f++}else if(A.isHemisphereLight){const L=i.hemi[y];L.direction.setFromMatrixPosition(A.matrixWorld),L.direction.transformDirection(g),L.direction.normalize(),y++}}}return{setup:l,setupView:c,state:i}}function dl(r,e){const t=new Cg(r,e),n=[],i=[];function s(){n.length=0,i.length=0}function a(h){n.push(h)}function o(h){i.push(h)}function l(){t.setup(n)}function c(h){t.setupView(n,h)}return{init:s,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Rg(r,e){let t=new WeakMap;function n(s,a=0){let o;return t.has(s)===!1?(o=new dl(r,e),t.set(s,[o])):a>=t.get(s).length?(o=new dl(r,e),t.get(s).push(o)):o=t.get(s)[a],o}function i(){t=new WeakMap}return{get:n,dispose:i}}class _c extends ft{constructor(e){super(),this.type="MeshDepthMaterial",this.depthPacking=ad,this.skinning=!1,this.morphTargets=!1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}_c.prototype.isMeshDepthMaterial=!0;class wc extends ft{constructor(e){super(),this.type="MeshDistanceMaterial",this.referencePosition=new M,this.nearDistance=1,this.farDistance=1e3,this.skinning=!1,this.morphTargets=!1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}wc.prototype.isMeshDistanceMaterial=!0;var Pg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	float mean = 0.0;
	float squared_mean = 0.0;
	float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy ) / resolution ) );
	for ( float i = -1.0; i < 1.0 ; i += SAMPLE_RATE) {
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( i, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, i ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean * HALF_SAMPLE_RATE;
	squared_mean = squared_mean * HALF_SAMPLE_RATE;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`,Dg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`;function Mc(r,e,t){let n=new Rs;const i=new se,s=new se,a=new qe,o=[],l=[],c={},u=t.maxTextureSize,h={0:lt,1:Ss,2:Nn},d=new Zt({defines:{SAMPLE_RATE:2/8,HALF_SAMPLE_RATE:1/8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:Dg,fragmentShader:Pg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new Ve;m.setAttribute("position",new Ze(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ye(m,d),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=jl,this.render=function(_,F,D){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||_.length===0)return;const B=r.getRenderTarget(),U=r.getActiveCubeFace(),N=r.getActiveMipmapLevel(),z=r.state;z.setBlending(Rn),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);for(let S=0,E=_.length;S<E;S++){const C=_[S],b=C.shadow;if(b===void 0){console.warn("THREE.WebGLShadowMap:",C,"has no shadow.");continue}if(b.autoUpdate===!1&&b.needsUpdate===!1)continue;i.copy(b.mapSize);const V=b.getFrameExtents();if(i.multiply(V),s.copy(b.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(s.x=Math.floor(u/V.x),i.x=s.x*V.x,b.mapSize.x=s.x),i.y>u&&(s.y=Math.floor(u/V.y),i.y=s.y*V.y,b.mapSize.y=s.y)),b.map===null&&!b.isPointLightShadow&&this.type===or){const $={minFilter:zt,magFilter:zt,format:Ft};b.map=new Pn(i.x,i.y,$),b.map.texture.name=C.name+".shadowMap",b.mapPass=new Pn(i.x,i.y,$),b.camera.updateProjectionMatrix()}if(b.map===null){const $={minFilter:dt,magFilter:dt,format:Ft};b.map=new Pn(i.x,i.y,$),b.map.texture.name=C.name+".shadowMap",b.camera.updateProjectionMatrix()}r.setRenderTarget(b.map),r.clear();const te=b.getViewportCount();for(let $=0;$<te;$++){const he=b.getViewport($);a.set(s.x*he.x,s.y*he.y,s.x*he.z,s.y*he.w),z.viewport(a),b.updateMatrices(C,$),n=b.getFrustum(),L(F,D,b.camera,C,this.type)}!b.isPointLightShadow&&this.type===or&&g(b,D),b.needsUpdate=!1}y.needsUpdate=!1,r.setRenderTarget(B,U,N)};function g(_,F){const D=e.update(v);d.uniforms.shadow_pass.value=_.map.texture,d.uniforms.resolution.value=_.mapSize,d.uniforms.radius.value=_.radius,r.setRenderTarget(_.mapPass),r.clear(),r.renderBufferDirect(F,null,D,d,v,null),f.uniforms.shadow_pass.value=_.mapPass.texture,f.uniforms.resolution.value=_.mapSize,f.uniforms.radius.value=_.radius,r.setRenderTarget(_.map),r.clear(),r.renderBufferDirect(F,null,D,f,v,null)}function p(_,F,D){const B=_<<0|F<<1|D<<2;let U=o[B];return U===void 0&&(U=new _c({depthPacking:od,morphTargets:_,skinning:F}),o[B]=U),U}function R(_,F,D){const B=_<<0|F<<1|D<<2;let U=l[B];return U===void 0&&(U=new wc({morphTargets:_,skinning:F}),l[B]=U),U}function A(_,F,D,B,U,N,z){let S=null,E=p,C=_.customDepthMaterial;if(B.isPointLight===!0&&(E=R,C=_.customDistanceMaterial),C===void 0){let b=!1;D.morphTargets===!0&&(b=F.morphAttributes&&F.morphAttributes.position&&F.morphAttributes.position.length>0);let V=!1;_.isSkinnedMesh===!0&&(D.skinning===!0?V=!0:console.warn("THREE.WebGLShadowMap: THREE.SkinnedMesh with material.skinning set to false:",_));const te=_.isInstancedMesh===!0;S=E(b,V,te)}else S=C;if(r.localClippingEnabled&&D.clipShadows===!0&&D.clippingPlanes.length!==0){const b=S.uuid,V=D.uuid;let te=c[b];te===void 0&&(te={},c[b]=te);let $=te[V];$===void 0&&($=S.clone(),te[V]=$),S=$}return S.visible=D.visible,S.wireframe=D.wireframe,z===or?S.side=D.shadowSide!==null?D.shadowSide:D.side:S.side=D.shadowSide!==null?D.shadowSide:h[D.side],S.clipShadows=D.clipShadows,S.clippingPlanes=D.clippingPlanes,S.clipIntersection=D.clipIntersection,S.wireframeLinewidth=D.wireframeLinewidth,S.linewidth=D.linewidth,B.isPointLight===!0&&S.isMeshDistanceMaterial===!0&&(S.referencePosition.setFromMatrixPosition(B.matrixWorld),S.nearDistance=U,S.farDistance=N),S}function L(_,F,D,B,U){if(_.visible===!1)return;if(_.layers.test(F.layers)&&(_.isMesh||_.isLine||_.isPoints)&&(_.castShadow||_.receiveShadow&&U===or)&&(!_.frustumCulled||n.intersectsObject(_))){_.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,_.matrixWorld);const S=e.update(_),E=_.material;if(Array.isArray(E)){const C=S.groups;for(let b=0,V=C.length;b<V;b++){const te=C[b],$=E[te.materialIndex];if($&&$.visible){const he=A(_,S,$,B,D.near,D.far,U);r.renderBufferDirect(D,null,S,he,_,te)}}}else if(E.visible){const C=A(_,S,E,B,D.near,D.far,U);r.renderBufferDirect(D,null,S,C,_,null)}}const z=_.children;for(let S=0,E=z.length;S<E;S++)L(z[S],F,D,B,U)}}function Ig(r,e,t){const n=t.isWebGL2;function i(){let I=!1;const ae=new qe;let ue=null;const _e=new qe(0,0,0,0);return{setMask:function(K){ue!==K&&!I&&(r.colorMask(K,K,K,K),ue=K)},setLocked:function(K){I=K},setClear:function(K,Ie,je,st,Qt){Qt===!0&&(K*=st,Ie*=st,je*=st),ae.set(K,Ie,je,st),_e.equals(ae)===!1&&(r.clearColor(K,Ie,je,st),_e.copy(ae))},reset:function(){I=!1,ue=null,_e.set(-1,0,0,0)}}}function s(){let I=!1,ae=null,ue=null,_e=null;return{setTest:function(K){K?Me(2929):Ee(2929)},setMask:function(K){ae!==K&&!I&&(r.depthMask(K),ae=K)},setFunc:function(K){if(ue!==K){if(K)switch(K){case Zu:r.depthFunc(512);break;case Ju:r.depthFunc(519);break;case Qu:r.depthFunc(513);break;case Ra:r.depthFunc(515);break;case $u:r.depthFunc(514);break;case Ku:r.depthFunc(518);break;case eh:r.depthFunc(516);break;case th:r.depthFunc(517);break;default:r.depthFunc(515)}else r.depthFunc(515);ue=K}},setLocked:function(K){I=K},setClear:function(K){_e!==K&&(r.clearDepth(K),_e=K)},reset:function(){I=!1,ae=null,ue=null,_e=null}}}function a(){let I=!1,ae=null,ue=null,_e=null,K=null,Ie=null,je=null,st=null,Qt=null;return{setTest:function(it){I||(it?Me(2960):Ee(2960))},setMask:function(it){ae!==it&&!I&&(r.stencilMask(it),ae=it)},setFunc:function(it,Ut,Rt){(ue!==it||_e!==Ut||K!==Rt)&&(r.stencilFunc(it,Ut,Rt),ue=it,_e=Ut,K=Rt)},setOp:function(it,Ut,Rt){(Ie!==it||je!==Ut||st!==Rt)&&(r.stencilOp(it,Ut,Rt),Ie=it,je=Ut,st=Rt)},setLocked:function(it){I=it},setClear:function(it){Qt!==it&&(r.clearStencil(it),Qt=it)},reset:function(){I=!1,ae=null,ue=null,_e=null,K=null,Ie=null,je=null,st=null,Qt=null}}}const o=new i,l=new s,c=new a;let u={},h=null,d={},f=null,m=!1,v=null,y=null,g=null,p=null,R=null,A=null,L=null,_=!1,F=null,D=null,B=null,U=null,N=null;const z=r.getParameter(35661);let S=!1,E=0;const C=r.getParameter(7938);C.indexOf("WebGL")!==-1?(E=parseFloat(/^WebGL (\d)/.exec(C)[1]),S=E>=1):C.indexOf("OpenGL ES")!==-1&&(E=parseFloat(/^OpenGL ES (\d)/.exec(C)[1]),S=E>=2);let b=null,V={};const te=new qe(0,0,r.canvas.width,r.canvas.height),$=new qe(0,0,r.canvas.width,r.canvas.height);function he(I,ae,ue){const _e=new Uint8Array(4),K=r.createTexture();r.bindTexture(I,K),r.texParameteri(I,10241,9728),r.texParameteri(I,10240,9728);for(let Ie=0;Ie<ue;Ie++)r.texImage2D(ae+Ie,0,6408,1,1,0,6408,5121,_e);return K}const oe={};oe[3553]=he(3553,3553,1),oe[34067]=he(34067,34069,6),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Me(2929),l.setFunc(Ra),ze(!1),ne(_o),Me(2884),Ge(Rn);function Me(I){u[I]!==!0&&(r.enable(I),u[I]=!0)}function Ee(I){u[I]!==!1&&(r.disable(I),u[I]=!1)}function j(I){I!==h&&(r.bindFramebuffer(36160,I),h=I)}function He(I,ae){ae===null&&h!==null&&(ae=h),d[I]!==ae&&(r.bindFramebuffer(I,ae),d[I]=ae,n&&(I===36009&&(d[36160]=ae),I===36160&&(d[36009]=ae)))}function Oe(I){return f!==I?(r.useProgram(I),f=I,!0):!1}const De={[Mi]:32774,[ku]:32778,[Ou]:32779};if(n)De[So]=32775,De[To]=32776;else{const I=e.get("EXT_blend_minmax");I!==null&&(De[So]=I.MIN_EXT,De[To]=I.MAX_EXT)}const be={[Hu]:0,[Gu]:1,[Uu]:768,[Jl]:770,[ju]:776,[Xu]:774,[Wu]:772,[Vu]:769,[Ql]:771,[Yu]:775,[qu]:773};function Ge(I,ae,ue,_e,K,Ie,je,st){if(I===Rn){m===!0&&(Ee(3042),m=!1);return}if(m===!1&&(Me(3042),m=!0),I!==Bu){if(I!==v||st!==_){if((y!==Mi||R!==Mi)&&(r.blendEquation(32774),y=Mi,R=Mi),st)switch(I){case cr:r.blendFuncSeparate(1,771,1,771);break;case wo:r.blendFunc(1,1);break;case Mo:r.blendFuncSeparate(0,0,769,771);break;case bo:r.blendFuncSeparate(0,768,0,770);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case cr:r.blendFuncSeparate(770,771,1,771);break;case wo:r.blendFunc(770,1);break;case Mo:r.blendFunc(0,769);break;case bo:r.blendFunc(0,768);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}g=null,p=null,A=null,L=null,v=I,_=st}return}K=K||ae,Ie=Ie||ue,je=je||_e,(ae!==y||K!==R)&&(r.blendEquationSeparate(De[ae],De[K]),y=ae,R=K),(ue!==g||_e!==p||Ie!==A||je!==L)&&(r.blendFuncSeparate(be[ue],be[_e],be[Ie],be[je]),g=ue,p=_e,A=Ie,L=je),v=I,_=null}function Fe(I,ae){I.side===Nn?Ee(2884):Me(2884);let ue=I.side===lt;ae&&(ue=!ue),ze(ue),I.blending===cr&&I.transparent===!1?Ge(Rn):Ge(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),o.setMask(I.colorWrite);const _e=I.stencilWrite;c.setTest(_e),_e&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),le(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Me(32926):Ee(32926)}function ze(I){F!==I&&(I?r.frontFace(2304):r.frontFace(2305),F=I)}function ne(I){I!==Fu?(Me(2884),I!==D&&(I===_o?r.cullFace(1029):I===Nu?r.cullFace(1028):r.cullFace(1032))):Ee(2884),D=I}function re(I){I!==B&&(S&&r.lineWidth(I),B=I)}function le(I,ae,ue){I?(Me(32823),(U!==ae||N!==ue)&&(r.polygonOffset(ae,ue),U=ae,N=ue)):Ee(32823)}function ye(I){I?Me(3089):Ee(3089)}function ce(I){I===void 0&&(I=33984+z-1),b!==I&&(r.activeTexture(I),b=I)}function T(I,ae){b===null&&ce();let ue=V[b];ue===void 0&&(ue={type:void 0,texture:void 0},V[b]=ue),(ue.type!==I||ue.texture!==ae)&&(r.bindTexture(I,ae||oe[I]),ue.type=I,ue.texture=ae)}function w(){const I=V[b];I!==void 0&&I.type!==void 0&&(r.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function O(){try{r.compressedTexImage2D.apply(r,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Z(){try{r.texImage2D.apply(r,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function fe(){try{r.texImage3D.apply(r,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ge(I){te.equals(I)===!1&&(r.scissor(I.x,I.y,I.z,I.w),te.copy(I))}function Ne(I){$.equals(I)===!1&&(r.viewport(I.x,I.y,I.z,I.w),$.copy(I))}function Se(){r.disable(3042),r.disable(2884),r.disable(2929),r.disable(32823),r.disable(3089),r.disable(2960),r.disable(32926),r.blendEquation(32774),r.blendFunc(1,0),r.blendFuncSeparate(1,0,1,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(513),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(519,0,4294967295),r.stencilOp(7680,7680,7680),r.clearStencil(0),r.cullFace(1029),r.frontFace(2305),r.polygonOffset(0,0),r.activeTexture(33984),r.bindFramebuffer(36160,null),n===!0&&(r.bindFramebuffer(36009,null),r.bindFramebuffer(36008,null)),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),u={},b=null,V={},h=null,d={},f=null,m=!1,v=null,y=null,g=null,p=null,R=null,A=null,L=null,_=!1,F=null,D=null,B=null,U=null,N=null,te.set(0,0,r.canvas.width,r.canvas.height),$.set(0,0,r.canvas.width,r.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Me,disable:Ee,bindFramebuffer:He,bindXRFramebuffer:j,useProgram:Oe,setBlending:Ge,setMaterial:Fe,setFlipSided:ze,setCullFace:ne,setLineWidth:re,setPolygonOffset:le,setScissorTest:ye,activeTexture:ce,bindTexture:T,unbindTexture:w,compressedTexImage2D:O,texImage2D:Z,texImage3D:fe,scissor:ge,viewport:Ne,reset:Se}}function Fg(r,e,t,n,i,s,a){const o=i.isWebGL2,l=i.maxTextures,c=i.maxCubemapSize,u=i.maxTextureSize,h=i.maxSamples,d=new WeakMap;let f,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(T,w){return m?new OffscreenCanvas(T,w):document.createElementNS("http://www.w3.org/1999/xhtml","canvas")}function y(T,w,O,Z){let fe=1;if((T.width>Z||T.height>Z)&&(fe=Z/Math.max(T.width,T.height)),fe<1||w===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){const ge=w?dd:Math.floor,Ne=ge(fe*T.width),Se=ge(fe*T.height);f===void 0&&(f=v(Ne,Se));const I=O?v(Ne,Se):f;return I.width=Ne,I.height=Se,I.getContext("2d").drawImage(T,0,0,Ne,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+Ne+"x"+Se+")."),I}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function g(T){return Go(T.width)&&Go(T.height)}function p(T){return o?!1:T.wrapS!==jt||T.wrapT!==jt||T.minFilter!==dt&&T.minFilter!==zt}function R(T,w){return T.generateMipmaps&&w&&T.minFilter!==dt&&T.minFilter!==zt}function A(T,w,O,Z){r.generateMipmap(T);const fe=n.get(w);fe.__maxMipLevel=Math.log2(Math.max(O,Z))}function L(T,w,O){if(o===!1)return w;if(T!==null){if(r[T]!==void 0)return r[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Z=w;return w===6403&&(O===5126&&(Z=33326),O===5131&&(Z=33325),O===5121&&(Z=33321)),w===6407&&(O===5126&&(Z=34837),O===5131&&(Z=34843),O===5121&&(Z=32849)),w===6408&&(O===5126&&(Z=34836),O===5131&&(Z=34842),O===5121&&(Z=32856)),(Z===33325||Z===33326||Z===34842||Z===34836)&&e.get("EXT_color_buffer_float"),Z}function _(T){return T===dt||T===Lo||T===Co?9728:9729}function F(T){const w=T.target;w.removeEventListener("dispose",F),B(w),w.isVideoTexture&&d.delete(w),a.memory.textures--}function D(T){const w=T.target;w.removeEventListener("dispose",D),U(w),a.memory.textures--}function B(T){const w=n.get(T);w.__webglInit!==void 0&&(r.deleteTexture(w.__webglTexture),n.remove(T))}function U(T){const w=T.texture,O=n.get(T),Z=n.get(w);if(T){if(Z.__webglTexture!==void 0&&r.deleteTexture(Z.__webglTexture),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let fe=0;fe<6;fe++)r.deleteFramebuffer(O.__webglFramebuffer[fe]),O.__webglDepthbuffer&&r.deleteRenderbuffer(O.__webglDepthbuffer[fe]);else r.deleteFramebuffer(O.__webglFramebuffer),O.__webglDepthbuffer&&r.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&r.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer&&r.deleteRenderbuffer(O.__webglColorRenderbuffer),O.__webglDepthRenderbuffer&&r.deleteRenderbuffer(O.__webglDepthRenderbuffer);n.remove(w),n.remove(T)}}let N=0;function z(){N=0}function S(){const T=N;return T>=l&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+l),N+=1,T}function E(T,w){const O=n.get(T);if(T.isVideoTexture&&ne(T),T.version>0&&O.__version!==T.version){const Z=T.image;if(Z===void 0)console.warn("THREE.WebGLRenderer: Texture marked for update but image is undefined");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Me(O,T,w);return}}t.activeTexture(33984+w),t.bindTexture(3553,O.__webglTexture)}function C(T,w){const O=n.get(T);if(T.version>0&&O.__version!==T.version){Me(O,T,w);return}t.activeTexture(33984+w),t.bindTexture(35866,O.__webglTexture)}function b(T,w){const O=n.get(T);if(T.version>0&&O.__version!==T.version){Me(O,T,w);return}t.activeTexture(33984+w),t.bindTexture(32879,O.__webglTexture)}function V(T,w){const O=n.get(T);if(T.version>0&&O.__version!==T.version){Ee(O,T,w);return}t.activeTexture(33984+w),t.bindTexture(34067,O.__webglTexture)}const te={[hs]:10497,[jt]:33071,[Pa]:33648},$={[dt]:9728,[Lo]:9984,[Co]:9986,[zt]:9729,[lh]:9985,[ja]:9987};function he(T,w,O){if(O?(r.texParameteri(T,10242,te[w.wrapS]),r.texParameteri(T,10243,te[w.wrapT]),(T===32879||T===35866)&&r.texParameteri(T,32882,te[w.wrapR]),r.texParameteri(T,10240,$[w.magFilter]),r.texParameteri(T,10241,$[w.minFilter])):(r.texParameteri(T,10242,33071),r.texParameteri(T,10243,33071),(T===32879||T===35866)&&r.texParameteri(T,32882,33071),(w.wrapS!==jt||w.wrapT!==jt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),r.texParameteri(T,10240,_(w.magFilter)),r.texParameteri(T,10241,_(w.minFilter)),w.minFilter!==dt&&w.minFilter!==zt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),e.has("EXT_texture_filter_anisotropic")===!0){const Z=e.get("EXT_texture_filter_anisotropic");if(w.type===gn&&e.has("OES_texture_float_linear")===!1||o===!1&&w.type===fs&&e.has("OES_texture_half_float_linear")===!1)return;(w.anisotropy>1||n.get(w).__currentAnisotropy)&&(r.texParameterf(T,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy)}}function oe(T,w){T.__webglInit===void 0&&(T.__webglInit=!0,w.addEventListener("dispose",F),T.__webglTexture=r.createTexture(),a.memory.textures++)}function Me(T,w,O){let Z=3553;w.isDataTexture2DArray&&(Z=35866),w.isDataTexture3D&&(Z=32879),oe(T,w),t.activeTexture(33984+O),t.bindTexture(Z,T.__webglTexture),r.pixelStorei(37440,w.flipY),r.pixelStorei(37441,w.premultiplyAlpha),r.pixelStorei(3317,w.unpackAlignment),r.pixelStorei(37443,0);const fe=p(w)&&g(w.image)===!1,ge=y(w.image,fe,!1,u),Ne=g(ge)||o,Se=s.convert(w.format);let I=s.convert(w.type),ae=L(w.internalFormat,Se,I);he(Z,w,Ne);let ue;const _e=w.mipmaps;if(w.isDepthTexture)ae=6402,o?w.type===gn?ae=36012:w.type===ss?ae=33190:w.type===ur?ae=35056:ae=33189:w.type===gn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),w.format===Li&&ae===6402&&w.type!==ds&&w.type!==ss&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),w.type=ds,I=s.convert(w.type)),w.format===fr&&ae===6402&&(ae=34041,w.type!==ur&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),w.type=ur,I=s.convert(w.type))),t.texImage2D(3553,0,ae,ge.width,ge.height,0,Se,I,null);else if(w.isDataTexture)if(_e.length>0&&Ne){for(let K=0,Ie=_e.length;K<Ie;K++)ue=_e[K],t.texImage2D(3553,K,ae,ue.width,ue.height,0,Se,I,ue.data);w.generateMipmaps=!1,T.__maxMipLevel=_e.length-1}else t.texImage2D(3553,0,ae,ge.width,ge.height,0,Se,I,ge.data),T.__maxMipLevel=0;else if(w.isCompressedTexture){for(let K=0,Ie=_e.length;K<Ie;K++)ue=_e[K],w.format!==Ft&&w.format!==Zn?Se!==null?t.compressedTexImage2D(3553,K,ae,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):t.texImage2D(3553,K,ae,ue.width,ue.height,0,Se,I,ue.data);T.__maxMipLevel=_e.length-1}else if(w.isDataTexture2DArray)t.texImage3D(35866,0,ae,ge.width,ge.height,ge.depth,0,Se,I,ge.data),T.__maxMipLevel=0;else if(w.isDataTexture3D)t.texImage3D(32879,0,ae,ge.width,ge.height,ge.depth,0,Se,I,ge.data),T.__maxMipLevel=0;else if(_e.length>0&&Ne){for(let K=0,Ie=_e.length;K<Ie;K++)ue=_e[K],t.texImage2D(3553,K,ae,Se,I,ue);w.generateMipmaps=!1,T.__maxMipLevel=_e.length-1}else t.texImage2D(3553,0,ae,Se,I,ge),T.__maxMipLevel=0;R(w,Ne)&&A(Z,w,ge.width,ge.height),T.__version=w.version,w.onUpdate&&w.onUpdate(w)}function Ee(T,w,O){if(w.image.length!==6)return;oe(T,w),t.activeTexture(33984+O),t.bindTexture(34067,T.__webglTexture),r.pixelStorei(37440,w.flipY),r.pixelStorei(37441,w.premultiplyAlpha),r.pixelStorei(3317,w.unpackAlignment),r.pixelStorei(37443,0);const Z=w&&(w.isCompressedTexture||w.image[0].isCompressedTexture),fe=w.image[0]&&w.image[0].isDataTexture,ge=[];for(let K=0;K<6;K++)!Z&&!fe?ge[K]=y(w.image[K],!1,!0,c):ge[K]=fe?w.image[K].image:w.image[K];const Ne=ge[0],Se=g(Ne)||o,I=s.convert(w.format),ae=s.convert(w.type),ue=L(w.internalFormat,I,ae);he(34067,w,Se);let _e;if(Z){for(let K=0;K<6;K++){_e=ge[K].mipmaps;for(let Ie=0;Ie<_e.length;Ie++){const je=_e[Ie];w.format!==Ft&&w.format!==Zn?I!==null?t.compressedTexImage2D(34069+K,Ie,ue,je.width,je.height,0,je.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):t.texImage2D(34069+K,Ie,ue,je.width,je.height,0,I,ae,je.data)}}T.__maxMipLevel=_e.length-1}else{_e=w.mipmaps;for(let K=0;K<6;K++)if(fe){t.texImage2D(34069+K,0,ue,ge[K].width,ge[K].height,0,I,ae,ge[K].data);for(let Ie=0;Ie<_e.length;Ie++){const st=_e[Ie].image[K].image;t.texImage2D(34069+K,Ie+1,ue,st.width,st.height,0,I,ae,st.data)}}else{t.texImage2D(34069+K,0,ue,I,ae,ge[K]);for(let Ie=0;Ie<_e.length;Ie++){const je=_e[Ie];t.texImage2D(34069+K,Ie+1,ue,I,ae,je.image[K])}}T.__maxMipLevel=_e.length}R(w,Se)&&A(34067,w,Ne.width,Ne.height),T.__version=w.version,w.onUpdate&&w.onUpdate(w)}function j(T,w,O,Z){const fe=w.texture,ge=s.convert(fe.format),Ne=s.convert(fe.type),Se=L(fe.internalFormat,ge,Ne);Z===32879||Z===35866?t.texImage3D(Z,0,Se,w.width,w.height,w.depth,0,ge,Ne,null):t.texImage2D(Z,0,Se,w.width,w.height,0,ge,Ne,null),t.bindFramebuffer(36160,T),r.framebufferTexture2D(36160,O,Z,n.get(fe).__webglTexture,0),t.bindFramebuffer(36160,null)}function He(T,w,O){if(r.bindRenderbuffer(36161,T),w.depthBuffer&&!w.stencilBuffer){let Z=33189;if(O){const fe=w.depthTexture;fe&&fe.isDepthTexture&&(fe.type===gn?Z=36012:fe.type===ss&&(Z=33190));const ge=ze(w);r.renderbufferStorageMultisample(36161,ge,Z,w.width,w.height)}else r.renderbufferStorage(36161,Z,w.width,w.height);r.framebufferRenderbuffer(36160,36096,36161,T)}else if(w.depthBuffer&&w.stencilBuffer){if(O){const Z=ze(w);r.renderbufferStorageMultisample(36161,Z,35056,w.width,w.height)}else r.renderbufferStorage(36161,34041,w.width,w.height);r.framebufferRenderbuffer(36160,33306,36161,T)}else{const Z=w.texture,fe=s.convert(Z.format),ge=s.convert(Z.type),Ne=L(Z.internalFormat,fe,ge);if(O){const Se=ze(w);r.renderbufferStorageMultisample(36161,Se,Ne,w.width,w.height)}else r.renderbufferStorage(36161,Ne,w.width,w.height)}r.bindRenderbuffer(36161,null)}function Oe(T,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(36160,T),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),E(w.depthTexture,0);const Z=n.get(w.depthTexture).__webglTexture;if(w.depthTexture.format===Li)r.framebufferTexture2D(36160,36096,3553,Z,0);else if(w.depthTexture.format===fr)r.framebufferTexture2D(36160,33306,3553,Z,0);else throw new Error("Unknown depthTexture format")}function De(T){const w=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Oe(w.__webglFramebuffer,T)}else if(O){w.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)t.bindFramebuffer(36160,w.__webglFramebuffer[Z]),w.__webglDepthbuffer[Z]=r.createRenderbuffer(),He(w.__webglDepthbuffer[Z],T,!1)}else t.bindFramebuffer(36160,w.__webglFramebuffer),w.__webglDepthbuffer=r.createRenderbuffer(),He(w.__webglDepthbuffer,T,!1);t.bindFramebuffer(36160,null)}function be(T){const w=T.texture,O=n.get(T),Z=n.get(w);T.addEventListener("dispose",D),Z.__webglTexture=r.createTexture(),Z.__version=w.version,a.memory.textures++;const fe=T.isWebGLCubeRenderTarget===!0,ge=T.isWebGLMultisampleRenderTarget===!0,Ne=w.isDataTexture3D||w.isDataTexture2DArray,Se=g(T)||o;if(o&&w.format===Zn&&(w.type===gn||w.type===fs)&&(w.format=Ft,console.warn("THREE.WebGLRenderer: Rendering to textures with RGB format is not supported. Using RGBA format instead.")),fe){O.__webglFramebuffer=[];for(let I=0;I<6;I++)O.__webglFramebuffer[I]=r.createFramebuffer()}else if(O.__webglFramebuffer=r.createFramebuffer(),ge)if(o){O.__webglMultisampledFramebuffer=r.createFramebuffer(),O.__webglColorRenderbuffer=r.createRenderbuffer(),r.bindRenderbuffer(36161,O.__webglColorRenderbuffer);const I=s.convert(w.format),ae=s.convert(w.type),ue=L(w.internalFormat,I,ae),_e=ze(T);r.renderbufferStorageMultisample(36161,_e,ue,T.width,T.height),t.bindFramebuffer(36160,O.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(36160,36064,36161,O.__webglColorRenderbuffer),r.bindRenderbuffer(36161,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=r.createRenderbuffer(),He(O.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(36160,null)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.");if(fe){t.bindTexture(34067,Z.__webglTexture),he(34067,w,Se);for(let I=0;I<6;I++)j(O.__webglFramebuffer[I],T,36064,34069+I);R(w,Se)&&A(34067,w,T.width,T.height),t.bindTexture(34067,null)}else{let I=3553;Ne&&(o?I=w.isDataTexture3D?32879:35866:console.warn("THREE.DataTexture3D and THREE.DataTexture2DArray only supported with WebGL2.")),t.bindTexture(I,Z.__webglTexture),he(I,w,Se),j(O.__webglFramebuffer,T,36064,I),R(w,Se)&&A(3553,w,T.width,T.height),t.bindTexture(3553,null)}T.depthBuffer&&De(T)}function Ge(T){const w=T.texture,O=g(T)||o;if(R(w,O)){const Z=T.isWebGLCubeRenderTarget?34067:3553,fe=n.get(w).__webglTexture;t.bindTexture(Z,fe),A(Z,w,T.width,T.height),t.bindTexture(Z,null)}}function Fe(T){if(T.isWebGLMultisampleRenderTarget)if(o){const w=T.width,O=T.height;let Z=16384;T.depthBuffer&&(Z|=256),T.stencilBuffer&&(Z|=1024);const fe=n.get(T);t.bindFramebuffer(36008,fe.__webglMultisampledFramebuffer),t.bindFramebuffer(36009,fe.__webglFramebuffer),r.blitFramebuffer(0,0,w,O,0,0,w,O,Z,9728),t.bindFramebuffer(36008,null),t.bindFramebuffer(36009,fe.__webglMultisampledFramebuffer)}else console.warn("THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.")}function ze(T){return o&&T.isWebGLMultisampleRenderTarget?Math.min(h,T.samples):0}function ne(T){const w=a.render.frame;d.get(T)!==w&&(d.set(T,w),T.update())}let re=!1,le=!1;function ye(T,w){T&&T.isWebGLRenderTarget&&(re===!1&&(console.warn("THREE.WebGLTextures.safeSetTexture2D: don't use render targets as textures. Use their .texture property instead."),re=!0),T=T.texture),E(T,w)}function ce(T,w){T&&T.isWebGLCubeRenderTarget&&(le===!1&&(console.warn("THREE.WebGLTextures.safeSetTextureCube: don't use cube render targets as textures. Use their .texture property instead."),le=!0),T=T.texture),V(T,w)}this.allocateTextureUnit=S,this.resetTextureUnits=z,this.setTexture2D=E,this.setTexture2DArray=C,this.setTexture3D=b,this.setTextureCube=V,this.setupRenderTarget=be,this.updateRenderTargetMipmap=Ge,this.updateMultisampleRenderTarget=Fe,this.safeSetTexture2D=ye,this.safeSetTextureCube=ce}function Ng(r,e,t){const n=t.isWebGL2;function i(s){let a;if(s===_r)return 5121;if(s===dh)return 32819;if(s===fh)return 32820;if(s===ph)return 33635;if(s===ch)return 5120;if(s===uh)return 5122;if(s===ds)return 5123;if(s===hh)return 5124;if(s===ss)return 5125;if(s===gn)return 5126;if(s===fs)return n?5131:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===mh)return 6406;if(s===Zn)return 6407;if(s===Ft)return 6408;if(s===gh)return 6409;if(s===vh)return 6410;if(s===Li)return 6402;if(s===fr)return 34041;if(s===yh)return 6403;if(s===_h)return 36244;if(s===wh)return 33319;if(s===Mh)return 33320;if(s===bh)return 36248;if(s===Sh)return 36249;if(s===Ro||s===Po||s===Do||s===Io)if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===Ro)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Po)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Do)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Io)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Fo||s===No||s===zo||s===Bo)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===Fo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===No)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===zo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Bo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Th)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if((s===ko||s===Oo)&&(a=e.get("WEBGL_compressed_texture_etc"),a!==null)){if(s===ko)return a.COMPRESSED_RGB8_ETC2;if(s===Oo)return a.COMPRESSED_RGBA8_ETC2_EAC}if(s===Eh||s===Ah||s===Lh||s===Ch||s===Rh||s===Ph||s===Dh||s===Ih||s===Fh||s===Nh||s===zh||s===Bh||s===kh||s===Oh||s===Gh||s===Uh||s===Vh||s===Wh||s===qh||s===Xh||s===Yh||s===jh||s===Zh||s===Jh||s===Qh||s===$h||s===Kh||s===ed)return a=e.get("WEBGL_compressed_texture_astc"),a!==null?s:null;if(s===Hh)return a=e.get("EXT_texture_compression_bptc"),a!==null?s:null;if(s===ur)return n?34042:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null)}return{convert:i}}class bc extends bt{constructor(e=[]){super(),this.cameras=e}}bc.prototype.isArrayCamera=!0;class Bt extends Je{constructor(){super(),this.type="Group"}}Bt.prototype.isGroup=!0;const zg={type:"move"};class ya{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new M,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new M),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new M,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new M),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred")if(o!==null&&(i=t.getPose(e.targetRaySpace,n),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(zg))),c&&e.hand){a=!0;for(const v of e.hand.values()){const y=t.getJointPose(v,n);if(c.joints[v.jointName]===void 0){const p=new Bt;p.matrixAutoUpdate=!1,p.visible=!1,c.joints[v.jointName]=p,c.add(p)}const g=c.joints[v.jointName];y!==null&&(g.matrix.fromArray(y.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.jointRadius=y.radius),g.visible=y!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}}class Bg extends $n{constructor(e,t){super();const n=this,i=e.state;let s=null,a=1,o=null,l="local-floor",c=null;const u=[],h=new Map,d=new bt;d.layers.enable(1),d.viewport=new qe;const f=new bt;f.layers.enable(2),f.viewport=new qe;const m=[d,f],v=new bc;v.layers.enable(1),v.layers.enable(2);let y=null,g=null;this.enabled=!1,this.isPresenting=!1,this.getController=function(z){let S=u[z];return S===void 0&&(S=new ya,u[z]=S),S.getTargetRaySpace()},this.getControllerGrip=function(z){let S=u[z];return S===void 0&&(S=new ya,u[z]=S),S.getGripSpace()},this.getHand=function(z){let S=u[z];return S===void 0&&(S=new ya,u[z]=S),S.getHandSpace()};function p(z){const S=h.get(z.inputSource);S&&S.dispatchEvent({type:z.type,data:z.inputSource})}function R(){h.forEach(function(z,S){z.disconnect(S)}),h.clear(),y=null,g=null,i.bindXRFramebuffer(null),e.setRenderTarget(e.getRenderTarget()),N.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(z){a=z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(z){l=z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return o},this.getSession=function(){return s},this.setSession=async function(z){if(s=z,s!==null){s.addEventListener("select",p),s.addEventListener("selectstart",p),s.addEventListener("selectend",p),s.addEventListener("squeeze",p),s.addEventListener("squeezestart",p),s.addEventListener("squeezeend",p),s.addEventListener("end",R),s.addEventListener("inputsourceschange",A);const S=t.getContextAttributes();S.xrCompatible!==!0&&await t.makeXRCompatible();const E={antialias:S.antialias,alpha:S.alpha,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:a},C=new XRWebGLLayer(s,t,E);s.updateRenderState({baseLayer:C}),o=await s.requestReferenceSpace(l),N.setContext(s),N.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}};function A(z){const S=s.inputSources;for(let E=0;E<u.length;E++)h.set(S[E],u[E]);for(let E=0;E<z.removed.length;E++){const C=z.removed[E],b=h.get(C);b&&(b.dispatchEvent({type:"disconnected",data:C}),h.delete(C))}for(let E=0;E<z.added.length;E++){const C=z.added[E],b=h.get(C);b&&b.dispatchEvent({type:"connected",data:C})}}const L=new M,_=new M;function F(z,S,E){L.setFromMatrixPosition(S.matrixWorld),_.setFromMatrixPosition(E.matrixWorld);const C=L.distanceTo(_),b=S.projectionMatrix.elements,V=E.projectionMatrix.elements,te=b[14]/(b[10]-1),$=b[14]/(b[10]+1),he=(b[9]+1)/b[5],oe=(b[9]-1)/b[5],Me=(b[8]-1)/b[0],Ee=(V[8]+1)/V[0],j=te*Me,He=te*Ee,Oe=C/(-Me+Ee),De=Oe*-Me;S.matrixWorld.decompose(z.position,z.quaternion,z.scale),z.translateX(De),z.translateZ(Oe),z.matrixWorld.compose(z.position,z.quaternion,z.scale),z.matrixWorldInverse.copy(z.matrixWorld).invert();const be=te+Oe,Ge=$+Oe,Fe=j-De,ze=He+(C-De),ne=he*$/Ge*be,re=oe*$/Ge*be;z.projectionMatrix.makePerspective(Fe,ze,ne,re,be,Ge)}function D(z,S){S===null?z.matrixWorld.copy(z.matrix):z.matrixWorld.multiplyMatrices(S.matrixWorld,z.matrix),z.matrixWorldInverse.copy(z.matrixWorld).invert()}this.getCamera=function(z){v.near=f.near=d.near=z.near,v.far=f.far=d.far=z.far,(y!==v.near||g!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),y=v.near,g=v.far);const S=z.parent,E=v.cameras;D(v,S);for(let b=0;b<E.length;b++)D(E[b],S);z.matrixWorld.copy(v.matrixWorld),z.matrix.copy(v.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale);const C=z.children;for(let b=0,V=C.length;b<V;b++)C[b].updateMatrixWorld(!0);return E.length===2?F(v,d,f):v.projectionMatrix.copy(d.projectionMatrix),v};let B=null;function U(z,S){if(c=S.getViewerPose(o),c!==null){const C=c.views,b=s.renderState.baseLayer;i.bindXRFramebuffer(b.framebuffer);let V=!1;C.length!==v.cameras.length&&(v.cameras.length=0,V=!0);for(let te=0;te<C.length;te++){const $=C[te],he=b.getViewport($),oe=m[te];oe.matrix.fromArray($.transform.matrix),oe.projectionMatrix.fromArray($.projectionMatrix),oe.viewport.set(he.x,he.y,he.width,he.height),te===0&&v.matrix.copy(oe.matrix),V===!0&&v.cameras.push(oe)}}const E=s.inputSources;for(let C=0;C<u.length;C++){const b=u[C],V=E[C];b.update(V,S,o)}B&&B(z,S)}const N=new cc;N.setAnimationLoop(U),this.setAnimationLoop=function(z){B=z},this.dispose=function(){}}}function kg(r){function e(g,p){g.fogColor.value.copy(p.color),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function t(g,p,R,A){p.isMeshBasicMaterial?n(g,p):p.isMeshLambertMaterial?(n(g,p),l(g,p)):p.isMeshToonMaterial?(n(g,p),u(g,p)):p.isMeshPhongMaterial?(n(g,p),c(g,p)):p.isMeshStandardMaterial?(n(g,p),p.isMeshPhysicalMaterial?d(g,p):h(g,p)):p.isMeshMatcapMaterial?(n(g,p),f(g,p)):p.isMeshDepthMaterial?(n(g,p),m(g,p)):p.isMeshDistanceMaterial?(n(g,p),v(g,p)):p.isMeshNormalMaterial?(n(g,p),y(g,p)):p.isLineBasicMaterial?(i(g,p),p.isLineDashedMaterial&&s(g,p)):p.isPointsMaterial?a(g,p,R,A):p.isSpriteMaterial?o(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function n(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map),p.alphaMap&&(g.alphaMap.value=p.alphaMap),p.specularMap&&(g.specularMap.value=p.specularMap);const R=r.get(p).envMap;if(R){g.envMap.value=R,g.flipEnvMap.value=R.isCubeTexture&&R._needsFlipEnvMap?-1:1,g.reflectivity.value=p.reflectivity,g.refractionRatio.value=p.refractionRatio;const _=r.get(R).__maxMipLevel;_!==void 0&&(g.maxMipLevel.value=_)}p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity);let A;p.map?A=p.map:p.specularMap?A=p.specularMap:p.displacementMap?A=p.displacementMap:p.normalMap?A=p.normalMap:p.bumpMap?A=p.bumpMap:p.roughnessMap?A=p.roughnessMap:p.metalnessMap?A=p.metalnessMap:p.alphaMap?A=p.alphaMap:p.emissiveMap?A=p.emissiveMap:p.clearcoatMap?A=p.clearcoatMap:p.clearcoatNormalMap?A=p.clearcoatNormalMap:p.clearcoatRoughnessMap&&(A=p.clearcoatRoughnessMap),A!==void 0&&(A.isWebGLRenderTarget&&(A=A.texture),A.matrixAutoUpdate===!0&&A.updateMatrix(),g.uvTransform.value.copy(A.matrix));let L;p.aoMap?L=p.aoMap:p.lightMap&&(L=p.lightMap),L!==void 0&&(L.isWebGLRenderTarget&&(L=L.texture),L.matrixAutoUpdate===!0&&L.updateMatrix(),g.uv2Transform.value.copy(L.matrix))}function i(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity}function s(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function a(g,p,R,A){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*R,g.scale.value=A*.5,p.map&&(g.map.value=p.map),p.alphaMap&&(g.alphaMap.value=p.alphaMap);let L;p.map?L=p.map:p.alphaMap&&(L=p.alphaMap),L!==void 0&&(L.matrixAutoUpdate===!0&&L.updateMatrix(),g.uvTransform.value.copy(L.matrix))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map),p.alphaMap&&(g.alphaMap.value=p.alphaMap);let R;p.map?R=p.map:p.alphaMap&&(R=p.alphaMap),R!==void 0&&(R.matrixAutoUpdate===!0&&R.updateMatrix(),g.uvTransform.value.copy(R.matrix))}function l(g,p){p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap)}function c(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap),p.bumpMap&&(g.bumpMap.value=p.bumpMap,g.bumpScale.value=p.bumpScale,p.side===lt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,g.normalScale.value.copy(p.normalScale),p.side===lt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap),p.bumpMap&&(g.bumpMap.value=p.bumpMap,g.bumpScale.value=p.bumpScale,p.side===lt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,g.normalScale.value.copy(p.normalScale),p.side===lt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias)}function h(g,p){g.roughness.value=p.roughness,g.metalness.value=p.metalness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap),p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap),p.bumpMap&&(g.bumpMap.value=p.bumpMap,g.bumpScale.value=p.bumpScale,p.side===lt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,g.normalScale.value.copy(p.normalScale),p.side===lt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),r.get(p).envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p){h(g,p),g.reflectivity.value=p.reflectivity,g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.sheen&&g.sheen.value.copy(p.sheen),p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap),p.clearcoatNormalMap&&(g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),g.clearcoatNormalMap.value=p.clearcoatNormalMap,p.side===lt&&g.clearcoatNormalScale.value.negate()),g.transmission.value=p.transmission,p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap)}function f(g,p){p.matcap&&(g.matcap.value=p.matcap),p.bumpMap&&(g.bumpMap.value=p.bumpMap,g.bumpScale.value=p.bumpScale,p.side===lt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,g.normalScale.value.copy(p.normalScale),p.side===lt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias)}function m(g,p){p.displacementMap&&(g.displacementMap.value=p.displacementMap,g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias)}function v(g,p){p.displacementMap&&(g.displacementMap.value=p.displacementMap,g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),g.referencePosition.value.copy(p.referencePosition),g.nearDistance.value=p.nearDistance,g.farDistance.value=p.farDistance}function y(g,p){p.bumpMap&&(g.bumpMap.value=p.bumpMap,g.bumpScale.value=p.bumpScale,p.side===lt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,g.normalScale.value.copy(p.normalScale),p.side===lt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias)}return{refreshFogUniforms:e,refreshMaterialUniforms:t}}function Og(){const r=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");return r.style.display="block",r}function Ke(r){r=r||{};const e=r.canvas!==void 0?r.canvas:Og(),t=r.context!==void 0?r.context:null,n=r.alpha!==void 0?r.alpha:!1,i=r.depth!==void 0?r.depth:!0,s=r.stencil!==void 0?r.stencil:!0,a=r.antialias!==void 0?r.antialias:!1,o=r.premultipliedAlpha!==void 0?r.premultipliedAlpha:!0,l=r.preserveDrawingBuffer!==void 0?r.preserveDrawingBuffer:!1,c=r.powerPreference!==void 0?r.powerPreference:"default",u=r.failIfMajorPerformanceCaveat!==void 0?r.failIfMajorPerformanceCaveat:!1;let h=null,d=null;const f=[],m=[];this.domElement=e,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.gammaFactor=2,this.outputEncoding=Ct,this.physicallyCorrectLights=!1,this.toneMapping=Ai,this.toneMappingExposure=1;const v=this;let y=!1,g=0,p=0,R=null,A=-1,L=null;const _=new qe,F=new qe;let D=null,B=e.width,U=e.height,N=1,z=null,S=null;const E=new qe(0,0,B,U),C=new qe(0,0,B,U);let b=!1;const V=new Rs;let te=!1,$=!1;const he=new Re,oe=new M,Me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ee(){return R===null?N:1}let j=t;function He(x,k){for(let P=0;P<x.length;P++){const G=x[P],ie=e.getContext(G,k);if(ie!==null)return ie}return null}try{const x={alpha:n,depth:i,stencil:s,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:u};if(e.addEventListener("webglcontextlost",Ie,!1),e.addEventListener("webglcontextrestored",je,!1),j===null){const k=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&k.shift(),j=He(k,x),j===null)throw He(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}j.getShaderPrecisionFormat===void 0&&(j.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Oe,De,be,Ge,Fe,ze,ne,re,le,ye,ce,T,w,O,Z,fe,ge,Ne,Se,I,ae,ue;function _e(){Oe=new om(j),De=new rm(j,Oe,r),Oe.init(De),ae=new Ng(j,Oe,De),be=new Ig(j,Oe,De),Ge=new um,Fe=new wg,ze=new Fg(j,Oe,be,Fe,De,ae,Ge),ne=new am(v),re=new Dd(j,De),ue=new nm(j,Oe,re,De),le=new lm(j,re,Ge,ue),ye=new pm(j,le,re,Ge),Ne=new fm(j),Z=new sm(Fe),ce=new _g(v,ne,Oe,De,ue,Z),T=new kg(Fe),w=new Sg(Fe),O=new Rg(Oe,De),ge=new tm(v,ne,be,ye,o),fe=new Mc(v,ye,De),Se=new im(j,Oe,Ge,De),I=new cm(j,Oe,Ge,De),Ge.programs=ce.programs,v.capabilities=De,v.extensions=Oe,v.properties=Fe,v.renderLists=w,v.shadowMap=fe,v.state=be,v.info=Ge}_e();const K=new Bg(v,j);this.xr=K,this.getContext=function(){return j},this.getContextAttributes=function(){return j.getContextAttributes()},this.forceContextLoss=function(){const x=Oe.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=Oe.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(x){x!==void 0&&(N=x,this.setSize(B,U,!1))},this.getSize=function(x){return x===void 0&&(console.warn("WebGLRenderer: .getsize() now requires a Vector2 as an argument"),x=new se),x.set(B,U)},this.setSize=function(x,k,P){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=x,U=k,e.width=Math.floor(x*N),e.height=Math.floor(k*N),P!==!1&&(e.style.width=x+"px",e.style.height=k+"px"),this.setViewport(0,0,x,k)},this.getDrawingBufferSize=function(x){return x===void 0&&(console.warn("WebGLRenderer: .getdrawingBufferSize() now requires a Vector2 as an argument"),x=new se),x.set(B*N,U*N).floor()},this.setDrawingBufferSize=function(x,k,P){B=x,U=k,N=P,e.width=Math.floor(x*P),e.height=Math.floor(k*P),this.setViewport(0,0,x,k)},this.getCurrentViewport=function(x){return x===void 0&&(console.warn("WebGLRenderer: .getCurrentViewport() now requires a Vector4 as an argument"),x=new qe),x.copy(_)},this.getViewport=function(x){return x.copy(E)},this.setViewport=function(x,k,P,G){x.isVector4?E.set(x.x,x.y,x.z,x.w):E.set(x,k,P,G),be.viewport(_.copy(E).multiplyScalar(N).floor())},this.getScissor=function(x){return x.copy(C)},this.setScissor=function(x,k,P,G){x.isVector4?C.set(x.x,x.y,x.z,x.w):C.set(x,k,P,G),be.scissor(F.copy(C).multiplyScalar(N).floor())},this.getScissorTest=function(){return b},this.setScissorTest=function(x){be.setScissorTest(b=x)},this.setOpaqueSort=function(x){z=x},this.setTransparentSort=function(x){S=x},this.getClearColor=function(x){return x===void 0&&(console.warn("WebGLRenderer: .getClearColor() now requires a Color as an argument"),x=new xe),x.copy(ge.getClearColor())},this.setClearColor=function(){ge.setClearColor.apply(ge,arguments)},this.getClearAlpha=function(){return ge.getClearAlpha()},this.setClearAlpha=function(){ge.setClearAlpha.apply(ge,arguments)},this.clear=function(x,k,P){let G=0;(x===void 0||x)&&(G|=16384),(k===void 0||k)&&(G|=256),(P===void 0||P)&&(G|=1024),j.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Ie,!1),e.removeEventListener("webglcontextrestored",je,!1),w.dispose(),O.dispose(),Fe.dispose(),ne.dispose(),ye.dispose(),ue.dispose(),K.dispose(),K.removeEventListener("sessionstart",Tr),K.removeEventListener("sessionend",Er),X.stop()};function Ie(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function je(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const x=Ge.autoReset,k=fe.enabled,P=fe.autoUpdate,G=fe.needsUpdate,ie=fe.type;_e(),Ge.autoReset=x,fe.enabled=k,fe.autoUpdate=P,fe.needsUpdate=G,fe.type=ie}function st(x){const k=x.target;k.removeEventListener("dispose",st),Qt(k)}function Qt(x){it(x),Fe.remove(x)}function it(x){const k=Fe.get(x).programs;k!==void 0&&k.forEach(function(P){ce.releaseProgram(P)})}function Ut(x,k){x.render(function(P){v.renderBufferImmediate(P,k)})}this.renderBufferImmediate=function(x,k){ue.initAttributes();const P=Fe.get(x);x.hasPositions&&!P.position&&(P.position=j.createBuffer()),x.hasNormals&&!P.normal&&(P.normal=j.createBuffer()),x.hasUvs&&!P.uv&&(P.uv=j.createBuffer()),x.hasColors&&!P.color&&(P.color=j.createBuffer());const G=k.getAttributes();x.hasPositions&&(j.bindBuffer(34962,P.position),j.bufferData(34962,x.positionArray,35048),ue.enableAttribute(G.position),j.vertexAttribPointer(G.position,3,5126,!1,0,0)),x.hasNormals&&(j.bindBuffer(34962,P.normal),j.bufferData(34962,x.normalArray,35048),ue.enableAttribute(G.normal),j.vertexAttribPointer(G.normal,3,5126,!1,0,0)),x.hasUvs&&(j.bindBuffer(34962,P.uv),j.bufferData(34962,x.uvArray,35048),ue.enableAttribute(G.uv),j.vertexAttribPointer(G.uv,2,5126,!1,0,0)),x.hasColors&&(j.bindBuffer(34962,P.color),j.bufferData(34962,x.colorArray,35048),ue.enableAttribute(G.color),j.vertexAttribPointer(G.color,3,5126,!1,0,0)),ue.disableUnusedAttributes(),j.drawArrays(4,0,x.count),x.count=0},this.renderBufferDirect=function(x,k,P,G,ie,Pe){k===null&&(k=Me);const ve=ie.isMesh&&ie.matrixWorld.determinant()<0,we=J(x,k,G,ie);be.setMaterial(G,ve);let Be=P.index;const Te=P.attributes.position;if(Be===null){if(Te===void 0||Te.count===0)return}else if(Be.count===0)return;let ke=1;G.wireframe===!0&&(Be=le.getWireframeAttribute(P),ke=2),(G.morphTargets||G.morphNormals)&&Ne.update(ie,P,G,we),ue.setup(ie,G,we,P,Be);let Ae,We=Se;Be!==null&&(Ae=re.get(Be),We=I,We.setIndex(Ae));const Pt=Be!==null?Be.count:Te.count,pt=P.drawRange.start*ke,Gn=P.drawRange.count*ke,ct=Pe!==null?Pe.start*ke:0,Un=Pe!==null?Pe.count*ke:1/0,ot=Math.max(pt,ct),Ws=Math.min(Pt,pt+Gn,ct+Un)-1,Et=Math.max(0,Ws-ot+1);if(Et!==0){if(ie.isMesh)G.wireframe===!0?(be.setLineWidth(G.wireframeLinewidth*Ee()),We.setMode(1)):We.setMode(4);else if(ie.isLine){let cn=G.linewidth;cn===void 0&&(cn=1),be.setLineWidth(cn*Ee()),ie.isLineSegments?We.setMode(1):ie.isLineLoop?We.setMode(2):We.setMode(3)}else ie.isPoints?We.setMode(0):ie.isSprite&&We.setMode(4);if(ie.isInstancedMesh)We.renderInstances(ot,Et,ie.count);else if(P.isInstancedBufferGeometry){const cn=Math.min(P.instanceCount,P._maxInstanceCount);We.renderInstances(ot,Et,cn)}else We.render(ot,Et)}},this.compile=function(x,k){d=O.get(x),d.init(),x.traverseVisible(function(P){P.isLight&&P.layers.test(k.layers)&&(d.pushLight(P),P.castShadow&&d.pushShadow(P))}),d.setupLights(),x.traverse(function(P){const G=P.material;if(G)if(Array.isArray(G))for(let ie=0;ie<G.length;ie++){const Pe=G[ie];ee(Pe,x,P)}else ee(G,x,P)})};let Rt=null;function Vs(x){Rt&&Rt(x)}function Tr(){X.stop()}function Er(){X.start()}const X=new cc;X.setAnimationLoop(Vs),typeof window<"u"&&X.setContext(window),this.setAnimationLoop=function(x){Rt=x,K.setAnimationLoop(x),x===null?X.stop():X.start()},K.addEventListener("sessionstart",Tr),K.addEventListener("sessionend",Er),this.render=function(x,k){let P,G;if(arguments[2]!==void 0&&(console.warn("THREE.WebGLRenderer.render(): the renderTarget argument has been removed. Use .setRenderTarget() instead."),P=arguments[2]),arguments[3]!==void 0&&(console.warn("THREE.WebGLRenderer.render(): the forceClear argument has been removed. Use .clear() instead."),G=arguments[3]),k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;x.autoUpdate===!0&&x.updateMatrixWorld(),k.parent===null&&k.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(k=K.getCamera(k)),x.isScene===!0&&x.onBeforeRender(v,x,k,P||R),d=O.get(x,m.length),d.init(),m.push(d),he.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),V.setFromProjectionMatrix(he),$=this.localClippingEnabled,te=Z.init(this.clippingPlanes,$,k),h=w.get(x,f.length),h.init(),f.push(h),Q(x,k,0,v.sortObjects),h.finish(),v.sortObjects===!0&&h.sort(z,S),te===!0&&Z.beginShadows();const ie=d.state.shadowsArray;fe.render(ie,x,k),d.setupLights(),d.setupLightsView(k),te===!0&&Z.endShadows(),this.info.autoReset===!0&&this.info.reset(),P!==void 0&&this.setRenderTarget(P),ge.render(h,x,k,G);const Pe=h.opaque,ve=h.transparent;Pe.length>0&&H(Pe,x,k),ve.length>0&&H(ve,x,k),R!==null&&(ze.updateRenderTargetMipmap(R),ze.updateMultisampleRenderTarget(R)),x.isScene===!0&&x.onAfterRender(v,x,k),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1),ue.resetDefaultState(),A=-1,L=null,m.pop(),m.length>0?d=m[m.length-1]:d=null,f.pop(),f.length>0?h=f[f.length-1]:h=null};function Q(x,k,P,G){if(x.visible===!1)return;if(x.layers.test(k.layers)){if(x.isGroup)P=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(k);else if(x.isLight)d.pushLight(x),x.castShadow&&d.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||V.intersectsSprite(x)){G&&oe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(he);const ve=ye.update(x),we=x.material;we.visible&&h.push(x,ve,we,P,oe.z,null)}}else if(x.isImmediateRenderObject)G&&oe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(he),h.push(x,null,x.material,P,oe.z,null);else if((x.isMesh||x.isLine||x.isPoints)&&(x.isSkinnedMesh&&x.skeleton.frame!==Ge.render.frame&&(x.skeleton.update(),x.skeleton.frame=Ge.render.frame),!x.frustumCulled||V.intersectsObject(x))){G&&oe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(he);const ve=ye.update(x),we=x.material;if(Array.isArray(we)){const Be=ve.groups;for(let Te=0,ke=Be.length;Te<ke;Te++){const Ae=Be[Te],We=we[Ae.materialIndex];We&&We.visible&&h.push(x,ve,We,P,oe.z,Ae)}}else we.visible&&h.push(x,ve,we,P,oe.z,null)}}const Pe=x.children;for(let ve=0,we=Pe.length;ve<we;ve++)Q(Pe[ve],k,P,G)}function H(x,k,P){const G=k.isScene===!0?k.overrideMaterial:null;for(let ie=0,Pe=x.length;ie<Pe;ie++){const ve=x[ie],we=ve.object,Be=ve.geometry,Te=G===null?ve.material:G,ke=ve.group;if(P.isArrayCamera){const Ae=P.cameras;for(let We=0,Pt=Ae.length;We<Pt;We++){const pt=Ae[We];we.layers.test(pt.layers)&&(be.viewport(_.copy(pt.viewport)),d.setupLightsView(pt),q(we,k,pt,Be,Te,ke))}}else q(we,k,P,Be,Te,ke)}}function q(x,k,P,G,ie,Pe){if(x.onBeforeRender(v,k,P,G,ie,Pe),x.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),x.isImmediateRenderObject){const ve=J(P,k,ie,x);be.setMaterial(ie),ue.reset(),Ut(x,ve)}else v.renderBufferDirect(P,k,G,ie,x,Pe);x.onAfterRender(v,k,P,G,ie,Pe)}function ee(x,k,P){k.isScene!==!0&&(k=Me);const G=Fe.get(x),ie=d.state.lights,Pe=d.state.shadowsArray,ve=ie.state.version,we=ce.getParameters(x,ie.state,Pe,k,P),Be=ce.getProgramCacheKey(we);let Te=G.programs;G.environment=x.isMeshStandardMaterial?k.environment:null,G.fog=k.fog,G.envMap=ne.get(x.envMap||G.environment),Te===void 0&&(x.addEventListener("dispose",st),Te=new Map,G.programs=Te);let ke=Te.get(Be);if(ke!==void 0){if(G.currentProgram===ke&&G.lightsStateVersion===ve)return W(x,we),ke}else we.uniforms=ce.getUniforms(x),x.onBuild(we,v),x.onBeforeCompile(we,v),ke=ce.acquireProgram(we,Be),Te.set(Be,ke),G.uniforms=we.uniforms;const Ae=G.uniforms;(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Ae.clippingPlanes=Z.uniform),W(x,we),G.needsLights=Ce(x),G.lightsStateVersion=ve,G.needsLights&&(Ae.ambientLightColor.value=ie.state.ambient,Ae.lightProbe.value=ie.state.probe,Ae.directionalLights.value=ie.state.directional,Ae.directionalLightShadows.value=ie.state.directionalShadow,Ae.spotLights.value=ie.state.spot,Ae.spotLightShadows.value=ie.state.spotShadow,Ae.rectAreaLights.value=ie.state.rectArea,Ae.ltc_1.value=ie.state.rectAreaLTC1,Ae.ltc_2.value=ie.state.rectAreaLTC2,Ae.pointLights.value=ie.state.point,Ae.pointLightShadows.value=ie.state.pointShadow,Ae.hemisphereLights.value=ie.state.hemi,Ae.directionalShadowMap.value=ie.state.directionalShadowMap,Ae.directionalShadowMatrix.value=ie.state.directionalShadowMatrix,Ae.spotShadowMap.value=ie.state.spotShadowMap,Ae.spotShadowMatrix.value=ie.state.spotShadowMatrix,Ae.pointShadowMap.value=ie.state.pointShadowMap,Ae.pointShadowMatrix.value=ie.state.pointShadowMatrix);const We=ke.getUniforms(),Pt=Dn.seqWithValue(We.seq,Ae);return G.currentProgram=ke,G.uniformsList=Pt,ke}function W(x,k){const P=Fe.get(x);P.outputEncoding=k.outputEncoding,P.instancing=k.instancing,P.numClippingPlanes=k.numClippingPlanes,P.numIntersection=k.numClipIntersection,P.vertexAlphas=k.vertexAlphas}function J(x,k,P,G){k.isScene!==!0&&(k=Me),ze.resetTextureUnits();const ie=k.fog,Pe=P.isMeshStandardMaterial?k.environment:null,ve=R===null?v.outputEncoding:R.texture.encoding,we=ne.get(P.envMap||Pe),Be=P.vertexColors===!0&&G.geometry&&G.geometry.attributes.color&&G.geometry.attributes.color.itemSize===4,Te=Fe.get(P),ke=d.state.lights;if(te===!0&&($===!0||x!==L)){const ot=x===L&&P.id===A;Z.setState(P,x,ot)}let Ae=!1;P.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==ke.state.version||Te.outputEncoding!==ve||G.isInstancedMesh&&Te.instancing===!1||!G.isInstancedMesh&&Te.instancing===!0||Te.envMap!==we||P.fog&&Te.fog!==ie||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==Z.numPlanes||Te.numIntersection!==Z.numIntersection)||Te.vertexAlphas!==Be)&&(Ae=!0):(Ae=!0,Te.__version=P.version);let We=Te.currentProgram;Ae===!0&&(We=ee(P,k,G));let Pt=!1,pt=!1,Gn=!1;const ct=We.getUniforms(),Un=Te.uniforms;if(be.useProgram(We.program)&&(Pt=!0,pt=!0,Gn=!0),P.id!==A&&(A=P.id,pt=!0),Pt||L!==x){if(ct.setValue(j,"projectionMatrix",x.projectionMatrix),De.logarithmicDepthBuffer&&ct.setValue(j,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),L!==x&&(L=x,pt=!0,Gn=!0),P.isShaderMaterial||P.isMeshPhongMaterial||P.isMeshToonMaterial||P.isMeshStandardMaterial||P.envMap){const ot=ct.map.cameraPosition;ot!==void 0&&ot.setValue(j,oe.setFromMatrixPosition(x.matrixWorld))}(P.isMeshPhongMaterial||P.isMeshToonMaterial||P.isMeshLambertMaterial||P.isMeshBasicMaterial||P.isMeshStandardMaterial||P.isShaderMaterial)&&ct.setValue(j,"isOrthographic",x.isOrthographicCamera===!0),(P.isMeshPhongMaterial||P.isMeshToonMaterial||P.isMeshLambertMaterial||P.isMeshBasicMaterial||P.isMeshStandardMaterial||P.isShaderMaterial||P.isShadowMaterial||P.skinning)&&ct.setValue(j,"viewMatrix",x.matrixWorldInverse)}if(P.skinning){ct.setOptional(j,G,"bindMatrix"),ct.setOptional(j,G,"bindMatrixInverse");const ot=G.skeleton;if(ot){const Ws=ot.bones;if(De.floatVertexTextures){if(ot.boneTexture===null){let Et=Math.sqrt(Ws.length*4);Et=hd(Et),Et=Math.max(Et,4);const cn=new Float32Array(Et*Et*4);cn.set(ot.boneMatrices);const Du=new eo(cn,Et,Et,Ft,gn);ot.boneMatrices=cn,ot.boneTexture=Du,ot.boneTextureSize=Et}ct.setValue(j,"boneTexture",ot.boneTexture,ze),ct.setValue(j,"boneTextureSize",ot.boneTextureSize)}else ct.setOptional(j,ot,"boneMatrices")}}return(pt||Te.receiveShadow!==G.receiveShadow)&&(Te.receiveShadow=G.receiveShadow,ct.setValue(j,"receiveShadow",G.receiveShadow)),pt&&(ct.setValue(j,"toneMappingExposure",v.toneMappingExposure),Te.needsLights&&pe(Un,Gn),ie&&P.fog&&T.refreshFogUniforms(Un,ie),T.refreshMaterialUniforms(Un,P,N,U),Dn.upload(j,Te.uniformsList,Un,ze)),P.isShaderMaterial&&P.uniformsNeedUpdate===!0&&(Dn.upload(j,Te.uniformsList,Un,ze),P.uniformsNeedUpdate=!1),P.isSpriteMaterial&&ct.setValue(j,"center",G.center),ct.setValue(j,"modelViewMatrix",G.modelViewMatrix),ct.setValue(j,"normalMatrix",G.normalMatrix),ct.setValue(j,"modelMatrix",G.matrixWorld),We}function pe(x,k){x.ambientLightColor.needsUpdate=k,x.lightProbe.needsUpdate=k,x.directionalLights.needsUpdate=k,x.directionalLightShadows.needsUpdate=k,x.pointLights.needsUpdate=k,x.pointLightShadows.needsUpdate=k,x.spotLights.needsUpdate=k,x.spotLightShadows.needsUpdate=k,x.rectAreaLights.needsUpdate=k,x.hemisphereLights.needsUpdate=k}function Ce(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return g},this.getActiveMipmapLevel=function(){return p},this.getRenderTarget=function(){return R},this.setRenderTarget=function(x,k=0,P=0){R=x,g=k,p=P,x&&Fe.get(x).__webglFramebuffer===void 0&&ze.setupRenderTarget(x);let G=null,ie=!1,Pe=!1;if(x){const ve=x.texture;(ve.isDataTexture3D||ve.isDataTexture2DArray)&&(Pe=!0);const we=Fe.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(G=we[k],ie=!0):x.isWebGLMultisampleRenderTarget?G=Fe.get(x).__webglMultisampledFramebuffer:G=we,_.copy(x.viewport),F.copy(x.scissor),D=x.scissorTest}else _.copy(E).multiplyScalar(N).floor(),F.copy(C).multiplyScalar(N).floor(),D=b;if(be.bindFramebuffer(36160,G),be.viewport(_),be.scissor(F),be.setScissorTest(D),ie){const ve=Fe.get(x.texture);j.framebufferTexture2D(36160,36064,34069+k,ve.__webglTexture,P)}else if(Pe){const ve=Fe.get(x.texture),we=k||0;j.framebufferTextureLayer(36160,36064,ve.__webglTexture,P||0,we)}},this.readRenderTargetPixels=function(x,k,P,G,ie,Pe,ve){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=Fe.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ve!==void 0&&(we=we[ve]),we){be.bindFramebuffer(36160,we);try{const Be=x.texture,Te=Be.format,ke=Be.type;if(Te!==Ft&&ae.convert(Te)!==j.getParameter(35739)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ae=ke===fs&&(Oe.has("EXT_color_buffer_half_float")||De.isWebGL2&&Oe.has("EXT_color_buffer_float"));if(ke!==_r&&ae.convert(ke)!==j.getParameter(35738)&&!(ke===gn&&(De.isWebGL2||Oe.has("OES_texture_float")||Oe.has("WEBGL_color_buffer_float")))&&!Ae){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j.checkFramebufferStatus(36160)===36053?k>=0&&k<=x.width-G&&P>=0&&P<=x.height-ie&&j.readPixels(k,P,G,ie,ae.convert(Te),ae.convert(ke),Pe):console.error("THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.")}finally{const Be=R!==null?Fe.get(R).__webglFramebuffer:null;be.bindFramebuffer(36160,Be)}}},this.copyFramebufferToTexture=function(x,k,P=0){const G=Math.pow(2,-P),ie=Math.floor(k.image.width*G),Pe=Math.floor(k.image.height*G),ve=ae.convert(k.format);ze.setTexture2D(k,0),j.copyTexImage2D(3553,P,ve,x.x,x.y,ie,Pe,0),be.unbindTexture()},this.copyTextureToTexture=function(x,k,P,G=0){const ie=k.image.width,Pe=k.image.height,ve=ae.convert(P.format),we=ae.convert(P.type);ze.setTexture2D(P,0),j.pixelStorei(37440,P.flipY),j.pixelStorei(37441,P.premultiplyAlpha),j.pixelStorei(3317,P.unpackAlignment),k.isDataTexture?j.texSubImage2D(3553,G,x.x,x.y,ie,Pe,ve,we,k.image.data):k.isCompressedTexture?j.compressedTexSubImage2D(3553,G,x.x,x.y,k.mipmaps[0].width,k.mipmaps[0].height,ve,k.mipmaps[0].data):j.texSubImage2D(3553,G,x.x,x.y,ve,we,k.image),G===0&&P.generateMipmaps&&j.generateMipmap(3553),be.unbindTexture()},this.copyTextureToTexture3D=function(x,k,P,G,ie=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const{width:Pe,height:ve,data:we}=P.image,Be=ae.convert(G.format),Te=ae.convert(G.type);let ke;if(G.isDataTexture3D)ze.setTexture3D(G,0),ke=32879;else if(G.isDataTexture2DArray)ze.setTexture2DArray(G,0),ke=35866;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}j.pixelStorei(37440,G.flipY),j.pixelStorei(37441,G.premultiplyAlpha),j.pixelStorei(3317,G.unpackAlignment);const Ae=j.getParameter(3314),We=j.getParameter(32878),Pt=j.getParameter(3316),pt=j.getParameter(3315),Gn=j.getParameter(32877);j.pixelStorei(3314,Pe),j.pixelStorei(32878,ve),j.pixelStorei(3316,x.min.x),j.pixelStorei(3315,x.min.y),j.pixelStorei(32877,x.min.z),j.texSubImage3D(ke,ie,k.x,k.y,k.z,x.max.x-x.min.x+1,x.max.y-x.min.y+1,x.max.z-x.min.z+1,Be,Te,we),j.pixelStorei(3314,Ae),j.pixelStorei(32878,We),j.pixelStorei(3316,Pt),j.pixelStorei(3315,pt),j.pixelStorei(32877,Gn),ie===0&&G.generateMipmaps&&j.generateMipmap(ke),be.unbindTexture()},this.initTexture=function(x){ze.setTexture2D(x,0),be.unbindTexture()},this.resetState=function(){g=0,p=0,R=null,be.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}class Hg extends Ke{}Hg.prototype.isWebGL1Renderer=!0;class Ps{constructor(e,t=25e-5){this.name="",this.color=new xe(e),this.density=t}clone(){return new Ps(this.color,this.density)}toJSON(){return{type:"FogExp2",color:this.color.getHex(),density:this.density}}}Ps.prototype.isFogExp2=!0;class Ds extends Je{constructor(){super(),this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.overrideMaterial=null,this.autoUpdate=!0,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.autoUpdate=e.autoUpdate,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.background!==null&&(t.object.background=this.background.toJSON(e)),this.environment!==null&&(t.object.environment=this.environment.toJSON(e)),this.fog!==null&&(t.object.fog=this.fog.toJSON()),t}}Ds.prototype.isScene=!0;class Kn{constructor(e,t){this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=pr,this.updateRange={offset:0,count:-1},this.version=0,this.uuid=rn(),this.onUploadCallback=function(){}}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new Kn(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.prototype.slice.call(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}Kn.prototype.isInterleavedBuffer=!0;const at=new M;class mr{constructor(e,t,n,i){this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i===!0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)at.x=this.getX(t),at.y=this.getY(t),at.z=this.getZ(t),at.applyMatrix4(e),this.setXYZ(t,at.x,at.y,at.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)at.x=this.getX(t),at.y=this.getY(t),at.z=this.getZ(t),at.applyNormalMatrix(e),this.setXYZ(t,at.x,at.y,at.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)at.x=this.getX(t),at.y=this.getY(t),at.z=this.getZ(t),at.transformDirection(e),this.setXYZ(t,at.x,at.y,at.z);return this}setX(e,t){return this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){return this.data.array[e*this.data.stride+this.offset]}getY(e){return this.data.array[e*this.data.stride+this.offset+1]}getZ(e){return this.data.array[e*this.data.stride+this.offset+2]}getW(e){return this.data.array[e*this.data.stride+this.offset+3]}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interlaved buffer attribute will deinterleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Ze(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new mr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interlaved buffer attribute will deinterleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}mr.prototype.isInterleavedBufferAttribute=!0;class Sc extends ft{constructor(e){super(),this.type="SpriteMaterial",this.color=new xe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this}}Sc.prototype.isSpriteMaterial=!0;let pi;const tr=new M,mi=new M,gi=new M,vi=new se,nr=new se,Tc=new Re,Wr=new M,ir=new M,qr=new M,fl=new se,_a=new se,pl=new se;class Gg extends Je{constructor(e){if(super(),this.type="Sprite",pi===void 0){pi=new Ve;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Kn(t,5);pi.setIndex([0,1,2,0,2,3]),pi.setAttribute("position",new mr(n,3,0,!1)),pi.setAttribute("uv",new mr(n,2,3,!1))}this.geometry=pi,this.material=e!==void 0?e:new Sc,this.center=new se(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),mi.setFromMatrixScale(this.matrixWorld),Tc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),gi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&mi.multiplyScalar(-gi.z);const n=this.material.rotation;let i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));const a=this.center;Xr(Wr.set(-.5,-.5,0),gi,a,mi,i,s),Xr(ir.set(.5,-.5,0),gi,a,mi,i,s),Xr(qr.set(.5,.5,0),gi,a,mi,i,s),fl.set(0,0),_a.set(1,0),pl.set(1,1);let o=e.ray.intersectTriangle(Wr,ir,qr,!1,tr);if(o===null&&(Xr(ir.set(-.5,.5,0),gi,a,mi,i,s),_a.set(0,1),o=e.ray.intersectTriangle(Wr,qr,ir,!1,tr),o===null))return;const l=e.ray.origin.distanceTo(tr);l<e.near||l>e.far||t.push({distance:l,point:tr.clone(),uv:ut.getUV(tr,Wr,ir,qr,fl,_a,pl,new se),face:null,object:this})}copy(e){return super.copy(e),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}Gg.prototype.isSprite=!0;function Xr(r,e,t,n,i,s){vi.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(nr.x=s*vi.x-i*vi.y,nr.y=i*vi.x+s*vi.y):nr.copy(vi),r.copy(e),r.x+=nr.x,r.y+=nr.y,r.applyMatrix4(Tc)}const ml=new M,gl=new qe,vl=new qe,Ug=new M,xl=new Re;class Ec extends Ye{constructor(e,t){super(e,t),this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new Re,this.bindMatrixInverse=new Re}copy(e){return super.copy(e),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new qe,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.x=t.getX(n),e.y=t.getY(n),e.z=t.getZ(n),e.w=t.getW(n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode==="attached"?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode==="detached"?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}boneTransform(e,t){const n=this.skeleton,i=this.geometry;gl.fromBufferAttribute(i.attributes.skinIndex,e),vl.fromBufferAttribute(i.attributes.skinWeight,e),ml.fromBufferAttribute(i.attributes.position,e).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=vl.getComponent(s);if(a!==0){const o=gl.getComponent(s);xl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Ug.copy(ml).applyMatrix4(xl),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}Ec.prototype.isSkinnedMesh=!0;class Vg extends Je{constructor(){super(),this.type="Bone"}}Vg.prototype.isBone=!0;const yl=new Re,_l=new Re,Yr=[],rr=new Ye;class Wg extends Ye{constructor(e,t,n){super(e,t),this.instanceMatrix=new Ze(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.frustumCulled=!1}copy(e){return super.copy(e),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const n=this.matrixWorld,i=this.count;if(rr.geometry=this.geometry,rr.material=this.material,rr.material!==void 0)for(let s=0;s<i;s++){this.getMatrixAt(s,yl),_l.multiplyMatrices(n,yl),rr.matrixWorld=_l,rr.raycast(e,Yr);for(let a=0,o=Yr.length;a<o;a++){const l=Yr[a];l.instanceId=s,l.object=this,t.push(l)}Yr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ze(new Float32Array(this.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}Wg.prototype.isInstancedMesh=!0;class qi extends ft{constructor(e){super(),this.type="LineBasicMaterial",this.color=new xe(16777215),this.linewidth=1,this.linecap="round",this.linejoin="round",this.morphTargets=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.morphTargets=e.morphTargets,this}}qi.prototype.isLineBasicMaterial=!0;const wl=new M,Ml=new M,bl=new Re,wa=new Ui,jr=new Gi;class Is extends Je{constructor(e=new Ve,t=new qi){super(),this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.isBufferGeometry)if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)wl.fromBufferAttribute(t,i-1),Ml.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=wl.distanceTo(Ml);e.setAttribute("lineDistance",new $e(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");else e.isGeometry&&console.error("THREE.Line.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(i),jr.radius+=s,e.ray.intersectsSphere(jr)===!1)return;bl.copy(i).invert(),wa.copy(e.ray).applyMatrix4(bl);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new M,u=new M,h=new M,d=new M,f=this.isLineSegments?2:1;if(n.isBufferGeometry){const m=n.index,y=n.attributes.position;if(m!==null){const g=Math.max(0,a.start),p=Math.min(m.count,a.start+a.count);for(let R=g,A=p-1;R<A;R+=f){const L=m.getX(R),_=m.getX(R+1);if(c.fromBufferAttribute(y,L),u.fromBufferAttribute(y,_),wa.distanceSqToSegment(c,u,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);const D=e.ray.origin.distanceTo(d);D<e.near||D>e.far||t.push({distance:D,point:h.clone().applyMatrix4(this.matrixWorld),index:R,face:null,faceIndex:null,object:this})}}else{const g=Math.max(0,a.start),p=Math.min(y.count,a.start+a.count);for(let R=g,A=p-1;R<A;R+=f){if(c.fromBufferAttribute(y,R),u.fromBufferAttribute(y,R+1),wa.distanceSqToSegment(c,u,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);const _=e.ray.origin.distanceTo(d);_<e.near||_>e.far||t.push({distance:_,point:h.clone().applyMatrix4(this.matrixWorld),index:R,face:null,faceIndex:null,object:this})}}}else n.isGeometry&&console.error("THREE.Line.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Line.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.")}}}Is.prototype.isLine=!0;const Sl=new M,Tl=new M;class to extends Is{constructor(e,t){super(e,t),this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.isBufferGeometry)if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Sl.fromBufferAttribute(t,i),Tl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Sl.distanceTo(Tl);e.setAttribute("lineDistance",new $e(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");else e.isGeometry&&console.error("THREE.LineSegments.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.");return this}}to.prototype.isLineSegments=!0;class qg extends Is{constructor(e,t){super(e,t),this.type="LineLoop"}}qg.prototype.isLineLoop=!0;class Ac extends ft{constructor(e){super(),this.type="PointsMaterial",this.color=new xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.morphTargets=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.morphTargets=e.morphTargets,this}}Ac.prototype.isPointsMaterial=!0;const El=new Re,Fa=new Ui,Zr=new Gi,Jr=new M;class Lc extends Je{constructor(e=new Ve,t=new Ac){super(),this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(i),Zr.radius+=s,e.ray.intersectsSphere(Zr)===!1)return;El.copy(i).invert(),Fa.copy(e.ray).applyMatrix4(El);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o;if(n.isBufferGeometry){const c=n.index,h=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,v=f;m<v;m++){const y=c.getX(m);Jr.fromBufferAttribute(h,y),Al(Jr,y,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let m=d,v=f;m<v;m++)Jr.fromBufferAttribute(h,m),Al(Jr,m,l,i,e,t,this)}}else console.error("THREE.Points.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.")}updateMorphTargets(){const e=this.geometry;if(e.isBufferGeometry){const t=e.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}else{const t=e.morphTargets;t!==void 0&&t.length>0&&console.error("THREE.Points.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.")}}}Lc.prototype.isPoints=!0;function Al(r,e,t,n,i,s,a){const o=Fa.distanceSqToPoint(r);if(o<t){const l=new M;Fa.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class Xg extends _t{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.format=o!==void 0?o:Zn,this.minFilter=a!==void 0?a:zt,this.magFilter=s!==void 0?s:zt,this.generateMipmaps=!1;const u=this;function h(){u.needsUpdate=!0,e.requestVideoFrameCallback(h)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(h)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}Xg.prototype.isVideoTexture=!0;class Yg extends _t{constructor(e,t,n,i,s,a,o,l,c,u,h,d){super(null,a,o,l,c,u,i,s,h,d),this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}Yg.prototype.isCompressedTexture=!0;class jg extends _t{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.needsUpdate=!0}}jg.prototype.isCanvasTexture=!0;class Zg extends _t{constructor(e,t,n,i,s,a,o,l,c,u){if(u=u!==void 0?u:Li,u!==Li&&u!==fr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Li&&(n=ds),n===void 0&&u===fr&&(n=ur),super(null,i,s,a,o,l,u,n,c),this.image={width:e,height:t},this.magFilter=o!==void 0?o:dt,this.minFilter=l!==void 0?l:dt,this.flipY=!1,this.generateMipmaps=!1}}Zg.prototype.isDepthTexture=!0;class Di extends Ve{constructor(e=1,t=1,n=1,i=8,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const u=[],h=[],d=[],f=[];let m=0;const v=[],y=n/2;let g=0;p(),a===!1&&(e>0&&R(!0),t>0&&R(!1)),this.setIndex(u),this.setAttribute("position",new $e(h,3)),this.setAttribute("normal",new $e(d,3)),this.setAttribute("uv",new $e(f,2));function p(){const A=new M,L=new M;let _=0;const F=(t-e)/n;for(let D=0;D<=s;D++){const B=[],U=D/s,N=U*(t-e)+e;for(let z=0;z<=i;z++){const S=z/i,E=S*l+o,C=Math.sin(E),b=Math.cos(E);L.x=N*C,L.y=-U*n+y,L.z=N*b,h.push(L.x,L.y,L.z),A.set(C,F,b).normalize(),d.push(A.x,A.y,A.z),f.push(S,1-U),B.push(m++)}v.push(B)}for(let D=0;D<i;D++)for(let B=0;B<s;B++){const U=v[B][D],N=v[B+1][D],z=v[B+1][D+1],S=v[B][D+1];u.push(U,N,S),u.push(N,z,S),_+=6}c.addGroup(g,_,0),g+=_}function R(A){const L=m,_=new se,F=new M;let D=0;const B=A===!0?e:t,U=A===!0?1:-1;for(let z=1;z<=i;z++)h.push(0,y*U,0),d.push(0,U,0),f.push(.5,.5),m++;const N=m;for(let z=0;z<=i;z++){const E=z/i*l+o,C=Math.cos(E),b=Math.sin(E);F.x=B*b,F.y=y*U,F.z=B*C,h.push(F.x,F.y,F.z),d.push(0,U,0),_.x=C*.5+.5,_.y=b*.5*U+.5,f.push(_.x,_.y),m++}for(let z=0;z<i;z++){const S=L+z,E=N+z;A===!0?u.push(E,E+1,S):u.push(E+1,E,S),D+=3}c.addGroup(g,D,A===!0?1:2),g+=D}}}class Jg extends Di{constructor(e=1,t=1,n=8,i=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}}const Qg={triangulate:function(r,e,t){t=t||2;const n=e&&e.length,i=n?e[0]*t:r.length;let s=Cc(r,0,i,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,u,h,d,f;if(n&&(s=n0(r,e,s,t)),r.length>80*t){o=c=r[0],l=u=r[1];for(let m=t;m<i;m+=t)h=r[m],d=r[m+1],h<o&&(o=h),d<l&&(l=d),h>c&&(c=h),d>u&&(u=d);f=Math.max(c-o,u-l),f=f!==0?1/f:0}return gr(s,a,t,o,l,f),a}};function Cc(r,e,t,n,i){let s,a;if(i===f0(r,e,t,n)>0)for(s=e;s<t;s+=n)a=Ll(s,r[s],r[s+1],a);else for(s=t-n;s>=e;s-=n)a=Ll(s,r[s],r[s+1],a);return a&&Fs(a,a.next)&&(xr(a),a=a.next),a}function zn(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(Fs(t,t.next)||rt(t.prev,t,t.next)===0)){if(xr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function gr(r,e,t,n,i,s,a){if(!r)return;!a&&s&&o0(r,n,i,s);let o=r,l,c;for(;r.prev!==r.next;){if(l=r.prev,c=r.next,s?Kg(r,n,i,s):$g(r)){e.push(l.i/t),e.push(r.i/t),e.push(c.i/t),xr(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=e0(zn(r),e,t),gr(r,e,t,n,i,s,2)):a===2&&t0(r,e,t,n,i,s):gr(zn(r),e,t,n,i,s,1);break}}}function $g(r){const e=r.prev,t=r,n=r.next;if(rt(e,t,n)>=0)return!1;let i=r.next.next;for(;i!==r.prev;){if(Ei(e.x,e.y,t.x,t.y,n.x,n.y,i.x,i.y)&&rt(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function Kg(r,e,t,n){const i=r.prev,s=r,a=r.next;if(rt(i,s,a)>=0)return!1;const o=i.x<s.x?i.x<a.x?i.x:a.x:s.x<a.x?s.x:a.x,l=i.y<s.y?i.y<a.y?i.y:a.y:s.y<a.y?s.y:a.y,c=i.x>s.x?i.x>a.x?i.x:a.x:s.x>a.x?s.x:a.x,u=i.y>s.y?i.y>a.y?i.y:a.y:s.y>a.y?s.y:a.y,h=Na(o,l,e,t,n),d=Na(c,u,e,t,n);let f=r.prevZ,m=r.nextZ;for(;f&&f.z>=h&&m&&m.z<=d;){if(f!==r.prev&&f!==r.next&&Ei(i.x,i.y,s.x,s.y,a.x,a.y,f.x,f.y)&&rt(f.prev,f,f.next)>=0||(f=f.prevZ,m!==r.prev&&m!==r.next&&Ei(i.x,i.y,s.x,s.y,a.x,a.y,m.x,m.y)&&rt(m.prev,m,m.next)>=0))return!1;m=m.nextZ}for(;f&&f.z>=h;){if(f!==r.prev&&f!==r.next&&Ei(i.x,i.y,s.x,s.y,a.x,a.y,f.x,f.y)&&rt(f.prev,f,f.next)>=0)return!1;f=f.prevZ}for(;m&&m.z<=d;){if(m!==r.prev&&m!==r.next&&Ei(i.x,i.y,s.x,s.y,a.x,a.y,m.x,m.y)&&rt(m.prev,m,m.next)>=0)return!1;m=m.nextZ}return!0}function e0(r,e,t){let n=r;do{const i=n.prev,s=n.next.next;!Fs(i,s)&&Rc(i,n,n.next,s)&&vr(i,s)&&vr(s,i)&&(e.push(i.i/t),e.push(n.i/t),e.push(s.i/t),xr(n),xr(n.next),n=r=s),n=n.next}while(n!==r);return zn(n)}function t0(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&u0(a,o)){let l=Pc(a,o);a=zn(a,a.next),l=zn(l,l.next),gr(a,e,t,n,i,s),gr(l,e,t,n,i,s);return}o=o.next}a=a.next}while(a!==r)}function n0(r,e,t,n){const i=[];let s,a,o,l,c;for(s=0,a=e.length;s<a;s++)o=e[s]*n,l=s<a-1?e[s+1]*n:r.length,c=Cc(r,o,l,n,!1),c===c.next&&(c.steiner=!0),i.push(c0(c));for(i.sort(i0),s=0;s<i.length;s++)r0(i[s],t),t=zn(t,t.next);return t}function i0(r,e){return r.x-e.x}function r0(r,e){if(e=s0(r,e),e){const t=Pc(e,r);zn(e,e.next),zn(t,t.next)}}function s0(r,e){let t=e;const n=r.x,i=r.y;let s=-1/0,a;do{if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const d=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>s){if(s=d,d===n){if(i===t.y)return t;if(i===t.next.y)return t.next}a=t.x<t.next.x?t:t.next}}t=t.next}while(t!==e);if(!a)return null;if(n===s)return a;const o=a,l=a.x,c=a.y;let u=1/0,h;t=a;do n>=t.x&&t.x>=l&&n!==t.x&&Ei(i<c?n:s,i,l,c,i<c?s:n,i,t.x,t.y)&&(h=Math.abs(i-t.y)/(n-t.x),vr(t,r)&&(h<u||h===u&&(t.x>a.x||t.x===a.x&&a0(a,t)))&&(a=t,u=h)),t=t.next;while(t!==o);return a}function a0(r,e){return rt(r.prev,r,e.prev)<0&&rt(e.next,r,r.next)<0}function o0(r,e,t,n){let i=r;do i.z===null&&(i.z=Na(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,l0(i)}function l0(r){let e,t,n,i,s,a,o,l,c=1;do{for(t=r,r=null,s=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,o--):(i=n,n=n.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;t=n}s.nextZ=null,c*=2}while(a>1);return r}function Na(r,e,t,n,i){return r=32767*(r-t)*i,e=32767*(e-n)*i,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function c0(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Ei(r,e,t,n,i,s,a,o){return(i-a)*(e-o)-(r-a)*(s-o)>=0&&(r-a)*(n-o)-(t-a)*(e-o)>=0&&(t-a)*(s-o)-(i-a)*(n-o)>=0}function u0(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!h0(r,e)&&(vr(r,e)&&vr(e,r)&&d0(r,e)&&(rt(r.prev,r,e.prev)||rt(r,e.prev,e))||Fs(r,e)&&rt(r.prev,r,r.next)>0&&rt(e.prev,e,e.next)>0)}function rt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Fs(r,e){return r.x===e.x&&r.y===e.y}function Rc(r,e,t,n){const i=$r(rt(r,e,t)),s=$r(rt(r,e,n)),a=$r(rt(t,n,r)),o=$r(rt(t,n,e));return!!(i!==s&&a!==o||i===0&&Qr(r,t,e)||s===0&&Qr(r,n,e)||a===0&&Qr(t,r,n)||o===0&&Qr(t,e,n))}function Qr(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function $r(r){return r>0?1:r<0?-1:0}function h0(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&Rc(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function vr(r,e){return rt(r.prev,r,r.next)<0?rt(r,e,r.next)>=0&&rt(r,r.prev,e)>=0:rt(r,e,r.prev)<0||rt(r,r.next,e)<0}function d0(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function Pc(r,e){const t=new za(r.i,r.x,r.y),n=new za(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Ll(r,e,t,n){const i=new za(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function xr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function za(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function f0(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}class In{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return In.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];Cl(e),Rl(n,e);let a=e.length;t.forEach(Cl);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Rl(n,t[l]);const o=Qg.triangulate(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Cl(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Rl(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class Ns extends Ve{constructor(e,t){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],s=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new $e(i,3)),this.setAttribute("uv",new $e(s,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1;let h=t.depth!==void 0?t.depth:100,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:6,m=t.bevelSize!==void 0?t.bevelSize:f-2,v=t.bevelOffset!==void 0?t.bevelOffset:0,y=t.bevelSegments!==void 0?t.bevelSegments:3;const g=t.extrudePath,p=t.UVGenerator!==void 0?t.UVGenerator:p0;t.amount!==void 0&&(console.warn("THREE.ExtrudeBufferGeometry: amount has been renamed to depth."),h=t.amount);let R,A=!1,L,_,F,D;g&&(R=g.getSpacedPoints(u),A=!0,d=!1,L=g.computeFrenetFrames(u,!1),_=new M,F=new M,D=new M),d||(y=0,f=0,m=0,v=0);const B=o.extractPoints(c);let U=B.shape;const N=B.holes;if(!In.isClockWise(U)){U=U.reverse();for(let ne=0,re=N.length;ne<re;ne++){const le=N[ne];In.isClockWise(le)&&(N[ne]=le.reverse())}}const S=In.triangulateShape(U,N),E=U;for(let ne=0,re=N.length;ne<re;ne++){const le=N[ne];U=U.concat(le)}function C(ne,re,le){return re||console.error("THREE.ExtrudeGeometry: vec does not exist"),re.clone().multiplyScalar(le).add(ne)}const b=U.length,V=S.length;function te(ne,re,le){let ye,ce,T;const w=ne.x-re.x,O=ne.y-re.y,Z=le.x-ne.x,fe=le.y-ne.y,ge=w*w+O*O,Ne=w*fe-O*Z;if(Math.abs(Ne)>Number.EPSILON){const Se=Math.sqrt(ge),I=Math.sqrt(Z*Z+fe*fe),ae=re.x-O/Se,ue=re.y+w/Se,_e=le.x-fe/I,K=le.y+Z/I,Ie=((_e-ae)*fe-(K-ue)*Z)/(w*fe-O*Z);ye=ae+w*Ie-ne.x,ce=ue+O*Ie-ne.y;const je=ye*ye+ce*ce;if(je<=2)return new se(ye,ce);T=Math.sqrt(je/2)}else{let Se=!1;w>Number.EPSILON?Z>Number.EPSILON&&(Se=!0):w<-Number.EPSILON?Z<-Number.EPSILON&&(Se=!0):Math.sign(O)===Math.sign(fe)&&(Se=!0),Se?(ye=-O,ce=w,T=Math.sqrt(ge)):(ye=w,ce=O,T=Math.sqrt(ge/2))}return new se(ye/T,ce/T)}const $=[];for(let ne=0,re=E.length,le=re-1,ye=ne+1;ne<re;ne++,le++,ye++)le===re&&(le=0),ye===re&&(ye=0),$[ne]=te(E[ne],E[le],E[ye]);const he=[];let oe,Me=$.concat();for(let ne=0,re=N.length;ne<re;ne++){const le=N[ne];oe=[];for(let ye=0,ce=le.length,T=ce-1,w=ye+1;ye<ce;ye++,T++,w++)T===ce&&(T=0),w===ce&&(w=0),oe[ye]=te(le[ye],le[T],le[w]);he.push(oe),Me=Me.concat(oe)}for(let ne=0;ne<y;ne++){const re=ne/y,le=f*Math.cos(re*Math.PI/2),ye=m*Math.sin(re*Math.PI/2)+v;for(let ce=0,T=E.length;ce<T;ce++){const w=C(E[ce],$[ce],ye);De(w.x,w.y,-le)}for(let ce=0,T=N.length;ce<T;ce++){const w=N[ce];oe=he[ce];for(let O=0,Z=w.length;O<Z;O++){const fe=C(w[O],oe[O],ye);De(fe.x,fe.y,-le)}}}const Ee=m+v;for(let ne=0;ne<b;ne++){const re=d?C(U[ne],Me[ne],Ee):U[ne];A?(F.copy(L.normals[0]).multiplyScalar(re.x),_.copy(L.binormals[0]).multiplyScalar(re.y),D.copy(R[0]).add(F).add(_),De(D.x,D.y,D.z)):De(re.x,re.y,0)}for(let ne=1;ne<=u;ne++)for(let re=0;re<b;re++){const le=d?C(U[re],Me[re],Ee):U[re];A?(F.copy(L.normals[ne]).multiplyScalar(le.x),_.copy(L.binormals[ne]).multiplyScalar(le.y),D.copy(R[ne]).add(F).add(_),De(D.x,D.y,D.z)):De(le.x,le.y,h/u*ne)}for(let ne=y-1;ne>=0;ne--){const re=ne/y,le=f*Math.cos(re*Math.PI/2),ye=m*Math.sin(re*Math.PI/2)+v;for(let ce=0,T=E.length;ce<T;ce++){const w=C(E[ce],$[ce],ye);De(w.x,w.y,h+le)}for(let ce=0,T=N.length;ce<T;ce++){const w=N[ce];oe=he[ce];for(let O=0,Z=w.length;O<Z;O++){const fe=C(w[O],oe[O],ye);A?De(fe.x,fe.y+R[u-1].y,R[u-1].x+le):De(fe.x,fe.y,h+le)}}}j(),He();function j(){const ne=i.length/3;if(d){let re=0,le=b*re;for(let ye=0;ye<V;ye++){const ce=S[ye];be(ce[2]+le,ce[1]+le,ce[0]+le)}re=u+y*2,le=b*re;for(let ye=0;ye<V;ye++){const ce=S[ye];be(ce[0]+le,ce[1]+le,ce[2]+le)}}else{for(let re=0;re<V;re++){const le=S[re];be(le[2],le[1],le[0])}for(let re=0;re<V;re++){const le=S[re];be(le[0]+b*u,le[1]+b*u,le[2]+b*u)}}n.addGroup(ne,i.length/3-ne,0)}function He(){const ne=i.length/3;let re=0;Oe(E,re),re+=E.length;for(let le=0,ye=N.length;le<ye;le++){const ce=N[le];Oe(ce,re),re+=ce.length}n.addGroup(ne,i.length/3-ne,1)}function Oe(ne,re){let le=ne.length;for(;--le>=0;){const ye=le;let ce=le-1;ce<0&&(ce=ne.length-1);for(let T=0,w=u+y*2;T<w;T++){const O=b*T,Z=b*(T+1),fe=re+ye+O,ge=re+ce+O,Ne=re+ce+Z,Se=re+ye+Z;Ge(fe,ge,Ne,Se)}}}function De(ne,re,le){l.push(ne),l.push(re),l.push(le)}function be(ne,re,le){Fe(ne),Fe(re),Fe(le);const ye=i.length/3,ce=p.generateTopUV(n,i,ye-3,ye-2,ye-1);ze(ce[0]),ze(ce[1]),ze(ce[2])}function Ge(ne,re,le,ye){Fe(ne),Fe(re),Fe(ye),Fe(re),Fe(le),Fe(ye);const ce=i.length/3,T=p.generateSideWallUV(n,i,ce-6,ce-3,ce-2,ce-1);ze(T[0]),ze(T[1]),ze(T[3]),ze(T[1]),ze(T[2]),ze(T[3])}function Fe(ne){i.push(l[ne*3+0]),i.push(l[ne*3+1]),i.push(l[ne*3+2])}function ze(ne){s.push(ne.x),s.push(ne.y)}}}toJSON(){const e=Ve.prototype.toJSON.call(this),t=this.parameters.shapes,n=this.parameters.options;return m0(t,n,e)}}const p0={generateTopUV:function(r,e,t,n,i){const s=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],u=e[i*3+1];return[new se(s,a),new se(o,l),new se(c,u)]},generateSideWallUV:function(r,e,t,n,i,s){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],h=e[n*3+2],d=e[i*3],f=e[i*3+1],m=e[i*3+2],v=e[s*3],y=e[s*3+1],g=e[s*3+2];return Math.abs(o-u)<.01?[new se(a,1-l),new se(c,1-h),new se(d,1-m),new se(v,1-g)]:[new se(o,1-l),new se(u,1-h),new se(f,1-m),new se(y,1-g)]}};function m0(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){const s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class g0 extends Ve{constructor(e,t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=At(i,0,Math.PI*2);const s=[],a=[],o=[],l=1/t,c=new M,u=new se;for(let h=0;h<=t;h++){const d=n+h*l*i,f=Math.sin(d),m=Math.cos(d);for(let v=0;v<=e.length-1;v++)c.x=e[v].x*f,c.y=e[v].y,c.z=e[v].x*m,a.push(c.x,c.y,c.z),u.x=h/t,u.y=v/(e.length-1),o.push(u.x,u.y)}for(let h=0;h<t;h++)for(let d=0;d<e.length-1;d++){const f=d+h*e.length,m=f,v=f+e.length,y=f+e.length+1,g=f+1;s.push(m,v,g),s.push(v,y,g)}if(this.setIndex(s),this.setAttribute("position",new $e(a,3)),this.setAttribute("uv",new $e(o,2)),this.computeVertexNormals(),i===Math.PI*2){const h=this.attributes.normal.array,d=new M,f=new M,m=new M,v=t*e.length*3;for(let y=0,g=0;y<e.length;y++,g+=3)d.x=h[g+0],d.y=h[g+1],d.z=h[g+2],f.x=h[v+g+0],f.y=h[v+g+1],f.z=h[v+g+2],m.addVectors(d,f).normalize(),h[g+0]=h[v+g+0]=m.x,h[g+1]=h[v+g+1]=m.y,h[g+2]=h[v+g+2]=m.z}}}class v0 extends Ve{constructor(e,t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],s=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new $e(i,3)),this.setAttribute("normal",new $e(s,3)),this.setAttribute("uv",new $e(a,2));function c(u){const h=i.length/3,d=u.extractPoints(t);let f=d.shape;const m=d.holes;In.isClockWise(f)===!1&&(f=f.reverse());for(let y=0,g=m.length;y<g;y++){const p=m[y];In.isClockWise(p)===!0&&(m[y]=p.reverse())}const v=In.triangulateShape(f,m);for(let y=0,g=m.length;y<g;y++){const p=m[y];f=f.concat(p)}for(let y=0,g=f.length;y<g;y++){const p=f[y];i.push(p.x,p.y,0),s.push(0,0,1),a.push(p.x,p.y)}for(let y=0,g=v.length;y<g;y++){const p=v[y],R=p[0]+h,A=p[1]+h,L=p[2]+h;n.push(R,A,L),l+=3}}}toJSON(){const e=Ve.prototype.toJSON.call(this),t=this.parameters.shapes;return x0(t,e)}}function x0(r,e){if(e.shapes=[],Array.isArray(r))for(let t=0,n=r.length;t<n;t++){const i=r[t];e.shapes.push(i.uuid)}else e.shapes.push(r.uuid);return e}class xs extends Ve{constructor(e=1,t=8,n=6,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new M,d=new M,f=[],m=[],v=[],y=[];for(let g=0;g<=n;g++){const p=[],R=g/n;let A=0;g==0&&a==0?A=.5/t:g==n&&l==Math.PI&&(A=-.5/t);for(let L=0;L<=t;L++){const _=L/t;h.x=-e*Math.cos(i+_*s)*Math.sin(a+R*o),h.y=e*Math.cos(a+R*o),h.z=e*Math.sin(i+_*s)*Math.sin(a+R*o),m.push(h.x,h.y,h.z),d.copy(h).normalize(),v.push(d.x,d.y,d.z),y.push(_+A,1-R),p.push(c++)}u.push(p)}for(let g=0;g<n;g++)for(let p=0;p<t;p++){const R=u[g][p+1],A=u[g][p],L=u[g+1][p],_=u[g+1][p+1];(g!==0||a>0)&&f.push(R,A,_),(g!==n-1||l<Math.PI)&&f.push(A,L,_)}this.setIndex(f),this.setAttribute("position",new $e(m,3)),this.setAttribute("normal",new $e(v,3)),this.setAttribute("uv",new $e(y,2))}}class y0 extends ft{constructor(e){super(),this.type="ShadowMaterial",this.color=new xe(0),this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this}}y0.prototype.isShadowMaterial=!0;class zs extends Zt{constructor(e){super(e),this.type="RawShaderMaterial"}}zs.prototype.isRawShaderMaterial=!0;class Ot extends ft{constructor(e){super(),this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oi,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.flatShading=!1,this.vertexTangents=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.flatShading=e.flatShading,this.vertexTangents=e.vertexTangents,this}}Ot.prototype.isMeshStandardMaterial=!0;class Dc extends Ot{constructor(e){super(),this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.clearcoat=0,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new se(1,1),this.clearcoatNormalMap=null,this.reflectivity=.5,Object.defineProperty(this,"ior",{get:function(){return(1+.4*this.reflectivity)/(1-.4*this.reflectivity)},set:function(t){this.reflectivity=At(2.5*(t-1)/(t+1),0,1)}}),this.sheen=null,this.transmission=0,this.transmissionMap=null,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.reflectivity=e.reflectivity,e.sheen?this.sheen=(this.sheen||new xe).copy(e.sheen):this.sheen=null,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this}}Dc.prototype.isMeshPhysicalMaterial=!0;class _0 extends ft{constructor(e){super(),this.type="MeshPhongMaterial",this.color=new xe(16777215),this.specular=new xe(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oi,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ts,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.flatShading=e.flatShading,this}}_0.prototype.isMeshPhongMaterial=!0;class w0 extends ft{constructor(e){super(),this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new xe(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oi,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this}}w0.prototype.isMeshToonMaterial=!0;class M0 extends ft{constructor(e){super(),this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oi,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.flatShading=e.flatShading,this}}M0.prototype.isMeshNormalMaterial=!0;class b0 extends ft{constructor(e){super(),this.type="MeshLambertMaterial",this.color=new xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ts,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this}}b0.prototype.isMeshLambertMaterial=!0;class S0 extends ft{constructor(e){super(),this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new xe(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Oi,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.flatShading=e.flatShading,this}}S0.prototype.isMeshMatcapMaterial=!0;class T0 extends qi{constructor(e){super(),this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}T0.prototype.isLineDashedMaterial=!0;const nt={arraySlice:function(r,e,t){return nt.isTypedArray(r)?new r.constructor(r.subarray(e,t!==void 0?t:r.length)):r.slice(e,t)},convertArray:function(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)},isTypedArray:function(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)},getKeyframeOrder:function(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n},sortedArray:function(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i},flattenJSON:function(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push.apply(t,a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)},subclip:function(r,e,t,n,i=30){const s=r.clone();s.name=e;const a=[];for(let l=0;l<s.tracks.length;++l){const c=s.tracks[l],u=c.getValueSize(),h=[],d=[];for(let f=0;f<c.times.length;++f){const m=c.times[f]*i;if(!(m<t||m>=n)){h.push(c.times[f]);for(let v=0;v<u;++v)d.push(c.values[f*u+v])}}h.length!==0&&(c.times=nt.convertArray(h,c.times.constructor),c.values=nt.convertArray(d,c.values.constructor),a.push(c))}s.tracks=a;let o=1/0;for(let l=0;l<s.tracks.length;++l)o>s.tracks[l].times[0]&&(o=s.tracks[l].times[0]);for(let l=0;l<s.tracks.length;++l)s.tracks[l].shift(-1*o);return s.resetDuration(),s},makeClipAdditive:function(r,e=0,t=r,n=30){n<=0&&(n=30);const i=t.tracks.length,s=e/n;for(let a=0;a<i;++a){const o=t.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;const c=r.tracks.find(function(g){return g.name===o.name&&g.ValueTypeName===l});if(c===void 0)continue;let u=0;const h=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=h/3);let d=0;const f=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(d=f/3);const m=o.times.length-1;let v;if(s<=o.times[0]){const g=u,p=h-u;v=nt.arraySlice(o.values,g,p)}else if(s>=o.times[m]){const g=m*h+u,p=g+h-u;v=nt.arraySlice(o.values,g,p)}else{const g=o.createInterpolant(),p=u,R=h-u;g.evaluate(s),v=nt.arraySlice(g.resultBuffer,p,R)}l==="quaternion"&&new St().fromArray(v).normalize().conjugate().toArray(v);const y=c.times.length;for(let g=0;g<y;++g){const p=g*f+d;if(l==="quaternion")St.multiplyQuaternionsFlat(c.values,p,v,0,c.values,p);else{const R=f-d*2;for(let A=0;A<R;++A)c.values[p+A]-=v[A]}}}return r.blendMode=ec,r}};class Bn{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,e,s)}if(n===o)break;if(s=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,i);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,i);if(i===void 0)return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,s,e)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}Bn.prototype.beforeStart_=Bn.prototype.copySampleValue_;Bn.prototype.afterEnd_=Bn.prototype.copySampleValue_;class E0 extends Bn{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Si,endingEnd:Si}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ti:s=e,o=2*t-n;break;case gs:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ti:a=e,l=2*n-t;break;case gs:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*u,this._offsetNext=a*u}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(i-t),v=m*m,y=v*m,g=-d*y+2*d*v-d*m,p=(1+d)*y+(-1.5-2*d)*v+(-.5+d)*m+1,R=(-1-f)*y+(1.5+f)*v+.5*m,A=f*y-f*v;for(let L=0;L!==o;++L)s[L]=g*a[u+L]+p*a[c+L]+R*a[l+L]+A*a[h+L];return s}}class Ic extends Bn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(i-t),h=1-u;for(let d=0;d!==o;++d)s[d]=a[c+d]*h+a[l+d]*u;return s}}class A0 extends Bn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class on{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=nt.convertArray(t,this.TimeBufferType),this.values=nt.convertArray(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:nt.convertArray(e.times,Array),values:nt.convertArray(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new A0(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ic(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new E0(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ps:t=this.InterpolantFactoryMethodDiscrete;break;case ms:t=this.InterpolantFactoryMethodLinear;break;case qs:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ps;case this.InterpolantFactoryMethodLinear:return ms;case this.InterpolantFactoryMethodSmooth:return qs}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=nt.arraySlice(n,s,a),this.values=nt.arraySlice(this.values,s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&nt.isTypedArray(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=nt.arraySlice(this.times),t=nt.arraySlice(this.values),n=this.getValueSize(),i=this.getInterpolation()===qs,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(i)l=!0;else{const h=o*n,d=h-n,f=h+n;for(let m=0;m!==n;++m){const v=t[h+m];if(v!==t[d+m]||v!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const h=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=nt.arraySlice(e,0,a),this.values=nt.arraySlice(t,0,a*n)):(this.times=e,this.values=t),this}clone(){const e=nt.arraySlice(this.times,0),t=nt.arraySlice(this.values,0),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}on.prototype.TimeBufferType=Float32Array;on.prototype.ValueBufferType=Float32Array;on.prototype.DefaultInterpolation=ms;class Xi extends on{}Xi.prototype.ValueTypeName="bool";Xi.prototype.ValueBufferType=Array;Xi.prototype.DefaultInterpolation=ps;Xi.prototype.InterpolantFactoryMethodLinear=void 0;Xi.prototype.InterpolantFactoryMethodSmooth=void 0;class Fc extends on{}Fc.prototype.ValueTypeName="color";class ys extends on{}ys.prototype.ValueTypeName="number";class L0 extends Bn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let u=c+o;c!==u;c+=4)St.slerpFlat(s,0,a,c-o,a,c,l);return s}}class wr extends on{InterpolantFactoryMethodLinear(e){return new L0(this.times,this.values,this.getValueSize(),e)}}wr.prototype.ValueTypeName="quaternion";wr.prototype.DefaultInterpolation=ms;wr.prototype.InterpolantFactoryMethodSmooth=void 0;class Yi extends on{}Yi.prototype.ValueTypeName="string";Yi.prototype.ValueBufferType=Array;Yi.prototype.DefaultInterpolation=ps;Yi.prototype.InterpolantFactoryMethodLinear=void 0;Yi.prototype.InterpolantFactoryMethodSmooth=void 0;class _s extends on{}_s.prototype.ValueTypeName="vector";class Pl{constructor(e,t=-1,n,i=Za){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=rn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(R0(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,a=n.length;s!==a;++s)t.push(on.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const u=nt.getKeyframeOrder(l);l=nt.sortedArray(l,1,u),c=nt.sortedArray(c,1,u),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new ys(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],u=c.name.match(s);if(u&&u.length>1){const h=u[1];let d=i[h];d||(i[h]=d=[]),d.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(h,d,f,m,v){if(f.length!==0){const y=[],g=[];nt.flattenJSON(f,y,g,m),y.length!==0&&v.push(new h(d,y,g))}},i=[],s=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let h=0;h<c.length;h++){const d=c[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let m;for(m=0;m<d.length;m++)if(d[m].morphTargets)for(let v=0;v<d[m].morphTargets.length;v++)f[d[m].morphTargets[v]]=-1;for(const v in f){const y=[],g=[];for(let p=0;p!==d[m].morphTargets.length;++p){const R=d[m];y.push(R.time),g.push(R.morphTarget===v?1:0)}i.push(new ys(".morphTargetInfluence["+v+"]",y,g))}l=f.length*a}else{const f=".bones["+t[h].name+"]";n(_s,f+".position",d,"pos",i),n(wr,f+".quaternion",d,"rot",i),n(_s,f+".scale",d,"scl",i)}}return i.length===0?null:new this(s,l,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function C0(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ys;case"vector":case"vector2":case"vector3":case"vector4":return _s;case"color":return Fc;case"quaternion":return wr;case"bool":case"boolean":return Xi;case"string":return Yi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function R0(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=C0(r.type);if(r.times===void 0){const t=[],n=[];nt.flattenJSON(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const Ii={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class P0{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,s===!1&&i.onStart!==void 0&&i.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,i.onProgress!==void 0&&i.onProgress(u,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){const f=c[h],m=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null}}}const D0=new P0;class Hn{constructor(e){this.manager=e!==void 0?e:D0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}const Xt={};class I0 extends Hn{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Ii.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;if(Xt[e]!==void 0){Xt[e].push({onLoad:t,onProgress:n,onError:i});return}const o=/^data:(.*?)(;base64)?,(.*)$/,l=e.match(o);let c;if(l){const u=l[1],h=!!l[2];let d=l[3];d=decodeURIComponent(d),h&&(d=atob(d));try{let f;const m=(this.responseType||"").toLowerCase();switch(m){case"arraybuffer":case"blob":const v=new Uint8Array(d.length);for(let g=0;g<d.length;g++)v[g]=d.charCodeAt(g);m==="blob"?f=new Blob([v.buffer],{type:u}):f=v.buffer;break;case"document":f=new DOMParser().parseFromString(d,u);break;case"json":f=JSON.parse(d);break;default:f=d;break}setTimeout(function(){t&&t(f),s.manager.itemEnd(e)},0)}catch(f){setTimeout(function(){i&&i(f),s.manager.itemError(e),s.manager.itemEnd(e)},0)}}else{Xt[e]=[],Xt[e].push({onLoad:t,onProgress:n,onError:i}),c=new XMLHttpRequest,c.open("GET",e,!0),c.addEventListener("load",function(u){const h=this.response,d=Xt[e];if(delete Xt[e],this.status===200||this.status===0){this.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),Ii.add(e,h);for(let f=0,m=d.length;f<m;f++){const v=d[f];v.onLoad&&v.onLoad(h)}s.manager.itemEnd(e)}else{for(let f=0,m=d.length;f<m;f++){const v=d[f];v.onError&&v.onError(u)}s.manager.itemError(e),s.manager.itemEnd(e)}},!1),c.addEventListener("progress",function(u){const h=Xt[e];for(let d=0,f=h.length;d<f;d++){const m=h[d];m.onProgress&&m.onProgress(u)}},!1),c.addEventListener("error",function(u){const h=Xt[e];delete Xt[e];for(let d=0,f=h.length;d<f;d++){const m=h[d];m.onError&&m.onError(u)}s.manager.itemError(e),s.manager.itemEnd(e)},!1),c.addEventListener("abort",function(u){const h=Xt[e];delete Xt[e];for(let d=0,f=h.length;d<f;d++){const m=h[d];m.onError&&m.onError(u)}s.manager.itemError(e),s.manager.itemEnd(e)},!1),this.responseType!==void 0&&(c.responseType=this.responseType),this.withCredentials!==void 0&&(c.withCredentials=this.withCredentials),c.overrideMimeType&&c.overrideMimeType(this.mimeType!==void 0?this.mimeType:"text/plain");for(const u in this.requestHeader)c.setRequestHeader(u,this.requestHeader[u]);c.send(null)}return s.manager.itemStart(e),c}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Nc extends Hn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Ii.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=document.createElementNS("http://www.w3.org/1999/xhtml","img");function l(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1),Ii.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(u){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1),i&&i(u),s.manager.itemError(e),s.manager.itemEnd(e)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.substr(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class F0 extends Hn{constructor(e){super(e)}load(e,t,n,i){const s=new Cs,a=new Nc(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(e[c],function(u){s.images[c]=u,o++,o===6&&(s.needsUpdate=!0,t&&t(s))},void 0,i)}for(let c=0;c<e.length;++c)l(c);return s}}class zc extends Hn{constructor(e){super(e)}load(e,t,n,i){const s=new _t,a=new Nc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o;const l=e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0;s.format=l?Zn:Ft,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Ht{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(s-1);const u=n[i],d=n[i+1]-u,f=(a-u)/d;return(i+f)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const a=this.getPoint(i),o=this.getPoint(s),l=t||(a.isVector2?new se:new M);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new M,i=[],s=[],a=[],o=new M,l=new Re;for(let f=0;f<=e;f++){const m=f/e;i[f]=this.getTangentAt(m,new M),i[f].normalize()}s[0]=new M,a[0]=new M;let c=Number.MAX_VALUE;const u=Math.abs(i[0].x),h=Math.abs(i[0].y),d=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(At(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,m))}a[f].crossVectors(i[f],s[f])}if(t===!0){let f=Math.acos(At(s[0].dot(s[e]),-1,1));f/=e,i[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(i[m],f*m)),a[m].crossVectors(i[m],s[m])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.5,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Bs extends Ht{constructor(e=0,t=0,n=1,i=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t){const n=t||new se,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(a?s=0:s=i),this.aClockwise===!0&&!a&&(s===i?s=-i:s=s-i);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}Bs.prototype.isEllipseCurve=!0;class Bc extends Bs{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a),this.type="ArcCurve"}}Bc.prototype.isArcCurve=!0;function no(){let r=0,e=0,t=0,n=0;function i(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){i(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,u,h){let d=(a-s)/c-(o-s)/(c+u)+(o-a)/u,f=(o-a)/u-(l-a)/(u+h)+(l-o)/h;d*=u,f*=u,i(a,o,d,f)},calc:function(s){const a=s*s,o=a*s;return r+e*s+t*a+n*o}}}const Kr=new M,Ma=new no,ba=new no,Sa=new no;class kc extends Ht{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new M){const n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,u;this.closed||o>0?c=i[(o-1)%s]:(Kr.subVectors(i[0],i[1]).add(i[0]),c=Kr);const h=i[o%s],d=i[(o+1)%s];if(this.closed||o+2<s?u=i[(o+2)%s]:(Kr.subVectors(i[s-1],i[s-2]).add(i[s-1]),u=Kr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(h),f),v=Math.pow(h.distanceToSquared(d),f),y=Math.pow(d.distanceToSquared(u),f);v<1e-4&&(v=1),m<1e-4&&(m=v),y<1e-4&&(y=v),Ma.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,m,v,y),ba.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,m,v,y),Sa.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,m,v,y)}else this.curveType==="catmullrom"&&(Ma.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),ba.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),Sa.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(Ma.calc(l),ba.calc(l),Sa.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new M().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}kc.prototype.isCatmullRomCurve3=!0;function Dl(r,e,t,n,i){const s=(n-e)*.5,a=(i-t)*.5,o=r*r,l=r*o;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*o+s*r+t}function N0(r,e){const t=1-r;return t*t*e}function z0(r,e){return 2*(1-r)*r*e}function B0(r,e){return r*r*e}function hr(r,e,t,n){return N0(r,e)+z0(r,t)+B0(r,n)}function k0(r,e){const t=1-r;return t*t*t*e}function O0(r,e){const t=1-r;return 3*t*t*r*e}function H0(r,e){return 3*(1-r)*r*r*e}function G0(r,e){return r*r*r*e}function dr(r,e,t,n,i){return k0(r,e)+O0(r,t)+H0(r,n)+G0(r,i)}class io extends Ht{constructor(e=new se,t=new se,n=new se,i=new se){super(),this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new se){const n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(dr(e,i.x,s.x,a.x,o.x),dr(e,i.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}io.prototype.isCubicBezierCurve=!0;class Oc extends Ht{constructor(e=new M,t=new M,n=new M,i=new M){super(),this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new M){const n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(dr(e,i.x,s.x,a.x,o.x),dr(e,i.y,s.y,a.y,o.y),dr(e,i.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}Oc.prototype.isCubicBezierCurve3=!0;class ks extends Ht{constructor(e=new se,t=new se){super(),this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t){const n=t||new se;return n.copy(this.v2).sub(this.v1).normalize(),n}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}ks.prototype.isLineCurve=!0;class U0 extends Ht{constructor(e=new M,t=new M){super(),this.type="LineCurve3",this.isLineCurve3=!0,this.v1=e,this.v2=t}getPoint(e,t=new M){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ro extends Ht{constructor(e=new se,t=new se,n=new se){super(),this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new se){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(hr(e,i.x,s.x,a.x),hr(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}ro.prototype.isQuadraticBezierCurve=!0;class Hc extends Ht{constructor(e=new M,t=new M,n=new M){super(),this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new M){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(hr(e,i.x,s.x,a.x),hr(e,i.y,s.y,a.y),hr(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}Hc.prototype.isQuadraticBezierCurve3=!0;class so extends Ht{constructor(e=[]){super(),this.type="SplineCurve",this.points=e}getPoint(e,t=new se){const n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),o=s-a,l=i[a===0?a:a-1],c=i[a],u=i[a>i.length-2?i.length-1:a+1],h=i[a>i.length-3?i.length-1:a+2];return n.set(Dl(o,l.x,c.x,u.x,h.x),Dl(o,l.y,c.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new se().fromArray(i))}return this}}so.prototype.isSplineCurve=!0;var V0=Object.freeze({__proto__:null,ArcCurve:Bc,CatmullRomCurve3:kc,CubicBezierCurve:io,CubicBezierCurve3:Oc,EllipseCurve:Bs,LineCurve:ks,LineCurve3:U0,QuadraticBezierCurve:ro,QuadraticBezierCurve3:Hc,SplineCurve:so});class W0 extends Ht{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);e.equals(t)||this.curves.push(new ks(t,e))}getPoint(e){const t=e*this.getLength(),n=this.getCurveLengths();let i=0;for(;i<n.length;){if(n[i]>=t){const s=n[i]-t,a=this.curves[i],o=a.getLength(),l=o===0?0:1-s/o;return a.getPointAt(l)}i++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const a=s[i],o=a&&a.isEllipseCurve?e*2:a&&(a.isLineCurve||a.isLineCurve3)?1:a&&a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new V0[i.type]().fromJSON(i))}return this}}class Ba extends W0{constructor(e){super(),this.type="Path",this.currentPoint=new se,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new ks(this.currentPoint.clone(),new se(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const s=new ro(this.currentPoint.clone(),new se(e,t),new se(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){const o=new io(this.currentPoint.clone(),new se(e,t),new se(n,i),new se(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new so(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,i,s,a,o,l),this}absellipse(e,t,n,i,s,a,o,l){const c=new Bs(e,t,n,i,s,a,o,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class ao extends Ba{constructor(e){super(e),this.uuid=rn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new Ba().fromJSON(i))}return this}}class sn extends Je{constructor(e,t=1){super(),this.type="Light",this.color=new xe(e),this.intensity=t}dispose(){}copy(e){return super.copy(e),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}sn.prototype.isLight=!0;class Gc extends sn{constructor(e,t,n){super(e,n),this.type="HemisphereLight",this.position.copy(Je.DefaultUp),this.updateMatrix(),this.groundColor=new xe(t)}copy(e){return sn.prototype.copy.call(this,e),this.groundColor.copy(e.groundColor),this}}Gc.prototype.isHemisphereLight=!0;const Il=new Re,Fl=new M,Nl=new M;class oo{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.mapSize=new se(512,512),this.map=null,this.mapPass=null,this.matrix=new Re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Rs,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Fl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fl),Nl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nl),t.updateMatrixWorld(),Il.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Il),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(t.projectionMatrix),n.multiply(t.matrixWorldInverse)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Uc extends oo{constructor(){super(new bt(50,1,.5,500)),this.focus=1}updateMatrices(e){const t=this.camera,n=Da*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}Uc.prototype.isSpotLightShadow=!0;class q0 extends sn{constructor(e,t,n=0,i=Math.PI/3,s=0,a=1){super(e,t),this.type="SpotLight",this.position.copy(Je.DefaultUp),this.updateMatrix(),this.target=new Je,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.shadow=new Uc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}q0.prototype.isSpotLight=!0;const zl=new Re,sr=new M,Ta=new M;class Vc extends oo{constructor(){super(new bt(90,1,.5,500)),this._frameExtents=new se(4,2),this._viewportCount=6,this._viewports=[new qe(2,1,1,1),new qe(0,1,1,1),new qe(3,1,1,1),new qe(1,1,1,1),new qe(3,0,1,1),new qe(1,0,1,1)],this._cubeDirections=[new M(1,0,0),new M(-1,0,0),new M(0,0,1),new M(0,0,-1),new M(0,1,0),new M(0,-1,0)],this._cubeUps=[new M(0,1,0),new M(0,1,0),new M(0,1,0),new M(0,1,0),new M(0,0,1),new M(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),sr.setFromMatrixPosition(e.matrixWorld),n.position.copy(sr),Ta.copy(n.position),Ta.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ta),n.updateMatrixWorld(),i.makeTranslation(-sr.x,-sr.y,-sr.z),zl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zl)}}Vc.prototype.isPointLightShadow=!0;class X0 extends sn{constructor(e,t,n=0,i=1){super(e,t),this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Vc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}X0.prototype.isPointLight=!0;class lo extends $a{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}lo.prototype.isOrthographicCamera=!0;class Wc extends oo{constructor(){super(new lo(-5,5,5,-5,.5,500))}}Wc.prototype.isDirectionalLightShadow=!0;class qc extends sn{constructor(e,t){super(e,t),this.type="DirectionalLight",this.position.copy(Je.DefaultUp),this.updateMatrix(),this.target=new Je,this.shadow=new Wc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}qc.prototype.isDirectionalLight=!0;class Y0 extends sn{constructor(e,t){super(e,t),this.type="AmbientLight"}}Y0.prototype.isAmbientLight=!0;class j0 extends sn{constructor(e,t,n=10,i=10){super(e,t),this.type="RectAreaLight",this.width=n,this.height=i}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}j0.prototype.isRectAreaLight=!0;class Xc{constructor(){this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new M)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,s=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*i),t.addScaledVector(a[2],.488603*s),t.addScaledVector(a[3],.488603*n),t.addScaledVector(a[4],1.092548*(n*i)),t.addScaledVector(a[5],1.092548*(i*s)),t.addScaledVector(a[6],.315392*(3*s*s-1)),t.addScaledVector(a[7],1.092548*(n*s)),t.addScaledVector(a[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,s=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],2*.511664*i),t.addScaledVector(a[2],2*.511664*s),t.addScaledVector(a[3],2*.511664*n),t.addScaledVector(a[4],2*.429043*n*i),t.addScaledVector(a[5],2*.429043*i*s),t.addScaledVector(a[6],.743125*s*s-.247708),t.addScaledVector(a[7],2*.429043*n*s),t.addScaledVector(a[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,s=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*s,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*s,t[6]=.315392*(3*s*s-1),t[7]=1.092548*n*s,t[8]=.546274*(n*n-i*i)}}Xc.prototype.isSphericalHarmonics3=!0;class co extends sn{constructor(e=new Xc,t=1){super(void 0,t),this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}co.prototype.isLightProbe=!0;class Z0{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.substr(0,t+1)}}class J0 extends Ve{constructor(){super(),this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}clone(){return new this.constructor().copy(this)}toJSON(){const e=super.toJSON(this);return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}J0.prototype.isInstancedBufferGeometry=!0;class Q0 extends Ze{constructor(e,t,n,i){typeof n=="number"&&(i=n,n=!1,console.error("THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.")),super(e,t,n),this.meshPerAttribute=i||1}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}Q0.prototype.isInstancedBufferAttribute=!0;class $0 extends Hn{constructor(e){super(e),typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Ii.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){Ii.add(e,l),t&&t(l),s.manager.itemEnd(e)}).catch(function(l){i&&i(l),s.manager.itemError(e),s.manager.itemEnd(e)}),s.manager.itemStart(e)}}$0.prototype.isImageBitmapLoader=!0;let es;const K0={getContext:function(){return es===void 0&&(es=new(window.AudioContext||window.webkitAudioContext)),es},setContext:function(r){es=r}};class ev extends Hn{constructor(e){super(e)}load(e,t,n,i){const s=this,a=new I0(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(o){try{const l=o.slice(0);K0.getContext().decodeAudioData(l,function(u){t(u)})}catch(l){i?i(l):console.error(l),s.manager.itemError(e)}},n,i)}}class tv extends co{constructor(e,t,n=1){super(void 0,n);const i=new xe().set(e),s=new xe().set(t),a=new M(i.r,i.g,i.b),o=new M(s.r,s.g,s.b),l=Math.sqrt(Math.PI),c=l*Math.sqrt(.75);this.sh.coefficients[0].copy(a).add(o).multiplyScalar(l),this.sh.coefficients[1].copy(a).sub(o).multiplyScalar(c)}}tv.prototype.isHemisphereLightProbe=!0;class nv extends co{constructor(e,t=1){super(void 0,t);const n=new xe().set(e);this.sh.coefficients[0].set(n.r,n.g,n.b).multiplyScalar(2*Math.sqrt(Math.PI))}}nv.prototype.isAmbientLightProbe=!0;class iv extends Je{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source.stop(),this.source.onended=null,this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){if(this.detune=e,this.source.detune!==void 0)return this.isPlaying===!0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}}class rv{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,a;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,s=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[s+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,s,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-s,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,a=i;s!==a;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let a=0;a!==s;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){St.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){const a=this._workIndex*s;St.multiplyQuaternionsFlat(e,a,e,t,e,n),St.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,s){const a=1-i;for(let o=0;o!==s;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,s){for(let a=0;a!==s;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const uo="\\[\\]\\.:\\/",sv=new RegExp("["+uo+"]","g"),ho="[^"+uo+"]",av="[^"+uo.replace("\\.","")+"]",ov=/((?:WC+[\/:])*)/.source.replace("WC",ho),lv=/(WCOD+)?/.source.replace("WCOD",av),cv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ho),uv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ho),hv=new RegExp("^"+ov+lv+cv+uv+"$"),dv=["material","materials","bones"];class fv{constructor(e,t,n){const i=n||Qe.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Qe{constructor(e,t,n){this.path=t,this.parsedPath=n||Qe.parseTrackName(t),this.node=Qe.findNode(e,this.parsedPath.nodeName)||e,this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Qe.Composite(e,t,n):new Qe(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(sv,"")}static parseTrackName(e){const t=hv.exec(e);if(!t)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);dv.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(!t||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.node[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=Qe.findNode(this.rootNode,t.nodeName)||this.rootNode,this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.error("THREE.PropertyBinding: Trying to update node for track: "+this.path+" but it wasn't found.");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(e.geometry.isBufferGeometry){if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}else{console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences on THREE.Geometry. Use THREE.BufferGeometry instead.",this);return}}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Qe.Composite=fv;Qe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Qe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Qe.prototype.GetterByBindingType=[Qe.prototype._getValue_direct,Qe.prototype._getValue_array,Qe.prototype._getValue_arrayElement,Qe.prototype._getValue_toArray];Qe.prototype.SetterByBindingTypeAndVersioning=[[Qe.prototype._setValue_direct,Qe.prototype._setValue_direct_setNeedsUpdate,Qe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Qe.prototype._setValue_array,Qe.prototype._setValue_array_setNeedsUpdate,Qe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Qe.prototype._setValue_arrayElement,Qe.prototype._setValue_arrayElement_setNeedsUpdate,Qe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Qe.prototype._setValue_fromArray,Qe.prototype._setValue_fromArray_setNeedsUpdate,Qe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class pv{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const s=t.tracks,a=s.length,o=new Array(a),l={endingStart:Si,endingEnd:Si};for(let c=0;c!==a;++c){const u=s[c].createInterpolant(null);o[c]=u,u.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=nd,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){const i=this._clip.duration,s=e._clip.duration,a=s/i,o=i/s;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,s=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=s,l[1]=s+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const l=(e-s)*n;if(l<0||n===0)return;this._startTime=null,t=n*l}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case ec:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(a),c[u].accumulateAdditive(o);break;case Za:default:for(let u=0,h=l.length;u!==h;++u)l[u].evaluate(a),c[u].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,s=this._loopCount;const a=n===id;if(e===0)return s===-1?i:a&&(s&1)===1?t-i:i;if(n===td){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,s+=Math.abs(o);const l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=i;if(a&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=Ti,i.endingEnd=Ti):(e?i.endingStart=this.zeroSlopeAtStart?Ti:Si:i.endingStart=gs,t?i.endingEnd=this.zeroSlopeAtEnd?Ti:Si:i.endingEnd=gs)}_scheduleFading(e,t,n){const i=this._mixer,s=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=s,l[0]=t,o[1]=s+e,l[1]=n,this}}class mv extends $n{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let u=c[l];u===void 0&&(u={},c[l]=u);for(let h=0;h!==s;++h){const d=i[h],f=d.name;let m=u[f];if(m!==void 0)a[h]=m;else{if(m=a[h],m!==void 0){m._cacheIndex===null&&(++m.referenceCount,this._addInactiveBinding(m,l,f));continue}const v=t&&t._propertyBindings[h].binding.parsedPath;m=new rv(Qe.create(n,f,v),d.ValueTypeName,d.getValueSize()),++m.referenceCount,this._addInactiveBinding(m,l,f),a[h]=m}o[h].resultBuffer=m.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,s=this._actionsByClip;let a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,a=this._actionsByClip,o=a[s],l=o.knownActions,c=l[l.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,l[u]=c,l.pop(),e._byClipCacheIndex=null;const h=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete h[d],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,s=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[s],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Ic(new Float32Array(2),new Float32Array(2),1,this._controlInterpolantsResultBuffer),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){const i=t||this._root,s=i.uuid;let a=typeof e=="string"?Pl.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Za),l!==void 0){const h=l.actionByRoot[s];if(h!==void 0&&h.blendMode===n)return h;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const u=new pv(this,a,t,n);return this._bindAction(u,c),this._addInactiveAction(u,o,s),u}existingAction(e,t){const n=t||this._root,i=n.uuid,s=typeof e=="string"?Pl.findByName(n,e):e,a=s?s.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){const a=s.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const u=c._cacheIndex,h=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(const a in s){const o=s[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}mv.prototype._controlInterpolantsResultBuffer=new Float32Array(1);class gv extends Kn{constructor(e,t,n=1){super(e,t),this.meshPerAttribute=n||1}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}gv.prototype.isInstancedInterleavedBuffer=!0;class vv extends Je{constructor(e){super(),this.material=e,this.render=function(){},this.hasPositions=!1,this.hasNormals=!1,this.hasColors=!1,this.hasUvs=!1,this.positionArray=null,this.normalArray=null,this.colorArray=null,this.uvArray=null,this.count=0}}vv.prototype.isImmediateRenderObject=!0;const Ln=new M,ts=new Re,Ea=new Re;class xv extends to{constructor(e){const t=Yc(e),n=new Ve,i=[],s=[],a=new xe(0,0,1),o=new xe(0,1,0);for(let c=0;c<t.length;c++){const u=t[c];u.parent&&u.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(a.r,a.g,a.b),s.push(o.r,o.g,o.b))}n.setAttribute("position",new $e(i,3)),n.setAttribute("color",new $e(s,3));const l=new qi({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,l),this.type="SkeletonHelper",this.isSkeletonHelper=!0,this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");Ea.copy(this.root.matrixWorld).invert();for(let s=0,a=0;s<t.length;s++){const o=t[s];o.parent&&o.parent.isBone&&(ts.multiplyMatrices(Ea,o.matrixWorld),Ln.setFromMatrixPosition(ts),i.setXYZ(a,Ln.x,Ln.y,Ln.z),ts.multiplyMatrices(Ea,o.parent.matrixWorld),Ln.setFromMatrixPosition(ts),i.setXYZ(a+1,Ln.x,Ln.y,Ln.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}}function Yc(r){const e=[];r&&r.isBone&&e.push(r);for(let t=0;t<r.children.length;t++)e.push.apply(e,Yc(r.children[t]));return e}class yv extends to{constructor(e=10,t=10,n=4473924,i=8947848){n=new xe(n),i=new xe(i);const s=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,m=-o;d<=t;d++,m+=a){l.push(-o,0,m,o,0,m),l.push(m,0,-o,m,0,o);const v=d===s?n:i;v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3}const u=new Ve;u.setAttribute("position",new $e(l,3)),u.setAttribute("color",new $e(c,3));const h=new qi({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}}const _v=new Float32Array(1);new Int32Array(_v.buffer);const Ci=4,Fn=8,Kt=Math.pow(2,Fn),jc=[.125,.215,.35,.446,.526,.582],Zc=Fn-Ci+1+jc.length,xi=20,nn={[Ct]:0,[ki]:1,[Qa]:2,[tc]:3,[nc]:4,[ic]:5,[Ja]:6},qn=new As({side:lt,depthWrite:!1,depthTest:!1}),wv=new Ye(new Ls,qn),Aa=new lo,{_lodPlanes:ar,_sizeLods:Bl,_sigmas:ns}=Sv(),kl=new xe;let La=null;const Xn=(1+Math.sqrt(5))/2,yi=1/Xn,Ol=[new M(1,1,1),new M(-1,1,1),new M(1,1,-1),new M(-1,1,-1),new M(0,Xn,yi),new M(0,Xn,-yi),new M(yi,0,Xn),new M(-yi,0,Xn),new M(Xn,yi,0),new M(-Xn,yi,0)];function Hl(r){const e=Math.max(r.r,r.g,r.b),t=Math.min(Math.max(Math.ceil(Math.log2(e)),-128),127);return r.multiplyScalar(Math.pow(2,-t)),(t+128)/255}class Mv{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._blurMaterial=Tv(xi),this._equirectShader=null,this._cubemapShader=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){La=this._renderer.getRenderTarget();const s=this._allocateTargets();return this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e){return this._fromTexture(e)}fromCubemap(e){return this._fromTexture(e)}compileCubemapShader(){this._cubemapShader===null&&(this._cubemapShader=Vl(),this._compileMaterial(this._cubemapShader))}compileEquirectangularShader(){this._equirectShader===null&&(this._equirectShader=Ul(),this._compileMaterial(this._equirectShader))}dispose(){this._blurMaterial.dispose(),this._cubemapShader!==null&&this._cubemapShader.dispose(),this._equirectShader!==null&&this._equirectShader.dispose();for(let e=0;e<ar.length;e++)ar[e].dispose()}_cleanup(e){this._pingPongRenderTarget.dispose(),this._renderer.setRenderTarget(La),e.scissorTest=!1,is(e,0,0,e.width,e.height)}_fromTexture(e){La=this._renderer.getRenderTarget();const t=this._allocateTargets(e);return this._textureToCubeUV(e,t),this._applyPMREM(t),this._cleanup(t),t}_allocateTargets(e){const t={magFilter:dt,minFilter:dt,generateMipmaps:!1,type:_r,format:xh,encoding:bv(e)?e.encoding:Qa,depthBuffer:!1},n=Gl(t);return n.depthBuffer=!e,this._pingPongRenderTarget=Gl(t),n}_compileMaterial(e){const t=new Ye(ar[0],e);this._renderer.compile(t,Aa)}_sceneToCubeUV(e,t,n,i){const o=new bt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.outputEncoding,f=u.toneMapping;u.getClearColor(kl),u.toneMapping=Ai,u.outputEncoding=Ct,u.autoClear=!1;let m=!1;const v=e.background;if(v){if(v.isColor){qn.color.copy(v).convertSRGBToLinear(),e.background=null;const y=Hl(qn.color);qn.opacity=y,m=!0}}else{qn.color.copy(kl).convertSRGBToLinear();const y=Hl(qn.color);qn.opacity=y,m=!0}for(let y=0;y<6;y++){const g=y%3;g==0?(o.up.set(0,l[y],0),o.lookAt(c[y],0,0)):g==1?(o.up.set(0,0,l[y]),o.lookAt(0,c[y],0)):(o.up.set(0,l[y],0),o.lookAt(0,0,c[y])),is(i,g*Kt,y>2?Kt:0,Kt,Kt),u.setRenderTarget(i),m&&u.render(wv,o),u.render(e,o)}u.toneMapping=f,u.outputEncoding=d,u.autoClear=h}_textureToCubeUV(e,t){const n=this._renderer;e.isCubeTexture?this._cubemapShader==null&&(this._cubemapShader=Vl()):this._equirectShader==null&&(this._equirectShader=Ul());const i=e.isCubeTexture?this._cubemapShader:this._equirectShader,s=new Ye(ar[0],i),a=i.uniforms;a.envMap.value=e,e.isCubeTexture||a.texelSize.value.set(1/e.image.width,1/e.image.height),a.inputEncoding.value=nn[e.encoding],a.outputEncoding.value=nn[t.texture.encoding],is(t,0,0,3*Kt,2*Kt),n.setRenderTarget(t),n.render(s,Aa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<Zc;i++){const s=Math.sqrt(ns[i]*ns[i]-ns[i-1]*ns[i-1]),a=Ol[(i-1)%Ol.length];this._blur(e,i-1,i,s,a)}t.autoClear=n}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Ye(ar[i],c),d=c.uniforms,f=Bl[n]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*xi-1),v=s/m,y=isFinite(s)?1+Math.floor(u*v):xi;y>xi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${xi}`);const g=[];let p=0;for(let _=0;_<xi;++_){const F=_/v,D=Math.exp(-F*F/2);g.push(D),_==0?p+=D:_<y&&(p+=2*D)}for(let _=0;_<g.length;_++)g[_]=g[_]/p;d.envMap.value=e.texture,d.samples.value=y,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o),d.dTheta.value=m,d.mipInt.value=Fn-n,d.inputEncoding.value=nn[e.texture.encoding],d.outputEncoding.value=nn[e.texture.encoding];const R=Bl[i],A=3*Math.max(0,Kt-2*R),L=(i===0?0:2*Kt)+2*R*(i>Fn-Ci?i-Fn+Ci:0);is(t,A,L,3*R,2*R),l.setRenderTarget(t),l.render(h,Aa)}}function bv(r){return r===void 0||r.type!==_r?!1:r.encoding===Ct||r.encoding===ki||r.encoding===Ja}function Sv(){const r=[],e=[],t=[];let n=Fn;for(let i=0;i<Zc;i++){const s=Math.pow(2,n);e.push(s);let a=1/s;i>Fn-Ci?a=jc[i-Fn+Ci-1]:i==0&&(a=0),t.push(a);const o=1/(s-1),l=-o/2,c=1+o/2,u=[l,l,c,l,c,c,l,l,c,c,l,c],h=6,d=6,f=3,m=2,v=1,y=new Float32Array(f*d*h),g=new Float32Array(m*d*h),p=new Float32Array(v*d*h);for(let A=0;A<h;A++){const L=A%3*2/3-1,_=A>2?0:-1,F=[L,_,0,L+2/3,_,0,L+2/3,_+1,0,L,_,0,L+2/3,_+1,0,L,_+1,0];y.set(F,f*d*A),g.set(u,m*d*A);const D=[A,A,A,A,A,A];p.set(D,v*d*A)}const R=new Ve;R.setAttribute("position",new Ze(y,f)),R.setAttribute("uv",new Ze(g,m)),R.setAttribute("faceIndex",new Ze(p,v)),r.push(R),n>Ci&&n--}return{_lodPlanes:r,_sizeLods:e,_sigmas:t}}function Gl(r){const e=new Pn(3*Kt,3*Kt,r);return e.texture.mapping=Es,e.texture.name="PMREM.cubeUv",e.scissorTest=!0,e}function is(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Tv(r){const e=new Float32Array(r),t=new M(0,1,0);return new zs({name:"SphericalGaussianBlur",defines:{n:r},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:e},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:t},inputEncoding:{value:nn[Ct]},outputEncoding:{value:nn[Ct]}},vertexShader:fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			${po()}

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Ul(){const r=new se(1,1);return new zs({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null},texelSize:{value:r},inputEncoding:{value:nn[Ct]},outputEncoding:{value:nn[Ct]}},vertexShader:fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform vec2 texelSize;

			${po()}

			#include <common>

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				vec2 f = fract( uv / texelSize - 0.5 );
				uv -= f * texelSize;
				vec3 tl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.x += texelSize.x;
				vec3 tr = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.y += texelSize.y;
				vec3 br = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;
				uv.x -= texelSize.x;
				vec3 bl = envMapTexelToLinear( texture2D ( envMap, uv ) ).rgb;

				vec3 tm = mix( tl, tr, f.x );
				vec3 bm = mix( bl, br, f.x );
				gl_FragColor.rgb = mix( tm, bm, f.y );

				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Vl(){return new zs({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},inputEncoding:{value:nn[Ct]},outputEncoding:{value:nn[Ct]}},vertexShader:fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			${po()}

			void main() {

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb = envMapTexelToLinear( textureCube( envMap, vec3( - vOutputDirection.x, vOutputDirection.yz ) ) ).rgb;
				gl_FragColor = linearToOutputTexel( gl_FragColor );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function fo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 position;
		attribute vec2 uv;
		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function po(){return`

		uniform int inputEncoding;
		uniform int outputEncoding;

		#include <encodings_pars_fragment>

		vec4 inputTexelToLinear( vec4 value ) {

			if ( inputEncoding == 0 ) {

				return value;

			} else if ( inputEncoding == 1 ) {

				return sRGBToLinear( value );

			} else if ( inputEncoding == 2 ) {

				return RGBEToLinear( value );

			} else if ( inputEncoding == 3 ) {

				return RGBMToLinear( value, 7.0 );

			} else if ( inputEncoding == 4 ) {

				return RGBMToLinear( value, 16.0 );

			} else if ( inputEncoding == 5 ) {

				return RGBDToLinear( value, 256.0 );

			} else {

				return GammaToLinear( value, 2.2 );

			}

		}

		vec4 linearToOutputTexel( vec4 value ) {

			if ( outputEncoding == 0 ) {

				return value;

			} else if ( outputEncoding == 1 ) {

				return LinearTosRGB( value );

			} else if ( outputEncoding == 2 ) {

				return LinearToRGBE( value );

			} else if ( outputEncoding == 3 ) {

				return LinearToRGBM( value, 7.0 );

			} else if ( outputEncoding == 4 ) {

				return LinearToRGBM( value, 16.0 );

			} else if ( outputEncoding == 5 ) {

				return LinearToRGBD( value, 256.0 );

			} else {

				return LinearToGamma( value, 2.2 );

			}

		}

		vec4 envMapTexelToLinear( vec4 color ) {

			return inputTexelToLinear( color );

		}
	`}Ht.create=function(r,e){return console.log("THREE.Curve.create() has been deprecated"),r.prototype=Object.create(Ht.prototype),r.prototype.constructor=r,r.prototype.getPoint=e,r};Ba.prototype.fromPoints=function(r){return console.warn("THREE.Path: .fromPoints() has been renamed to .setFromPoints()."),this.setFromPoints(r)};yv.prototype.setColors=function(){console.error("THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead.")};xv.prototype.update=function(){console.error("THREE.SkeletonHelper: update() no longer needs to be called.")};Hn.prototype.extractUrlBase=function(r){return console.warn("THREE.Loader: .extractUrlBase() has been deprecated. Use THREE.LoaderUtils.extractUrlBase() instead."),Z0.extractUrlBase(r)};Hn.Handlers={add:function(){console.error("THREE.Loader: Handlers.add() has been removed. Use LoadingManager.addHandler() instead.")},get:function(){console.error("THREE.Loader: Handlers.get() has been removed. Use LoadingManager.getHandler() instead.")}};Gt.prototype.center=function(r){return console.warn("THREE.Box3: .center() has been renamed to .getCenter()."),this.getCenter(r)};Gt.prototype.empty=function(){return console.warn("THREE.Box3: .empty() has been renamed to .isEmpty()."),this.isEmpty()};Gt.prototype.isIntersectionBox=function(r){return console.warn("THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(r)};Gt.prototype.isIntersectionSphere=function(r){return console.warn("THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere()."),this.intersectsSphere(r)};Gt.prototype.size=function(r){return console.warn("THREE.Box3: .size() has been renamed to .getSize()."),this.getSize(r)};Gi.prototype.empty=function(){return console.warn("THREE.Sphere: .empty() has been renamed to .isEmpty()."),this.isEmpty()};Rs.prototype.setFromMatrix=function(r){return console.warn("THREE.Frustum: .setFromMatrix() has been renamed to .setFromProjectionMatrix()."),this.setFromProjectionMatrix(r)};yt.prototype.flattenToArrayOffset=function(r,e){return console.warn("THREE.Matrix3: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."),this.toArray(r,e)};yt.prototype.multiplyVector3=function(r){return console.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."),r.applyMatrix3(this)};yt.prototype.multiplyVector3Array=function(){console.error("THREE.Matrix3: .multiplyVector3Array() has been removed.")};yt.prototype.applyToBufferAttribute=function(r){return console.warn("THREE.Matrix3: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix3( matrix ) instead."),r.applyMatrix3(this)};yt.prototype.applyToVector3Array=function(){console.error("THREE.Matrix3: .applyToVector3Array() has been removed.")};yt.prototype.getInverse=function(r){return console.warn("THREE.Matrix3: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead."),this.copy(r).invert()};Re.prototype.extractPosition=function(r){return console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."),this.copyPosition(r)};Re.prototype.flattenToArrayOffset=function(r,e){return console.warn("THREE.Matrix4: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."),this.toArray(r,e)};Re.prototype.getPosition=function(){return console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead."),new M().setFromMatrixColumn(this,3)};Re.prototype.setRotationFromQuaternion=function(r){return console.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."),this.makeRotationFromQuaternion(r)};Re.prototype.multiplyToArray=function(){console.warn("THREE.Matrix4: .multiplyToArray() has been removed.")};Re.prototype.multiplyVector3=function(r){return console.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};Re.prototype.multiplyVector4=function(r){return console.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};Re.prototype.multiplyVector3Array=function(){console.error("THREE.Matrix4: .multiplyVector3Array() has been removed.")};Re.prototype.rotateAxis=function(r){console.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."),r.transformDirection(this)};Re.prototype.crossVector=function(r){return console.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};Re.prototype.translate=function(){console.error("THREE.Matrix4: .translate() has been removed.")};Re.prototype.rotateX=function(){console.error("THREE.Matrix4: .rotateX() has been removed.")};Re.prototype.rotateY=function(){console.error("THREE.Matrix4: .rotateY() has been removed.")};Re.prototype.rotateZ=function(){console.error("THREE.Matrix4: .rotateZ() has been removed.")};Re.prototype.rotateByAxis=function(){console.error("THREE.Matrix4: .rotateByAxis() has been removed.")};Re.prototype.applyToBufferAttribute=function(r){return console.warn("THREE.Matrix4: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix4( matrix ) instead."),r.applyMatrix4(this)};Re.prototype.applyToVector3Array=function(){console.error("THREE.Matrix4: .applyToVector3Array() has been removed.")};Re.prototype.makeFrustum=function(r,e,t,n,i,s){return console.warn("THREE.Matrix4: .makeFrustum() has been removed. Use .makePerspective( left, right, top, bottom, near, far ) instead."),this.makePerspective(r,e,n,t,i,s)};Re.prototype.getInverse=function(r){return console.warn("THREE.Matrix4: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead."),this.copy(r).invert()};en.prototype.isIntersectionLine=function(r){return console.warn("THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine()."),this.intersectsLine(r)};St.prototype.multiplyVector3=function(r){return console.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."),r.applyQuaternion(this)};St.prototype.inverse=function(){return console.warn("THREE.Quaternion: .inverse() has been renamed to invert()."),this.invert()};Ui.prototype.isIntersectionBox=function(r){return console.warn("THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox()."),this.intersectsBox(r)};Ui.prototype.isIntersectionPlane=function(r){return console.warn("THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane()."),this.intersectsPlane(r)};Ui.prototype.isIntersectionSphere=function(r){return console.warn("THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere()."),this.intersectsSphere(r)};ut.prototype.area=function(){return console.warn("THREE.Triangle: .area() has been renamed to .getArea()."),this.getArea()};ut.prototype.barycoordFromPoint=function(r,e){return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."),this.getBarycoord(r,e)};ut.prototype.midpoint=function(r){return console.warn("THREE.Triangle: .midpoint() has been renamed to .getMidpoint()."),this.getMidpoint(r)};ut.prototypenormal=function(r){return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."),this.getNormal(r)};ut.prototype.plane=function(r){return console.warn("THREE.Triangle: .plane() has been renamed to .getPlane()."),this.getPlane(r)};ut.barycoordFromPoint=function(r,e,t,n,i){return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."),ut.getBarycoord(r,e,t,n,i)};ut.normal=function(r,e,t,n){return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."),ut.getNormal(r,e,t,n)};ao.prototype.extractAllPoints=function(r){return console.warn("THREE.Shape: .extractAllPoints() has been removed. Use .extractPoints() instead."),this.extractPoints(r)};ao.prototype.extrude=function(r){return console.warn("THREE.Shape: .extrude() has been removed. Use ExtrudeGeometry() instead."),new Ns(this,r)};ao.prototype.makeGeometry=function(r){return console.warn("THREE.Shape: .makeGeometry() has been removed. Use ShapeGeometry() instead."),new v0(this,r)};se.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector2: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};se.prototype.distanceToManhattan=function(r){return console.warn("THREE.Vector2: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."),this.manhattanDistanceTo(r)};se.prototype.lengthManhattan=function(){return console.warn("THREE.Vector2: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};M.prototype.setEulerFromRotationMatrix=function(){console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.")};M.prototype.setEulerFromQuaternion=function(){console.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.")};M.prototype.getPositionFromMatrix=function(r){return console.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."),this.setFromMatrixPosition(r)};M.prototype.getScaleFromMatrix=function(r){return console.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."),this.setFromMatrixScale(r)};M.prototype.getColumnFromMatrix=function(r,e){return console.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."),this.setFromMatrixColumn(e,r)};M.prototype.applyProjection=function(r){return console.warn("THREE.Vector3: .applyProjection() has been removed. Use .applyMatrix4( m ) instead."),this.applyMatrix4(r)};M.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector3: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};M.prototype.distanceToManhattan=function(r){return console.warn("THREE.Vector3: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."),this.manhattanDistanceTo(r)};M.prototype.lengthManhattan=function(){return console.warn("THREE.Vector3: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};qe.prototype.fromAttribute=function(r,e,t){return console.warn("THREE.Vector4: .fromAttribute() has been renamed to .fromBufferAttribute()."),this.fromBufferAttribute(r,e,t)};qe.prototype.lengthManhattan=function(){return console.warn("THREE.Vector4: .lengthManhattan() has been renamed to .manhattanLength()."),this.manhattanLength()};Je.prototype.getChildByName=function(r){return console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."),this.getObjectByName(r)};Je.prototype.renderDepth=function(){console.warn("THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.")};Je.prototype.translate=function(r,e){return console.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."),this.translateOnAxis(e,r)};Je.prototype.getWorldRotation=function(){console.error("THREE.Object3D: .getWorldRotation() has been removed. Use THREE.Object3D.getWorldQuaternion( target ) instead.")};Je.prototype.applyMatrix=function(r){return console.warn("THREE.Object3D: .applyMatrix() has been renamed to .applyMatrix4()."),this.applyMatrix4(r)};Object.defineProperties(Je.prototype,{eulerOrder:{get:function(){return console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),this.rotation.order},set:function(r){console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."),this.rotation.order=r}},useQuaternion:{get:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")},set:function(){console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")}}});Ye.prototype.setDrawMode=function(){console.error("THREE.Mesh: .setDrawMode() has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")};Object.defineProperties(Ye.prototype,{drawMode:{get:function(){return console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode."),rd},set:function(){console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")}}});Ec.prototype.initBones=function(){console.error("THREE.SkinnedMesh: initBones() has been removed.")};bt.prototype.setLens=function(r,e){console.warn("THREE.PerspectiveCamera.setLens is deprecated. Use .setFocalLength and .filmGauge for a photographic setup."),e!==void 0&&(this.filmGauge=e),this.setFocalLength(r)};Object.defineProperties(sn.prototype,{onlyShadow:{set:function(){console.warn("THREE.Light: .onlyShadow has been removed.")}},shadowCameraFov:{set:function(r){console.warn("THREE.Light: .shadowCameraFov is now .shadow.camera.fov."),this.shadow.camera.fov=r}},shadowCameraLeft:{set:function(r){console.warn("THREE.Light: .shadowCameraLeft is now .shadow.camera.left."),this.shadow.camera.left=r}},shadowCameraRight:{set:function(r){console.warn("THREE.Light: .shadowCameraRight is now .shadow.camera.right."),this.shadow.camera.right=r}},shadowCameraTop:{set:function(r){console.warn("THREE.Light: .shadowCameraTop is now .shadow.camera.top."),this.shadow.camera.top=r}},shadowCameraBottom:{set:function(r){console.warn("THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom."),this.shadow.camera.bottom=r}},shadowCameraNear:{set:function(r){console.warn("THREE.Light: .shadowCameraNear is now .shadow.camera.near."),this.shadow.camera.near=r}},shadowCameraFar:{set:function(r){console.warn("THREE.Light: .shadowCameraFar is now .shadow.camera.far."),this.shadow.camera.far=r}},shadowCameraVisible:{set:function(){console.warn("THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead.")}},shadowBias:{set:function(r){console.warn("THREE.Light: .shadowBias is now .shadow.bias."),this.shadow.bias=r}},shadowDarkness:{set:function(){console.warn("THREE.Light: .shadowDarkness has been removed.")}},shadowMapWidth:{set:function(r){console.warn("THREE.Light: .shadowMapWidth is now .shadow.mapSize.width."),this.shadow.mapSize.width=r}},shadowMapHeight:{set:function(r){console.warn("THREE.Light: .shadowMapHeight is now .shadow.mapSize.height."),this.shadow.mapSize.height=r}}});Object.defineProperties(Ze.prototype,{length:{get:function(){return console.warn("THREE.BufferAttribute: .length has been deprecated. Use .count instead."),this.array.length}},dynamic:{get:function(){return console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."),this.usage===vs},set:function(){console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."),this.setUsage(vs)}}});Ze.prototype.setDynamic=function(r){return console.warn("THREE.BufferAttribute: .setDynamic() has been deprecated. Use .setUsage() instead."),this.setUsage(r===!0?vs:pr),this};Ze.prototype.copyIndicesArray=function(){console.error("THREE.BufferAttribute: .copyIndicesArray() has been removed.")},Ze.prototype.setArray=function(){console.error("THREE.BufferAttribute: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")};Ve.prototype.addIndex=function(r){console.warn("THREE.BufferGeometry: .addIndex() has been renamed to .setIndex()."),this.setIndex(r)};Ve.prototype.addAttribute=function(r,e){return console.warn("THREE.BufferGeometry: .addAttribute() has been renamed to .setAttribute()."),!(e&&e.isBufferAttribute)&&!(e&&e.isInterleavedBufferAttribute)?(console.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."),this.setAttribute(r,new Ze(arguments[1],arguments[2]))):r==="index"?(console.warn("THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute."),this.setIndex(e),this):this.setAttribute(r,e)};Ve.prototype.addDrawCall=function(r,e,t){t!==void 0&&console.warn("THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset."),console.warn("THREE.BufferGeometry: .addDrawCall() is now .addGroup()."),this.addGroup(r,e)};Ve.prototype.clearDrawCalls=function(){console.warn("THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups()."),this.clearGroups()};Ve.prototype.computeOffsets=function(){console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.")};Ve.prototype.removeAttribute=function(r){return console.warn("THREE.BufferGeometry: .removeAttribute() has been renamed to .deleteAttribute()."),this.deleteAttribute(r)};Ve.prototype.applyMatrix=function(r){return console.warn("THREE.BufferGeometry: .applyMatrix() has been renamed to .applyMatrix4()."),this.applyMatrix4(r)};Object.defineProperties(Ve.prototype,{drawcalls:{get:function(){return console.error("THREE.BufferGeometry: .drawcalls has been renamed to .groups."),this.groups}},offsets:{get:function(){return console.warn("THREE.BufferGeometry: .offsets has been renamed to .groups."),this.groups}}});Kn.prototype.setDynamic=function(r){return console.warn("THREE.InterleavedBuffer: .setDynamic() has been deprecated. Use .setUsage() instead."),this.setUsage(r===!0?vs:pr),this};Kn.prototype.setArray=function(){console.error("THREE.InterleavedBuffer: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")};Ns.prototype.getArrays=function(){console.error("THREE.ExtrudeGeometry: .getArrays() has been removed.")};Ns.prototype.addShapeList=function(){console.error("THREE.ExtrudeGeometry: .addShapeList() has been removed.")};Ns.prototype.addShape=function(){console.error("THREE.ExtrudeGeometry: .addShape() has been removed.")};Ds.prototype.dispose=function(){console.error("THREE.Scene: .dispose() has been removed.")};Object.defineProperties(ft.prototype,{wrapAround:{get:function(){console.warn("THREE.Material: .wrapAround has been removed.")},set:function(){console.warn("THREE.Material: .wrapAround has been removed.")}},overdraw:{get:function(){console.warn("THREE.Material: .overdraw has been removed.")},set:function(){console.warn("THREE.Material: .overdraw has been removed.")}},wrapRGB:{get:function(){return console.warn("THREE.Material: .wrapRGB has been removed."),new xe}},shading:{get:function(){console.error("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead.")},set:function(r){console.warn("THREE."+this.type+": .shading has been removed. Use the boolean .flatShading instead."),this.flatShading=r===Zl}},stencilMask:{get:function(){return console.warn("THREE."+this.type+": .stencilMask has been removed. Use .stencilFuncMask instead."),this.stencilFuncMask},set:function(r){console.warn("THREE."+this.type+": .stencilMask has been removed. Use .stencilFuncMask instead."),this.stencilFuncMask=r}}});Object.defineProperties(Zt.prototype,{derivatives:{get:function(){return console.warn("THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives."),this.extensions.derivatives},set:function(r){console.warn("THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives."),this.extensions.derivatives=r}}});Ke.prototype.clearTarget=function(r,e,t,n){console.warn("THREE.WebGLRenderer: .clearTarget() has been deprecated. Use .setRenderTarget() and .clear() instead."),this.setRenderTarget(r),this.clear(e,t,n)};Ke.prototype.animate=function(r){console.warn("THREE.WebGLRenderer: .animate() is now .setAnimationLoop()."),this.setAnimationLoop(r)};Ke.prototype.getCurrentRenderTarget=function(){return console.warn("THREE.WebGLRenderer: .getCurrentRenderTarget() is now .getRenderTarget()."),this.getRenderTarget()};Ke.prototype.getMaxAnisotropy=function(){return console.warn("THREE.WebGLRenderer: .getMaxAnisotropy() is now .capabilities.getMaxAnisotropy()."),this.capabilities.getMaxAnisotropy()};Ke.prototype.getPrecision=function(){return console.warn("THREE.WebGLRenderer: .getPrecision() is now .capabilities.precision."),this.capabilities.precision};Ke.prototype.resetGLState=function(){return console.warn("THREE.WebGLRenderer: .resetGLState() is now .state.reset()."),this.state.reset()};Ke.prototype.supportsFloatTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' )."),this.extensions.get("OES_texture_float")};Ke.prototype.supportsHalfFloatTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' )."),this.extensions.get("OES_texture_half_float")};Ke.prototype.supportsStandardDerivatives=function(){return console.warn("THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' )."),this.extensions.get("OES_standard_derivatives")};Ke.prototype.supportsCompressedTextureS3TC=function(){return console.warn("THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' )."),this.extensions.get("WEBGL_compressed_texture_s3tc")};Ke.prototype.supportsCompressedTexturePVRTC=function(){return console.warn("THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' )."),this.extensions.get("WEBGL_compressed_texture_pvrtc")};Ke.prototype.supportsBlendMinMax=function(){return console.warn("THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' )."),this.extensions.get("EXT_blend_minmax")};Ke.prototype.supportsVertexTextures=function(){return console.warn("THREE.WebGLRenderer: .supportsVertexTextures() is now .capabilities.vertexTextures."),this.capabilities.vertexTextures};Ke.prototype.supportsInstancedArrays=function(){return console.warn("THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' )."),this.extensions.get("ANGLE_instanced_arrays")};Ke.prototype.enableScissorTest=function(r){console.warn("THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest()."),this.setScissorTest(r)};Ke.prototype.initMaterial=function(){console.warn("THREE.WebGLRenderer: .initMaterial() has been removed.")};Ke.prototype.addPrePlugin=function(){console.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.")};Ke.prototype.addPostPlugin=function(){console.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.")};Ke.prototype.updateShadowMap=function(){console.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.")};Ke.prototype.setFaceCulling=function(){console.warn("THREE.WebGLRenderer: .setFaceCulling() has been removed.")};Ke.prototype.allocTextureUnit=function(){console.warn("THREE.WebGLRenderer: .allocTextureUnit() has been removed.")};Ke.prototype.setTexture=function(){console.warn("THREE.WebGLRenderer: .setTexture() has been removed.")};Ke.prototype.setTexture2D=function(){console.warn("THREE.WebGLRenderer: .setTexture2D() has been removed.")};Ke.prototype.setTextureCube=function(){console.warn("THREE.WebGLRenderer: .setTextureCube() has been removed.")};Ke.prototype.getActiveMipMapLevel=function(){return console.warn("THREE.WebGLRenderer: .getActiveMipMapLevel() is now .getActiveMipmapLevel()."),this.getActiveMipmapLevel()};Object.defineProperties(Ke.prototype,{shadowMapEnabled:{get:function(){return this.shadowMap.enabled},set:function(r){console.warn("THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled."),this.shadowMap.enabled=r}},shadowMapType:{get:function(){return this.shadowMap.type},set:function(r){console.warn("THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type."),this.shadowMap.type=r}},shadowMapCullFace:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")}},context:{get:function(){return console.warn("THREE.WebGLRenderer: .context has been removed. Use .getContext() instead."),this.getContext()}},vr:{get:function(){return console.warn("THREE.WebGLRenderer: .vr has been renamed to .xr"),this.xr}},gammaInput:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead."),!1},set:function(){console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead.")}},gammaOutput:{get:function(){return console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."),!1},set:function(r){console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."),this.outputEncoding=r===!0?ki:Ct}},toneMappingWhitePoint:{get:function(){return console.warn("THREE.WebGLRenderer: .toneMappingWhitePoint has been removed."),1},set:function(){console.warn("THREE.WebGLRenderer: .toneMappingWhitePoint has been removed.")}}});Object.defineProperties(Mc.prototype,{cullFace:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")}},renderReverseSided:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")}},renderSingleSided:{get:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")},set:function(){console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")}}});Object.defineProperties(Pn.prototype,{wrapS:{get:function(){return console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),this.texture.wrapS},set:function(r){console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."),this.texture.wrapS=r}},wrapT:{get:function(){return console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),this.texture.wrapT},set:function(r){console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."),this.texture.wrapT=r}},magFilter:{get:function(){return console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."),this.texture.magFilter},set:function(r){console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."),this.texture.magFilter=r}},minFilter:{get:function(){return console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."),this.texture.minFilter},set:function(r){console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."),this.texture.minFilter=r}},anisotropy:{get:function(){return console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."),this.texture.anisotropy},set:function(r){console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."),this.texture.anisotropy=r}},offset:{get:function(){return console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."),this.texture.offset},set:function(r){console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."),this.texture.offset=r}},repeat:{get:function(){return console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."),this.texture.repeat},set:function(r){console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."),this.texture.repeat=r}},format:{get:function(){return console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."),this.texture.format},set:function(r){console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."),this.texture.format=r}},type:{get:function(){return console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),this.texture.type},set:function(r){console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."),this.texture.type=r}},generateMipmaps:{get:function(){return console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."),this.texture.generateMipmaps},set:function(r){console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."),this.texture.generateMipmaps=r}}});iv.prototype.load=function(r){console.warn("THREE.Audio: .load has been deprecated. Use THREE.AudioLoader instead.");const e=this;return new ev().load(r,function(n){e.setBuffer(n)}),this};Ka.prototype.updateCubeMap=function(r,e){return console.warn("THREE.CubeCamera: .updateCubeMap() is now .update()."),this.update(r,e)};Ka.prototype.clear=function(r,e,t,n){return console.warn("THREE.CubeCamera: .clear() is now .renderTarget.clear()."),this.renderTarget.clear(r,e,t,n)};Hi.crossOrigin=void 0;Hi.loadTexture=function(r,e,t,n){console.warn("THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.");const i=new zc;i.setCrossOrigin(this.crossOrigin);const s=i.load(r,t,void 0,n);return e&&(s.mapping=e),s};Hi.loadTextureCube=function(r,e,t,n){console.warn("THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.");const i=new F0;i.setCrossOrigin(this.crossOrigin);const s=i.load(r,t,void 0,n);return e&&(s.mapping=e),s};Hi.loadCompressedTexture=function(){console.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.")};Hi.loadCompressedTextureCube=function(){console.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.")};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yl);(function(r){const n=Math.PI/180,i=180/Math.PI,s={slate:{id:"slate",name:"Flat slate",alpha:18,win:7,lift:1,stab:1,vmin:5,vyMax:6.5,vtop:19,thick:.9},oval:{id:"oval",name:"River oval",alpha:15,win:6,lift:.88,stab:.85,vmin:5.8,vyMax:5.5,vtop:17,thick:1.4},pebble:{id:"pebble",name:"Round pebble",alpha:12,win:5.5,lift:.75,stab:1.2,vmin:6.8,vyMax:5,vtop:20,thick:2.2},chunk:{id:"chunk",name:"Heavy chunk",alpha:22,win:9,lift:.7,stab:.75,vmin:5.5,vyMax:7.5,vtop:15,thick:3.2}},a={lake:{id:"lake",name:"Calm lake",loss:.08,winF:.7,amp:.01,flow:0},sea:{id:"sea",name:"Choppy sea",loss:.115,winF:1,amp:.085,flow:0},river:{id:"river",name:"River current",loss:.115,winF:1,amp:.03,flow:1},patchy:{id:"patchy",name:"Patchy",loss:.1,winF:.9,amp:.07,flow:0}},o=4;function l(N){const z=a[N.water];let S={loss:z.loss,winF:z.winF,amp:z.amp,flow:0,flowDir:0,height:0};if(N.water==="river"&&(S.flow=N.flowStr,S.flowDir=N.flowDir),N.rain)if(N.water==="lake"){const E=a.river;S={loss:E.loss,winF:E.winF,amp:.02,flow:N.flowStr,flowDir:N.flowDir}}else N.water==="sea"?S.amp*=1.25:N.water==="river"&&(S.winF*=.75);return S.bias=S.flow*S.flowDir*o,S.height=S.amp/.2,S}const c=[90,60,41,28,19,13,9,6.2,4.3,3,2.1,1.5],u=[.005,.006,.0075,.0085,.0095,.01,.01,.0095,.009,.0085,.008,.0075],h=[0,-.35,.4,-.7,.8,-1.1,1.2,-.55,.95,-1.3,.65,-.2],d=1.5*Math.PI,f=c.map(function(N){return 2*Math.PI/N}),m=f.map(function(N){return Math.sqrt(9.81/N)}),v=h.map(function(N){return Math.sin(d+N)});function y(N){return{toff:N()*500}}function g(N,z,S){const E=Math.min(1,Math.max(0,(S-N)/(z-N)));return E*E*(3-2*E)}function p(N,z){const S=.6*Math.sin(.19*N+1.7+.9*Math.sin(.11*z))+.4*Math.sin(.071*N+.05*z+4.1);return .22+1.45*g(-.15,.25,S)}function R(N,z,S,E){const C=E+N.toff;let b=0;for(let V=0;V<12;V++)b+=c[V]*u[V]*z*Math.sin(f[V]*(v[V]*S-m[V]*C)+V*1.7);return N.patch?b*p(S,0):b}function A(N,z,S,E){const C=E+N.toff;let b=0;for(let V=0;V<12;V++)b+=c[V]*u[V]*z*f[V]*v[V]*Math.cos(f[V]*(v[V]*S-m[V]*C)+V*1.7);return Math.atan(N.patch?b*p(S,0):b)*i}function L(N,z,S){return N<z?z:N>S?S:N}function _(N,z,S){const E=s[N.stone],C=N.thick,b=l(N),V=E.alpha+(C-1)*8,te=E.vmin*(.9+.1*C);let $=z.spin;const he=z.v*(1-.12*$);let oe=he*Math.cos(z.theta*n),Me=he*Math.sin(z.theta*n),Ee=0,j=.6,He=0;const Oe=function(ze,ne){return R(N.waves,b.height,ze,S+ne)},De=[],be=[];let Ge=0,Fe="sank";for(let ze=0;ze<45;ze++){const ne=function(_e){return(Me+Math.sqrt(Math.max(0,Me*Me+19.62*(j-_e))))/9.81};let re=Math.max(.02,ne(0)),le=0;for(let _e=0;_e<3;_e++)le=Oe(Ee+oe*re,He+re),re=Math.max(.02,ne(le));le=Oe(Ee+oe*re,He+re),De.push({x0:Ee,y0:j,t0:He,vx:oe,vy:Me,dur:re,spin:$}),Ee+=oe*re,He+=re;const ye=Me-9.81*re,ce=Math.hypot(oe,ye),T=Math.atan2(-ye,oe)*i,w=L($*E.stab,0,1),O=A(N.waves,b.height,Ee,S+He),Z=z.phi+T+b.bias+O*(1-.9*w),fe=L(1-.16*(ce-E.vtop),.2,1),ge=E.win*b.winF*(.65+.35*w)*fe*(N.winK||1),Ne=Z-V,Se={n:ze+1,x:Ee,y:le,t:He,speed:ce,gamma:T,alpha:Z,err:Ne,win:ge,ok:!1,why:""};if(ce<te?Se.why="slow":-ye>E.vyMax?Se.why="hard":Ne>ge?Se.why="steep":Ne<-ge?Se.why="shallow":Se.ok=!0,be.push(Se),!Se.ok){Fe=Se.why;break}Ge++;const I=Math.abs(Ne)/ge,ae=b.loss*(1+.8*I*I)*(1+.25*$);oe*=1-ae;const ue=L(Z,6,30)*n;Me=Math.max(.55,.42*ce*Math.sin(ue)*E.lift),j=le,$*=.88}return{skips:Ge,contacts:be,segs:De,end:Fe,distance:Ee,duration:He,ideal:V,eff:b}}function F(N,z){const S=N.segs;for(let E=0;E<S.length;E++){const C=S[E];if(z<=C.t0+C.dur||E===S.length-1){const b=L(z-C.t0,0,C.dur);return{x:C.x0+C.vx*b,y:C.y0+C.vy*b-.5*9.81*b*b,seg:E,spin:C.spin}}}return{x:0,y:.6,seg:0,spin:0}}function D(N){let z=N>>>0;return function(){z=z+1831565813>>>0;let S=z;return S=Math.imul(S^S>>>15,S|1),S^=S+Math.imul(S^S>>>7,S|61),((S^S>>>14)>>>0)/4294967296}}function B(N,z){z=z||{};const S=Object.keys(s),E=Object.keys(a),C=z.water||E[Math.floor(N()*E.length)],b=z.stone||S[Math.floor(N()*S.length)],V=z.rain!==void 0?z.rain:N()<.3,te=[.6,1,1.4];return{stone:b,thick:z.thick||.88+N()*.24,water:C,rain:V,flowDir:N()<.5?1:-1,flowStr:te[Math.floor(N()*3)],waves:y(N)}}const U={theta:[-10,15],v:[7,24],phi:[0,30],spin:[0,1]};r.Phys={G:9.81,H0:.6,STONES:s,WATER:a,LIMITS:U,BIAS_PER_FLOW:o,effective:l,simulate:_,stateAt:F,makeCondition:B,makeWaves:y,patchM:p,waveHeight:R,waveSlopeDeg:A,mulberry:D,clamp:L},typeof Jn<"u"&&Jn.exports&&(Jn.exports=r.Phys)})(typeof window<"u"?window:globalThis);const Jt=window.Phys,Ev=Math.PI/180,Le=r=>document.querySelector(r),bi=(r,e,t)=>r<e?e:r>t?t:r;function Jc(r){const e=new Uint8Array(512),t=Jt.mulberry(r);for(let s=0;s<256;s++)e[s]=s;for(let s=255;s>0;s--){const a=Math.floor(t()*(s+1)),o=e[s];e[s]=e[a],e[a]=o}for(let s=0;s<256;s++)e[s+256]=e[s];const n=new Float32Array(256);for(let s=0;s<256;s++)n[s]=t();function i(s,a){const o=Math.floor(s),l=Math.floor(a),c=s-o,u=a-l,h=c*c*(3-2*c),d=u*u*(3-2*u),f=n[e[(o&255)+e[l&255]]],m=n[e[(o+1&255)+e[l&255]]],v=n[e[(o&255)+e[l+1&255]]],y=n[e[(o+1&255)+e[l+1&255]]];return(f*(1-h)+m*h)*(1-d)+(v*(1-h)+y*h)*d}return function(a,o,l){let c=0,u=.5,h=1;for(let d=0;d<(l||5);d++)c+=u*i(a*h,o*h),h*=2.03,u*=.5;return c}}(function(r){const e=r.Phys||(typeof require<"u"?require("./physics.js"):null),t=e.LIMITS,n={wren:{id:"wren",name:"Wren",chapter:1,stone:"oval",blurb:"Skips this lake every morning with a river oval. Steady, never greedy.",noise:{lake:1,patchy:1.6,sea:2},spin:[.6,.9],dv:-1.2,dphi:.6}},i={easy:2.6,normal:1.6,hard:.8};function s(o){const l=Math.max(1e-9,o()),c=o();return Math.sqrt(-2*Math.log(l))*Math.cos(2*Math.PI*c)}function a(o,l,c,u,h){const d=n[c],f=i[u]||i.normal,m=d.spin[0],v=d.spin[1],y=function(_){const F=e.simulate(o,_,l);return F.skips+F.distance*.01},g=function(){return{theta:h()*6,v:t.v[0]+h()*(t.v[1]-t.v[0]),phi:t.phi[0]+h()*(t.phi[1]-t.phi[0]),spin:m+h()*(v-m)}},p=[];for(let _=0;_<320;_++){const F=g();p.push({th:F,s:y(F)})}p.sort(function(_,F){return F.s-_.s});let R=p[0].th,A=p[0].s;for(let _=0;_<3;_++){let F=Object.assign({},p[_].th),D=p[_].s;for(let B=0;B<60;B++){const U={theta:e.clamp(F.theta+(h()-.5)*2,0,6),v:e.clamp(F.v+(h()-.5)*3,t.v[0],t.v[1]),phi:e.clamp(F.phi+(h()-.5)*3,t.phi[0],t.phi[1]),spin:e.clamp(F.spin+(h()-.5)*.2,m,v)},N=y(U);N>=D&&(F=U,D=N)}D>A&&(A=D,R=F)}const L=(d.noise[o.water]||1.5)*f;return{theta:e.clamp(R.theta+s(h)*.3*L,0,8),v:e.clamp(R.v+d.dv+s(h)*.6*L,t.v[0],t.v[1]),phi:e.clamp(R.phi+d.dphi+s(h)*1.1*L,t.phi[0],t.phi[1]),spin:e.clamp(R.spin+s(h)*.03*L,m,v)}}r.Cpu={PERSONAS:n,DIFFICULTY:i,plan:a},typeof Jn<"u"&&Jn.exports&&(Jn.exports=r.Cpu)})(typeof window<"u"?window:globalThis);function Av(r){let e="";try{const i=r.getContext(),s=i.getExtension("WEBGL_debug_renderer_info");s&&(e=String(i.getParameter(s.UNMASKED_RENDERER_WEBGL)||""))}catch{}const t=navigator.deviceMemory||4,n=navigator.hardwareConcurrency||4;return/swiftshader|llvmpipe|software|mali-4|mali-t|adreno \(tm\) [1-5]\d\d|powervr sgx/i.test(e)||t<=2||n<=2?{tier:"low",gpu:e}:/apple|nvidia|geforce|radeon|rtx|quadro|adreno \(tm\) [7-9]\d\d|mali-g7\d|immortalis|intel\(r\) (arc|iris)/i.test(e)&&t>=4?{tier:"high",gpu:e}:{tier:"mid",gpu:e}}function Lv(r){const e=new Ke({canvas:r,antialias:!0,powerPreference:"high-performance"}),{tier:t,gpu:n}=Av(e),i={low:1.25,mid:1.75,high:2.25}[t];let s=Math.min(window.devicePixelRatio||1,i);e.setPixelRatio(s),e.outputEncoding=ki,e.toneMapping=$l,e.toneMappingExposure=1;let a=()=>{};function o(){const f=Math.max(10,window.innerWidth),m=Math.max(10,window.innerHeight);e.setSize(f,m,!1),a(f,m)}window.addEventListener("resize",o);let l=60,c=0,u=0,h=0;function d(f){if(f>0&&(l+=(1/Math.max(f,.001)-l)*.05),h+=f,h<1)return;h=0,l<40?(c++,u=0):l>56?(u++,c=0):(c=0,u=0);const m=Math.min(window.devicePixelRatio||1,i);c>=2&&s>.75?(s=Math.max(.75,s*.85),c=0,e.setPixelRatio(s),o()):u>=4&&s<m-.01&&(s=Math.min(m,s*1.12),u=0,e.setPixelRatio(s),o())}return{renderer:e,tier:t,gpu:n,resize:o,adapt:d,setOnResize(f){a=f},get pr(){return s},get fps(){return l}}}function Cv(r,e){if(!/[?&]fps\b/.test(location.search))return{tick(){},start(){}};r.hidden=!1;let n=null,i=0,s=0,a=[],o=0,l=0,c=0;return{start(){n===null&&(n=performance.now())},tick(u,h){if(n!==null&&(i++,s+=u,o+=u,l++,o>=10&&(a.push(l/o),a.length>6&&a.shift(),o=0,l=0)),h-c<500)return;c=h;const d=s>0?i/s:0,f=a.length?a.reduce((v,y)=>v+y,0)/a.length:0,m=n===null?0:(h-n)/6e4;r.textContent=`${e.fps.toFixed(0)} fps  tier ${e.tier}  px ${e.pr.toFixed(2)}
since start ${d.toFixed(1)}  last min ${f.toFixed(1)}
played ${m.toFixed(1)} min`}}}function Rv(r,e,t){var n=t==="low"||t!=="high"&&Math.min(window.innerWidth,window.innerHeight)<700,i={height:.7,chop:.9,wind:270,sun:12,cover:.2,clarity:.75,caustics:1.35,spray:1,volume:.6},s=78*Math.PI/180,a=9e3,o=9.81,l=0,c=!1,u=0,h=0,d=[90,60,41,28,19,13,9,6.2,4.3,3,2.1,1.5],f=[.005,.006,.0075,.0085,.0095,.01,.01,.0095,.009,.0085,.008,.0075],m=[0,-.35,.4,-.7,.8,-1.1,1.2,-.55,.95,-1.3,.65,-.2],v=t==="high"?192:t==="mid"?160:128,y=96,g=y/v,p=9.81*.6,R=-y/2,A=new Float32Array(v*v),L=new Float32Array(v*v),_=new Float32Array(v*v),F=new Float32Array(v*v),D=new Float32Array(v*v),B=new Float32Array(v*v),U=new Float32Array(v*v*4),N=new eo(U,v,v,Ft,gn);N.minFilter=N.magFilter=dt,N.generateMipmaps=!1,N.flipY=!1,N.needsUpdate=!0,function(){var X=v,Q=14,H,q;for(q=0;q<X;q++)for(H=0;H<X;H++){var ee=Math.min(H,q,X-1-H,X-1-q);B[q*X+H]=ee<Q?Math.pow((Q-ee)/Q,2)*6:0}}();function z(X){var Q=v,H=p*X/g,q=X/g,ee,W,J,pe,Ce=1-.35*X,x=Math.exp(-.45*X);for(W=0;W<Q;W++)for(ee=0;ee<Q;ee++){J=W*Q+ee,pe=Ce-B[J]*X;var k=A[J]+D[J];L[J]=ee<Q-1?(L[J]-H*(A[J+1]+D[J+1]-k))*pe:0,_[J]=W<Q-1?(_[J]-H*(A[J+Q]+D[J+Q]-k))*pe:0}for(W=0;W<Q;W++)for(ee=0;ee<Q;ee++){J=W*Q+ee;var P=L[J]-(ee>0?L[J-1]:0)+_[J]-(W>0?_[J-Q]:0),G=(A[J]-q*P)*(1-(.04+B[J]*.5)*X);A[J]=G>-3&&G<3?G:0,F[J]*=x}}function S(X,Q,H,q,ee){var W=v,J=y/2-6;if(Math.abs(X)>J||Math.abs(Q)>J)return!1;var pe=(X-R)/g-.5,Ce=(Q-R)/g-.5,x=Math.ceil(q*4/g)+1,k=Math.max(1,Math.floor(pe)-x),P=Math.min(W-2,Math.floor(pe)+x),G=Math.max(1,Math.floor(Ce)-x),ie=Math.min(W-2,Math.floor(Ce)+x),Pe=2*q*q;h=0;for(var ve=G;ve<=ie;ve++)for(var we=k;we<=P;we++){var Be=(we+.5)*g+R-X,Te=(ve+.5)*g+R-Q,ke=Be*Be+Te*Te,Ae=ve*W+we,We=Math.exp(-ke/Pe);A[Ae]+=H*(We-.25*Math.exp(-ke/(4*Pe))),F[Ae]=Math.min(1,F[Ae]+ee*We)}return!0}function E(){var X=v,Q=1/(2*g),H,q,ee,W;for(q=0;q<X;q++)for(H=0;H<X;H++){ee=q*X+H,W=ee*4;var J=(A[H<X-1?ee+1:ee]-A[H>0?ee-1:ee])*Q,pe=(A[q<X-1?ee+X:ee]-A[q>0?ee-X:ee])*Q,Ce=Math.sqrt(J*J+pe*pe)-.25;if(Ce>0){var x=Math.min(1,Ce*2.2);x>F[ee]&&(F[ee]=x)}U[W]=A[ee],U[W+1]=J,U[W+2]=pe,U[W+3]=F[ee]}N.needsUpdate=!0}var C=["uniform highp sampler2D uSim;","uniform vec2 uSimO;","uniform float uSimS;","uniform float uSimN;","vec4 simAt(vec2 p){","  vec2 q=(p-uSimO)/uSimS;","  vec2 e=min(q,1.0-q);","  float ew=smoothstep(0.0,0.06,e.x)*smoothstep(0.0,0.06,e.y);","  vec2 g=clamp(q,0.0,1.0)*uSimN-0.5;","  vec2 i0=floor(g);vec2 f=g-i0;","  float inv=1.0/uSimN;","  vec2 c0=clamp(i0,0.0,uSimN-1.0);vec2 c1=clamp(i0+1.0,0.0,uSimN-1.0);","  vec4 a=texture2D(uSim,(c0+0.5)*inv);","  vec4 b=texture2D(uSim,(vec2(c1.x,c0.y)+0.5)*inv);","  vec4 c=texture2D(uSim,(vec2(c0.x,c1.y)+0.5)*inv);","  vec4 d=texture2D(uSim,(c1+0.5)*inv);","  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y)*ew;","}"].join(`
`),b={uTime:{value:0},uSunDir:{value:new M(0,1,0)},uCover:{value:i.cover},uExposure:{value:1},uWarm:{value:new M(.95,.48,.24)},uZen:{value:new M(.09,.26,.6)},uHor:{value:new M(.58,.74,.88)},uDusk:{value:.35},uBed:{value:1},uFogD:{value:1400},uFarR:{value:a},uWaves:{value:d.map(function(){return new qe})},uChop:{value:1},uWindAng:{value:0},uHs:{value:1},uFlow:{value:0},uRainAmt:{value:0},uPatch:{value:0},uFoamAmt:{value:0},uRip:{value:[0,1,2,3,4,5].map(function(){return new qe(0,0,-100,0)})},uClarity:{value:i.clarity},uCaustic:{value:i.caustics},uSim:{value:N},uSimO:{value:new se(R,R)},uSimS:{value:y},uSimN:{value:v}},V=Object.assign({},b,{uSpray:{value:i.spray},uPxScale:{value:800},uWind:{value:new se(0,1)},uBurst:{value:[0,1,2,3,4,5].map(function(){return new qe(0,0,-100,0)})},uImp:{value:[0,1,2,3].map(function(){return new qe(0,0,-100,0)})},uImpB:{value:[0,1,2,3].map(function(){return new qe(0,0,0,0)})}}),te=["precision highp float;","uniform float uTime;","uniform vec3 uSunDir;","uniform float uCover;","uniform float uExposure;","uniform vec3 uWarm;","uniform vec3 uZen;","uniform vec3 uHor;","uniform float uDusk;","float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}","float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);","  float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));","  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}","float fbm(vec2 p){float s=0.0;float a=0.5;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.03+vec2(17.1,9.7);a*=0.5;}return s;}","uniform float uPatch;","float patchM(vec2 p){if(uPatch<0.5)return 1.0;float n=0.6*sin(0.19*p.x+1.7+0.9*sin(0.11*p.y))+0.4*sin(0.071*p.x+0.05*p.y+4.1);return 0.22+1.45*smoothstep(-0.15,0.25,n);}","float fbm3(vec2 p){float s=0.0;float a=0.5;for(int i=0;i<3;i++){s+=a*noise(p);p=p*2.07+vec2(5.3,13.1);a*=0.5;}return s;}","vec3 sunColor(){","  float s=uSunDir.y;","  vec3 c=mix(vec3(1.0,0.42,0.16),vec3(1.0,0.95,0.86),smoothstep(0.0,0.4,s));","  return c*smoothstep(-0.07,0.05,s)*(1.0-0.8*uCover);","}","void skyBase(out vec3 zen,out vec3 hor){","  float s=uSunDir.y;","  float dk=smoothstep(-0.2,0.3,s);","  zen=mix(vec3(0.004,0.008,0.03),uZen,dk);","  hor=mix(vec3(0.02,0.04,0.08),uHor,dk);","  float warm=exp(-(s*4.2)*(s*4.2));","  hor=mix(hor,uWarm,warm*0.75);","  zen=mix(zen,vec3(0.20,0.15,0.35),warm*uDusk);","}","vec3 skyColor(vec3 rd){","  vec3 zen;vec3 hor;skyBase(zen,hor);","  float el=clamp(rd.y,0.0,1.0);","  float sd=max(dot(rd,uSunDir),0.0);","  vec3 sc=sunColor();","  float toward=0.5+0.5*dot(normalize(rd.xz+vec2(1e-5)),normalize(uSunDir.xz+vec2(1e-5)));","  vec3 coolHor=mix(vec3(0.02,0.04,0.08),uHor,smoothstep(-0.2,0.3,uSunDir.y));","  hor=mix(coolHor,hor,0.3+0.7*toward*toward);","  vec3 h2=hor+sc*0.28*pow(sd,5.0)*(1.0-el);","  vec3 col=mix(h2,zen,1.0-exp(-el*5.0));","  float lum=dot(col,vec3(0.299,0.587,0.114));","  col=mix(col,vec3(lum)*vec3(0.9,0.95,1.0),uCover*0.65);","  col+=sc*(pow(sd,300.0)*4.0+pow(sd,24.0)*0.35);","  col+=sc*50.0*smoothstep(0.9997,0.99995,sd);","  if(rd.y>0.005){","    vec2 cp=rd.xz/(rd.y+0.18)*0.8+vec2(uTime*0.006,uTime*0.003);","    float d1=fbm(cp*1.4);","    float d2=fbm(cp*1.4+uSunDir.xz*0.12);","    float cov=smoothstep(mix(0.56,0.22,uCover),mix(0.86,0.55,uCover),d1)*smoothstep(0.0,0.2,rd.y);","    float edge=clamp((d1-d2)*5.0+0.55,0.0,1.0);","    vec3 lit=hor*0.55+sc*1.3;","    vec3 shade=mix(zen,hor,0.5)*0.55+0.02;","    col=mix(col,mix(shade,lit,edge),cov*0.9);","  }","  return col;","}","vec3 aces(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}","vec3 finish(vec3 c){","  c=aces(c*uExposure);","  c=pow(c,vec3(1.0/2.2));","  c+=(hash(gl_FragCoord.xy+fract(uTime))-0.5)/255.0;","  return c;","}"].join(`
`),$=["uniform vec4 uRip[6];","float ripple(vec2 p,out vec2 g){","  float h=0.0;g=vec2(0.0);","  for(int i=0;i<6;i++){","    vec4 r=uRip[i];float age=uTime-r.z;","    if(r.w>0.0&&age>0.0&&age<14.0){","      vec2 dv=p-r.xy;float d=length(dv)+0.0001;","      float x=d-2.0*age;float k=2.4;","      float env=exp(-age*0.45)*exp(-x*x*0.35)/(1.0+d*0.25);","      float ph=k*x;","      h+=r.w*env*cos(ph);","      float dh=r.w*env*(-k*sin(ph)-0.7*x*cos(ph));","      g+=dh*dv/d;","    }","  }","  return h;","}"].join(`
`),he=["varying vec3 vDir;","void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"].join(`
`),oe=te+`
`+["varying vec3 vDir;","void main(){","  vec3 rd=vDir;","  rd.y=max(rd.y,0.0);","  rd=normalize(rd+vec3(0.0,0.00001,0.0)+vec3(0.00001,0.0,0.0));","  gl_FragColor=vec4(finish(skyColor(rd)),1.0);","}"].join(`
`),Me=["precision highp float;","uniform float uTime;","uniform vec4 uWaves[12];","uniform float uPatch;","float patchM(vec2 p){if(uPatch<0.5)return 1.0;float n=0.6*sin(0.19*p.x+1.7+0.9*sin(0.11*p.y))+0.4*sin(0.071*p.x+0.05*p.y+4.1);return 0.22+1.45*smoothstep(-0.15,0.25,n);}","uniform float uChop;","uniform float uHs;","uniform float uFoamAmt;",$,C,"varying vec3 vWorld;","varying vec3 vN;","varying float vFoam;","varying float vH;","void main(){","  vec3 p=(modelMatrix*vec4(position,1.0)).xyz;","  vec3 disp=vec3(0.0);","  float nx=0.0;float nz=0.0;float ny=0.0;","  float jxx=0.0;float jxz=0.0;float jzz=0.0;","  float dv=distance(p,cameraPosition);","  float pm=patchM(p.xz);","  for(int i=0;i<12;i++){","    vec4 w=uWaves[i];","    vec2 D=w.xy;float k=w.w;","    float Lw=6.2831853/k;","    float A=w.z*(1.0-smoothstep(Lw*10.0,Lw*30.0,dv))*pm;","    float c=sqrt(9.81/k);","    float f=k*(dot(D,p.xz)-c*uTime)+float(i)*1.7;","    float s=sin(f);float co=cos(f);","    disp.xz+=D*(uChop*A*co);","    disp.y+=A*s;","    nx+=D.x*k*A*co;nz+=D.y*k*A*co;ny+=uChop*k*A*s;","    float q=uChop*k*A*s;","    jxx+=q*D.x*D.x;jxz+=q*D.x*D.y;jzz+=q*D.y*D.y;","  }","  vec2 rg;","  disp.y+=ripple(p.xz,rg);","  disp.y+=simAt(p.xz).x;","  vN=normalize(vec3(-nx,1.0-ny,-nz));","  vWorld=p+disp;","  vH=disp.y;","  float Jd=(1.0-jxx)*(1.0-jzz)-jxz*jxz;","  float fH=smoothstep(0.55,1.0,disp.y/(0.55*uHs+0.001));","  float fJ=1.0-smoothstep(0.2,0.55,Jd);","  vFoam=max(fH,fJ)*uFoamAmt;","  gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.0);","}"].join(`
`),Ee=te+`
`+$+`
`+C+`
`+["varying vec3 vWorld;","varying vec3 vN;","varying float vFoam;","varying float vH;","uniform float uClarity;","uniform float uCaustic;","uniform float uHs;","uniform float uFlow;","uniform float uRainAmt;","uniform float uFogD;","uniform float uBed;","uniform float uFarR;","float rrHash(vec2 p){vec3 p3=fract(vec3(p.xyx)*0.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}","vec2 rainRings(vec2 p,float hd){","  vec2 g=vec2(0.0);","  float fade=1.0-smoothstep(14.0,46.0,hd);","  if(uRainAmt<0.01||fade<=0.0)return g;","  for(int l=0;l<3;l++){","    float sc=1.5+0.9*float(l);","    vec2 q=p*sc+float(l)*19.7;vec2 id=floor(q);vec2 f=fract(q);","    float h1=rrHash(id+float(l)*5.1),h2=rrHash(id+31.7),h3=rrHash(id+77.3);","    vec2 c=vec2(0.22+0.56*h1,0.22+0.56*h2);","    float per=0.8+0.9*h3;","    float t=fract((uTime+h3*13.0)/per);","    float on=step(h1*1.37-floor(h1*1.37),0.78);","    vec2 dv=f-c;float d=length(dv)+0.0001;","    float R=t*0.36;float x=d-R;float w=0.045;","    float env=exp(-x*x/(w*w))*(1.0-t)*(1.0-t)*on;","    g+=env*cos(x*58.0)*(dv/d)*0.34/(0.7+0.3*float(l));","  }","  return g*fade*uRainAmt;","}","uniform vec4 uWaves[12];","uniform float uWindAng;","uniform float uFoamAmt;","float gAmt;float gPatch;","void detail(vec2 p,float dist,out vec2 g,out float h){","  g=vec2(0.0);h=0.0;","  for(int i=0;i<8;i++){","    float fi=float(i);","    float L=1.9*pow(0.72,fi);","    float k=6.2831853/L;","    float ang=uWindAng+1.6*sin(fi*2.4+1.0);","    vec2 D=vec2(sin(ang),cos(ang));","    float c=sqrt(9.81/k);","    float f=k*(dot(D,p)-c*uTime)+fi*2.13;","    float fade=1.0-smoothstep(L*40.0,L*160.0,dist);","    float sl=0.034*gAmt*gPatch*fade*(0.35+0.65*patchM(p));","    g+=D*(sl*cos(f));","    h+=sl/k*sin(f);","  }","}","void waveField(vec2 p,float dist,out vec2 g,out vec3 H){","  g=vec2(0.0);H=vec3(0.0);","  for(int i=2;i<12;i++){","    vec4 w=uWaves[i];vec2 D=w.xy;float A=w.z;float k=w.w;","    float c=sqrt(9.81/k);","    float f=k*(dot(D,p)-c*uTime)+float(i)*1.7;","    float s=sin(f);float co=cos(f);","    g+=D*(A*k*co);","    float q=-A*k*k*s;","    H+=vec3(D.x*D.x,D.x*D.y,D.y*D.y)*q;","  }","  for(int i=0;i<4;i++){","    float fi=float(i);","    float L=1.9*pow(0.72,fi);","    float k=6.2831853/L;","    float ang=uWindAng+1.6*sin(fi*2.4+1.0);","    vec2 D=vec2(sin(ang),cos(ang));","    float c=sqrt(9.81/k);","    float f=k*(dot(D,p)-c*uTime)+fi*2.13;","    float fade=1.0-smoothstep(L*40.0,L*160.0,dist);","    float sl=0.034*gAmt*gPatch*fade*(0.35+0.65*patchM(p));","    g+=D*(sl*cos(f));","    float q=-sl*k*sin(f);","    H+=vec3(D.x*D.x,D.x*D.y,D.y*D.y)*q;","  }","}","float seaDepth(vec2 p){","  float base=mix(2.0,10.0,smoothstep(-1.5,70.0,p.x));base=mix(base,38.0,smoothstep(80.0,420.0,p.x));","  float n=noise(p*0.025+7.3);","  float dune=0.10*sin(p.x*0.55+sin(p.y*0.23)*2.4)+0.05*sin(p.y*0.9+p.x*0.2);","  return base*(0.7+0.6*n)+dune;","}","float caustic(vec2 uv,float time){","  vec2 p=mod(uv*6.28318530718,6.28318530718)-250.0;","  vec2 i=p;float c=1.0;float inten=0.005;","  for(int n=0;n<5;n++){","    float t=time*(1.0-(3.5/float(n+1)));","    i=p+vec2(cos(t-i.x)+sin(t+i.y),sin(t-i.y)+cos(t+i.x));","    c+=1.0/length(vec2(p.x/(sin(i.x+t)/inten),p.y/(cos(i.y+t)/inten)));","  }","  c/=5.0;","  c=1.17-pow(c,1.4);","  return pow(abs(c),8.0);","}","void main(){","  vec3 toCam=cameraPosition-vWorld;","  float dist=length(toCam);","  vec3 V=toCam/dist;","  vec3 N=normalize(vN);","  vec2 p=vWorld.xz;","  float hd=length(toCam.xz);","  vec4 sv=simAt(p);","  float detailAmt=1.0-smoothstep(30.0,220.0,hd);","#ifdef FAR","  detailAmt=0.0;","#endif","  vec2 dg=vec2(0.0);","  if(detailAmt>0.01){","    float e=0.05;","    vec2 q1=p*0.9+vec2(uTime*0.30,uTime*0.18);","    vec2 q2=p*1.55-vec2(uTime*0.22,-uTime*0.27);","    float h0=fbm3(q1)+0.6*fbm3(q2);","    float hx=fbm3(q1+vec2(e,0.0))+0.6*fbm3(q2+vec2(e,0.0));","    float hz=fbm3(q1+vec2(0.0,e))+0.6*fbm3(q2+vec2(0.0,e));","    dg=vec2(hx-h0,hz-h0)/e*0.16*detailAmt*(0.4+0.6*min(uHs,1.5))*(0.22+0.78*smoothstep(0.05,0.6,uHs));","  }","  vec2 rg;float rh=ripple(p,rg);rg+=rainRings(p,hd);","  N=normalize(vec3(N.x-dg.x-rg.x-sv.y,N.y,N.z-dg.y-rg.y-sv.z));","  N=normalize(mix(N,vec3(0.0,1.0,0.0),smoothstep(60.0,420.0,hd)*0.55));","  float nv=dot(N,V);","  if(nv<0.03){N=normalize(N+V*(0.03-nv));nv=max(dot(N,V),0.001);}","  vec3 zen;vec3 hor;skyBase(zen,hor);","  vec3 sc=sunColor();","  float dayf=smoothstep(-0.2,0.3,uSunDir.y);","  float sunUp=smoothstep(-0.05,0.1,uSunDir.y);","  vec3 ambCol=mix(hor,zen,0.5);","  float ambLum=dot(ambCol,vec3(0.299,0.587,0.114));","  vec3 R=reflect(-V,N);R.y=abs(R.y);","  vec3 refl=skyColor(R);","  float F=min(0.02+0.98*pow(1.0-clamp(nv,0.0,1.0),5.0),0.98);","  vec3 absK=vec3(0.42,0.11,0.025)*(1.55-uClarity*1.1);","  vec3 waterCol=vec3(0.004,0.07,0.30)*(0.12+ambLum*1.6)*(1.0+0.6*dot(sc,vec3(0.333))*max(uSunDir.y,0.0));","  vec3 Nr=normalize(mix(N,vec3(0.0,1.0,0.0),0.55));","  vec3 T=refract(-V,Nr,0.7502);","  float smax=70.0;float s0=0.0;float s1=0.0;bool hit=false;","#ifndef FAR","  for(int i=1;i<=24;i++){","    float fi=float(i)/24.0;","    s1=fi*fi*smax;","    vec3 q=vWorld+T*s1;","    if(q.y<-seaDepth(q.xz)){hit=true;break;}","    s0=s1;","  }","#endif","  vec3 body=waterCol;","#ifdef FAR","  hit=false;","#endif","  if(hit){","    for(int j=0;j<6;j++){","      float m=0.5*(s0+s1);vec3 q=vWorld+T*m;","      if(q.y<-seaDepth(q.xz)){s1=m;}else{s0=m;}","    }","    vec3 hp=vWorld+T*s1;","    float path=s1;","    float colDepth=max(vWorld.y-hp.y,0.05);","    vec2 h2=hp.xz;","    float sandN=noise(h2*0.35)*0.5+noise(h2*1.7)*0.3+noise(h2*9.0)*0.2;","    float ra=h2.x*2.6+sin(h2.y*0.37)*2.5+noise(h2*0.5)*3.0;","    float rip=0.5+0.5*sin(ra);","    float grain=noise(h2*34.0);","    float speck=smoothstep(0.90,0.96,noise(h2*17.0+5.0));","    vec3 sand=mix(vec3(0.40,0.36,0.29),vec3(0.62,0.56,0.44),sandN)*uBed;","    sand*=0.84+0.16*rip;","    sand*=0.92+0.16*grain;","    sand=mix(sand,vec3(0.9,0.86,0.78),speck*0.15);","    float gx=0.10*cos(ra)+0.04*(noise(h2*34.0+vec2(0.07,0.0))-grain)*14.0;","    float gz=0.05*cos(h2.y*0.9+h2.x*0.2)+0.04*(noise(h2*34.0+vec2(0.0,0.07))-grain)*14.0;","    vec3 bn=normalize(vec3(-gx,1.0,-gz));","    vec3 Lr=refract(-uSunDir,vec3(0.0,1.0,0.0),0.7502);","    float lp=colDepth/max(-Lr.y,0.2);","    vec2 ce=h2-Lr.xz*lp;","    vec2 wob=vec2(noise(ce*0.3+3.1),noise(ce*0.3+9.7))-0.5;","    vec2 cuv=ce*0.09+wob*0.25;","    float cA=caustic(cuv,uTime*0.55);","    float cB=caustic(cuv*1.618+0.41,uTime*0.42+9.0);","    float cc=cA*0.6+cB*0.4;","    float sharp=1.0-smoothstep(1.5,16.0,colDepth);","    float cm=clamp(1.0+uCaustic*(cc*2.2*(0.2+0.8*sharp)-0.3),0.25,2.8);","    vec3 sunAbs=exp(-absK*lp);","    vec3 bedRad=sand*(sc*2.0*max(dot(bn,-Lr),0.0)*sunAbs*cm*sunUp+ambCol*0.55*exp(-absK*colDepth*1.2));","    vec3 trans=exp(-absK*path);","    float scat=1.0-exp(-path*0.16*(1.6-uClarity));","    body=bedRad*trans+waterCol*scat;","  }","  float crest=smoothstep(0.0,0.9,vH/(0.5*uHs+0.05));","  float sss=pow(max(dot(-V,uSunDir),0.0),3.0)*crest*dayf*sunUp;","  body+=vec3(0.05,0.42,0.30)*sc*sss*0.9;","  vec3 H=normalize(uSunDir+V);","  float NdH=max(dot(N,H),0.0);","  float Fh=0.02+0.98*pow(1.0-max(dot(H,V),0.0),5.0);","  float rf=smoothstep(30.0,300.0,hd);","  float spec=pow(NdH,mix(900.0,220.0,rf))*mix(28.0,10.0,rf)+pow(NdH,120.0)*1.4+pow(NdH,18.0)*0.05;","  vec3 col=body*(1.0-F)+refl*F+sc*spec*Fh;","  float ft=fbm3(p*1.1+vec2(uTime*0.08,0.0))*0.6+fbm3(p*3.7-vec2(0.0,uTime*0.15))*0.4;","  float foam=vFoam*smoothstep(0.30,0.62,ft+vFoam*0.35);","  foam=max(foam,smoothstep(0.18,0.7,sv.w*(0.55+0.9*ft)));","  foam*=1.0-smoothstep(120.0,260.0,hd);","  vec3 foamCol=vec3(0.93,0.97,1.0)*(sc*max(dot(N,uSunDir),0.0)*0.85+ambCol*0.95+0.02);","  col=mix(col,foamCol,clamp(foam,0.0,1.0)*0.92);","  float fog=max(1.0-exp(-pow(hd/uFogD,1.5)),smoothstep(uFarR*0.6,uFarR*0.95,hd));","  vec3 fd=-V;fd.y=0.02;fd=normalize(fd);","  col=mix(col,skyColor(fd),fog);","  gl_FragColor=vec4(finish(col),1.0);","}"].join(`
`),j=["precision highp float;","uniform float uTime;","uniform vec4 uWaves[12];","uniform float uPxScale;","varying float vAlpha;","varying float vDist;","float surfH(vec2 p,float t){","  float h=0.0;","  for(int i=0;i<12;i++){vec4 w=uWaves[i];float k=w.w;float c=sqrt(9.81/k);h+=w.z*sin(k*(dot(w.xy,p)-c*t)+float(i)*1.7);}","  return h;","}","float rnd(vec2 v){return fract(sin(dot(v,vec2(12.9898,78.233)))*43758.5453);}"].join(`
`),He=j+`
`+["uniform float uHs;","uniform float uFoamAmt;","uniform float uSpray;","uniform vec2 uWind;","attribute vec4 aSeed;","void main(){","  vAlpha=0.0;vDist=0.0;","  vec2 cam=cameraPosition.xz;","  float R=110.0;float LIFE=1.5;","  vec2 base=aSeed.xy*R;","  vec2 p0=cam+mod(base-cam+R*0.5,R)-R*0.5;","  float cyc=uTime/LIFE+aSeed.z;","  float n=floor(cyc);float ph=fract(cyc);","  float ts=(n-aSeed.z)*LIFE;","  float r1=rnd(vec2(n,aSeed.w*91.7));","  float r2=rnd(vec2(n+3.1,aSeed.w*57.3));","  float r3=rnd(vec2(n+7.7,aSeed.w*13.9));","  vec2 sp=p0+(vec2(r1,r2)-0.5)*30.0;","  float h0=surfH(sp,ts);","  float crest=h0/(0.5*uHs+0.01);","  float emit=step(0.6,crest)*step(r3,uFoamAmt*uSpray*1.5);","  float age=ph*LIFE;","  float vy=1.0+3.0*r2*(0.5+0.35*uHs);","  vec2 vh=uWind*(2.0+5.0*r1)+(vec2(r3,r1)-0.5)*1.6;","  vec3 wp=vec3(sp.x+vh.x*age,h0+0.1+vy*age-5.5*age*age,sp.y+vh.y*age);","  float d=length(wp.xz-cam);","  float dc=distance(wp,cameraPosition);","  float fade=(1.0-smoothstep(R*0.30,R*0.46,d))*(1.0-smoothstep(70.0,105.0,dc));","  float a=emit*fade*(1.0-ph)*smoothstep(0.0,0.08,ph)*0.85;","  if(a<0.01||wp.y<h0-0.15){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;return;}","  vAlpha=a;vDist=dc;","  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);","  float sz=(0.05+0.10*r2)*(1.2-0.5*ph);","  gl_PointSize=clamp(sz*uPxScale/gl_Position.w,1.5,48.0);","}"].join(`
`),Oe=j+`
`+["uniform vec4 uBurst[6];","attribute vec4 aSeed;","attribute float aId;","void main(){","  vAlpha=0.0;vDist=0.0;","  vec4 b=uBurst[int(aId+0.5)];","  float age=uTime-b.z;","  if(b.w<=0.0||age<0.0||age>3.0){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;return;}","  float th=aSeed.x*6.2831853;","  float sp=(0.6+2.8*aSeed.y*aSeed.y)*b.w;","  float vy=(2.5+4.5*aSeed.z)*(0.2+0.9*b.w);","  float land=2.0*vy/9.8;","  if(age>land){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;return;}","  float y0=surfH(b.xy,uTime);","  vec3 wp=vec3(b.x+cos(th)*sp*age,y0+0.05+vy*age-4.9*age*age,b.y+sin(th)*sp*age);","  float dc=distance(wp,cameraPosition);","  vAlpha=(1.0-age/land)*smoothstep(0.0,0.05,age)*0.9;vDist=dc;","  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);","  float sz=(0.02+0.06*aSeed.w)*(0.5+0.5*b.w);","  gl_PointSize=clamp(sz*uPxScale/gl_Position.w,1.5,40.0);","}"].join(`
`),De=te+`
`+["varying float vAlpha;","varying float vDist;","void main(){","  vec2 c=gl_PointCoord-0.5;","  float r=dot(c,c)*4.0;","  float a=smoothstep(1.0,0.35,r)*vAlpha;","  if(a<0.01)discard;","  vec3 zen;vec3 hor;skyBase(zen,hor);","  vec3 sc=sunColor();","  vec3 amb=mix(hor,zen,0.5);","  vec3 col=vec3(0.95,0.98,1.0)*(sc*0.8+amb*0.9+0.02);","  float fog=max(1.0-exp(-pow(vDist/190.0,1.5)),smoothstep(150.0,250.0,vDist));","  col=mix(col,hor,fog);","  gl_FragColor=vec4(finish(col),a);","}"].join(`
`),be=new Ye(new xs(a*1.05,32,16),new Zt({uniforms:b,vertexShader:he,fragmentShader:oe,side:lt,depthTest:!1,depthWrite:!1}));be.frustumCulled=!1,be.renderOrder=-1,r.add(be);function Ge(X,Q,H){var q=new Float32Array((X+1)*Q*3),ee=[],W,J,pe,Ce,x;for(W=0;W<=X;W++)for(pe=W/X,Ce=H*pe*pe,J=0;J<Q;J++){x=J/Q*Math.PI*2;var k=(W*Q+J)*3;q[k]=Math.cos(x)*Ce,q[k+1]=0,q[k+2]=Math.sin(x)*Ce}for(W=0;W<X;W++)for(J=0;J<Q;J++){var P=(J+1)%Q,G=W*Q+J,ie=W*Q+P,Pe=(W+1)*Q+J,ve=(W+1)*Q+P;ee.push(G,ie,Pe,ie,ve,Pe)}var we=new Ve;return we.setAttribute("position",new Ze(q,3)),we.setIndex(new Ze(new Uint32Array(ee),1)),we}var Fe=new Ye(Ge(n?300:440,n?440:640,260),new Zt({uniforms:b,vertexShader:Me,fragmentShader:Ee,side:Nn}));Fe.frustumCulled=!1,r.add(Fe);function ze(X,Q,H,q){var ee=new Float32Array((H+1)*q*3),W=[],J,pe,Ce=Math.pow(Q/X,1/H);for(J=0;J<=H;J++)for(pe=0;pe<q;pe++){var x=pe/q*Math.PI*2,k=X*Math.pow(Ce,J),P=(J*q+pe)*3;ee[P]=Math.cos(x)*k,ee[P+1]=0,ee[P+2]=Math.sin(x)*k}for(J=0;J<H;J++)for(pe=0;pe<q;pe++){var G=(pe+1)%q;W.push(J*q+pe,J*q+G,(J+1)*q+pe,J*q+G,(J+1)*q+G,(J+1)*q+pe)}var ie=new Ve;return ie.setAttribute("position",new Ze(ee,3)),ie.setIndex(W),ie}var ne=new Ye(ze(255,a,n?40:64,n?192:320),new Zt({uniforms:b,vertexShader:Me,fragmentShader:`#define FAR
`+Ee,side:Nn}));ne.frustumCulled=!1,ne.renderOrder=-.5,r.add(ne);function re(X,Q){var H=new Ve,q=new Float32Array(X*4),ee=new Float32Array(X),W;for(W=0;W<X*4;W++)q[W]=Math.random();for(W=0;W<X;W++)ee[W]=Math.floor(W/(X/6));H.setAttribute("position",new Ze(new Float32Array(X*3),3)),H.setAttribute("aSeed",new Ze(q,4)),Q&&H.setAttribute("aId",new Ze(ee,1));var J=new Lc(H,new Zt({uniforms:V,vertexShader:Q?Oe:He,fragmentShader:De,transparent:!0,depthWrite:!1,depthTest:!0}));return J.frustumCulled=!1,J.renderOrder=2,J}r.add(re(n?3500:7e3,!1)),r.add(re(6*140,!0));function le(){var X=i.wind*Math.PI/180,Q=0,H=0,q;for(q=0;q<d.length;q++){var ee=X+m[q],W=d[q]*f[q]*i.height,J=2*Math.PI/d[q];b.uWaves.value[q].set(Math.sin(ee),Math.cos(ee),W,J),Q+=W*W,H+=J*W}var pe=4*Math.sqrt(Q/2),Ce=H>0?Math.min(i.chop,1.2/H):i.chop;b.uChop.value=Ce,V.uWind.value.set(Math.sin(X),Math.cos(X)),b.uWindAng.value=X,b.uHs.value=Math.max(pe,.02),b.uFoamAmt.value=Math.max(0,Math.min(1,(pe-.7)/1.8))*(.5+.5*Math.min(i.chop,1))}function ye(){var X=i.sun*Math.PI/180;i.az!==void 0&&(s=i.az*Math.PI/180),b.uSunDir.value.set(Math.cos(X)*Math.sin(s),Math.sin(X),-Math.cos(X)*Math.cos(s))}var ce=0,T=0;function w(X,Q,H){var q=b.uTime.value;S(X,Q,-.3*H,.8,.9*H)||(b.uRip.value[T].set(X,Q,q,.35*H),T=(T+1)%b.uRip.value.length),V.uBurst.value[ce].set(X,Q,q,Math.max(.1,Math.min(1,H))),ce=(ce+1)%V.uBurst.value.length}var O={ctx:null,on:!1,wanted:!0,n:null,gust:1,gustT:1,gustClock:0,lap:0,thunder:22};function Z(X,Q,H){for(var q=X.sampleRate,ee=Math.floor(Q*q),W=Math.floor(.6*q),J=X.createBuffer(2,ee,q),pe=0;pe<2;pe++){var Ce=new Float32Array(ee+W),x,k,P,G=0,ie=0,Pe=0,ve=0,we=0,Be=0,Te=0,ke=0;for(x=0;x<ee+W;x++)P=Math.random()*2-1,H==="white"?k=P:H==="pink"?(G=.99886*G+P*.0555179,ie=.99332*ie+P*.0750759,Pe=.969*Pe+P*.153852,ve=.8665*ve+P*.3104856,we=.55*we+P*.5329522,Be=-.7616*Be-P*.016898,k=(G+ie+Pe+ve+we+Be+Te+P*.5362)*.11,Te=P*.115926):(ke=(ke+.02*P)/1.02,k=ke*3.5),Ce[x]=k;var Ae=J.getChannelData(pe),We=0;for(x=0;x<ee;x++)Ae[x]=Ce[x];for(x=0;x<W;x++){var Pt=x/W;Ae[x]=Ce[x]*Math.sin(Pt*Math.PI/2)+Ce[ee+x]*Math.cos(Pt*Math.PI/2)}for(x=0;x<ee;x++)We+=Ae[x]*Ae[x];var pt=.2/Math.sqrt(We/ee+1e-9);for(x=0;x<ee;x++)Ae[x]*=pt}return J}function fe(X,Q,H){for(var q=Math.floor(Q*X.sampleRate),ee=X.createBuffer(2,q,X.sampleRate),W=0;W<2;W++)for(var J=ee.getChannelData(W),pe=0;pe<q;pe++)J[pe]=(Math.random()*2-1)*Math.pow(1-pe/q,H);return ee}function ge(){if(O.ctx)return;var X=window.AudioContext||window.webkitAudioContext;if(!X)return;var Q=new X,H={};O.ctx=Q,O.n=H,H.master=Q.createGain(),H.master.gain.value=0;var q=Q.createDynamicsCompressor();q.threshold.value=-16,q.ratio.value=3,q.attack.value=.02,q.release.value=.3,H.master.connect(q),q.connect(Q.destination),H.verb=Q.createConvolver(),H.verb.buffer=fe(Q,2.4,3);var ee=Q.createGain();ee.gain.value=.5,H.verb.connect(ee),ee.connect(H.master),H.pink=Z(Q,10,"pink"),H.brown=Z(Q,10,"brown"),H.white=Z(Q,6,"white");function W(Ce){var x=Q.createBufferSource();return x.buffer=Ce,x.loop=!0,x.start(0,Math.random()*Ce.duration),x}function J(Ce,x,k){var P=Q.createBiquadFilter();return P.type=Ce,P.frequency.value=x,P.Q.value=k,P}function pe(Ce,x,k){var P=Ce;x.forEach(function(G){P.connect(G),P=G}),P.connect(k)}H.wLP=J("lowpass",1200,.4),H.wG=Q.createGain(),H.wG.gain.value=0,pe(W(H.pink),[H.wLP,H.wG],H.master),H.rG=Q.createGain(),H.rG.gain.value=0,pe(W(H.brown),[J("lowpass",220,.5),H.rG],H.master),H.dBP=J("bandpass",520,.6),H.dG=Q.createGain(),H.dG.gain.value=0,pe(W(H.pink),[H.dBP,H.dG],H.master),H.whBP=J("bandpass",1100,9),H.whG=Q.createGain(),H.whG.gain.value=0,pe(W(H.white),[H.whBP,H.whG],H.master),H.hG=Q.createGain(),H.hG.gain.value=0,pe(W(H.white),[J("highpass",4500,.5),H.hG],H.master)}function Ne(X,Q,H){var q=O.ctx,ee=O.n,W=X;if(q.createStereoPanner){var J=q.createStereoPanner();J.pan.value=Math.max(-1,Math.min(1,Q)),X.connect(J),W=J}if(W.connect(ee.master),H){var pe=q.createGain();pe.gain.value=H,W.connect(pe),pe.connect(ee.verb)}}function Se(X,Q,H,q,ee,W,J,pe,Ce){var x=O.ctx,k=x.createBufferSource();k.buffer=X;var P=x.createBiquadFilter();P.type=W,P.frequency.value=q,P.Q.value=ee;var G=x.createGain();G.gain.setValueAtTime(1e-4,Q),G.gain.exponentialRampToValueAtTime(J,Q+.006),G.gain.exponentialRampToValueAtTime(1e-4,Q+H),k.connect(P),P.connect(G),Ne(G,pe,Ce),k.start(Q,Math.random()*(X.duration-H-.2)),k.stop(Q+H+.05)}function I(){var X=O.ctx,Q=O.n,H=X.currentTime+.1,q=5.5,ee,W=X.createBufferSource();W.buffer=Q.brown;var J=X.createBiquadFilter();J.type="lowpass",J.Q.value=.8,J.frequency.setValueAtTime(420,H),J.frequency.exponentialRampToValueAtTime(70,H+q);var pe=new Float32Array(48),Ce=0;for(ee=0;ee<pe.length;ee++){var x=ee/(pe.length-1);Ce=.55*Ce+.45*Math.random(),pe[ee]=Math.min(1,Math.sin(Math.min(x*14,Math.PI/2)))*Math.pow(1-x,1.6)*(.5+Ce)*1.3}var k=X.createGain();k.gain.setValueAtTime(0,H),k.gain.setValueCurveAtTime(pe,H,q),W.connect(J),J.connect(k),Ne(k,(Math.random()*2-1)*.6,.5),W.start(H,Math.random()*4),W.stop(H+q+.1)}function ae(X,Q){var H=e.matrixWorld.elements,q=X-e.position.x,ee=Q-e.position.z,W=Math.sqrt(q*q+ee*ee)+.01;return{d:W,pan:Math.max(-1,Math.min(1,(q*H[0]+ee*H[2])/W))}}function ue(X,Q,H){if(O.on){var q=O.ctx,ee=O.n,W=q.currentTime+.01,J,pe=ae(X,Q),Ce=Math.min(1.6,H||1)/(1+pe.d/12),x=pe.pan,k=q.createBufferSource();k.buffer=ee.white;var P=q.createBiquadFilter();P.type="lowpass",P.Q.value=.7,P.frequency.setValueAtTime(5e3,W),P.frequency.exponentialRampToValueAtTime(350,W+.5);var G=q.createGain();G.gain.setValueAtTime(1e-4,W),G.gain.exponentialRampToValueAtTime(.7*Ce,W+.012),G.gain.exponentialRampToValueAtTime(1e-4,W+.55),k.connect(P),P.connect(G),Ne(G,x,.35),k.start(W,Math.random()*3),k.stop(W+.6);var ie=q.createOscillator();ie.type="sine",ie.frequency.setValueAtTime(240,W),ie.frequency.exponentialRampToValueAtTime(62,W+.2);var Pe=q.createGain();for(Pe.gain.setValueAtTime(1e-4,W),Pe.gain.exponentialRampToValueAtTime(.5*Ce,W+.01),Pe.gain.exponentialRampToValueAtTime(1e-4,W+.26),ie.connect(Pe),Ne(Pe,x,.15),ie.start(W),ie.stop(W+.3),J=0;J<5;J++){var ve=W+.04+Math.random()*.4,we=500+Math.random()*1800,Be=q.createOscillator();Be.type="sine",Be.frequency.setValueAtTime(we,ve),Be.frequency.exponentialRampToValueAtTime(we*1.9,ve+.07);var Te=q.createGain();Te.gain.setValueAtTime(1e-4,ve),Te.gain.exponentialRampToValueAtTime(.1*Ce,ve+.008),Te.gain.exponentialRampToValueAtTime(1e-4,ve+.09),Be.connect(Te),Ne(Te,x+(Math.random()-.5)*.2,.25),Be.start(ve),Be.stop(ve+.1)}}}function _e(X,Q,H){if(O.on){var q=O.ctx,ee=O.n,W=q.currentTime+.005,J=ae(X,Q),pe=.9/(1+J.d/12),Ce=q.createBufferSource();Ce.buffer=ee.white;var x=q.createBiquadFilter();x.type="bandpass",x.Q.value=1.2,x.frequency.setValueAtTime(2600+H*60,W),x.frequency.exponentialRampToValueAtTime(900,W+.09);var k=q.createGain();k.gain.setValueAtTime(1e-4,W),k.gain.exponentialRampToValueAtTime(.5*pe,W+.004),k.gain.exponentialRampToValueAtTime(1e-4,W+.12),Ce.connect(x),x.connect(k),Ne(k,J.pan,.3),Ce.start(W,Math.random()*3),Ce.stop(W+.15);var P=q.createOscillator();P.type="sine",P.frequency.setValueAtTime(900+H*20,W),P.frequency.exponentialRampToValueAtTime(260,W+.06);var G=q.createGain();G.gain.setValueAtTime(1e-4,W),G.gain.exponentialRampToValueAtTime(.18*pe,W+.004),G.gain.exponentialRampToValueAtTime(1e-4,W+.08),P.connect(G),Ne(G,J.pan,.1),P.start(W),P.stop(W+.1)}}function K(X){if(O.on){var Q=O.ctx,H=O.n,q=Q.currentTime+.005,ee=Q.createBufferSource();ee.buffer=H.pink;var W=Q.createBiquadFilter();W.type="bandpass",W.Q.value=1.4,W.frequency.setValueAtTime(500,q),W.frequency.exponentialRampToValueAtTime(1500+X*40,q+.14),W.frequency.exponentialRampToValueAtTime(400,q+.4);var J=Q.createGain();J.gain.setValueAtTime(1e-4,q),J.gain.exponentialRampToValueAtTime(.6,q+.12),J.gain.exponentialRampToValueAtTime(1e-4,q+.42),ee.connect(W),W.connect(J),Ne(J,0,.2),ee.start(q,Math.random()*3),ee.stop(q+.45)}}function Ie(X,Q,H){for(var q=0,ee=b.uWaves.value,W=0;W<ee.length;W++){var J=ee[W],pe=J.w,Ce=Math.sqrt(o/pe);q+=J.z*Math.sin(pe*(J.x*X+J.y*Q-Ce*H)+W*1.7)}return q}function je(X){if(!(!O.on||!O.n)){var Q=O.ctx,H=O.n,q=Q.currentTime,ee=b.uHs.value,W=Math.min(ee/2.4,1),J=Math.max(-1,Math.min(1,Ie(e.position.x,e.position.z,b.uTime.value)/(.45*ee+.05))),pe=Math.pow(Math.max(0,J*.5+.5),2.2),Ce=1/(1+Math.max(0,e.position.y-1.5)/18),x=Math.min(1,.2+.5*W+.3*i.cover);for(O.gustClock-=X,O.gustClock<=0&&(O.gustClock=2+Math.random()*3,O.gustT=.6+Math.random()*.7),O.gust+=(O.gustT-O.gust)*(1-Math.exp(-X*.7)),H.wG.gain.setTargetAtTime((.04+.4*W)*(.25+pe)*(.55+.45*Ce),q,.12),H.wLP.frequency.setTargetAtTime(500+3200*pe*(.4+W),q,.12),H.rG.gain.setTargetAtTime((.04+.3*W)*(.4+.9*pe),q,.2),H.dG.gain.setTargetAtTime((.03+.3*x)*O.gust*(.6+.8*(1-Ce)),q,.3),H.dBP.frequency.setTargetAtTime(380+520*x*O.gust,q,.3),H.whG.gain.setTargetAtTime(Math.max(0,x-.6)*.06*O.gust,q,.4),H.hG.gain.setTargetAtTime(.035*i.spray*b.uFoamAmt.value*(.3+pe)+(c?.03:0),q,.2),O.lap+=X*(1.2+7*W*Math.min(i.chop,1.2))*(.4+.6*Ce);O.lap>=1;){O.lap-=1;var k=Math.random();Se(H.white,q+Math.random()*.05,.07+k*.18,900+k*2400,2+k*4,"bandpass",.03+.06*Math.random()*(.5+W),(Math.random()*2-1)*.8,.1)}O.thunder-=X,O.thunder<=0&&(O.thunder=14+Math.random()*24,c&&I())}}function st(){O.n&&O.n.master.gain.setTargetAtTime(O.on?i.volume:0,O.ctx.currentTime,.25)}function Qt(X){O.wanted=X,X&&(ge(),O.ctx&&O.ctx.resume&&O.ctx.resume()),O.on=X&&!!O.ctx,st()}document.addEventListener("visibilitychange",function(){O.ctx&&(document.hidden?O.ctx.suspend():O.on&&O.ctx.resume())});function it(X,Q,H){var q=X.water;i.height=Q.height,i.chop=q==="sea"?1:q==="patchy"?.85:q==="river"?.5:.25,i.clarity=q==="lake"?.9:q==="sea"?.62:.72,b.uPatch.value=q==="patchy"?1:0,i.cover=X.rain?.88:.18,i.sun=X.rain?22:11,H&&(i.sun=H.sun,i.az=H.az,i.cover=H.cover,H.clarity!==void 0&&(i.clarity=H.clarity),b.uExposure.value=H.exposure||1,b.uFogD.value=H.fogD||1400,H.warm&&b.uWarm.value.set(H.warm[0],H.warm[1],H.warm[2]),H.zen&&b.uZen.value.set(H.zen[0],H.zen[1],H.zen[2]),H.hor&&b.uHor.value.set(H.hor[0],H.hor[1],H.hor[2]),b.uDusk.value=H.dusk!==void 0?H.dusk:.35,b.uBed.value=H.bed||1),i.spray=X.rain?1.3:1,c=!!X.rain,l=X.waves.toff,b.uFlow.value=-Q.flow*Q.flowDir,b.uRainAmt.value=X.rain?1:0,b.uCover.value=i.cover,b.uClarity.value=i.clarity,b.uCaustic.value=i.caustics,V.uSpray.value=i.spray,le(),ye();for(var ee=0;ee<A.length;ee++)A[ee]=0,L[ee]=0,_[ee]=0,F[ee]=0;h=0}function Ut(X,Q){if(b.uTime.value=Q+l,h+=X,h>24&&!c){h-X<=24&&(A.fill(0),L.fill(0),_.fill(0),F.fill(0),E());return}u+=Math.min(X,.05);for(var H=0,q=1/60;u>=q&&H<2;)u-=q,H++,z(q);c&&Math.random()<.5&&S((Math.random()-.4)*40,(Math.random()-.5)*30,-.02-Math.random()*.04,.3,.2),H&&E()}function Rt(X,Q){be.position.copy(e.position),Fe.position.set(X===void 0?e.position.x:X,0,Q===void 0?e.position.z:Q),ne.position.copy(Fe.position)}function Vs(){return b.uSunDir.value}function Tr(){var X=b.uSunDir.value.y,Q=Math.max(0,Math.min(1,X/.4));return new xe(1,.42+.53*Q,.16+.7*Q)}function Er(X,Q){V.uPxScale.value=X*.5/Math.tan(Q*Math.PI/360)}return{setCondition:it,uniforms:b,simBusy:function(){return h<=24||c},update:Ut,follow:Rt,sky:function(){return be},sunDir:Vs,sunColor:Tr,pixelScale:Er,splash:w,hs:function(){return b.uHs.value},audio:{start:function(X){O.ctx?O.ctx.resume&&O.ctx.resume():Qt(X!==!1)},setOn:function(X){Qt(X)},tick:function(X){je(X)},splash:ue,skip:_e,whoosh:K}}}const Pv="./assets/stone/",rs=.048,Wl={slate:{r:rs,h:.0072,sx:1.12,sz:.9,wob:1,tint:12172477,seed:41},oval:{r:rs*.92,h:.0105,sx:1.3,sz:.82,wob:.5,tint:14274498,seed:17},pebble:{r:rs*.78,h:.016,sx:1.05,sz:.98,wob:.3,tint:10131604,seed:5},chunk:{r:rs*1.05,h:.022,sx:1.08,sz:.92,wob:1.6,tint:11051674,seed:29}};function Dv(r){const e=[];for(let l=0;l<=28;l++){const c=l/28*Math.PI,u=Math.sin(c);e.push(new se(u<1e-4?0:r.r*Math.pow(u,.22),r.h*Math.cos(c)))}e.reverse();const n=new g0(e,128),i=n.attributes.position,s=Jc(r.seed+11),a=n.attributes.uv,o=Jt.mulberry(r.seed)()*6.28;for(let l=0;l<i.count;l++){let c=i.getX(l),u=i.getY(l),h=i.getZ(l);const d=Math.atan2(h,c),f=Math.hypot(c,h)/r.r,m=1+r.wob*(.045*Math.sin(d*2+o)+.03*Math.sin(d*3+1.1)+.02*Math.sin(d*5+.3)+(s(Math.cos(d)*2+3,Math.sin(d)*2+3,3)-.5)*.08);c*=m*r.sx,h*=m*r.sz;const v=(s(c*60+5,h*60+2,4)-.5)*.0026*f*(1-f*.4);u=u*(1+.18*Math.sin(d*2+.7))+Math.sign(u||1)*v,i.setXYZ(l,c,u,h),a.setXY(l,c/(r.r*2.4)+.5+(u>0?0:.37),h/(r.r*2.4)+.5)}return n.computeVertexNormals(),n}function Iv(r,e){const t=new zc,n=Math.min(8,r.capabilities.getMaxAnisotropy()),i=(u,h)=>{const d=t.load(Pv+u);return d.wrapS=d.wrapT=hs,d.repeat.set(.16,.16),d.offset.set(.31,.57),d.anisotropy=n,h&&(d.encoding=ki),d},s=new Dc({map:i("rock_surface_diff_1k.jpg",!0),normalMap:i("rock_surface_nor_gl_1k.jpg"),roughnessMap:i("rock_surface_rough_1k.jpg"),normalScale:new se(.9,.9),roughness:.92,metalness:0,clearcoat:.22,clearcoatRoughness:.5,envMapIntensity:1}),a={},o=new Ye(void 0,s),l=new Bt;l.add(o),e.add(l);function c(u){const h=Wl[u]||Wl.slate;a[u]||(a[u]=Dv(h)),o.geometry=a[u],s.color.setHex(h.tint)}return c("slate"),{group:l,mesh:o,mat:s,setKind:c}}function Fv(r,e,t,n,i){const s=r==="low"?64:112,a=new uc(2*t,2*t,s,s);a.rotateX(-Math.PI/2);const o=Jc(e),l=a.attributes.position,c=new Float32Array(l.count*3),u=new xe,h=new xe(7301208),d=new xe(1319962),f=new xe(2241567),m=new xe(4736842);for(let v=0;v<l.count;v++){const y=l.getX(v),g=l.getZ(v),p=Math.atan2(g,y),R=1+.18*Math.sin(p*3+e)+.12*Math.sin(p*5+e*2)+(o(Math.cos(p)*1.5+4,Math.sin(p)*1.5+4,3)-.5)*.5,A=Math.hypot(y/i,g)/(t*.82*R/Math.max(1,i*.6)),L=o(y/t*2.2+7,g/t*2.2+3,5),_=Math.max(0,1-A),F=A>=1?-6:n*Math.pow(_,1.35)*(.55+.9*L)+1.5*_;l.setY(v,F);const D=F/n;F<4?u.copy(h):D>.62?u.copy(f).lerp(m,Math.min(1,(D-.62)*2.5)):u.copy(d).lerp(f,L),c[v*3]=u.r,c[v*3+1]=u.g,c[v*3+2]=u.b}return a.setAttribute("color",new Ze(c,3)),a.computeVertexNormals(),new Ye(a,new Ot({vertexColors:!0,roughness:1,metalness:0,envMapIntensity:.12}))}function Cn(r,e,t,n,i,s,a,o){const l=new Ye(new Ls(r,e,t),new Ot({color:n,roughness:.8,metalness:.1}));return l.position.set(i,s,a),o.add(l),l}function Nv(){const r=new Bt,e=Jt.mulberry(5);Cn(176,10,28,2896184,0,3,0,r),Cn(176.5,2.2,28.4,8203042,0,-1.4,0,r);const t=new Ye(new Di(.1,14,22,4,1),new Ot({color:2896184,roughness:.8}));t.rotation.set(0,Math.PI/4,-Math.PI/2),t.scale.set(1,1,.72),t.position.set(99,3,0),r.add(t);const n=[9059118,3104124,10259020,5073738,8028038,11886895,3490383];for(let i=0;i<9;i++)for(let s=0;s<4;s++){const a=2+Math.floor(e()*3);for(let o=0;o<a;o++)Cn(12,2.6,2.6,n[Math.floor(e()*n.length)],50-i*13.5,9.3+o*2.6,-9+s*6,r).scale.z=2.2}return Cn(18,18,24,15131868,-74,17,0,r),Cn(10,6,26,15131868,-72,28,0,r),Cn(5,9,5,9055524,-82,30,0,r),r}function zv(){const r=new Bt,e=new Ot({color:15921386,roughness:.6,side:Nn}),t=new Ye(new xs(1,20,10,0,Math.PI*2,Math.PI/2,Math.PI/2),e);t.scale.set(5.5,-1.3,1.6),t.position.y=.6,r.add(t);const n=new Ye(new Di(.07,.1,13,6),new Ot({color:12566463,metalness:.6,roughness:.4}));n.position.set(.6,7,0),r.add(n);const i=s=>{const a=new Ve;return a.setAttribute("position",new $e(s,3)),a.computeVertexNormals(),new Ye(a,e)};return r.add(i([.55,1.2,0,.55,13.2,0,-4.2,1.4,0])),r.add(i([.65,12.5,0,.65,1.4,0,4.6,1,0])),r}function Bv(){const r=new Bt;Cn(11,2.2,3.6,3956346,0,.6,0,r),Cn(3.4,2.6,2.8,15263455,-1.6,2.9,0,r);const e=new Ye(new Di(.06,.08,6,5),new Ot({color:9145227}));return e.position.set(1.5,4,0),r.add(e),r}function kv(r){const e=new Bt,t=new Ot({color:r?16734751:15987178,roughness:.55,emissive:r?3804672:1710618}),n=new Ye(new Di(r?.2:.11,r?.24:.13,r?.5:.28,20),t);if(n.position.y=r?.16:.08,e.add(n),r){const i=new Ye(new Di(.205,.215,.09,20),new Ot({color:16777215,roughness:.5}));i.position.y=.2,e.add(i);const s=new Ye(new Jg(.2,.28,20),t);s.position.y=.55,e.add(s)}return e}function Ov(r,e,t,n){const i=new Bt;r.add(i),[[2600,-700,520,140,1.4,3],[3500,520,900,270,1.8,5],[1900,980,260,70,1.2,9],[4300,-1700,1100,330,1.6,12],[5200,1500,900,210,2.2,17]].forEach(D=>{const B=Fv(n,D[5],D[2],D[3],D[4]);B.position.set(D[0],0,D[1]),B.rotation.y=D[5],i.add(B)});const s=Nv(),a=[{o:s,x:1350,z:-900,vz:6.5,yaw:-Math.PI/2,amp:.25,sea:!0},{o:zv(),x:430,z:160,vz:-1.6,yaw:Math.PI*.62,amp:.35},{o:Bv(),x:780,z:-300,vz:1,yaw:-Math.PI*.4,amp:.3}];a.forEach(D=>{D.o.rotation.y=D.yaw,D.o.position.set(D.x,0,D.z),i.add(D.o)});const o=new Ot({color:15659250,roughness:.9,side:Nn,vertexColors:!0}),l=D=>{const B=new Ve,U=.72*D;return B.setAttribute("position",new $e([.1,0,0,-.12,0,0,-.16,0,U*.55,.12,0,U*.5,-.16,0,U*.55,-.02,0,U,.12,0,U*.5],3)),B.setAttribute("color",new $e([1,1,1,.92,.93,.95,.8,.82,.86,.85,.86,.9,.8,.82,.86,.12,.12,.14,.85,.86,.9],3)),B.setIndex([0,1,2,0,2,3,3,4,5,3,5,6]),B.computeVertexNormals(),B},c=new Ot({color:15922164,roughness:.9}),u=l(-1),h=l(1),d=new xs(.1,8,6),f=[];function m(D){const B=Math.random,U=35+B()*70,N=7+B()*14,z=B()<.5?1:-1,S=4+Math.floor(B()*4);for(let E=0;E<S;E++){let C=f[E];if(!C){const b=new Bt,V=new Ye(d,c);V.scale.set(2.6,.8,.8),b.add(V);const te=new Ye(u,o),$=new Ye(h,o);b.add(te,$),i.add(b),C=f[E]={o:b,L:te,R:$}}C.o.visible=!0,C.x=U+(B()-.5)*10+E*2.2,C.y=N+(B()-.5)*3,C.z=-z*(D?20+B()*40:90)-E*z*3.5,C.vz=z*(8+B()*2.5),C.ph=B()*6.28,C.flap=.5+B()*.5,C.o.rotation.y=z>0?-Math.PI/2:Math.PI/2}for(let E=S;E<f.length;E++)f[E].o.visible=!1}m(!0);let v=0;const y=[];function g(D){y.forEach(B=>i.remove(B.o)),y.length=0,(D||[]).forEach((B,U)=>{const N=kv(U===0);N.position.set(B.x,0,B.z),i.add(N),y.push({o:N,x:B.x,z:B.z,ph:U*1.3})})}function p(D){s.visible=D==="sea"}function R(D,B,U,N,z){a.forEach((E,C)=>{E.z+=E.vz*D,Math.abs(E.z)>2600&&(E.z=-Math.sign(E.vz)*2600),E.o.position.set(E.x,Math.sin(B*.6+C)*E.amp,E.z),E.o.rotation.x=Math.sin(B*.7+C*2)*.03,E.o.rotation.z=Math.sin(B*.5+C)*.02+(C===1?.14:0)});let S=0;for(let E=0;E<f.length;E++){const C=f[E];if(!C.o.visible)continue;C.z+=C.vz*D,C.ph+=D;const b=C.ph*.35%1,V=b<C.flap,te=V?Math.sin(C.ph*9)*.55+.1:.12+Math.sin(C.ph*2)*.03;C.L.rotation.x=-te,C.R.rotation.x=te,C.o.position.set(C.x,C.y+Math.sin(C.ph*.8)*.6+(V?Math.sin(C.ph*9)*.05:0),C.z),Math.abs(C.z)<110?S++:C.o.visible=!1}if(S||(v+=D,v>4+Math.random()*6&&(v=0,m(!1))),N)for(const E of y){const C=Jt.waveHeight(N.waves,z,E.x,U),b=Jt.waveSlopeDeg(N.waves,z,E.x,U);E.o.position.y=C-.02,E.o.rotation.z=-b*Math.PI/180*.8,E.o.rotation.x=Math.sin(B*1.1+E.ph)*.03}}let A=null;function L(D,B){try{const U=new Mv(e),N=new Ds,z=new xs(50,48,24),S=new Float32Array(z.attributes.position.count*3),E=D.clone().normalize(),C=new xe(B.env.top),b=new xe(B.env.hor),V=new xe(B.env.sea),te=new xe,$=new M;for(let he=0;he<z.attributes.position.count;he++){$.fromBufferAttribute(z.attributes.position,he).normalize(),$.y>=0?te.copy(b).lerp(C,Math.pow($.y,.55)):te.copy(b).lerp(V,Math.min(1,-$.y*5));const oe=Math.pow(Math.max(0,$.dot(E)),400)*40+Math.pow(Math.max(0,$.dot(E)),12)*.8;te.r+=oe*1,te.g+=oe*.85,te.b+=oe*.6,S[he*3]=te.r,S[he*3+1]=te.g,S[he*3+2]=te.b}z.setAttribute("color",new Ze(S,3)),N.add(new Ye(z,new As({vertexColors:!0,side:lt}))),A&&A.dispose(),A=U.fromScene(N,.03).texture,r.environment=A,U.dispose(),z.dispose()}catch{}}const _=new M;function F(){try{e.render(r,t);const D=e.getContext(),B=D.drawingBufferWidth,U=D.drawingBufferHeight,N=new Uint8Array(4);_.set(t.position.x+3e3,60,700).project(t),D.readPixels(Math.round((_.x*.5+.5)*B),Math.round((_.y*.5+.5)*U),1,1,D.RGBA,D.UNSIGNED_BYTE,N),N[0]+N[1]+N[2]>30&&r.fog.color.setRGB(N[0]/255,N[1]/255,N[2]/255).convertSRGBToLinear()}catch{}}return{update:R,setBuoys:g,setPlace:p,bakeEnv:L,sampleHorizon:F}}const Yt=Jt.LIMITS;function Hv(r,e,t){const n=!!(window.matchMedia&&window.matchMedia("(pointer: coarse)").matches),i={on:!1,seen:!1,base:null,baseTilt:14,raw:0,asked:!1};function s(u){const h=screen.orientation&&typeof screen.orientation.angle=="number"?screen.orientation.angle:window.orientation||0;return h===90?-u.gamma:h===-90||h===270?u.gamma:u.beta}function a(u){u.beta!=null&&(i.seen=!0,i.raw=s(u),i.on||(i.on=!0,t.onSource()),!(e.phase!=="aim"||!e.canAim)&&(i.base===null&&(i.base=i.raw,i.baseTilt=e.tiltTarget),e.tiltTarget=bi(i.baseTilt+(i.raw-i.base)*.5,Yt.phi[0],Yt.phi[1])))}function o(){if(i.asked)return;if(i.asked=!0,!n||!window.DeviceOrientationEvent){t.onSource();return}const u=()=>{window.addEventListener("deviceorientation",a),setTimeout(()=>{i.seen||(i.blocked="Tilt is not available here. Drag up or down to tilt",t.onSource())},1500)};typeof DeviceOrientationEvent.requestPermission=="function"?DeviceOrientationEvent.requestPermission().then(h=>{h==="granted"?u():(i.blocked="Motion access was declined. Drag up or down to tilt",t.onSource())}).catch(u):u()}let l=null;r.addEventListener("pointerdown",u=>{if(e.phase!=="aim"||!e.canAim)return;const h=r.getBoundingClientRect(),d=u.clientX-h.left,f=u.clientY-h.top,m=t.stoneScreen(),v=Math.max(64,Math.min(h.width,h.height)*.16);r.setPointerCapture(u.pointerId),Math.hypot(d-m.x,f-m.y)<v?l={kind:"pull",x0:d,y0:f,id:u.pointerId,h:h.height}:i.on||(l={kind:"tilt",y0:f,t0:e.tiltTarget,id:u.pointerId}),l&&l.kind==="pull"&&(e.phase="pull",e.pull=0,t.onPullStart())}),r.addEventListener("pointermove",u=>{if(!l||u.pointerId!==l.id)return;const h=r.getBoundingClientRect(),d=u.clientY-h.top,f=u.clientX-h.left;if(l.kind==="tilt")e.tiltTarget=bi(l.t0+(l.y0-d)*.05,Yt.phi[0],Yt.phi[1]);else{const m=Math.max(0,d-l.y0),v=f-l.x0;e.pull=bi(Math.hypot(v*.35,m)/(l.h*.3),0,1)}});function c(){e.phase="aim",e.pull=0,t.onCancel()}return r.addEventListener("pointerup",u=>{if(!l||u.pointerId!==l.id)return;const h=l;l=null,h.kind==="pull"&&(e.pull<.06?c():t.onThrow())}),r.addEventListener("pointercancel",()=>{l&&l.kind==="pull"&&c(),l=null}),window.addEventListener("keydown",u=>{e.phase!=="aim"||!e.canAim||(u.key==="ArrowUp"&&(e.tiltTarget=bi(e.tiltTarget+.5,Yt.phi[0],Yt.phi[1]),u.preventDefault()),u.key==="ArrowDown"&&(e.tiltTarget=bi(e.tiltTarget-.5,Yt.phi[0],Yt.phi[1]),u.preventDefault()))}),{motion:i,enableMotion:o,recalibrate(){i.base=null},sourceText(){return i.on?"Tilt your phone to angle the stone":i.blocked||"Drag up or down to tilt"},usesTilt(){return i.on}}}const Qc=r=>Yt.v[0]+(Yt.v[1]-Yt.v[0])*Math.pow(r,.85),$c={golden:{sun:7,az:78,cover:.14,exposure:1,fogD:2600,clarity:.92,bed:.42,zen:[.06,.22,.58],hor:[.7,.68,.6],warm:[1,.52,.18],dusk:.08,sunI:2.6,hemiSky:10467542,hemiGround:2767422,hemiI:.55,fogDensity:24e-5,env:{top:6131652,hor:15782576,sea:1918290}},dawn:{sun:3.5,az:64,cover:.06,exposure:1.08,fogD:3e3,clarity:.96,bed:.4,zen:[.07,.17,.48],hor:[.72,.66,.72],warm:[1,.56,.46],dusk:.08,sunI:2.1,hemiSky:11187416,hemiGround:3158590,hemiI:.6,fogDensity:2e-4,env:{top:7308992,hor:15975604,sea:2244686}}},Fi={slate:{name:"Flat Slate",line:"The all-rounder. Best on calm water."},oval:{name:"River Oval",line:"Glides far on calm water; least steady on waves."},pebble:{name:"Round Pebble",line:"Most stable in wind and rain; unforgiving on tilt."},chunk:{name:"Heavy Chunk",line:"Forgiving and steady; shorter, fewer skips."}},Kc=[{n:0,id:"cove",name:"Training cove",place:"lake",water:"lake",light:"golden",winK:1.9,unlock:"Flat Slate"},{n:1,id:"mirror",name:"Mirror Morning",place:"lake",water:"lake",light:"dawn",winK:1.6,blurb:"Dawn, clear and still. The water is a mirror: tilt and speed are all that matter.",cpu:"wren",cpuDiff:"easy",unlock:"River Oval",unlockStone:"oval",stages:{learn:{title:"Learn: five skips",goal:"Make the stone skip five times in one throw.",stars:[5,8,12],unit:"skips"},prove:{title:"Prove: the buoy",goal:"Reach the orange buoy, 30 m out. White markers sit at 40 and 50 m.",stars:[30,40,50],unit:"m",buoys:[30,40,50]},face:{title:"Face: Wren",goal:"Three rounds, one throw each. Most skips in total wins; a tie goes to sudden death.",stars:["Win","Win by 5+","Win by 10+"]}}},{n:2,place:"lake",teaser:"Lake"},{n:3,place:"lake",teaser:"Lake"},{n:4,place:"lake",teaser:"Lake"},{n:5,place:"sea",teaser:"Sea"},{n:6,place:"sea",teaser:"Sea"},{n:7,place:"sea",teaser:"Sea"},{n:8,place:"sea",teaser:"Sea"}],ws=["learn","prove","face"];function eu(r,e){return r.unit==="skips"||r.unit==="m"?r.stars.reduce((t,n)=>e>=n?t+1:t,0):0}const tu="skipstone-v2",nu=()=>({trainingDone:!1,chapter:1,stars:{},stones:["slate"],stone:"slate",records:{},sound:!0});let Nt=nu();try{const r=JSON.parse(localStorage.getItem(tu)||"null");r&&(Nt=Object.assign(nu(),r))}catch{}const Xe=Nt;function yn(){try{localStorage.setItem(tu,JSON.stringify(Nt))}catch{}}function Ni(r,e){return Nt.stars[r+"-"+e]||0}function mo(r,e,t){const n=r+"-"+e;return t>(Nt.stars[n]||0)?(Nt.stars[n]=t,yn(),!0):!1}function iu(){return Object.values(Nt.stars).reduce((r,e)=>r+e,0)}function ru(r,e){if(r>Nt.chapter)return!1;const t=ws.indexOf(e);return t===0||Ni(r,ws[t-1])>0}function su(r,e,t){const n=!!Nt.records[r],i=Nt.records[r]||{skips:0,dist:0},s={skips:!1,dist:!1};return e>i.skips&&(i.skips=e,s.skips=n),t>i.dist+.05&&(i.dist=Math.round(t*10)/10,s.dist=n),Nt.records[r]=i,yn(),s}function au(r){return Nt.stones.includes(r)?!1:(Nt.stones.push(r),yn(),!0)}const Gv=Object.freeze(Object.defineProperty({__proto__:null,CHAPTERS:Kc,LIGHTS:$c,STAGES:ws,STONE_INFO:Fi,persist:yn,progress:Xe,record:su,setStars:mo,stageOpen:ru,stars:Ni,starsFor:eu,totalStars:iu,unlockStone:au},Symbol.toStringTag,{value:"Module"})),Os=window.Cpu,ou=r=>{const e=Le("#err");e.hidden=!1,e.textContent=r},Mr=Le("#gl");let _n;try{_n=Lv(Mr)}catch(r){throw ou("This device could not start WebGL."),r}const ji=_n.renderer,ln=new Ds,Lt=new bt(60,1,.02,12e3);ln.fog=new Ps(14276310,11e-5);const xt=Rv(ln,Lt,_n.tier),as=new qc(16777215,2.4);ln.add(as);const os=new Gc(11127014,2372666,.75);ln.add(os);const kt=Iv(ji,ln),Ri=Ov(ln,ji,Lt,_n.tier),lu=Cv(Le("#fps"),_n),cu=600,ls=new Float32Array(cu*3),kn=new Ve;kn.setAttribute("position",new Ze(ls,3));kn.setDrawRange(0,0);const uu=new Is(kn,new qi({color:16777215,transparent:!0,opacity:.28,depthWrite:!1}));uu.frustumCulled=!1;ln.add(uu);let Yn=0;const mn=new M(-1.05,1.16,0),vn=new M(30,-.9,0),Ca=new M(-.62,.955,0),hu=new M(0,Jt.H0,0),ka=mn.clone(),Oa=vn.clone(),du=.8,fu=2,Y={phase:"menu",tilt:16,tiltTarget:16,pull:0,canAim:!0,paused:!1,cond:null,eff:null,sim:null,t:0,t0:0,next:0,count:0,sunk:0,doneAt:null,v:0,who:"you"};let me={kind:"menu"},vt=0,ql=0;const jn=[],Uv=(r,e)=>jn.push({at:r,fn:e}),zi=Hv(Mr,Y,{stoneScreen:vu,onSource:()=>{Le("#tiltSrc").textContent=zi.sourceText(),bu()},onPullStart:()=>{Le("#hint").hidden=!0,me.kind==="training"&&(me.step==="touch"||me.step==="tilt")&&Qn("pull")},onCancel:()=>{gu(),me.kind==="training"&&(me.step==="pull"||me.step==="release")&&Qn("touch")},onThrow:()=>_u()});function Vv(r,e){return{stone:e||"slate",thick:1,water:r.water,rain:!1,flowDir:1,flowStr:0,winK:r.winK,waves:{toff:Math.random()*500,patch:r.water==="patchy"}}}let Xl="";function Zi(r){Y.cond=Vv(r,Xe.stone),Y.eff=Jt.effective(Y.cond);const e=$c[r.light];xt.setCondition(Y.cond,Y.eff,e),as.position.copy(xt.sunDir()).multiplyScalar(10),as.color.copy(xt.sunColor()),as.intensity=e.sunI,os.color.setHex(e.hemiSky),os.groundColor.setHex(e.hemiGround),os.intensity=e.hemiI,ln.fog.density=e.fogDensity,ji.toneMappingExposure=e.exposure,Ri.setPlace(r.place),Xl!==r.light&&(Xl=r.light,Ri.bakeEnv(xt.sunDir(),e),xt.update(.016,vt),xt.follow(),Ri.sampleHorizon())}function Ha(r,e,t,n){let i=null,s=null;for(let a=0;a<=30;a+=.5){let o=0;for(let l=0;l<4;l++){const c=Jt.simulate(r,{theta:fu,v:e,phi:a,spin:du},vt+l*1.9);(n?c.distance:c.skips)>=t&&o++}o>=3&&(i===null&&(i=a),s=a)}return i===null?null:[i,s]}const tt=(r,e)=>{Le(r).hidden=!e};function br(r,e){return"★".repeat(r)+"☆".repeat(3-r)}function Hs(r){Le("#goal").innerHTML=r||""}let Ms=0;function pu(r,e){const t=Le("#banner");t.innerHTML=r,t.hidden=!1,Ms=e?vt+e:1/0}function mu(){Le("#banner").hidden=!0,Ms=0}function gu(){const r=Le("#hint");if(me.kind==="training"||(Xe.throws||0)>=3){r.hidden=!0;return}r.textContent=zi.usesTilt()?"Tilt to angle the stone, then touch it and pull down":"Drag up or down to tilt, then touch the stone and pull down",r.hidden=!1}function yr(r){if(me.band=r,tt("#band",!!r),r){const e=Le("#bandZone");e.style.left=r[0]/30*100+"%",e.style.width=(r[1]-r[0])/30*100+"%"}}function Ga(){tt("#card",!1)}function Bi(r){Le("#rSkips").textContent=r.big,Le("#rUnit").textContent=r.unit||"skips",Le("#rDist").textContent=r.dist||"",Le("#rSpeed").textContent=r.speed||"";const e=Le("#rWhy");e.textContent=r.why||"",e.className=r.ok?"good":"bad",e.hidden=!r.why;const t=Le("#rExtra");t.innerHTML=r.extra||"",t.hidden=!r.extra;const n=Le("#cardMain");n.textContent=r.main.label,n.onclick=()=>{Ga(),r.main.fn()};const i=Le("#cardAlt");i.hidden=!r.alt,r.alt&&(i.textContent=r.alt.label,i.onclick=()=>{Ga(),r.alt.fn()}),tt("#card",!0),tt("#count",!1)}function vu(){const r=new M().copy(kt.group.position).project(Lt),e=Mr.getBoundingClientRect();return{x:(r.x*.5+.5)*e.width,y:(-r.y*.5+.5)*e.height,r:e}}const xu=new M;function yu(r,e,t){Y.who=t,Y.v=e.v,Y.tilt=t==="you"?Y.tilt:e.phi,Y.t0=vt,Y.sim=Jt.simulate(r,e,Y.t0),Y.t=t==="you"?-.12:0,Y.next=0,Y.count=0,Y.sunk=0,Y.doneAt=null,xu.copy(kt.group.position),t!=="you"&&kt.group.position.copy(hu),kt.group.visible=!0,Yn=0,kn.setDrawRange(0,0),Y.phase="fly",tt("#hint",!1),tt("#tilt",!1),tt("#coach",!1),tt("#count",!0),Le("#countN").textContent="0",Le("#countLab").textContent=t==="you"?"skips":Os.PERSONAS[t].name+" · skips";try{xt.audio.whoosh(e.v)}catch{}}function _u(){Y.tilt=Y.tiltTarget;const r=Qc(Y.pull);Xe.throws=(Xe.throws||0)+1,Y.cond.stone=me.stoneId||"slate",me.kind==="training"&&me.step!=="watch"&&Qn("watch"),yu(Y.cond,{theta:fu,v:r,phi:Y.tilt,spin:du},"you")}function Gs(r,e){const t=Wv(r);return e===!1&&!t.ok&&(t.t=t.t.replace(/\. (Tilt|Pull|Throw) [^.]*\.$/,".")),t}function Wv(r){const e=r.contacts[0];if(!e)return{t:"The stone never reached the water.",ok:!1};const t=e.alpha.toFixed(0),n=(e.alpha-e.err).toFixed(0),i=e.win.toFixed(0);if(!e.ok){if(e.why==="steep")return{t:"Hit the water at "+t+"°, too steep. A good entry is about "+n+"° (±"+i+"°). Tilt the stone less.",ok:!1};if(e.why==="shallow")return{t:"Hit the water at "+t+"°, too flat. A good entry is about "+n+"° (±"+i+"°). Tilt the stone more.",ok:!1};if(e.why==="slow")return{t:"Too slow to bounce. Pull further back before you let go.",ok:!1};if(e.why==="hard")return{t:"It came down too hard and dug in. Throw flatter.",ok:!1}}const s=r.contacts[r.contacts.length-1];let a="First touch at "+t+"° (ideal "+n+"°). ";return r.end==="sank"||s&&s.why==="slow"?a+="It ran out of speed.":s&&s.why==="steep"?a+="It came in too steep at skip "+s.n+".":s&&s.why==="shallow"?a+="It came in too flat at skip "+s.n+".":s&&s.why==="hard"&&(a+="It dug in at skip "+s.n+"."),{t:a,ok:!0}}function qv(){Y.phase="result";const r=Y.sim;Y.who==="you"?tx(r):Kv(r)}const an=Kc;function ei(r){Y.phase="aim",Y.pull=0,Y.sim=null,Y.canAim=!0,zi.recalibrate(),kt.setKind(me.stoneId||"slate"),kt.group.visible=!0,kn.setDrawRange(0,0),Ga(),tt("#count",!1),tt("#tilt",!0),Le("#tiltSrc").textContent=zi.sourceText(),r&&r.noHint||gu(),lu.start()}function go(){Y.paused=!1,jn.length=0,mu(),["#home","#map","#intro","#pause"].forEach(r=>tt(r,!1)),tt("#top",!0)}function wu(r){return su(me.ch.id,r.skips,r.distance)}function cs(r,e){const t=[];return r.skips&&t.push(e.skips+" skips"),r.dist&&t.push(e.distance.toFixed(1)+" m"),t.length?"New record: "+t.join(", ")+".":""}const Xv=["tilt","touch","pull","release"];function Mu(){me={kind:"training",ch:an[0],stoneId:"slate",step:"tilt",throws:0,moved:!1,inBand:0,startTilt:17},Zi(an[0]),go(),Y.tilt=Y.tiltTarget=17,ei({noHint:!0}),yr(Ha(Y.cond,18,5)),Hs("Training cove"),Qn("tilt")}function Qn(r){me.step=r,tt("#coach",r!=="watch"&&r!=="done"),bu()}function bu(){if(me.kind!=="training"){tt("#coach",!1);return}const r=Xv.indexOf(me.step),e={tilt:zi.usesTilt()?"Tilt your phone forward or back until the white needle sits in the green.":"Drag up or down on the water until the white needle sits in the green.",touch:"Now touch the stone and keep your finger down. That locks the angle.",pull:"Pull down toward you. The further you pull, the faster it flies.",release:"Let go to throw."}[me.step];e&&(Le("#coachStep").textContent="Step "+(r+1)+" of 4",Le("#coachTxt").textContent=e)}function Yv(r){if(me.step==="tilt"&&Y.phase==="aim"){Math.abs(Y.tilt-me.startTilt)>1.5&&(me.moved=!0);const e=me.band,t=e&&Y.tilt>=e[0]&&Y.tilt<=e[1];me.inBand=t&&me.moved?me.inBand+r:0,me.inBand>.5&&Qn("touch")}me.step==="pull"&&Y.phase==="pull"&&Y.pull>=.5&&Qn("release")}function jv(r){me.throws++;const e=Gs(r),t=r.skips>=2,n=t||me.throws>=3;n&&!Xe.trainingDone&&(Xe.trainingDone=!0,yn());const i=()=>{ei({noHint:!0});const s=me.band,a=s&&Y.tilt>=s[0]&&Y.tilt<=s[1];me.moved=!0,Qn(a?"touch":"tilt")};Bi({big:r.skips,dist:r.distance.toFixed(1)+" m",speed:Y.v.toFixed(1)+" m/s",why:e.t,ok:e.ok,extra:t?"That’s the whole game: tilt, touch, pull, let go. Flat Slate is yours.":n?"You’ve got the controls. The lake will teach the rest.":"",main:n?{label:"Go to the lake",fn:xn}:{label:"Try again",fn:i},alt:n?{label:"Throw again",fn:i}:{label:"Skip training",fn:Su}})}function Su(){Xe.trainingDone=!0,yn(),xn()}function Tu(){me={kind:"practice",ch:an[0],stoneId:Xe.stone},Zi(an[0]),go(),yr(null),Hs("Practice · no score"),ei()}function bs(r,e){const t=an[r],n=t.stages[e];if(me={kind:e,ch:t,stage:n,stageId:e,stoneId:Xe.stone,fails:0},Zi(t),go(),yr(null),Ri.setBuoys(n.buoys?n.buoys.map((i,s)=>({x:i,z:s===0?-1.5:-1.2})):[]),e==="face")return Qv();vo(),ei()}function vo(){const r=me,e=Ni(r.ch.n,r.stageId),t=r.stageId==="learn"?"Five skips":r.stageId==="prove"?"Reach the buoy · 30 m":"Wren";Hs(t+'<span class="st">'+br(e)+"</span>")}function Zv(r){const e=me.stage,t=e.unit==="m",n=e.stars[0],i=Ha(Y.cond,Y.v,n,t);if(i)return yr(i),"Hint: at "+Y.v.toFixed(0)+" m/s, a tilt between "+i[0]+"° and "+i[1]+"° gets there. You threw at "+Y.tilt.toFixed(1)+"°. The green band on the tilt gauge shows it.";const s=Ha(Y.cond,21,n,t);return s&&yr(s),"Hint: at "+Y.v.toFixed(0)+" m/s it can’t get there. Pull further back"+(s?", and keep the tilt between "+s[0]+"° and "+s[1]+"°.":".")}function Jv(r){const e=me.stage,t=me.ch,n=e.unit==="m"?r.distance:r.skips,i=eu(e,n),s=Ni(t.n,me.stageId);mo(t.n,me.stageId,i);const a=wu(r),o=Gs(r);let l="";i>0?(l='<span class="stars">'+br(i)+"</span> ",l+=e.unit==="m"?i===1?"Past the buoy.":"Past the "+e.stars[i-1]+" m marker.":"Goal reached.",i<3&&(l+=" Next star at "+e.stars[i]+" "+e.unit+"."),i>s&&s>0&&(l+=" A new best.")):(me.fails++,l=e.unit==="m"?"Not past the buoy yet.":"Not five skips yet.",me.fails>=3&&(l+="<br>"+Zv()));const c=cs(a,r);c&&(l+="<br>"+c),vo();const u=Ni(t.n,me.stageId),h=me.stageId==="learn"?{label:"Next: Prove",fn:()=>Ua(t.n,"prove")}:{label:"Next: Face Wren",fn:()=>Ua(t.n,"face")},d={label:"Throw again",fn:()=>ei()};Bi({big:e.unit==="m"?r.distance.toFixed(1):r.skips,unit:e.unit==="m"?"metres":"skips",dist:e.unit==="m"?r.skips+" skips":r.distance.toFixed(1)+" m",speed:Y.v.toFixed(1)+" m/s",why:o.t,ok:o.ok,extra:l,main:u>0&&i>0?h:d,alt:u>0&&i>0?d:u>0?h:{label:"Journey",fn:xn}})}function Qv(){me.match={rounds:3,round:0,you:[],cpu:[],sudden:!1},me.cpu=Os.PERSONAS[me.ch.cpu],Sr(),Eu()}const On=r=>r.reduce((e,t)=>e+t,0);function Sr(){const r=me.match,e=r.sudden?"Sudden death":"Round "+(r.round+1)+" of "+r.rounds;Hs(e+" · You "+On(r.you)+" – "+On(r.cpu)+" "+me.cpu.name)}function Eu(){const r=me.match;Sr(),ei(),pu((r.sudden?"Sudden death":"Round "+(r.round+1)+" of "+r.rounds)+"<small>Your throw</small>",1.6)}function $v(){me.match;const r=me.cpu;Y.phase="wait",Y.canAim=!1,kt.group.visible=!1,tt("#tilt",!1),tt("#hint",!1),pu(r.name+" throws<small>"+Fi[r.stone].name+"</small>",1.3),Uv(vt+1.2,()=>{const e=Object.assign({},Y.cond,{stone:r.stone}),t=Os.plan(e,vt,r.id,me.ch.cpuDiff,Math.random);kt.setKind(r.stone),yu(e,t,r.id)}),Sr()}function Kv(r){const e=me.match;e.cpu.push(r.skips),Sr();const t=On(e.you),n=On(e.cpu),i=me.cpu.name;e.round++;const s=(e.sudden||e.round>=e.rounds)&&t!==n;!s&&e.round>=e.rounds&&t===n&&(e.sudden=!0);const a=Gs(r,!1);if(s)return ex();Bi({big:r.skips,unit:i+" · skips",dist:r.distance.toFixed(1)+" m",speed:"",why:a.t,ok:a.ok,extra:"You "+t+" – "+n+" "+i+(e.sudden?". Tied: sudden death, one more throw each.":"."),main:{label:e.sudden?"Sudden death":"Round "+(e.round+1),fn:Eu}})}function ex(){const r=me.match,e=me.ch,t=On(r.you),n=On(r.cpu),i=me.cpu.name,s=t>n;let a;if(s){const o=t-n,l=1+(o>=5?1:0)+(o>=10?1:0);mo(e.n,"face",l);const c=au(e.unlockStone);Xe.chapter<=e.n&&(Xe.chapter=e.n+1,yn()),a='<span class="stars">'+br(l)+"</span> You beat "+i+"."+(c?" "+Fi[e.unlockStone].name+" unlocked: "+Fi[e.unlockStone].line:"")}else a=i+" wins this time. Watch the result card: it says why each throw ended.";vo(),Bi({big:t+"–"+n,unit:s?"you win":i+" wins",dist:"",speed:"",why:"",ok:s,extra:a,main:s?{label:"Journey",fn:xn}:{label:"Rematch",fn:()=>bs(e.n,"face")},alt:s?{label:"Rematch",fn:()=>bs(e.n,"face")}:{label:"Journey",fn:xn}})}function tx(r){if(me.kind==="training")return jv(r);if(me.kind==="learn"||me.kind==="prove")return Jv(r);const e=Gs(r),t=wu(r);if(me.kind==="face"){const n=me.match;return n.you.push(r.skips),Sr(),Bi({big:r.skips,dist:r.distance.toFixed(1)+" m",speed:Y.v.toFixed(1)+" m/s",why:e.t,ok:e.ok,extra:(cs(t,r)?cs(t,r)+"<br>":"")+"You "+On(n.you)+" – "+On(n.cpu)+" "+me.cpu.name+".",main:{label:me.cpu.name+"’s turn",fn:$v}})}Bi({big:r.skips,dist:r.distance.toFixed(1)+" m",speed:Y.v.toFixed(1)+" m/s",why:e.t,ok:e.ok,extra:cs(t,r),main:{label:"Throw again",fn:()=>ei()},alt:{label:"Journey",fn:xn}})}function xo(){me={kind:"menu"},Y.phase="menu",Y.paused=!1,jn.length=0,kn.setDrawRange(0,0),["#top","#tilt","#hint","#coach","#count","#card","#banner"].forEach(r=>tt(r,!1)),Ri.setBuoys([])}function Au(){xo(),Zi(an[0]),["#map","#intro","#pause"].forEach(r=>tt(r,!1)),Le("#journeyBtn").textContent=Xe.trainingDone?"Continue":"Start",tt("#practiceBtn",Xe.trainingDone),tt("#home",!0)}function xn(){xo(),Zi(an[1]),["#home","#intro","#pause"].forEach(e=>tt(e,!1)),Le("#starsTotal").textContent="★ "+iu()+" / 72";const r=Le("#chapters");r.innerHTML="",an.forEach(e=>{const t=document.createElement("li");if(t.className="chap",e.n===0){t.innerHTML='<div class="ch-head"><span class="ch-name">Training cove</span><span class="ch-n">'+(Xe.trainingDone?"Done":"Start here")+'</span></div><p class="ch-sub">The controls: tilt, touch, pull, let go. Free practice afterwards.</p>';const n=document.createElement("button");n.type="button",n.className="one",n.textContent=Xe.trainingDone?"Practice":"Train",n.onclick=()=>Xe.trainingDone?Tu():Mu(),t.appendChild(n)}else if(e.stages&&Xe.chapter>=e.n&&Xe.trainingDone){t.innerHTML='<div class="ch-head"><span class="ch-name">'+e.name+'</span><span class="ch-n">Chapter '+e.n+" · "+e.place+'</span></div><p class="ch-sub">'+e.blurb+"</p>";const n=document.createElement("div");n.className="stages",ws.forEach(i=>{const s=document.createElement("button");s.type="button";const a=ru(e.n,i);s.disabled=!a,s.innerHTML=i[0].toUpperCase()+i.slice(1)+'<span class="s">'+(a?br(Ni(e.n,i)):"Locked")+"</span>",s.onclick=()=>Ua(e.n,i),n.appendChild(s)}),t.appendChild(n)}else{t.classList.add("locked");const n=!Xe.trainingDone&&e.n===1?"Finish the training cove to start.":Xe.chapter>=e.n?"Arrives in the next update.":e.n===2?"Beat Wren in Mirror Morning to unlock.":"Locked.";t.innerHTML='<div class="ch-head"><span class="ch-name">'+(e.name&&e.n===1?e.name:"? ? ?")+'</span><span class="ch-n">Chapter '+e.n+" · "+e.place+'</span></div><p class="ch-sub">'+n+"</p>"}r.appendChild(t)}),tt("#map",!0)}function Ua(r,e){xo(),Zi(an[r]);const t=an[r],n=t.stages[e];["#home","#map","#pause"].forEach(s=>tt(s,!1)),Le("#introKicker").textContent="Chapter "+t.n+" · "+t.name,Le("#introTitle").textContent=n.title,Le("#introGoal").textContent=e==="face"?n.goal+" "+Os.PERSONAS[t.cpu].blurb:n.goal,Le("#introStars").innerHTML=n.stars.map((s,a)=>"<li><span>"+br(a+1)+"</span>"+(typeof s=="number"?s+" "+n.unit:s)+"</li>").join("");const i=Le("#introStones");i.innerHTML="",tt("#introStones",Xe.stones.length>1),Xe.stones.forEach(s=>{const a=document.createElement("button");a.type="button",a.setAttribute("aria-pressed",Xe.stone===s),a.innerHTML=Fi[s].name+"<small>"+Fi[s].line+"</small>",a.onclick=()=>{Xe.stone=s,yn(),i.querySelectorAll("button").forEach(o=>o.setAttribute("aria-pressed",o===a))},i.appendChild(a)}),Le("#introGo").onclick=()=>bs(r,e),Le("#introBack").onclick=xn,tt("#intro",!0)}function Us(r){Y.paused=r,tt("#pause",r),Le("#pauseSound").textContent="Sound: "+(Xe.sound?"on":"off")}let Va=!1;function Lu(){if(!Va){Va=!0;try{xt.audio.start(Xe.sound)}catch{}yo()}}function yo(){const r=Xe.sound;if(Va)try{xt.audio.setOn(r)}catch{}const e=Le("#soundBtn");e.setAttribute("aria-pressed",r),e.setAttribute("aria-label",r?"Sound on":"Sound off"),Le("#sndWave").setAttribute("opacity",r?"1":"0.25")}function Cu(){Xe.sound=!Xe.sound,yn(),Lu(),yo(),Le("#pauseSound").textContent="Sound: "+(Xe.sound?"on":"off")}function Ru(){zi.enableMotion(),Lu()}Le("#journeyBtn").onclick=()=>{Ru(),Xe.trainingDone?xn():Mu()};Le("#practiceBtn").onclick=()=>{Ru(),Tu()};Le("#mapBack").onclick=Au;Le("#soundBtn").onclick=Cu;Le("#pauseSound").onclick=Cu;Le("#pauseBtn").onclick=()=>Us(!0);Le("#resumeBtn").onclick=()=>Us(!1);Le("#quitBtn").onclick=()=>{Us(!1),xn()};Le("#coachSkip").onclick=Su;document.addEventListener("visibilitychange",()=>{document.hidden&&me.kind!=="menu"&&!Y.paused&&Us(!0)});const us=Le("#fx"),mt=us.getContext("2d");function nx(){const r=Mr.getBoundingClientRect(),e=Math.min(window.devicePixelRatio||1,2);if(us.width!==Math.round(r.width*e)&&(us.width=Math.round(r.width*e),us.height=Math.round(r.height*e)),mt.setTransform(e,0,0,e,0,0),mt.clearRect(0,0,r.width,r.height),Y.phase!=="pull"&&Y.phase!=="aim"||Y.paused||!Y.canAim)return;const t=vu(),n=Math.max(46,Math.min(r.width,r.height)*.12),i=me.kind==="training"&&me.step==="touch"?.22+.25*(.5+.5*Math.sin(performance.now()/260)):.22;if(mt.lineCap="round",mt.strokeStyle="rgba(255,255,255,"+i.toFixed(2)+")",mt.lineWidth=2,mt.beginPath(),mt.arc(t.x,t.y,n,0,Math.PI*2),mt.stroke(),Y.phase==="pull"){const s=-Math.PI/2;mt.strokeStyle=Y.pull>.92?"#ffb48a":"#ffffff",mt.lineWidth=4,mt.beginPath(),mt.arc(t.x,t.y,n,s,s+Math.PI*2*Y.pull),mt.stroke(),mt.fillStyle="#ffffff",mt.font='500 14px "IBM Plex Mono", monospace',mt.textAlign="center",mt.fillText(Qc(Y.pull).toFixed(1)+" m/s",t.x,t.y-n-12)}}_n.setOnResize((r,e)=>{Lt.aspect=r/e,Lt.fov=r/e<.8?66:r/e<1.3?58:48,Lt.updateProjectionMatrix(),xt.pixelScale(ji.domElement.height||e,Lt.fov)});Mr.addEventListener("webglcontextlost",r=>{r.preventDefault(),ou("The graphics context was lost. Reload the page to keep playing.")});const _i=new M,wi=new M;let Wa=performance.now();function Pu(r){requestAnimationFrame(Pu);const e=Math.min(.05,(r-Wa)/1e3);Wa=r;const t=Y.paused?0:e;Y.tilt+=(Y.tiltTarget-Y.tilt)*Math.min(1,t*12),Ms&&vt>Ms&&mu();for(let s=jn.length-1;s>=0;s--)if(vt>=jn[s].at){const a=jn[s].fn;jn.splice(s,1),a()}me.kind==="training"&&Yv(t);const n=kt.group;if(Y.phase==="menu"){vt+=t,n.visible=!1;const s=Math.sin(r/9e3)*.12;_i.set(mn.x,mn.y+.4,0),wi.set(vn.x,vn.y+1.5,Math.sin(s)*30)}else if(Y.phase==="aim"||Y.phase==="pull"){vt+=t;const s=Y.phase==="pull"?Y.pull:0,a=s>.88?(s-.88)*.02:0;n.position.set(Ca.x-.07*s+(Math.random()-.5)*a,Ca.y-.012*s+Math.sin(r/900)*.002+(Math.random()-.5)*a,Ca.z),kt.mesh.rotation.y=0,Le("#tiltVal").textContent=Y.tilt.toFixed(1)+"°",me.band&&(Le("#bandNeedle").style.left=bi(Y.tilt,0,30)/30*100+"%"),_i.copy(mn),wi.copy(vn)}else if(Y.phase==="wait")vt+=t,_i.copy(mn),wi.copy(vn);else if(Y.phase==="fly"){const s=Y.sim;if(Y.t+=t,vt=Y.t0+Math.max(0,Y.t),Y.t<0){const o=1+Y.t/.12,l=o*o*(3-2*o);n.position.lerpVectors(xu,hu,l)}else{for(;Y.next<s.contacts.length&&Y.t>=s.contacts[Y.next].t;){const l=s.contacts[Y.next];xt.splash(l.x,0,l.ok?.1+Math.min(.14,l.speed/140):.32);try{l.ok?xt.audio.skip(l.x,0,l.speed):xt.audio.splash(l.x,0,1.3)}catch{}l.ok?(Y.count++,Le("#countN").textContent=Y.count):Y.sunk=1e-4,Y.next++}const o=s.contacts.length&&!s.contacts[s.contacts.length-1].ok;if(Y.sunk>0){Y.sunk+=t;const l=s.contacts[s.contacts.length-1];n.position.set(l.x+.2*Y.sunk,l.y-.05-Y.sunk*.7,0),Y.sunk>.6&&(n.visible=!1)}else{const l=Jt.stateAt(s,Y.t);n.position.set(l.x,l.y+.01,0),kt.mesh.rotation.y+=t*(25+l.spin*60),Yn<cu&&t>0&&(ls[Yn*3]=l.x,ls[Yn*3+1]=l.y+.01,ls[Yn*3+2]=0,Yn++,kn.attributes.position.needsUpdate=!0,kn.setDrawRange(0,Yn))}o&&Y.sunk>1&&Y.doneAt===null&&(Y.doneAt=Y.t),!o&&Y.t>s.duration+.5&&Y.doneAt===null&&(Y.doneAt=Y.t),Y.doneAt!==null&&Y.t>Y.doneAt+.3&&qv()}const a=n.position.x;_i.set(Math.max(mn.x,a-1.9),.62,.7),wi.set(a+3.5,0,-.1)}else{vt+=t;const s=Y.sim&&Y.sim.contacts[Y.sim.contacts.length-1],a=s?s.x:0;_i.set(Math.max(mn.x,a-3.2),.9,1.1),wi.set(a+2.5,0,-.1)}const i=Y.phase==="fly"?1-Math.exp(-e*7):1-Math.exp(-e*4);ka.lerp(_i,i),Oa.lerp(wi,i),Lt.position.copy(ka),Lt.lookAt(Oa),n.rotation.set(0,0,Y.tilt*Ev),Ri.update(t,r/1e3,vt,Y.cond,Y.eff?Y.eff.height:0),xt.update(vt-ql,vt),ql=vt;try{xt.audio.tick(e)}catch{}xt.follow(),ji.render(ln,Lt),nx(),_n.adapt(e),lu.tick(e,r)}_n.resize();Lt.position.set(mn.x,mn.y+.4,0);Lt.lookAt(vn.x,vn.y+1.5,0);ka.copy(Lt.position);Oa.set(vn.x,vn.y+1.5,0);Au();yo();requestAnimationFrame(r=>{Wa=r,Pu(r)});window.__skip={tier:_n.tier,game:Y,J:Gv,scene:ln,camera:Lt,stone:kt,ocean:xt,renderer:ji,get session(){return me},play(){Le("#journeyBtn").onclick()},stage:(r,e)=>bs(r,e),throwWith(r,e){Y.tiltTarget=Y.tilt=r,Y.pull=e,_u()}}});export default ix();
