document.querySelector('.nav__link--w').addEventListener('click', (e) => {
  localStorage.setItem('catalog', 'woman');
});

document.querySelector('.nav__link--m').addEventListener('click', (e) => {
  localStorage.setItem('catalog', 'man');
});
