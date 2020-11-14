let nameCatalog = localStorage.getItem('catalog');
let arrSel = [];


if (nameCatalog == 'man'){
  start(man);
  arrSel = man;
}
else if (nameCatalog == 'woman'){
  start(woman);
  arrSel = woman;
}

function start(arrey){
  vueCatalog.arr = arrey;
}

function filterCatalog(category,arr){
  let out = [];
  for (let i = 0; i < arr.length;i++){
    if (category == arr[i]['category']){
      out.push(arr[i]);
    }
  }
  vueCatalog.arr = out;
}

let fSport = document.querySelector('#filterSport');
let fJacket = document.querySelector('#filterJacket');
let fJeans = document.querySelector('#filterJeans');
let fUnders = document.querySelector('#filterUndershirt');
let fAll = document.querySelector('#filterAll');

fSport.onclick = ()=>{
  filterCatalog('sport',arrSel);
  butCheck(fSport);
}

fAll.onclick = ()=>{
  start(arrSel);
  butCheck(fAll);
}
fJacket.onclick = ()=>{
  filterCatalog('jacket',arrSel);
  butCheck(fJacket);
}

fJeans.onclick = ()=>{
  filterCatalog('jeans',arrSel);
  butCheck(fJeans);
}

fUnders.onclick = ()=>{
  filterCatalog('undershirt',arrSel);
  butCheck(fUnders);
}

function butCheck(but){
  fSport.classList.remove('btn-success');
  fSport.classList.add('btn-secondary');
  fAll.classList.remove('btn-success');
  fAll.classList.add('btn-secondary');
  fJacket.classList.remove('btn-success');
  fJacket.classList.add('btn-secondary');
  fJeans.classList.remove('btn-success');
  fJeans.classList.add('btn-secondary');
  fUnders.classList.remove('btn-success');
  fUnders.classList.add('btn-secondary');

  but.classList.remove('btn-secondary');
  but.classList.add('btn-success');
}

function stopModal(){
  setTimeout(function(){
    vueCatalog.modalErrBasket = false;
    vueCatalog.modalAddbasket = false;
  },800);
}
