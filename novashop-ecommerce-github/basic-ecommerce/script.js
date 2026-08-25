const products=[
{id:1,name:"Studio Headphones",category:"Tech",price:129,icon:"◉",tag:"Bestseller"},
{id:2,name:"Minimal Desk Lamp",category:"Desk",price:68,icon:"◒",tag:"New"},
{id:3,name:"Everyday Backpack",category:"Lifestyle",price:89,icon:"▣",tag:"Popular"},
{id:4,name:"Ceramic Planter",category:"Home",price:34,icon:"♧",tag:""},
{id:5,name:"Mechanical Keyboard",category:"Tech",price:119,icon:"⌨",tag:"New"},
{id:6,name:"Cloud Notebook",category:"Desk",price:22,icon:"▤",tag:""},
{id:7,name:"Soft Throw Blanket",category:"Home",price:54,icon:"▰",tag:""},
{id:8,name:"Travel Tumbler",category:"Lifestyle",price:29,icon:"◍",tag:"Popular"}
];
let cart=JSON.parse(localStorage.getItem("novashop-cart")||"[]");
let activeFilter="All";
const grid=document.getElementById("productGrid");

function renderProducts(){
 const query=document.getElementById("searchInput").value.toLowerCase().trim();
 const list=products.filter(p=>(activeFilter==="All"||p.category===activeFilter)&&(!query||p.name.toLowerCase().includes(query)||p.category.toLowerCase().includes(query)));
 grid.innerHTML=list.length?list.map(p=>`<article class="product-card">
  <div class="product-image">${p.tag?`<span>${p.tag}</span>`:""}<b>${p.icon}</b></div>
  <div class="product-info"><small>${p.category}</small><h3>${p.name}</h3>
  <div class="price-row"><span class="price">$${p.price.toFixed(2)}</span><button class="add" onclick="addToCart(${p.id})">Add to cart</button></div></div>
 </article>`).join(""):`<p>No products found.</p>`;
}
function addToCart(id){
 const item=cart.find(x=>x.id===id);
 if(item)item.qty++; else cart.push({id,qty:1});
 saveCart(); showToast("Added to cart");
}
function saveCart(){localStorage.setItem("novashop-cart",JSON.stringify(cart));renderCart();document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function renderCart(){
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML='<div class="empty">Your cart is empty.<br>Find something you love.</div>';document.getElementById("cartTotal").textContent="$0.00";return}
 let total=0;
 box.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);total+=p.price*item.qty;return `<div class="cart-row">
 <div class="cart-thumb">${p.icon}</div><div class="cart-row-info"><h4>${p.name}</h4><small>$${p.price.toFixed(2)}</small>
 <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div></div>`}).join("");
 document.getElementById("cartTotal").textContent=`$${total.toFixed(2)}`;
}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()}
function showToast(text){const t=document.getElementById("toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");activeFilter=btn.dataset.filter;renderProducts()}));
document.querySelectorAll(".category-card").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));document.getElementById("products").scrollIntoView({behavior:"smooth"});renderProducts()}));
document.getElementById("searchBtn").onclick=()=>{document.getElementById("searchBar").classList.toggle("open");document.getElementById("searchInput").focus()};
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("checkoutBtn").onclick=()=>cart.length?showToast("Demo checkout — connect your payment backend!"):showToast("Your cart is empty");
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();e.target.reset();showToast("Thanks for subscribing!")});
document.getElementById("menuBtn").onclick=()=>showToast("Use the navigation links above");
renderProducts();saveCart();
