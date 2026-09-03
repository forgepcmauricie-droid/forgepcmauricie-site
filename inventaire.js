/* ForgePC Mauricie — inventaire Google Sheets + photos Google Drive
   1) Publier la feuille Google Sheets en CSV.
   2) Coller l'URL CSV dans SHEET_CSV_URL ci-dessous.
   3) Dans Photo 1 à Photo 6, mettre les liens de partage Google Drive des photos.
*/
const SHEET_ID = "15llqGhrLL9I6SFxyFrxfbNY2ZuBXDswok_BwxPR7JqU";
const SHEET_NAME = "Inventaire";
// Le site lit directement l’onglet Inventaire de Google Sheets.
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

const DRIVE_PHOTOS = {};

const INVENTORY_FALLBACK = [{
  id:"001", nom:"Lenovo ThinkCentre M73 Tiny", prix:"169,95 $", statut:"Bientôt disponible",
  cpu:"Intel Core i5-4570T", gpu:"Intel HD Graphics", ram:"8 Go RAM", stockage:"SSD Kingston A400 240 Go",
  format:"ThinkCentre Tiny — très compact", os:"Windows 10",
  description:"Un PC compact, fiable et économique, préparé avec soin par ForgePC Mauricie. Idéal pour la bureautique, Internet, les courriels, les vidéos et les tâches quotidiennes.",
  etat:"Testé et vérifié.", garantie:"30 jours", photo1:"",photo2:"",photo3:"",photo4:"",photo5:"",photo6:""
}];

function parseCSV(text){
  const rows=[]; let row=[], cell='', quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(c==='"' && quoted && n==='"'){cell+='"'; i++; continue;}
    if(c==='"'){quoted=!quoted; continue;}
    if(c===',' && !quoted){row.push(cell.trim()); cell=''; continue;}
    if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(cell.trim());cell='';if(row.some(v=>v!==''))rows.push(row);row=[];continue;}
    cell+=c;
  }
  if(cell!==''||row.length){row.push(cell.trim());rows.push(row);}
  if(!rows.length)return [];
  const headers=rows[0].map(h=>h.replace(/^\ufeff/,'').toLowerCase().trim());
  return rows.slice(1).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??'']))).filter(x=>x.id||x['id pc']);
}

function normalize(row){
  const get=(...keys)=>{for(const k of keys){if(row[k]!==undefined&&row[k]!==null&&String(row[k]).trim()!=='')return String(row[k]).trim();}return '';};
  const out={
    id:get('id','id pc').replace(/^pc[- ]?/i,''),
    nom:get('nom','nom du pc'), cpu:get('cpu','processeur'), gpu:get('gpu','carte graphique'),
    ram:get('ram'), stockage:get('stockage'), format:get('format'), os:get('os','windows','système'),
    description:get('description'), etat:get('etat','état'), garantie:get('garantie'), prix:get('prix','prix de vente (cad)'),
    statut:get('statut'), photo1:get('photo1','photo 1'), photo2:get('photo2','photo 2'), photo3:get('photo3','photo 3'),
    photo4:get('photo4','photo 4'), photo5:get('photo5','photo 5'), photo6:get('photo6','photo 6')
  };
  if(out.id) out.id = out.id.replace(/^0+(?=\d)/, '');
  for(let i=1;i<=6;i++){
    if(out['photo'+i]) out['photo'+i]=driveImageUrl(out['photo'+i]);
  }
  return out;
}

function driveImageUrl(value){
  if(!value)return '';
  const s=value.trim();
  if(s.startsWith('data:')||s.startsWith('blob:')||s.startsWith('http')&&!s.includes('drive.google.com')) return s;
  let m=s.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if(!m)m=s.match(/[?&]id=([^&]+)/i);
  if(!m)m=s.match(/drive\.google\.com\/open\?id=([^&]+)/i);
  if(m)return `https://drive.google.com/thumbnail?id=${encodeURIComponent(m[1])}&sz=w1600&cb=${Date.now()}`;
  return s;
}

async function getInventory(){
  if(!SHEET_CSV_URL || SHEET_CSV_URL.includes('COLLER_ICI')) return INVENTORY_FALLBACK;
  try{
    const response=await fetch(`${SHEET_CSV_URL}&_=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error('CSV inaccessible');
    const rows=parseCSV(await response.text()).map(normalize);
    return rows.length?rows:INVENTORY_FALLBACK;
  }catch(e){console.warn('Inventaire Google Sheets indisponible; données locales utilisées.',e);return INVENTORY_FALLBACK;}
}
function isAvailable(pc){const s=(pc.statut||'').toLowerCase();return !['vendu','sold','inactif','retiré','retire'].includes(s);}
function pcPhoto(pc){return pc.photo1||pc.photo||'';}
function money(value){if(!value)return '';return String(value).includes('$')?value:`${value} $`;}
