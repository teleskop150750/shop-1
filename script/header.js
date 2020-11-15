document.querySelector('.nav__link--w').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.setItem('catalog', 'woman');
  window.location.href = 'catalog.html';
});

document.querySelector('.nav__link--m').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.setItem('catalog', 'man');
  window.location.href = 'catalog.html';
});
