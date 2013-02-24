"use strict";

(function(window, $, undefined) {
  function Item(name) {
    this.callbacks = {};
    this.name = name;

    var html = '<li class="item">' + this.name + ' <a class="remove">x</a></li>';
    this.element = $(html);

    var self = this;
    this.element.on('click', function(evt) {
      evt.stopPropagation();
    });

    this.element.find('.remove').click(function() {
      self.trigger('remove');
    });
  }

  Item.prototype.bind = function(event, fn) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }

    this.callbacks[event].push(fn);
  }

  Item.prototype.trigger = function(event) {
    if (!this.callbacks[event]) return;

    for (var i = 0; i < this.callbacks[event].length; i++) {
      this.callbacks[event][i]();
    }
  }

  Item.prototype.getElement = function() {
    return this.element;
  };

  function DelimitedInput(originalElement, options) {
    this.items = [];
    this.originalElement = $(originalElement);
    this.options = options || {};

    this.initUI();
    this.initDelimiters();
    this.bindEvents();
  }

  DelimitedInput.prototype.initUI = function() {
    this.container = $('<ul class="deli-input" />');
    this.container.width(this.originalElement.width());

    this.inputElement = $('<input type="text" />');
    this.updatePlaceholder();
    this.updateInput();

    this.inputItem = $('<li class="input" />');
    this.inputItem.append(this.inputElement);
    this.container.append(this.inputItem);

    this.originalElement.before(this.container);
    this.originalElement.hide();
  }

  DelimitedInput.prototype.initDelimiters = function() {
    if (!this.options.outputDelimiter) {
      this.options.outputDelimiter = ', ';
    }

    if (!this.options.delimiters) {
      this.options.delimiters = [','];
    }

    this.delimiters = {};
    for (var i = 0; i < this.options.delimiters.length; i++) {
      var delimiter = this.options.delimiters[i];
      var code = delimiter.charCodeAt(0);
      this.delimiters[code] = true;
    }
  };

  DelimitedInput.prototype.bindEvents = function() {
    var self = this;
    this.inputElement.on('keypress', function(e) { self.onKeyPress(e); });
    this.inputElement.on('keydown', function(e) { self.onKeyDown(e); });
    this.inputElement.on('blur', function() { self.handleAdd(); });
    this.container.on('click', function(e) {
      self.inputElement.focus();
    });
  };

  DelimitedInput.prototype.onKeyDown = function(evt) {
    if (this.inputElement.val().length === 0 && evt.keyCode === 8) {
      if (this.items.length) {
        var last = this.items[this.items.length - 1];
        this.removeItem(last);
      }
    }
  };

  DelimitedInput.prototype.onKeyPress = function(evt) {
    if (this.delimiters[evt.charCode] || evt.charCode === 13) {
      evt.preventDefault();
      this.handleAdd();
    }
  };

  DelimitedInput.prototype.handleAdd = function() {
    var name = $.trim(this.inputElement.val());

    if (name.length) {
      var item = new Item(name);
      this.addItem(item);
    }

    this.inputElement.val('');
  }

  DelimitedInput.prototype.addItem = function(item) {
    var self = this;
    item.bind('remove', function() {
      self.removeItem(item);
    });

    this.items.push(item);
    this.inputItem.before(item.getElement());
    this.updateValue();
    this.updatePlaceholder();
    this.updateInput();
  };

  DelimitedInput.prototype.removeItem = function(item) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i] === item) {
        item.getElement().remove();
        this.items.splice(i, 1);
      }
    }

    this.updateValue();
    this.updatePlaceholder();
    this.updateInput();
  };

  DelimitedInput.prototype.updateValue = function() {
    var names = [];
    for (var i = 0; i < this.items.length; i++) {
      names.push(this.items[i].name);
    }

    this.originalElement.val(names.join(this.options.outputDelimiter));
  };

  DelimitedInput.prototype.updatePlaceholder = function() {
    if (this.items.length) {
      this.inputElement.attr('placeholder', '');
    } else {
      this.inputElement.attr('placeholder', this.originalElement.attr('placeholder'));
    }
  };

  DelimitedInput.prototype.updateInput = function() {
    var width;

    if (this.items.length) {
      var last = this.items[this.items.length - 1];
      var left = last.element.offset().left + last.element.width();
      width = this.container.width() - left - 25;
    } else {
      width = this.container.width() - 10;
    }

    this.inputElement.width(width);
  }

  $.fn.delimit = function(args) {
    new DelimitedInput(this, args);
  }
})(window, jQuery);
