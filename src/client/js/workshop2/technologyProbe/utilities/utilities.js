function kill(type){
  window.document.body.addEventListener(type, function(e){
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);
}

