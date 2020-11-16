/**
 * photostack.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
(function (window) {
  // https://gist.github.com/edankwan/4389601
  Modernizr.addTest('csstransformspreserve3d', () => {
    let prop = Modernizr.prefixed('transformStyle');
    const val = 'preserve-3d';
    let computedStyle;
    if (!prop) return false;

    prop = prop.replace(/([A-Z])/g, (str, m1) => `-${m1.toLowerCase()}`).replace(/^ms-/, '-ms-');

    Modernizr.testStyles(`#modernizr{${prop}:${val};}`, (el, rule) => {
      computedStyle = window.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prop) : '';
    });

    return (computedStyle === val);
  });

  const support = {
    transitions: Modernizr.csstransitions,
    preserve3d: Modernizr.csstransformspreserve3d,
  };
  const transEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    msTransition: 'MSTransitionEnd',
    transition: 'transitionend',
  };
  const transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];

  function extend(a, b) {
    for (const key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function shuffleMArray(marray) {
    let arr = [];
    const marrlen = marray.length;
    const inArrLen = marray[0].length;
    for (let i = 0; i < marrlen; i++) {
      arr = arr.concat(marray[i]);
    }
    // shuffle 2 d array
    arr = shuffleArr(arr);
    // to 2d
    const newmarr = [];
    let pos = 0;
    for (let j = 0; j < marrlen; j++) {
      const tmparr = [];
      for (let k = 0; k < inArrLen; k++) {
        tmparr.push(arr[pos]);
        pos++;
      }
      newmarr.push(tmparr);
    }
    return newmarr;
  }

  function shuffleArr(array) {
    let m = array.length;
    let t;
    let i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  function Photostack(el, options) {
    this.el = el;
    this.inner = this.el.querySelector('div');
    this.allItems = [].slice.call(this.inner.children);
    this.allItemsCount = this.allItems.length;
    if (!this.allItemsCount) return;
    this.items = [].slice.call(this.inner.querySelectorAll('figure:not([data-dummy])'));
    this.itemsCount = this.items.length;
    this.options = extend({}, this.options);
  	extend(this.options, options);
 		// index of the current photo
    this.current = this.options.start;
  	this._init();
    const ps = this;

  	// Public methods.
  	return {
  		showPhoto(idx) {
  			ps._showPhoto.call(ps, idx);
  		},
  		open() {
  			ps._open.call(ps, true);
  		},
  		navigate(dir) {
  			ps._navigate.call(ps, dir);
  		},
  	};
  }

  Photostack.prototype.options = {
    start: 0,
    showNavigation: true,
    afterInit: null,
    afterShowPhoto: null,
    afterNavigate: null,
  };

  Photostack.prototype._init = function () {
    this.currentItem = this.items[this.current];
    if (this.options.showNavigation) {
      this._addNavigation();
    }
    this._getSizes();
    this._initEvents();
    if (this.options.afterInit) {
      this.options.afterInit(this);
    }
  };

  Photostack.prototype._addNavigation = function () {
    // add nav dots
    this.nav = document.createElement('nav');
    let inner = '';
    for (let i = 0; i < this.itemsCount; ++i) {
      inner += '<span></span>';
    }
    this.nav.innerHTML = inner;
    this.el.appendChild(this.nav);
    this.navDots = [].slice.call(this.nav.children);
  };

  Photostack.prototype._open = function (beforeStep) {
    const self = this;
    const { el } = this;
    const setTransition = function () {
      if (support.transitions) {
        classie.addClass(el, 'photostack-transition');
      }
    };
    if (beforeStep) {
      el.removeEventListener('click', open);
      classie.removeClass(el, 'photostack-start');
      setTransition();
    } else {
      self.openDefault = true;
      setTimeout(setTransition, 25);
    }
    self.started = true;
    self._showPhoto(self.current);
  };

  Photostack.prototype._initEvents = function () {
    if (this.options.clickToFlip == 'true') {
      this.items.forEach((img, idx) => {
        img.addEventListener('click', (event) => {
          event.preventDefault();
          if (idx === self.current) {
            self._rotateItem();
          }
        });
      });
    }

    var self = this;
    const beforeStep = classie.hasClass(this.el, 'photostack-start');

    if (beforeStep) {
      this._shuffle();
      this.el.addEventListener('click', () => {
        self._open(beforeStep);
      });
    } else {
      this._open(beforeStep);
    }

    if (this.options.showNavigation) {
      this.navDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          // rotate the photo if clicking on the current dot
          if (idx === self.current) {
            self._rotateItem();
          } else {
            // if the photo is flipped then rotate it back before shuffling again
            const callback = function () { self._showPhoto(idx); };
            if (self.flipped) {
              self._rotateItem(callback);
            } else {
              callback();
            }
          }
        });
      });
    }

    window.addEventListener('resize', () => { self._resizeHandler(); });
  };

  Photostack.prototype._resizeHandler = function () {
    const self = this;
    function delayed() {
      self._resize();
      self._resizeTimeout = null;
    }
    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
    }
    this._resizeTimeout = setTimeout(delayed, 100);
  };

  Photostack.prototype._resize = function () {
    const self = this;
    const callback = function () { self._shuffle(true); };
    this._getSizes();
    if (this.started && this.flipped) {
      this._rotateItem(callback);
    } else {
      callback();
    }
  };

  Photostack.prototype._showPhoto = function (pos) {
    if (this.isShuffling) {
      return false;
    }
    this.isShuffling = true;

    // if there is something behind..
    if (classie.hasClass(this.currentItem, 'photostack-flip')) {
      this._removeItemPerspective();
      if (this.options.showNavigation) {
        classie.removeClass(this.navDots[this.current], 'flippable');
      }
    }

    if (this.options.showNavigation) {
      classie.removeClass(this.navDots[this.current], 'current');
    }
    classie.removeClass(this.currentItem, 'photostack-current');

    // change current
    this.current = pos;
    this.currentItem = this.items[this.current];

    if (this.options.showNavigation) {
      classie.addClass(this.navDots[this.current], 'current');
    }
    // if there is something behind..
    if (this.options.showNavigation && this.currentItem.querySelector('.photostack-back')) {
      // nav dot gets class flippable
      classie.addClass(this.navDots[pos], 'flippable');
    }

    // shuffle a bit
    this._shuffle();

    if (this.options.afterShowPhoto) {
      this.options.afterShowPhoto(this);
    }
  };

  // display items (randomly)
  Photostack.prototype._shuffle = function (resize) {
    let iter = resize ? 1 : this.currentItem.getAttribute('data-shuffle-iteration') || 1;
    if (iter <= 0 || !this.started || this.openDefault) { iter = 1; }
    // first item is open by default
    if (this.openDefault) {
      // change transform-origin
      classie.addClass(this.currentItem, 'photostack-flip');
      this.openDefault = false;
      this.isShuffling = false;
    }

    const overlapFactor = 0.5;
    // lines & columns
    const lines = Math.ceil(this.sizes.inner.width / (this.sizes.item.width * overlapFactor));
    const columns = Math.ceil(this.sizes.inner.height / (this.sizes.item.height * overlapFactor));
    // since we are rounding up the previous calcs we need to know how much more we are adding to the calcs for both x and y axis
    const addX = lines * this.sizes.item.width * overlapFactor + this.sizes.item.width / 2 - this.sizes.inner.width;
    const addY = columns * this.sizes.item.height * overlapFactor + this.sizes.item.height / 2 - this.sizes.inner.height;
    // we will want to center the grid
    const extraX = addX / 2;
    const extraY = addY / 2;
    // max and min rotation angles
    const maxrot = 35;
    const minrot = -35;
    const self = this;
    // translate/rotate items
    var moveItems = function () {
      --iter;
      // create a "grid" of possible positions
      let grid = [];
      // populate the positions grid
      for (let i = 0; i < columns; ++i) {
        const col = grid[i] = [];
        for (let j = 0; j < lines; ++j) {
          const xVal = j * (self.sizes.item.width * overlapFactor) - extraX;
          const yVal = i * (self.sizes.item.height * overlapFactor) - extraY;
          let olx = 0;
          let oly = 0;

          if (self.started && iter === 0) {
            const ol = self._isOverlapping({ x: xVal, y: yVal });
            if (ol.overlapping) {
              olx = ol.noOverlap.x;
              oly = ol.noOverlap.y;
              const r = Math.floor(Math.random() * 3);
              switch (r) {
                case 0: olx = 0; break;
                case 1: oly = 0; break;
              }
            }
          }

          col[j] = { x: xVal + olx, y: yVal + oly };
        }
      }
      // shuffle
      grid = shuffleMArray(grid);

      let l = 0;
      let c = 0;
      let cntItemsAnim = 0;
      self.allItems.forEach((item, i) => {
        // pick a random item from the grid
        if (l === lines - 1) {
          c = c === columns - 1 ? 0 : c + 1;
          l = 1;
        } else {
          ++l;
        }

        const randXPos = Math.floor(Math.random() * lines);
        const randYPos = Math.floor(Math.random() * columns);
        const gridVal = grid[c][l - 1];
        const translation = { x: gridVal.x, y: gridVal.y };
        var onEndTransitionFn = function () {
          ++cntItemsAnim;
          if (support.transitions) {
            this.removeEventListener(transEndEventName, onEndTransitionFn);
          }
          if (cntItemsAnim === self.allItemsCount) {
            if (iter > 0) {
              moveItems.call();
            } else {
              // change transform-origin
              classie.addClass(self.currentItem, 'photostack-flip');
              // all done..
              self.isShuffling = false;
              if (typeof self.options.callback === 'function') {
                self.options.callback(self.currentItem);
              }
            }
          }
        };

        if (self.items.indexOf(item) === self.current && self.started && iter === 0) {
          self.currentItem.style.WebkitTransform = `translate(${self.centerItem.x}px,${self.centerItem.y}px) rotate(0deg)`;
          self.currentItem.style.msTransform = `translate(${self.centerItem.x}px,${self.centerItem.y}px) rotate(0deg)`;
          self.currentItem.style.transform = `translate(${self.centerItem.x}px,${self.centerItem.y}px) rotate(0deg)`;
          // if there is something behind..
          if (self.currentItem.querySelector('.photostack-back')) {
            self._addItemPerspective();
          }
          classie.addClass(self.currentItem, 'photostack-current');
        } else {
          item.style.WebkitTransform = `translate(${translation.x}px,${translation.y}px) rotate(${Math.floor(Math.random() * (maxrot - minrot + 1) + minrot)}deg)`;
          item.style.msTransform = `translate(${translation.x}px,${translation.y}px) rotate(${Math.floor(Math.random() * (maxrot - minrot + 1) + minrot)}deg)`;
          item.style.transform = `translate(${translation.x}px,${translation.y}px) rotate(${Math.floor(Math.random() * (maxrot - minrot + 1) + minrot)}deg)`;
        }

        if (self.started) {
          if (support.transitions) {
            item.addEventListener(transEndEventName, onEndTransitionFn);
          } else {
            onEndTransitionFn();
          }
        }
      });
    };

    moveItems.call();
  };

  Photostack.prototype._navigate = function (dir) {
    const { current } = this;
    const { itemsCount } = this;
    const lastItem = itemsCount - 1;
    let idx = 0;
    if (dir == 'next') {
      idx = current < lastItem ? current + 1 : 0;
    } else if (dir == 'prev') {
      idx = current > 0 ? current - 1 : lastItem;
    }
    this._showPhoto(idx);
    if (this.options.afterNavigate) {
      this.options.afterNavigate(this);
    }
  };

  Photostack.prototype._getSizes = function () {
    this.sizes = {
      inner: { width: this.inner.offsetWidth, height: this.inner.offsetHeight },
      item: { width: this.currentItem.offsetWidth, height: this.currentItem.offsetHeight },
    };

    // translation values to center an item
    this.centerItem = { x: this.sizes.inner.width / 2 - this.sizes.item.width / 2, y: this.sizes.inner.height / 2 - this.sizes.item.height / 2 };
  };

  Photostack.prototype._isOverlapping = function (itemVal) {
    const dxArea = this.sizes.item.width + this.sizes.item.width / 3; // adding some extra avoids any rotated item to touch the central area
    const dyArea = this.sizes.item.height + this.sizes.item.height / 3;
    const areaVal = { x: this.sizes.inner.width / 2 - dxArea / 2, y: this.sizes.inner.height / 2 - dyArea / 2 };
    const dxItem = this.sizes.item.width;
    const dyItem = this.sizes.item.height;

    if (!((itemVal.x + dxItem) < areaVal.x
			|| itemVal.x > (areaVal.x + dxArea)
			|| (itemVal.y + dyItem) < areaVal.y
			|| itemVal.y > (areaVal.y + dyArea))) {
      // how much to move so it does not overlap?
      // move left / or move right
      const left = Math.random() < 0.5;
      const randExtraX = Math.floor(Math.random() * (dxItem / 4 + 1));
      const randExtraY = Math.floor(Math.random() * (dyItem / 4 + 1));
      const noOverlapX = left ? (itemVal.x - areaVal.x + dxItem) * -1 - randExtraX : (areaVal.x + dxArea) - (itemVal.x + dxItem) + dxItem + randExtraX;
      const noOverlapY = left ? (itemVal.y - areaVal.y + dyItem) * -1 - randExtraY : (areaVal.y + dyArea) - (itemVal.y + dyItem) + dyItem + randExtraY;

      return {
        overlapping: true,
        noOverlap: { x: noOverlapX, y: noOverlapY },
      };
    }
    return {
      overlapping: false,
    };
  };

  Photostack.prototype._addItemPerspective = function () {
    classie.addClass(this.el, 'photostack-perspective');
  };

  Photostack.prototype._removeItemPerspective = function () {
    classie.removeClass(this.el, 'photostack-perspective');
    classie.removeClass(this.currentItem, 'photostack-flip');
  };

  Photostack.prototype._rotateItem = function (callback) {
    if (classie.hasClass(this.el, 'photostack-perspective') && !this.isRotating && !this.isShuffling) {
      this.isRotating = true;

      const self = this;
      var onEndTransitionFn = function () {
        if (support.transitions && support.preserve3d) {
          this.removeEventListener(transEndEventName, onEndTransitionFn);
        }
        self.isRotating = false;
        if (typeof callback === 'function') {
          callback();
        }
      };

      if (this.flipped) {
        if (this.options.showNavigation) {
          classie.removeClass(this.navDots[this.current], 'flip');
        }
        if (support.preserve3d) {
          this.currentItem.style.WebkitTransform = `translate(${this.centerItem.x}px,${this.centerItem.y}px) rotateY(0deg)`;
          this.currentItem.style.transform = `translate(${this.centerItem.x}px,${this.centerItem.y}px) rotateY(0deg)`;
        } else {
          classie.removeClass(this.currentItem, 'photostack-showback');
        }
      } else {
        if (this.options.showNavigation) {
          classie.addClass(this.navDots[this.current], 'flip');
        }
        if (support.preserve3d) {
          this.currentItem.style.WebkitTransform = `translate(${this.centerItem.x}px,${this.centerItem.y}px) translate(${this.sizes.item.width}px) rotateY(-179.9deg)`;
          this.currentItem.style.transform = `translate(${this.centerItem.x}px,${this.centerItem.y}px) translate(${this.sizes.item.width}px) rotateY(-179.9deg)`;
        } else {
          classie.addClass(this.currentItem, 'photostack-showback');
        }
      }

      this.flipped = !this.flipped;
      if (support.transitions && support.preserve3d) {
        this.currentItem.addEventListener(transEndEventName, onEndTransitionFn);
      } else {
        onEndTransitionFn();
      }
    }
  };

  // add to global namespace
  window.Photostack = Photostack;
}(window));
