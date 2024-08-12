onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
};

setTimeout(function() {
  window.location.href = '/home';
}, 10000);
