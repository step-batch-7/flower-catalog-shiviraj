const hideJar = function() {
  const jarImage = document.getElementById('jar-image');
  jarImage.classList.add('hide');
  setTimeout(() => {
    jarImage.classList.remove('hide');
  }, 1000);
};
