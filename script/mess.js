let sendMess = document.querySelector('#sendMess');

sendMess.onclick = function(){
  let name = document.querySelector('#messName');
  let email = document.querySelector('#messEmail');
  let title = document.querySelector('#messTitle');
  let text = document.querySelector('#messText');
  let err = [];

  if (name.value == '' || name.value.length < 2){err.push(name);}
  if (email.value == '' || email.value.length < 5){err.push(email);}
  if (text.value == '' || text.value.length < 2){err.push(text);}
  if (title.value == "none"){err.push(title);}

  if (err.length != 0){
    for(let i = 0; i < err.length; i++){
      err[i].classList.add('err');
      }
    errNone(err);
  }
  else{
    //ajax({'mess':{'name':name.value, 'email':email.value, 'title':title.value,'text':text.value}});
    send(title.value);
  }


}

function errNone(data){
  for(let i = 0; i < data.length; i++){
    data[i].onclick = function(){
      data[i].classList.remove('err');
    }
  }
}


function send(val){
  document.querySelector('.form_sendMess').style.display = 'none';
  let send = document.querySelector('.send_messege');
  send.style.display = 'block';
  let mess = send.querySelector('h1');
  if (val == "complaint"){
    mess.innerHTML = "Ваша жалоба будет рассмотренна в ближайщее время. Приносим свои извинения.";
  }
  else if (val == "thanks"){
    mess.innerHTML = "Спасибо за благодарность. Мы рады что вы остались довольны!";
  }
  else if (val == "sentence"){
    mess.innerHTML = "Мы обязательно в ближайшее время рассмотрим ваше пожелание.";
  }
}
