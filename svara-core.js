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

// ---------- Svara lisamine Devanāgarī tekstile ----------
// IAST-märk -> Devanāgarī märk. null = Devanāgarīs ei märgita (udātta).
const MARK_TO_DEVA={'̱':'॒','̍':'॑','̀':'॑','̎':'᳚','́':null,'':''};
const DEVA_ACC='॒॑᳚᳛';
const hasDeva=s=>/[ऀ-ॿ꣠-ꣿ᳐-᳿]/.test(s);
function isDevaCons(c){return D_CONS[c]!==undefined || (c>='क़' && c<='य़') || c==='ऩ' || c==='ऱ' || c==='ऴ';}
// Lisab/vahetab/eemaldab svara viimasel silbil. Tagastab {text} või {error}.
function devaAccentLast(t,mark){
  const dm=MARK_TO_DEVA[mark];
  if(dm===null) return {error:'Udāttat Devanāgarīs ei märgita (Ṛgveda tava).'};
  if(dm===undefined) return {error:'Tundmatu märk.'};
  for(let k=t.length-1;k>=0;k--){
    const c=t[k]; let pos=-1;
    if(D_MATRA[c]!==undefined || D_VOW[c]!==undefined || c==='ॐ') pos=k+1;
    else if(isDevaCons(c)){
      let j=k+1; if(t[j]===NUKTA) j++;
      if(t[j]===VIRAMA || D_MATRA[t[j]]!==undefined) continue;
      pos=j;
    }
    if(pos<0) continue;
    // olemasolevad svarad selle silbi lõpus (ka pärast anusvārat/candrabindut)
    let e=pos, found='', rest='';
    while(e<t.length && (DEVA_ACC.includes(t[e]) || t[e]==='ं' || t[e]==='ँ')){
      if(DEVA_ACC.includes(t[e])) found+=t[e]; else rest+=t[e];
      e++;
    }
    const nm=(dm && found!==dm)?dm:'';
    return {text:t.slice(0,pos)+nm+rest+t.slice(e)};
  }
  return {error:'Silpi ei leitud.'};
}

