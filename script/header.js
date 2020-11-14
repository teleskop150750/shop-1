document.querySelector('.messMenu').onclick=()=>{
  window.location.href = 'mess.html';
}
document.querySelector('.basketMenu').onclick=()=>{
  window.location.href = 'basket.html';
}
document.querySelector('.homeMenu').onclick=()=>{
  window.location.href = 'index.html';
}
document.querySelector('.catalogMan').onclick = ()=>{
  localStorage.setItem('catalog', 'man');
  window.location.href = 'catalog.html';
}
document.querySelector(".catalogWoman").onclick = ()=>{
  localStorage.setItem('catalog', 'woman');
  window.location.href = 'catalog.html';
}
