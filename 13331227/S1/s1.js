// Generated by CoffeeScript 1.9.1
(function() {
  var $, $$, Sum, disableOtherButtons, enableOtherButtons, getRandomNumberFromServer, getRandomNumbers, isInfo_barActive, resetCalculator, returnRandomNumber;

  $ = function(id) {
    return document.getElementById(id);
  };

  $$ = function(classN) {
    return document.getElementsByClassName(classN);
  };

  window.onload = function() {
    var buttons, info_bar;
    buttons = $$('button');
    info_bar = $('info-bar');
    return getRandomNumbers(buttons, info_bar);
  };

  getRandomNumbers = function(buttons, info_bar) {
    var button, i, len, ref, results;
    ref = $$('button');
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      results.push(button.onclick = function() {
        this.childNodes[1].classList.add('opacity');
        this.childNodes[1].innerHTML = '...';
        disableOtherButtons(buttons, this.id);
        return getRandomNumberFromServer(this.id);
      });
    }
    return results;
  };

  disableOtherButtons = function(buttons, id) {
    var button, clickedButton, i, len, results;
    clickedButton = $(id);
    results = [];
    for (i = 0, len = buttons.length; i < len; i++) {
      button = buttons[i];
      if (!(button !== clickedButton)) {
        continue;
      }
      button.disabled = 1;
      results.push(button.classList.add('grey'));
    }
    return results;
  };

  getRandomNumberFromServer = function(id) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        return returnRandomNumber(xmlhttp.responseText, id);
      }
    };
    xmlhttp.open('GET', '../server', true);
    return xmlhttp.send();
  };

  returnRandomNumber = function(rNum, id) {
    var buttons, clickedButton, info_bar;
    clickedButton = $(id);
    buttons = $$('button');
    info_bar = $('info-bar');
    clickedButton.childNodes[1].innerHTML = rNum;
    clickedButton.classList.add('grey');
    clickedButton.disabled = 1;
    enableOtherButtons(buttons, clickedButton);
    return isInfo_barActive(info_bar, buttons);
  };

  enableOtherButtons = function(buttons, clickedButton) {
    var button, i, len, results;
    results = [];
    for (i = 0, len = buttons.length; i < len; i++) {
      button = buttons[i];
      if (button !== clickedButton && !button.childNodes[1].classList.contains('opacity')) {
        button.disabled = 0;
        results.push(button.classList.remove('grey'));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  isInfo_barActive = function(info_bar, buttons) {
    var button, flag, i, len;
    flag = true;
    for (i = 0, len = buttons.length; i < len; i++) {
      button = buttons[i];
      if (!button.childNodes[1].classList.contains('opacity')) {
        flag = false;
      }
    }
    if (flag === true) {
      info_bar.disabled = 0;
      info_bar.classList.remove('grey');
      return info_bar.onclick = Sum;
    }
  };

  Sum = function() {
    var button, buttons, i, len, sum;
    sum = 0;
    buttons = $$('button');
    for (i = 0, len = buttons.length; i < len; i++) {
      button = buttons[i];
      sum += parseInt(button.childNodes[1].innerHTML);
    }
    this.innerHTML = sum;
    this.disable = 1;
    this.classList.add('grey');
    return $('button').onmouseout = resetCalculator;
  };

  resetCalculator = function() {
    var button, buttons, i, info_bar, len, results;
    info_bar = $('info-bar');
    info_bar.disabled = 1;
    info_bar.innerHTML = '';
    info_bar.classList.toggle('grey', true);
    buttons = $$('button');
    results = [];
    for (i = 0, len = buttons.length; i < len; i++) {
      button = buttons[i];
      button.classList.toggle('grey', false);
      button.childNodes[1].classList.toggle('opacity', false);
      results.push(button.disabled = 0);
    }
    return results;
  };

}).call(this);
