import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const webBundle = path.join(root, "dist", "assets", "index-C4Ju3GCt.js");
const androidBundle = path.join(
  root,
  "android",
  "app",
  "src",
  "main",
  "assets",
  "public",
  "assets",
  "index-C4Ju3GCt.js",
);

let source = fs.readFileSync(webBundle, "utf8");

function replaceOnce(search, replacement, label) {
  const count = source.split(search).length - 1;
  if (count === 0 && source.includes(replacement)) {
    console.log(`${label}: already applied`);
    return;
  }
  if (count !== 1) {
    throw new Error(`${label}: expected one match, found ${count}`);
  }
  source = source.replace(search, replacement);
  console.log(`${label}: applied`);
}

replaceOnce(
  "function Pv({children:r,initialLevelId:m,setCurrentLevelId:v,addCoins:d,play:A,haptic:g,",
  "function Pv({children:r,initialLevelId:m,setCurrentLevelId:v,addCoins:d,spendHint:x,play:A,haptic:g,",
  "wire hint spending into the game session",
);

replaceOnce(
  "const Wl=E.useCallback(()=>{re([])},[]),Fn=E.useCallback(()=>{H(De=>tm(De))},[]),Aa=",
  'const Wl=E.useCallback(()=>{re([])},[]),Fn=E.useCallback(()=>{H(De=>tm(De)),A("shuffle"),Te("Harfler karıştırıldı"),Q.safeTimeout(()=>Te(""),900)},[A,Q]),Aa=',
  "make shuffle visibly responsive",
);

replaceOnce(
  "const ol=la(De),Zl=U.mainWords.find(Ie=>la(Ie.word)===ol),Tl=U.hiddenWords.find(Ie=>la(Ie.word)===ol);",
  "const ol=la(De),Zl=U.mainWords.find(Ie=>la(Ie.word)===ol),Tl=U.hiddenWords.find(Ie=>la(Ie.word)===ol),xl=aa.flatMap(Ie=>[...Ie.mainWords,...Ie.hiddenWords]).find(Ie=>la(Ie.word)===ol);",
  "look up valid bonus words across the built-in dictionary",
);

replaceOnce(
  'Q.safeTimeout(()=>Te(""),2200);return}be(0),K("wrong"),',
  'Q.safeTimeout(()=>Te(""),2200);return}if(xl){const Ie=P+1;be(Ie),V(fl=>Math.max(fl,Ie)),B(xl),Ce(xl),K("hidden"),Te(`Bonus Kelime: ${xl.word}`),d(3),A("hidden"),g([20,30,20]),Wl(),hu(),Q.safeTimeout(()=>Ce(null),5e3),Q.safeTimeout(()=>K(null),600),Q.safeTimeout(()=>Te(""),2200);return}be(0),K("wrong"),',
  "accept built-in dictionary words as bonus discoveries",
);

replaceOnce(
  "bu=E.useCallback(()=>{},[]),pu=E.useCallback(()=>{},[]),Wa=",
  'bu=E.useCallback(()=>{const De=U.mainWords.find(ol=>!te.includes(ol.word));if(!De){Te("Bu seviyedeki tüm ana kelimeleri buldun");oe(null);return}if(!x()){Te("İpucu için 20 altın gerekiyor");return}C(!0),Ce({word:"ANLAM İPUCU",meaning:De.meaning}),K("hint"),A("hint"),oe(null),Q.safeTimeout(()=>Ce(null),6e3),Q.safeTimeout(()=>K(null),700)},[U,te,x,A,Q]),pu=E.useCallback(()=>{const De=U.mainWords.find(ol=>!te.includes(ol.word)&&(Ae[ol.word]?.length??0)<ol.word.length);if(!De){Te("Açılacak harf kalmadı");oe(null);return}if(!x()){Te("İpucu için 20 altın gerekiyor");return}const ol=Ae[De.word]??[],Zl=[...De.word].findIndex((Tl,Ie)=>!ol.includes(Ie));J(Tl=>({...Tl,[De.word]:[...(Tl[De.word]??[]),Zl]})),C(!0),Te(`${De.word.length} harfli bir kelimeden harf açıldı`),K("hint"),A("hint"),oe(null),Q.safeTimeout(()=>K(null),700),Q.safeTimeout(()=>Te(""),1800)},[U,te,Ae,x,A,Q]),Wa=',
  "implement meaning and letter hints",
);

replaceOnce(
  "const Zh=.38,Xh=.5;",
  "const Zh=.62,Xh=.78;",
  "increase wheel touch tolerance",
);

replaceOnce(
  'function zh({children:r}){const{addCoins:m,play:v,haptic:d}=om(),',
  'function zh({children:r}){const{addCoins:m,spendHint:x,play:v,haptic:d}=om(),',
  "read hint spending from resources",
);

replaceOnce(
  "initialLevelId:A,setCurrentLevelId:g,addCoins:m,play:v,",
  "initialLevelId:A,setCurrentLevelId:g,addCoins:m,spendHint:x,play:v,",
  "pass hint spending to the session",
);

fs.writeFileSync(webBundle, source, "utf8");
fs.copyFileSync(webBundle, androidBundle);
console.log("Web and Android production bundles are synchronized.");
