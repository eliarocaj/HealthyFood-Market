import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
const ORDERS_PATH = path.join(DATA_DIR, "orders.json");

app.use(express.static(PUBLIC_DIR));

function readJson(p, fallback){
  try { return JSON.parse(fs.readFileSync(p,"utf-8")); } catch { return fallback; }
}
function writeJson(p, obj){
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf-8");
}

app.get("/api/products", (req,res)=>{
  res.json(readJson(PRODUCTS_PATH, []));
});

app.post("/api/orders", (req,res)=>{
  const { customer, items, paymentMethod } = req.body || {};
  if(!customer?.name || !customer?.phone || !customer?.address || !Array.isArray(items) || items.length===0){
    return res.status(400).json({ ok:false, message:"Plotëso emër, tel, adresë dhe shportën." });
  }
  const products = readJson(PRODUCTS_PATH, []);
  const priced = items.map(it=>{
    const p = products.find(x=>x.id===it.id);
    return p ? { id:it.id, qty:it.qty||1, name:p.name, price:p.price, lineTotal:p.price*(it.qty||1) } : null;
  }).filter(Boolean);
  const total = priced.reduce((s,x)=>s+x.lineTotal,0);
  const order = {
    id: "HF-" + Math.random().toString(16).slice(2,8).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "Në përpunim",
    customer,
    paymentMethod: paymentMethod || "cash_on_delivery",
    items: priced,
    total
  };
  const orders = readJson(ORDERS_PATH, []);
  orders.push(order);
  writeJson(ORDERS_PATH, orders);
  res.json({ ok:true, order });
});

app.post("/api/chat",(req,res)=>{
  const m = (req.body?.message || "").toLowerCase();
  let reply = "Më thuaj dietën (vegan/pa gluten/keto) dhe çfarë po kërkon (snack, mëngjes, darkë).";
  if(m.includes("gluten")) reply = "Për pa gluten: 'Pasta Pa Gluten' është opsion i sigurt. Kontrollo gjithmonë alergjenët.";
  else if(m.includes("keto")) reply = "Për keto: 'Protein Bar Keto' është snack i shpejtë me karbo të ulët.";
  else if(m.includes("vegan")) reply = "Për vegan: 'Granola Bio' dhe 'Gjalp Kikiriku Bio' janë zgjedhje të mira.";
  else if(m.includes("alerg")) reply = "Shiko fushën 'Alergenë' te produkti. Nëse je e pasigurt, zgjidh produkte me shënim të qartë.";
  res.json({ ok:true, reply });
});

app.get("*",(req,res)=>res.sendFile(path.join(PUBLIC_DIR,"index.html")));

const PORT = process.env.PORT || 5173;
app.listen(PORT, ()=>console.log("Running: http://localhost:"+PORT));
