document.querySelector('.nav__link--w').addEventListener('click', () => {
  localStorage.setItem('catalog', 'woman');
});

document.querySelector('.nav__link--m').addEventListener('click', () => {
  localStorage.setItem('catalog', 'man');
});
