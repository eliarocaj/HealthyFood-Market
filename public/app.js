const $ = (q)=>document.querySelector(q);
let PRODUCTS=[];
let cart=JSON.parse(localStorage.getItem("hf_cart")||"[]");
const formatEur=n=>(Math.round(n*100)/100).toFixed(2);

function saveCart(){localStorage.setItem("hf_cart",JSON.stringify(cart)); renderCartBadge();}
function renderCartBadge(){ $("#cartCount").textContent = String(cart.reduce((s,i)=>s+(i.qty||1),0)); }
function toast(msg){ const el=document.createElement("div"); el.textContent=msg; el.style.cssText="position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0d1730;border:1px solid #243250;padding:10px 12px;border-radius:12px;color:#e6eefc;z-index:9999;"; document.body.appendChild(el); setTimeout(()=>el.remove(),1400); }

function addToCart(id){ const f=cart.find(x=>x.id===id); if(f) f.qty+=1; else cart.push({id,qty:1}); saveCart(); toast("U shtua në shportë."); }
function removeFromCart(id){ cart=cart.filter(x=>x.id!==id); saveCart(); renderCart(); }
function changeQty(id,delta){ const it=cart.find(x=>x.id===id); if(!it) return; it.qty=Math.max(1,(it.qty||1)+delta); saveCart(); renderCart(); }

function filteredProducts(){
  const q=$("#search").value.trim().toLowerCase();
  const diet=$("#dietFilter").value;
  const cat=$("#categoryFilter").value;
  return PRODUCTS.filter(p=>{
    if(q && !p.name.toLowerCase().includes(q)) return false;
    if(cat && p.category!==cat) return false;
    if(diet && !(p.diet||[]).includes(diet)) return false;
    return true;
  });
}

function card(p){
  const badges=[...new Set([p.category,...(p.diet||[]),...(p.tags||[])])].map(x=>`<span class="badge">${x}</span>`).join("");
  return `<article class="card">
    <div class="muted">${p.unit||""}</div>
    <h3>${p.name}</h3>
    <div class="badges">${badges}</div>
    <div class="muted"><b>Përbërës:</b> ${p.ingredients||"—"}</div>
    <div class="muted"><b>Alergenë:</b> ${p.allergens||"—"}</div>
    <div class="muted"><b>Kalori:</b> ${p.nutrition?.kcal ?? "—"} kcal</div>
    <div class="price-row">
      <div><b>${formatEur(p.price)} €</b></div>
      <button class="btn btn-primary" data-add="${p.id}">Shto</button>
    </div>
  </article>`;
}

function renderGrid(){
  $("#grid").innerHTML = filteredProducts().map(card).join("");
  document.querySelectorAll("[data-add]").forEach(btn=>btn.onclick=()=>addToCart(Number(btn.dataset.add)));
}

function cartLine(it){
  const p=PRODUCTS.find(x=>x.id===it.id); if(!p) return "";
  const lineTotal=p.price*(it.qty||1);
  return `<div class="cart-row">
    <div>
      <div><b>${p.name}</b></div>
      <div class="muted">${formatEur(p.price)} € × ${it.qty}</div>
    </div>
    <div class="qty">
      <button class="btn" data-minus="${p.id}">-</button>
      <div><b>${it.qty}</b></div>
      <button class="btn" data-plus="${p.id}">+</button>
      <button class="btn btn-ghost" data-remove="${p.id}">Hiq</button>
    </div>
    <div><b>${formatEur(lineTotal)} €</b></div>
  </div>`;
}

function renderCart(){
  $("#cartItems").innerHTML = cart.map(cartLine).join("") || `<div class="muted">Shporta është bosh.</div>`;
  const total = cart.reduce((s,it)=>{
    const p=PRODUCTS.find(x=>x.id===it.id);
    return s + (p ? p.price*(it.qty||1) : 0);
  },0);
  $("#cartTotal").textContent = formatEur(total);

  document.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.minus),-1));
  document.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.plus),+1));
  document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeFromCart(Number(b.dataset.remove)));
}

function openCart(){ $("#cartModal").classList.remove("hidden"); renderCart(); }
function closeCart(){ $("#cartModal").classList.add("hidden"); }

async function placeOrder(){
  const name=$("#name").value.trim();
  const phone=$("#phone").value.trim();
  const address=$("#address").value.trim();
  const paymentMethod=$("#payment").value;
  if(!name||!phone||!address){ $("#orderResult").textContent="Plotëso emër, tel dhe adresë."; return; }
  if(cart.length===0){ $("#orderResult").textContent="Shporta është bosh."; return; }

  $("#orderResult").textContent="Duke dërguar porosinë...";
  const payload={ customer:{name,phone,address}, paymentMethod, items: cart.map(x=>({id:x.id,qty:x.qty})) };
  const res=await fetch("/api/orders",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload)});
  const data=await res.json();
  if(!data.ok){ $("#orderResult").textContent=data.message||"Gabim."; return; }
  $("#orderResult").textContent=`Porosia u krijua ✅ ID: ${data.order.id} | Total: ${formatEur(data.order.total)} €`;
  cart=[]; saveCart(); renderCart();
}

function appendChat(who,txt){
  const box=document.createElement("div");
  box.className="msg";
  box.innerHTML=`<div class="who">${who}</div><div class="txt">${txt}</div>`;
  $("#chatLog").appendChild(box);
  $("#chatLog").scrollTop=$("#chatLog").scrollHeight;
}
async function sendChat(){
  const msg=$("#chatInput").value.trim(); if(!msg) return;
  $("#chatInput").value=""; appendChat("Ti",msg);
  const res=await fetch("/api/chat",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({message:msg})});
  const data=await res.json();
  appendChat("AI Assistant", data.reply || "—");
}

async function init(){
  renderCartBadge();
  $("#search").oninput=renderGrid;
  $("#dietFilter").onchange=renderGrid;
  $("#categoryFilter").onchange=renderGrid;
  $("#resetFilters").onclick=()=>{ $("#search").value=""; $("#dietFilter").value=""; $("#categoryFilter").value=""; renderGrid(); };

  $("#openCart").onclick=openCart;
  $("#closeCart").onclick=closeCart;
  $("#cartModal").onclick=(e)=>{ if(e.target.id==="cartModal") closeCart(); };
  $("#placeOrder").onclick=placeOrder;

  $("#chatSend").onclick=sendChat;
  $("#chatInput").addEventListener("keydown",(e)=>{ if(e.key==="Enter") sendChat(); });

  const res=await fetch("/api/products");
  PRODUCTS=await res.json();
  renderGrid();
  appendChat("AI Assistant","Përshëndetje! Thuaj: 'keto', 'pa gluten', 'vegan' ose 'alergjenë'.");
}
init();
