/* ForgePC Mauricie — inventaire Google Sheets + photos Google Drive */

const SHEET_ID = "15llqGhrLL9I6SFxyFrxfbNY2ZuBXDswok_BwxPR7JqU";
const SHEET_NAME = "Inventaire";

const SHEET_CSV_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

const DRIVE_PHOTOS = {};

const INVENTORY_FALLBACK = [{
  id:"001",
  nom:"Lenovo ThinkCentre M73 Tiny",
  prix:"169,95 $",
  statut:"Bientôt disponible",
  cpu:"Intel Core i5-4570T",
  gpu:"Intel HD Graphics",
  ram:"8 Go RAM",
  stockage:"SSD Kingston A400 240 Go",
  format:"ThinkCentre Tiny — très compact",
  os:"Windows 10",
  description:"Un PC compact, fiable et économique, préparé avec soin par ForgePC Mauricie.",
  etat:"Testé et vérifié.",
  garantie:"30 jours",
  photo1:"",
  photo2:"",
  photo3:"",
  photo4:"",
  photo5:"",
  photo6:""
}];

function parseCSV(text){
  const rows=[];
  let row=[], cell="", quoted=false;

  for(let i=0;i<text.length;i++){
    const c=text[i];
    const n=text[i+1];

    if(c==='"' && quoted && n==='"'){
      cell+='"';
      i++;
      continue;
    }

    if(c==='"'){
      quoted=!quoted;
      continue;
    }

    if(c===',' && !quoted){
      row.push(cell.trim());
      cell="";
      continue;
    }

    if((c==='\n'||c==='\r') && !quoted){
      if(c==='\r' && n==='\n') i++;

      row.push(cell.trim());
      cell="";

      if(row.some(v=>v!=="")){
        rows.push(row);
      }

      row=[];
      continue;
    }

    cell+=c;
  }

  if(cell!=="" || row.length){
    row.push(cell.trim());
    rows.push(row);
  }

  if(!rows.length) return [];

  const headers=rows[0]
    .map(h=>h.replace(/^\ufeff/,"").toLowerCase().trim());

  return rows.slice(1)
    .map(r=>Object.fromEntries(
      headers.map((h,i)=>[h,r[i]??""])
    ))
    .filter(x=>x.id || x["id pc"]);
}


function normalize(row){

  const get=(...keys)=>{
    for(const k of keys){
      if(
        row[k]!==undefined &&
        row[k]!==null &&
        String(row[k]).trim()!==""
      ){
        return String(row[k]).trim();
      }
    }
    return "";
  };

  const out={
    id:get("id","id pc").replace(/^pc[- ]?/i,""),

    nom:get("nom","nom du pc"),
    cpu:get("cpu","processeur"),
    gpu:get("gpu","carte graphique"),

    ram:get("ram"),
    stockage:get("stockage"),
    format:get("format"),

    os:get("os","windows","système"),

    description:get("description"),
    etat:get("etat","état"),
    garantie:get("garantie"),

    prix:get("prix","prix de vente (cad)"),
    statut:get("statut"),

    photo1:get("photo1","photo 1"),
    photo2:get("photo2","photo 2"),
    photo3:get("photo3","photo 3"),
    photo4:get("photo4","photo 4"),
    photo5:get("photo5","photo 5"),
    photo6:get("photo6","photo 6")
  };

  if(out.id){
    out.id=out.id.replace(/^pc[-_ ]?/i,"").trim();
    if(/^\d+$/.test(out.id)) out.id=String(parseInt(out.id,10)).padStart(3,"0");
  }

  const defaults=DRIVE_PHOTOS[out.id] || [];

  for(let i=1;i<=6;i++){

    if(out["photo"+i]){
      out["photo"+i]=driveImageUrl(out["photo"+i]);
    }
    else if(defaults[i-1]){
      out["photo"+i]=defaults[i-1];
    }

  }

  return out;
}


function driveImageUrl(value){

  if(!value) return "";

  const s=value.trim();

  if(
    s.startsWith("data:") ||
    s.startsWith("blob:") ||
    (s.startsWith("http") && !s.includes("drive.google.com"))
  ){
    return s;
  }

  let m=s.match(
    /drive\.google\.com\/file\/d\/([^/]+)/i
  );

  if(!m){
    m=s.match(/[?&]id=([^&]+)/i);
  }

  if(!m){
    m=s.match(
      /drive\.google\.com\/open\?id=([^&]+)/i
    );
  }

  if(m){
    return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(m[1])}`;
  }

  return s;
}


function loadGoogleSheetsJsonp(url){

  return new Promise((resolve,reject)=>{

    const callbackName=
      `forgepcSheets_${Date.now()}_${Math.random()
      .toString(36).slice(2)}`;

    const script=document.createElement("script");

    const timeout=setTimeout(()=>{
      cleanup();
      reject(
        new Error("Délai dépassé pour Google Sheets")
      );
    },10000);

    function cleanup(){
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName]=data=>{
      cleanup();
      resolve(data);
    };

    script.onerror=()=>{
      cleanup();
      reject(
        new Error("Impossible de charger Google Sheets")
      );
    };

    const separator=url.includes("?") ? "&" : "?";

    script.src=
      `${url}${separator}tqx=`+
      encodeURIComponent(
        `responseHandler:${callbackName}`
      );

    document.head.appendChild(script);
  });
}


function parseGoogleVisualization(data){

  const table=data && data.table;

  if(
    !table ||
    !Array.isArray(table.cols) ||
    !Array.isArray(table.rows)
  ){
    return [];
  }

  const headers=table.cols.map(
    c=>String(c.label||c.id||"")
      .toLowerCase()
      .trim()
  );

  return table.rows
    .map(r=>{

      const values=(r.c||[]).map(c=>
        c &&
        c.v!==null &&
        c.v!==undefined
          ? String(c.v)
          : ""
      );

      return Object.fromEntries(
        headers.map((h,i)=>[
          h,
          values[i]||""
        ])
      );

    })
    .filter(x=>
      Object.values(x).some(
        v=>String(v).trim()!==""
      )
    )
    .map(normalize);
}


async function getInventory(){

  if(
    !SHEET_CSV_URL ||
    SHEET_CSV_URL.includes("COLLER_ICI")
  ){
    return [];
  }

  try{

    const response=await fetch(
      `${SHEET_CSV_URL}&_=${Date.now()}`,
      {
        cache:"no-store"
      }
    );

    if(response.ok){

      const rows=parseCSV(
        await response.text()
      ).map(normalize);

      if(rows.length){
        return rows;
      }

    }

  }catch(e){

    console.warn(
      "Lecture CSV Google Sheets échouée, essai JSONP.",
      e
    );

  }


  try{

    const data=await loadGoogleSheetsJsonp(
      SHEET_CSV_URL
    );

    const rows=parseGoogleVisualization(data);

    if(rows.length){
      return rows;
    }

  }catch(e){

    console.warn(
      "Lecture Google Sheets impossible; données locales utilisées.",
      e
    );

  }

  return [];
}


function isAvailable(pc){

  const s=(pc.statut||"").toLowerCase();

  return ![
    "vendu",
    "sold",
    "inactif",
    "retiré",
    "retire"
  ].includes(s);
}


function pcPhoto(pc){
  return pc.photo1 || pc.photo || "";
}


function money(value){

  if(!value) return "";

  return String(value).includes("$")
    ? value
    : `${value} $`;
}
