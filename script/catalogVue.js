const vueCatalog = new Vue({
  el: '#catalog_Vue',
  data: {
    arr: '',
    catalog_modal: false,
    arr_coment: '',
    modalAddbasket: false,
    modalErrBasket: false,
  },
  methods: {
    readComent(id) {
      if (localStorage.getItem('catalog') === 'man') {
        for (let i = 0; i < man.length; i++) {
          if (man[i].id === id) {
            this.arr_coment = man[i].coment;
            this.catalog_modal = id;
          }
        }
      } else if (localStorage.getItem('catalog') === 'woman') {
        for (let i = 0; i < woman.length; i++) {
          if (woman[i].id === id) {
            this.arr_coment = woman[i].coment;
            this.catalog_modal = id;
          }
        }
      }
    },
    addComent() {
      const text = document.querySelector('.coment_text');

      if (localStorage.getItem('catalog') === 'man') {
        for (let i = 0; i < man.length; i++) {
          if (man[i].id === this.catalog_modal) {
            man[i].coment.push(text.value);
            text.value = '';
          }
        }
      }
      if (localStorage.getItem('catalog') === 'woman') {
        for (let i = 0; i < woman.length; i++) {
          if (woman[i].id === this.catalog_modal) {
            woman[i].coment.push(text.value);
            text.value = '';
          }
        }
      }
    },
    addBasket(arr) {
      if (localStorage.getItem('basket')) {
        let array = localStorage.getItem('basket');
        array = array.split(',');
        let err = true;
        for (let i = 0; i < array.length; i++) {
          if (array[i] === arr.id) {
            err = false;
            this.modalErrBasket = true;
            stopModal();
          }
        }
        if (err != false) {
          array.push(arr.id);
          localStorage.setItem('basket', array);
          this.modalAddbasket = true;
          stopModal();
        }
      } else {
        localStorage.setItem('basket', arr.id);
        this.modalAddbasket = true;
        stopModal();
      }
    },
  },
});