// ---------- Devanāgarī ja Vedic klaviatuur ----------
// [märk, nupu tekst, silt, Unicode nimi]
const KEYBOARD={"deva": [{"title": "Kaashäälikud", "keys": [["क", "क", "ka", "Devanagari Letter Ka"], ["ख", "ख", "kha", "Devanagari Letter Kha"], ["ग", "ग", "ga", "Devanagari Letter Ga"], ["घ", "घ", "gha", "Devanagari Letter Gha"], ["ङ", "ङ", "ṅa", "Devanagari Letter Nga"], ["च", "च", "ca", "Devanagari Letter Ca"], ["छ", "छ", "cha", "Devanagari Letter Cha"], ["ज", "ज", "ja", "Devanagari Letter Ja"], ["झ", "झ", "jha", "Devanagari Letter Jha"], ["ञ", "ञ", "ña", "Devanagari Letter Nya"], ["ट", "ट", "ṭa", "Devanagari Letter Tta"], ["ठ", "ठ", "ṭha", "Devanagari Letter Ttha"], ["ड", "ड", "ḍa", "Devanagari Letter Dda"], ["ढ", "ढ", "ḍha", "Devanagari Letter Ddha"], ["ण", "ण", "ṇa", "Devanagari Letter Nna"], ["त", "त", "ta", "Devanagari Letter Ta"], ["थ", "थ", "tha", "Devanagari Letter Tha"], ["द", "द", "da", "Devanagari Letter Da"], ["ध", "ध", "dha", "Devanagari Letter Dha"], ["न", "न", "na", "Devanagari Letter Na"], ["प", "प", "pa", "Devanagari Letter Pa"], ["फ", "फ", "pha", "Devanagari Letter Pha"], ["ब", "ब", "ba", "Devanagari Letter Ba"], ["भ", "भ", "bha", "Devanagari Letter Bha"], ["म", "म", "ma", "Devanagari Letter Ma"], ["य", "य", "ya", "Devanagari Letter Ya"], ["र", "र", "ra", "Devanagari Letter Ra"], ["ल", "ल", "la", "Devanagari Letter La"], ["ळ", "ळ", "ḷa", "Devanagari Letter Lla"], ["व", "व", "va", "Devanagari Letter Va"], ["श", "श", "śa", "Devanagari Letter Sha"], ["ष", "ष", "ṣa", "Devanagari Letter Ssa"], ["स", "स", "sa", "Devanagari Letter Sa"], ["ह", "ह", "ha", "Devanagari Letter Ha"]]}, {"title": "Täishäälikud", "keys": [["अ", "अ", "a", "Devanagari Letter A"], ["आ", "आ", "ā", "Devanagari Letter Aa"], ["इ", "इ", "i", "Devanagari Letter I"], ["ई", "ई", "ī", "Devanagari Letter Ii"], ["उ", "उ", "u", "Devanagari Letter U"], ["ऊ", "ऊ", "ū", "Devanagari Letter Uu"], ["ऋ", "ऋ", "ṛ", "Devanagari Letter Vocalic R"], ["ॠ", "ॠ", "ṝ", "Devanagari Letter Vocalic Rr"], ["ऌ", "ऌ", "ḷ", "Devanagari Letter Vocalic L"], ["ॡ", "ॡ", "ḹ", "Devanagari Letter Vocalic Ll"], ["ए", "ए", "e", "Devanagari Letter E"], ["ऐ", "ऐ", "ai", "Devanagari Letter Ai"], ["ओ", "ओ", "o", "Devanagari Letter O"], ["औ", "औ", "au", "Devanagari Letter Au"]]}, {"title": "Täishäälikumärgid (mātrā)", "keys": [["ा", "◌ा", "ā", "Devanagari Vowel Sign Aa"], ["ि", "◌ि", "i", "Devanagari Vowel Sign I"], ["ी", "◌ी", "ī", "Devanagari Vowel Sign Ii"], ["ु", "◌ु", "u", "Devanagari Vowel Sign U"], ["ू", "◌ू", "ū", "Devanagari Vowel Sign Uu"], ["ृ", "◌ृ", "ṛ", "Devanagari Vowel Sign Vocalic R"], ["ॄ", "◌ॄ", "ṝ", "Devanagari Vowel Sign Vocalic Rr"], ["ॢ", "◌ॢ", "ḷ", "Devanagari Vowel Sign Vocalic L"], ["ॣ", "◌ॣ", "ḹ", "Devanagari Vowel Sign Vocalic Ll"], ["े", "◌े", "e", "Devanagari Vowel Sign E"], ["ै", "◌ै", "ai", "Devanagari Vowel Sign Ai"], ["ो", "◌ो", "o", "Devanagari Vowel Sign O"], ["ौ", "◌ौ", "au", "Devanagari Vowel Sign Au"]]}, {"title": "Märgid", "keys": [["्", "◌्", "virāma", "Devanagari Sign Virama"], ["॑", "◌॑", "svarita", "Devanagari Stress Sign Udatta"], ["॒", "◌॒", "anudātta", "Devanagari Stress Sign Anudatta"], ["ँ", "◌ँ", "m̐", "Devanagari Sign Candrabindu"], ["ं", "◌ं", "ṃ", "Devanagari Sign Anusvara"], ["ः", "◌ः", "ḥ", "Devanagari Sign Visarga"], ["।", "।", "|", "Devanagari Danda"], ["॥", "॥", "||", "Devanagari Double Danda"], ["ऽ", "ऽ", "'", "Devanagari Sign Avagraha"], ["॰", "॰", "", "Devanagari Abbreviation Sign"], ["ॐ", "ॐ", "oṃ", "Devanagari Om"]]}, {"title": "Numbrid", "keys": [["०", "०", "0", "Devanagari Digit Zero"], ["१", "१", "1", "Devanagari Digit One"], ["२", "२", "2", "Devanagari Digit Two"], ["३", "३", "3", "Devanagari Digit Three"], ["४", "४", "4", "Devanagari Digit Four"], ["५", "५", "5", "Devanagari Digit Five"], ["६", "६", "6", "Devanagari Digit Six"], ["७", "७", "7", "Devanagari Digit Seven"], ["८", "८", "8", "Devanagari Digit Eight"], ["९", "९", "9", "Devanagari Digit Nine"]]}], "vedic": [{"title": "Svarad ja toonimärgid", "keys": [["॓", "◌॓", "", "Devanagari Grave Accent"], ["॔", "◌॔", "", "Devanagari Acute Accent"], ["᳐", "◌᳐", "", "Vedic Tone Karshana"], ["᳑", "◌᳑", "", "Vedic Tone Shara"], ["᳒", "◌᳒", "", "Vedic Tone Prenkha"], ["᳓", "᳓", "", "Vedic Sign Nihshvasa"], ["᳔", "◌᳔", "", "Vedic Sign Yajurvedic Midline Svarita"], ["᳕", "◌᳕", "", "Vedic Tone Yajurvedic Aggravated Independent Svarita"], ["᳖", "◌᳖", "", "Vedic Tone Yajurvedic Independent Svarita"], ["᳗", "◌᳗", "", "Vedic Tone Yajurvedic Kathaka Independent Svarita"], ["᳘", "◌᳘", "", "Vedic Tone Candra Below"], ["᳙", "◌᳙", "", "Vedic Tone Yajurvedic Kathaka Independent Svarita Schroeder"], ["᳚", "◌᳚", "", "Vedic Tone Double Svarita"], ["᳛", "◌᳛", "", "Vedic Tone Triple Svarita"], ["᳜", "◌᳜", "", "Vedic Tone Kathaka Anudatta"], ["᳝", "◌᳝", "", "Vedic Tone Dot Below"], ["᳞", "◌᳞", "", "Vedic Tone Two Dots Below"], ["᳟", "◌᳟", "", "Vedic Tone Three Dots Below"], ["᳠", "◌᳠", "", "Vedic Tone Rigvedic Kashmiri Independent Svarita"], ["᳡", "◌᳡", "", "Vedic Tone Atharvavedic Independent Svarita"], ["᳢", "◌᳢", "", "Vedic Sign Visarga Svarita"], ["᳣", "◌᳣", "", "Vedic Sign Visarga Udatta"], ["᳤", "◌᳤", "", "Vedic Sign Reversed Visarga Udatta"], ["᳥", "◌᳥", "", "Vedic Sign Visarga Anudatta"], ["᳦", "◌᳦", "", "Vedic Sign Reversed Visarga Anudatta"], ["᳧", "◌᳧", "", "Vedic Sign Visarga Udatta With Tail"], ["᳨", "◌᳨", "", "Vedic Sign Visarga Anudatta With Tail"], ["᳭", "◌᳭", "", "Vedic Sign Tiryak"], ["᳴", "◌᳴", "", "Vedic Tone Candra Above"], ["᳷", "◌᳷", "", "Vedic Sign Atikrama"], ["᳸", "◌᳸", "", "Vedic Tone Ring Above"], ["᳹", "◌᳹", "", "Vedic Tone Double Ring Above"]]}, {"title": "Anusvāra, visarga ja candrabindu vormid", "keys": [["ᳩ", "ᳩ", "", "Vedic Sign Anusvara Antargomukha"], ["ᳪ", "ᳪ", "", "Vedic Sign Anusvara Bahirgomukha"], ["ᳫ", "ᳫ", "", "Vedic Sign Anusvara Vamagomukha"], ["ᳬ", "ᳬ", "", "Vedic Sign Anusvara Vamagomukha With Tail"], ["ᳮ", "ᳮ", "", "Vedic Sign Hexiform Long Anusvara"], ["ᳯ", "ᳯ", "", "Vedic Sign Long Anusvara"], ["ᳰ", "ᳰ", "", "Vedic Sign Rthang Long Anusvara"], ["ᳱ", "ᳱ", "", "Vedic Sign Anusvara Ubhayato Mukha"], ["ᳲ", "ᳲ", "", "Vedic Sign Ardhavisarga"], ["ᳳ", "ᳳ", "", "Vedic Sign Rotated Ardhavisarga"], ["ᳵ", "ᳵ", "", "Vedic Sign Jihvamuliya"], ["ᳶ", "ᳶ", "", "Vedic Sign Upadhmaniya"], ["ᳺ", "ᳺ", "", "Vedic Sign Double Anusvara Antargomukha"], ["ꣲ", "ꣲ", "", "Devanagari Sign Spacing Candrabindu"], ["ꣳ", "ꣳ", "", "Devanagari Sign Candrabindu Virama"], ["ꣴ", "ꣴ", "", "Devanagari Sign Double Candrabindu Virama"], ["ꣵ", "ꣵ", "", "Devanagari Sign Candrabindu Two"], ["ꣶ", "ꣶ", "", "Devanagari Sign Candrabindu Three"], ["ꣷ", "ꣷ", "", "Devanagari Sign Candrabindu Avagraha"]]}, {"title": "Sāmaveda märgid", "keys": [["꣠", "◌꣠", "0", "Combining Devanagari Digit Zero"], ["꣡", "◌꣡", "1", "Combining Devanagari Digit One"], ["꣢", "◌꣢", "2", "Combining Devanagari Digit Two"], ["꣣", "◌꣣", "3", "Combining Devanagari Digit Three"], ["꣤", "◌꣤", "4", "Combining Devanagari Digit Four"], ["꣥", "◌꣥", "5", "Combining Devanagari Digit Five"], ["꣦", "◌꣦", "6", "Combining Devanagari Digit Six"], ["꣧", "◌꣧", "7", "Combining Devanagari Digit Seven"], ["꣨", "◌꣨", "8", "Combining Devanagari Digit Eight"], ["꣩", "◌꣩", "9", "Combining Devanagari Digit Nine"], ["꣪", "◌꣪", "a", "Combining Devanagari Letter A"], ["꣫", "◌꣫", "u", "Combining Devanagari Letter U"], ["꣬", "◌꣬", "ka", "Combining Devanagari Letter Ka"], ["꣭", "◌꣭", "na", "Combining Devanagari Letter Na"], ["꣮", "◌꣮", "pa", "Combining Devanagari Letter Pa"], ["꣯", "◌꣯", "ra", "Combining Devanagari Letter Ra"], ["꣰", "◌꣰", "vi", "Combining Devanagari Letter Vi"], ["꣱", "◌꣱", "'", "Combining Devanagari Sign Avagraha"]]}]};
function buildKeyboard(el,which,onInsert){
  for(const g of KEYBOARD[which]){
    const h=document.createElement('div'); h.className='kb-title'; h.textContent=g.title; el.appendChild(h);
    const row=document.createElement('div'); row.className='kb-row';
    for(const [ch,disp,label,name] of g.keys){
      const b=document.createElement('button'); b.type='button'; b.className='kb-key';
      b.title=(label?label+' · ':'')+name;
      const s=document.createElement('span'); s.className='kb-ch'; s.textContent=disp; b.appendChild(s);
      if(label){const l=document.createElement('small'); l.textContent=label; b.appendChild(l);}
      b.addEventListener('mousedown',e=>e.preventDefault());
      b.addEventListener('click',()=>onInsert(ch));
      row.appendChild(b);
    }
    el.appendChild(row);
  }
}
