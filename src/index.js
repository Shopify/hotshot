import Hotshot from './Hotshot';

// expose as global var
window.Hotshot = Hotshot;

// expose as a common js module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Hotshot;
}

// expose as an AMD module
if (typeof define === 'function' && define.amd) {
  define(() => {
    return Hotshot;
  });
}
