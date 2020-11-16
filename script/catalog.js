const nameCatalog = localStorage.getItem('catalog');
let arrSel = [];

function start(arrey) {
  vueCatalog.arr = arrey;
}

if (nameCatalog === 'man') {
  const linkW = document.querySelector('.nav__link--w');
  const linkM = document.querySelector('.nav__link--m');

  linkM.classList.remove('nav__link');
  linkM.classList.add('nav__link--active');

  linkW.classList.remove('nav__link--active');
  linkW.classList.add('nav__link');

  linkM.removeAttribute('href');
  linkW.href = './catalog.html';
  start(man);
  arrSel = man;
} else {
  const linkW = document.querySelector('.nav__link--w');
  const linkM = document.querySelector('.nav__link--m');

  linkW.classList.remove('nav__link');
  linkW.classList.add('nav__link--active');

  linkM.classList.remove('nav__link--active');
  linkM.classList.add('nav__link');

  linkW.removeAttribute('href');
  linkM.href = './catalog.html';
  start(woman);
  arrSel = woman;
}

const fSport = document.querySelector('#filterSport');
const fJacket = document.querySelector('#filterJacket');
const fJeans = document.querySelector('#filterJeans');
const fUnders = document.querySelector('#filterUndershirt');
const fAll = document.querySelector('#filterAll');

function filterCatalog(category, arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (category === arr[i].category) {
      out.push(arr[i]);
    }
  }
  vueCatalog.arr = out;
}

function butCheck(but) {
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

fSport.onclick = () => {
  filterCatalog('sport', arrSel);
  butCheck(fSport);
};

fAll.onclick = () => {
  start(arrSel);
  butCheck(fAll);
};
fJacket.onclick = () => {
  filterCatalog('jacket', arrSel);
  butCheck(fJacket);
};

fJeans.onclick = () => {
  filterCatalog('jeans', arrSel);
  butCheck(fJeans);
};

fUnders.onclick = () => {
  filterCatalog('undershirt', arrSel);
  butCheck(fUnders);
};

function stopModal() {
  setTimeout(() => {
    vueCatalog.modalErrBasket = false;
    vueCatalog.modalAddbasket = false;
  }, 800);
}
