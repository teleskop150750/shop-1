let vueBasket = new Vue({
  el:"#basket",
  data:{
    "outArr":false,
    'checkArr':false,
    'allCount':0,
    'shopCount':0,
    'modalFon':false,
    'modalFonMess':false
  },
  methods:{
    delAll(){
      localStorage.removeItem('basket');
      catalog();
    },
    start(){
      catalog()
    },
    delOne(id){
      let basket = localStorage.getItem('basket');
      basket = basket.split(',');
      let arr = [];
      for (var i = 0; i < basket.length; i++) {
        if (basket[i] != id) {
          arr.push(basket[i]);
        }
      }
      localStorage.setItem('basket', arr);
      catalog();
    },
    selectCard(){
      let card = document.querySelectorAll('.myBasCard');
      let count = 0;
      this.checkArr = [];
      for(let i = 0; i < card.length; i++){
        let checkCard = card[i].querySelector('.selProd').checked;
        if(checkCard == true){
          this.checkArr.push(card[i]);
          count = count + parseInt(card[i].querySelector('.countCard').getAttribute('data'));
          this.allCount = count;
        }
      }
      if(count == 0){this.checkArr = false;catalog();}
    },
    delSelect(){
      let card = this.checkArr;
      console.log(card)
      for(let i = 0; i < card.length; i++){
        let id = card[i].getAttribute('data');
        this.delOne(id);
      }
    },
    shopingAll(arr,cou){

        let card = arr;
        let err = [];
        let count = cou;

        for (var i = 0; i < card.length; i++) {
          let size = card[i].querySelector('.sizeB').value;
          if(size == 'err'){
            err.push(card[i]);
          }
        }
        if(err.length != 0){
          basketErr(err);
          this.modalFonMess = 'err';
          closeModalTime();
        }
        else{
          this.modalFon = card;
          this.shopCount = count;
        }



    },
    shoping(id,method){

      if(method == 'one'){
          let card = document.querySelectorAll('.myBasCard');
          let position = [];
          for (let i = 0; i < card.length; i++){
            if (id == parseInt(card[i].getAttribute('data'))){
              position.push(card[i])
              this.shopingAll(position, card[i].querySelector('.countCard').getAttribute('data'));    //,
            }
          }
      }
      else if(method == 'select'){
        this.shopingAll(this.checkArr,this.allCount);
      }
      else if(method == "all"){
        this.shopingAll(document.querySelectorAll('.myBasCard'),this.allCount);
      }
    },
    constDel(method){
      if (method == 'all') {
        this.delAll();
      }
      else if(method == 'select'){
        this.delSelect()
      }
      else if(parseInt(method) > 0){
        this.delOne(method)
      }
    },
    formPay(){
      let card = document.querySelector('.formPay');
      let numbCard = card.querySelector('input[name=card]');
      let name = card.querySelector('input[name=name]');
      let code = card.querySelector('input[name=code]');
      let tel = card.querySelector('input[name=tel]');
      let adres = card.querySelector('input[name=adres]');
      let err = [];

      if(numbCard.value != 16){err.push(numbCard)}
      if(name.value == ''){err.push(name)}
      if(code.value != 3){err.push(code)}
      if(tel.value < 9 && tel.value > 11){err.push(tel)}
      if(adres.value == ''){err.push(adres)}

      if (err.length != 0){
      //  basketErr(err)
      }
      else{

      }
    }
  }
});
