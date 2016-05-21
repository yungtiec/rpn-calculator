/*
RPN stack implementation will take O(n) times 
while recursion implementation will take O(n2) 

"2 2 + 3 *"
given an expression like this
The idea is to iterate over the expression
add each member to a stack, 
and when the member is an operation, 
calculate the previous 2 members with that operator.
*/

function RPNCalculator() {
  this.stack = [];
}

(function(RPNCalculatorProto) {
  RPNCalculatorProto.push = function(num) {
    this.stack.push(num);
  }

  RPNCalculatorProto.operate = function(callback) {
    if (this.stack.length < 2) {
      throw "rpnCalculator is empty"
    }
    else {
      var first = this.stack.pop();
      var second = this.stack.pop();
      var result = callback(first, second);
      this.push(result)
    }
  }

  RPNCalculatorProto.value = function() {
    return this.stack[this.stack.length - 1];
  }

  RPNCalculatorProto.plus = function() {
    this.operate(function(first, second) {
      return second + first;
    })
  }

  RPNCalculatorProto.minus = function() {
    this.operate(function(first, second) {
      return second - first;
    })
  }

  RPNCalculatorProto.times = function() {
    this.operate(function(first, second) {
      return second * first;
    })
  }

  RPNCalculatorProto.divide = function() {
    this.operate(function(first, second) {
      return second / first;
    })
  }

  RPNCalculatorProto.inputSubmission = function() {
    var operators = /[\+\-\*\/]/;
    var input = $("#calc-input").val();
    var res = "";
    var thisProto = this;
    $("#calc-input").attr("placeholder", "0-9+-/*")
    if (this.stack.length === 0) {
      $(".intro").addClass("off");
      $(".stack").removeClass("off")
    }
    if (input.search(operators) != -1 && input.split("").length === 1) {
      // a valid operator input 
      if (this.stack.length < 2) {
        // inform users 'syntax error'
        $("#calc-input").val("")
        $("#calc-input").attr("placeholder", "not enough numbers")
      } else {
        // perform operation
        switch(input) {
          case '+':
            this.plus();
            break
          case '-':
            this.minus();
            break
          case '*':
            this.times();
            break
          case '/':
            this.divide();
            break            
        }
        console.log($(this))
        $("#calc-input").val("");
        $(this)
        .queue(function() {
          thisProto.createStackDiv(input);
          $(this).dequeue();
        })
        .queue(function() {
          thisProto.operatorFallIn();
          $(this).dequeue();
        })    
      }
    } else if (!isNaN(input)) {
      // a valid number input
      this.push(Number(input));
      $("#calc-input").val("");
      $(this).queue(function() {
        thisProto.createStackDiv(input);
        $(this).dequeue();
      }).queue(function() {
        thisProto.fallIn();
        $(this).dequeue();
      });
    } else {
      // invalid input
      $("#calc-input").val("")
      $("#calc-input").attr("placeholder", "number or operator")
    }
  }

  RPNCalculatorProto.createStackDiv = function(input) {
    var rand = generateRandNumber();
    var pos = rand + "%";
    $("<div/>", {
      "class": "stack",
      text: input
    }).appendTo('.stack-container');
    $(".stack:nth-last-child(1)").css(
      ($(".stack").length % 2 === 0) ? "left" : "right",
      pos);
    $(".stack:nth-last-child(1)").css("top", "-200%");
  }

  RPNCalculatorProto.fallIn = function(callback) {
    var fn = callback || undefined;
    $(".stack:nth-last-child(1)").addClass("fall");
    $(".stack:nth-last-child(1)").on('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
    function(e) {
      $(".stack:nth-last-child(1)").css("top","0");
      $(".stack:nth-last-child(1)").removeClass("fall");
      if (fn) {fn()}
    });
  }

  RPNCalculatorProto.operatorFallIn = function() {
    var thisProto = this;
    $(".stack:nth-last-child(1)").addClass("fall");
    $(".fall").one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
    function(e) {
      $(".stack:nth-last-child(1)").css("top","0");
      $(".stack:nth-last-child(1)").removeClass("fall");
      $(".stack:nth-last-child(1)").addClass("changeColor");
      $(".stack:nth-last-child(2)").addClass("changeColor");
      $(".stack:nth-last-child(3)").addClass("changeColor");
      $(".stack").one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
      function(e) {
        $(".changeColor").remove();
        thisProto.createStackDiv(thisProto.value());
        thisProto.fallIn();
      });
    });
  }

}) (RPNCalculator.prototype)

function generateRandNumber(){
  var max = 3;
  var min = 1;
  return Math.floor(Math.random()*(max-min+1)+min);
}