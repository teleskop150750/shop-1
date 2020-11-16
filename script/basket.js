function catalog() {
  if (localStorage.getItem('basket')) {
    vueBasket.outArr = [];
    let arrBas = localStorage.getItem('basket');
    const allCat = man.concat(woman);
    arrBas = arrBas.split(',');
    let allCount = 0;

    const arr = [];

    for (let i = 0; i < arrBas.length; i++) {
      for (let k = 0; k < allCat.length; k++) {
        if (arrBas[i] == allCat[k].id) {
          arr.push(allCat[k]);
          allCount = parseInt(allCat[k].count) + allCount;
        }
      }
    }
    vueBasket.outArr = arr;
    vueBasket.allCount = allCount;
  } else {
    vueBasket.outArr = false;
  }
}
catalog();

function basketErr(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].querySelector('.sizeB').classList.add('errForm');
    arr[i].querySelector('.sizeB').onclick = function () {
      this.classList.remove('errForm');
    };
  }
}
function closeModalTime() {
  setTimeout(() => {
    vueBasket.modalFonMess = false;
  }, 1000);
}
