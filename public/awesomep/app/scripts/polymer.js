'use strict';

/* the core-pages example */
document.querySelector('#first').onclick = function(e) {
    this.selected = (this.selected + 1) % this.items.length;
    };

document.querySelector('core-pages.fancy').onclick = function(e) {
    this.selected = (this.selected + 1) % this.items.length;
    this.async(function() {
    if (this.selectedIndex == 0) {
    this.selectedItem.classList.remove('begin');
    } else if (this.selectedIndex == this.items.length - 1) {
    this.items[0].classList.add('begin');
    }
    });
};

/* the platform template example */
var t = document.querySelector('#greeting');
  var model = {
    salutations: { what: 'GoodBye', who: 'Imperative' }
  };
  t.model = model;
    
  function removeGo() {
    t.unbind('bind');
  }