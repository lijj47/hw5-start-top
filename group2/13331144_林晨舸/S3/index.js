// Generated by LiveScript 1.3.1
(function(){
  var button, bubble, ringmenu, robot;
  button = (function(){
    button.displayName = 'button';
    var prototype = button.prototype, constructor = button;
    button.state = 'idle';
    function button(sbutton, callback){
      this.sbutton = sbutton;
      this.callback = callback;
      this.setState('clickable');
      $(this.reddot = this.sbutton.find('.unread'));
      this.addListener();
    }
    prototype.addListener = function(){
      var this$ = this;
      $(this.sbutton).on('click', function(e){
        this$.setState('waiting');
        constructor.state = 'busy';
        this$.jqXHR = $.get('/?timestamp=' + new Date().getTime()).done(function(data){
          data = +data;
          this$.reddot.text(data);
          this$.setState('finished');
          constructor.state = 'idle';
          this$.callback(data);
        });
      });
    };
    prototype.getNumber = function(){
      return +this.reddot.text();
    };
    prototype.getState = function(){
      return this.state;
    };
    prototype.setState = function(state){
      this.state = state;
      if (this.state === 'clickable') {
        this.sbutton.removeClass('disabled');
        return $(this.reddot).removeClass('visible');
      } else if (this.state === 'waiting') {
        this.sbutton.addClass('disabled');
        return this.reddot.text('...').addClass('visible');
      } else {
        this.sbutton.addClass('disabled');
        return this.reddot.addClass('visible');
      }
    };
    prototype.reset = function(){
      var ref$;
      this.setState('clickable');
      if ((ref$ = this.jqXHR) != null) {
        ref$.abort();
      }
      constructor.state = 'idle';
    };
    return button;
  }());
  bubble = (function(){
    bubble.displayName = 'bubble';
    var prototype = bubble.prototype, constructor = bubble;
    function bubble(lbutton, sum, callback){
      this.lbutton = lbutton;
      this.sum = sum;
      this.callback = callback;
      this.setState('disabled');
      this.addListener();
    }
    prototype.addListener = function(){
      var this$ = this;
      this.lbutton.on('click', function(){});
      if (this.getState() === 'ready') {
        this.callback(this.lbutton);
        this.setState('summed');
      }
    };
    prototype.getState = function(){
      return this.state;
    };
    prototype.setState = function(state){
      switch (false) {
      case state !== 'init':
        this.lbutton.text('').addClass('disabled');
        break;
      case state !== 'ready':
        this.lbutton.removeClass('disabled');
        break;
      default:
        this.lbutton.addClass('disabled');
      }
      this.state = state;
    };
    prototype.reset = function(){
      this.setState('init');
    };
    return bubble;
  }());
  ringmenu = (function(){
    ringmenu.displayName = 'ringmenu';
    var prototype = ringmenu.prototype, constructor = ringmenu;
    function ringmenu(parts){
      var func, i$, ref$, len$, item, this$ = this;
      this.parts = parts;
      this.sum = 0;
      this.buttons = [];
      func = arguments[1];
      this.bubble = new bubble($(this.parts.lbutton, this.sum), function(lbutton){
        lbutton.text(this$.sum);
      });
      for (i$ = 0, len$ = (ref$ = this.parts.sbuttons).length; i$ < len$; ++i$) {
        item = ref$[i$];
        this.buttons.push(new button($(item), fn$));
      }
      this.container = this.parts.container;
      this.addListener();
      function fn$(number){
        this$.sum += number;
        if (this$.checkAbleToSum()) {
          this$.bubble.setState('ready');
          parts.lbutton.text(this$.sum);
          this$.bubble.setState('summed');
        }
      }
    }
    prototype.addListener = function(){
      var that;
      that = this;
      $(this.container).on('mouseleave', function(e){
        that.resetall();
      });
    };
    prototype.resetall = function(){
      var i$, ref$, len$, item;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        item = ref$[i$];
        item.reset();
      }
      this.bubble.reset();
      this.sum = 0;
      if ((ref$ = this.parts.robot) != null) {
        ref$.reset();
      }
    };
    prototype.checkAbleToSum = function(){
      var i$, ref$, len$, item;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        item = ref$[i$];
        if (item.getState() === 'clickable') {
          return false;
        }
      }
      return true;
    };
    return ringmenu;
  }());
  robot = (function(){
    robot.displayName = 'robot';
    var prototype = robot.prototype, constructor = robot;
    robot.orderLetter = ["A", "B", "C", "D", "E"];
    robot.orderNumber = [0, 1, 2, 3, 4];
    robot.current = 0;
    robot.activate = false;
    function robot(parts){
      this.parts = parts;
      this.addListener();
    }
    prototype.addListener = function(){
      var thats;
      thats = this;
      this.parts.btn.on('click', function(e){
        if (thats.state !== 'busy') {
          thats.clickTogether();
          thats.state = 'busy';
        }
      });
    };
    prototype.clickTogether = function(){
      var i$, ref$, len$, item;
      for (i$ = 0, len$ = (ref$ = this.parts.sbutton).length; i$ < len$; ++i$) {
        item = ref$[i$];
        $(item).click();
      }
    };
    prototype.reset = function(){
      this.current = 0;
      this.state = 'idle';
      this.activate = false;
    };
    return robot;
  }());
  $(function(){
    var parts, rob, rm;
    parts = {
      btn: $('.apb'),
      lbutton: $('#info-bar div'),
      sbutton: $('#control-ring li')
    };
    rob = new robot(parts);
    parts = {
      lbutton: $('#info-bar div'),
      sbuttons: $('#control-ring li'),
      container: $('#at-plus-container'),
      robot: rob
    };
    rm = new ringmenu(parts);
  });
}).call(this);
