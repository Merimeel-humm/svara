// ---------- Andmed ----------
const VIRAMA='्', NUKTA='़';
const D_VOW={'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ॠ':'ṝ','ऌ':'ḷ','ॡ':'ḹ','ए':'e','ऐ':'ai','ओ':'o','औ':'au','ऎ':'e','ऒ':'o','ऍ':'e','ऑ':'o'};
const D_MATRA={'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'ṛ','ॄ':'ṝ','ॢ':'ḷ','ॣ':'ḹ','े':'e','ै':'ai','ो':'o','ौ':'au','ॆ':'e','ॊ':'o'};
const D_CONS={'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ','च':'c','छ':'ch','ज':'j','झ':'jh','ञ':'ñ','ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ',
 'त':'t','थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'ph','ब':'b','भ':'bh','म':'m','य':'y','र':'r','ल':'l','ळ':'ḷ','व':'v',
 'श':'ś','ष':'ṣ','स':'s','ह':'h',
 ['क'+NUKTA]:'q',['ख'+NUKTA]:'ḳh',['ग'+NUKTA]:'ġ',['ज'+NUKTA]:'z',['ड'+NUKTA]:'ṛ',['ढ'+NUKTA]:'ṛh',['फ'+NUKTA]:'f',['य'+NUKTA]:'ẏ',['ळ'+NUKTA]:'ḻ',['न'+NUKTA]:'ṉ',['र'+NUKTA]:'ṟ'};
const D_ACC={'॒':'̱','॑':'̍','᳚':'̎','᳛':'̎̎'};
const D_OTHER={'ं':'ṃ','ः':'ḥ','ँ':'m̐','ऽ':"'",'ॐ':'oṃ','।':'|','॥':'||','ꣳ':'ṁ','ꣲ':'ṁ',
 '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'};

function devaToIast(text){
  const s=text.normalize('NFD'); const out=[]; let lastV=-1, pendingA=-1;
  for(let i=0;i<s.length;i++){
    let c=s[i];
    if(s[i+1]===NUKTA && D_CONS[c+NUKTA]!==undefined){c=c+NUKTA;i++;}
    if(D_CONS[c]!==undefined){out.push(D_CONS[c]);out.push('a');pendingA=lastV=out.length-1;continue;}
    if(D_MATRA[c]!==undefined){
      if(pendingA>=0){out[pendingA]=D_MATRA[c];lastV=pendingA;pendingA=-1;}
      else{out.push(D_MATRA[c]);lastV=out.length-1;}
      continue;}
    if(c===VIRAMA){if(pendingA>=0){out[pendingA]='';pendingA=-1;}continue;}
    if(D_VOW[c]!==undefined){out.push(D_VOW[c]);lastV=out.length-1;pendingA=-1;continue;}
    if(D_ACC[c]!==undefined){if(lastV>=0)out[lastV]+=D_ACC[c];continue;}
    if(c==='ॐ'){out.push('o');lastV=out.length-1;out.push('ṃ');pendingA=-1;continue;}
    pendingA=-1;
    out.push(D_OTHER[c]!==undefined?D_OTHER[c]:c);
  }
  return out.join('').normalize('NFC');
}

// Harvard-Kyoto -> IAST
const HK=[['lRR','ḹ'],['lR','ḷ'],['RR','ṝ'],['Th','ṭh'],['Dh','ḍh'],['A','ā'],['I','ī'],['U','ū'],['R','ṛ'],['M','ṃ'],['H','ḥ'],
 ['G','ṅ'],['J','ñ'],['T','ṭ'],['D','ḍ'],['N','ṇ'],['L','ḷ'],['z','ś'],['S','ṣ']];
function hkToIast(s){
  let out='';
  for(let i=0;i<s.length;){
    let hit=false;
    for(const [k,v] of HK){if(s.startsWith(k,i)){out+=v;i+=k.length;hit=true;break;}}
    if(!hit){out+=s[i];i++;}
  }
  return out;
}

// ---------- IAST -> Devanāgarī ----------
const ACC_MARKS='̱̍̎̀́'; // svara-märgid
const I_VOW={'a':['अ',''],'ā':['आ','ा'],'i':['इ','ि'],'ī':['ई','ी'],'u':['उ','ु'],'ū':['ऊ','ू'],'ṛ':['ऋ','ृ'],'ṝ':['ॠ','ॄ'],
 'ḷ':['ऌ','ॢ'],'ḹ':['ॡ','ॣ'],'e':['ए','े'],'ai':['ऐ','ै'],'o':['ओ','ो'],'au':['औ','ौ'],'ï':['इ','ि'],'ü':['उ','ु']};
const I_CONS={'k':'क','kh':'ख','g':'ग','gh':'घ','ṅ':'ङ','c':'च','ch':'छ','j':'ज','jh':'झ','ñ':'ञ','ṭ':'ट','ṭh':'ठ','ḍ':'ड','ḍh':'ढ','ṇ':'ण',
 't':'त','th':'थ','d':'द','dh':'ध','n':'न','p':'प','ph':'फ','b':'ब','bh':'भ','m':'म','y':'य','r':'र','l':'ल','v':'व','w':'व',
 'ś':'श','ṣ':'ष','s':'स','h':'ह','ḻ':'ळ','ḷh':'ळ्ह','f':'फ़','z':'ज़','q':'क़'};
const I_OTHER={'ṃ':'ं','ṁ':'ं','m̐':'ँ','ḥ':'ः',"'":'ऽ','’':'ऽ','|':'।','||':'॥','/':'।','//':'॥',
 '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
const TWO=new Set(['kh','gh','ch','jh','ṭh','ḍh','th','dh','ph','bh','ai','au','ḷh','||','//']);
function accToDeva(acc){
  let r='';
  for(const m of acc){
    if(m==='̱')r+='॒';
    else if(m==='̍'||m==='̀')r+='॑';
    else if(m==='̎')r+='᳚';
    // ́ (udātta) jääb märkimata
  }
  return r;
}
function iastToDeva(text){
  const s=text.normalize('NFD'); const units=[];
  for(let i=0;i<s.length;i++){
    const base=s[i]; let marks='',acc='';
    while(i+1<s.length && /\p{M}/u.test(s[i+1])){
      const m=s[++i];
      if(ACC_MARKS.includes(m) && !(m==='́' && /[sS]/.test(base))) acc+=m; else marks+=m;
    }
    units.push({ch:(base+marks).normalize('NFC').toLowerCase(),acc});
  }
  const toks=[];
  for(let i=0;i<units.length;){
    const two=units[i].ch+(units[i+1]?units[i+1].ch:'');
    if(units[i+1] && TWO.has(two)){toks.push({t:two,acc:units[i].acc+units[i+1].acc});i+=2;}
    else{toks.push({t:units[i].ch,acc:units[i].acc});i++;}
  }
  let out='', prevCons=false;
  for(let i=0;i<toks.length;i++){
    let {t,acc}=toks[i]; const next=toks[i+1];
    const nextIsVowel=next && I_VOW[next.t]!==undefined;
    if(t==='ḷ' && nextIsVowel) t='ḻ';         // agnimīḷe -> ळ
    if(I_CONS[t]!==undefined){ if(prevCons) out+=VIRAMA; out+=I_CONS[t]; prevCons=true; continue; }
    if(I_VOW[t]!==undefined){ out+=(prevCons?I_VOW[t][1]:I_VOW[t][0])+accToDeva(acc); prevCons=false; continue; }
    if(prevCons){ out+=VIRAMA; prevCons=false; }
    out+=(I_OTHER[t]!==undefined?I_OTHER[t]:t)+accToDeva(acc);
  }
  if(prevCons) out+=VIRAMA;
  return out;
}
