const sendMess = document.querySelector('.mess__send-mess');
const form = document.querySelector('.mess__form');
// console.log(form);

const errNoneHandler = function f() {
  this.classList.remove('err');
  this.removeEventListener('click', errNoneHandler);
};

const errNone = (errs) => {
  errs.forEach((err) => {
    err.addEventListener('click', errNoneHandler);
  });
};

const send = function f(val) {
  let text = '';
  if (val === 'complaint') {
    text = 'Ваша жалоба будет рассмотренна в ближайщее время. Приносим свои извинения.';
  } else if (val === 'thanks') {
    text = 'Спасибо за благодарность. Мы рады что вы остались довольны!';
  } else if (val === 'sentence') {
    text = 'Мы обязательно в ближайшее время рассмотрим ваше пожелание.';
  }

  sendMess.innerHTML = `
  <div class="col">
    <p>${text}</p>
  </div>
  `;
};

form.addEventListener('submit', function f(e) {
  e.preventDefault();
  const errs = [];

  const inputs = document.querySelectorAll('.mess__input');
  inputs.forEach((input) => {
    if (input.value.trim() === '') {
      errs.push(input);
    }
  });

  if (errs.length !== 0) {
    errs.forEach((err) => {
      err.classList.add('err');
    });
    errNone(errs);
  } else {
    // ajax({'mess':{'name':name.value, 'email':email.value, 'title':title.value,'text':text.value}});
    send(this.title.value);
  }
});

// sendMess.onclick = function () {
//   const name = document.querySelector('#messName');
//   const email = document.querySelector('#messEmail');
//   const title = document.querySelector('#messTitle');
//   const text = document.querySelector('#messText');
//   const err = [];

//   if (name.value === '' || name.value.length < 2) { err.push(name); }
//   if (email.value === '' || email.value.length < 5) { err.push(email); }
//   if (text.value === '' || text.value.length < 2) { err.push(text); }
//   if (title.value === 'none') { err.push(title); }

//   if (err.length !== 0) {
//     for (let i = 0; i < err.length; i++) {
//       err[i].classList.add('err');
//     }
//     errNone(err);
//   } else {
//     // ajax({'mess':{'name':name.value, 'email':email.value, 'title':title.value,'text':text.value}});
//     send(title.value);
//   }
// };

// function errNone(data) {
//   for (let i = 0; i < data.length; i++) {
//     data[i].onclick = function () {
//       data[i].classList.remove('err');
//     };
//   }
// }

// function send(val) {
//   document.querySelector('.form_sendMess').style.display = 'none';
//   const sendW = document.querySelector('.send_messege');
//   sendW.style.display = 'block';
//   const mess = sendW.querySelector('h1');
//   if (val === 'complaint') {
//     mess.innerHTML = 'Ваша жалоба будет рассмотренна в ближайщее время. Приносим свои извинения.';
//   } else if (val === 'thanks') {
//     mess.innerHTML = 'Спасибо за благодарность. Мы рады что вы остались довольны!';
//   } else if (val === 'sentence') {
//     mess.innerHTML = 'Мы обязательно в ближайшее время рассмотрим ваше пожелание.';
//   }
// }
