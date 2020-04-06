// Types of players

var socket = io.connect(location.origin);

(function () {




  /** 
   *  Join an existing game.
   */
  $('#join').on('click', function () {
    var name = $('#playerName').val();
    if (!name) {
      alert('Please enter your name and game ID.');
      return;
    }
    socket.emit('joinGame', {
      name: name
    });
  });




  $('#ready').on('click', function () {
    let ghosts = [];
    $('.ghost.my').each(function(i,el){
      let color = el.getAttribute('color');
      let col = $(el).parent().attr('col');
      let row = $(el).parent().attr('row');      
        ghosts.push(new Ghost(row,col,color));
    })
    socket.emit('ready', {
      ghosts: ghosts
    });
  });





  /**
   * 
   * Wait for 2nd player. 
   * Get role (p1 | p1)
   * create the board
   */
  socket.on('waiting', function (data) {

    $('#joinroom').hide()
    console.log(data);
    window.board = new Board(document.getElementById('board'), data.roomId, data.player);
    window.board.createBoard();
    window.board.paint();
    $('#ready').show();
    $('#status').show();




  });


  /**
   * If player creates the game, he'll be P1(X) and has the first turn.
   * This event is received when opponent connects to the room.
   */
  socket.on('starOrder', function (data) {

    
    console.log(data);


  });

  socket.on('waitingOrder', function () {

    $('#ready').hide()
    console.log('waitingOrder');
    


  });
  
  socket.on('startGame', function () {

    $('#ready').hide()
    console.log('starGame');
    window.board.stage = 'game';


  });

  socket.on('yourTurn', function () {

        window.board.turn = true;
        $('body').addClass('my-turn');



  });


  /**
   * End the game on any err event. 
   */
  socket.on('err', function (data) {
    game.endGame(data.message);
  });

  
  /**
   * End the game on any err event. 
   */
  socket.on('move', function (data) {
     console.log('move');
     console.log(data);

        let toX = parseInt(data.data.toX);     
        let toY = parseInt(data.data.toY);
        let fromX = parseInt(data.data.fromX);     
        let fromY = parseInt(data.data.fromY);
        let dir = 'left';
        if (fromX < toX) {
          dir = 'up'
        } else if (fromX > toX) {
          dir = 'down'
        }else if (fromY < toY) {
          dir = 'right'
        } 



     let toPlace = window.board.getElement(toX,toY);
     $(toPlace).html('')
     $(toPlace).addClass('last-move')
     $(board.getGhostElement(fromX,fromY)).appendTo(toPlace);
    $('#ghost-walk')[0].play();
/*
     $(board.getGhostElement(fromX,fromY)).addClass(dir); 

     setTimeout(function(){
      $(board.getGhostElement(fromX,fromY)).removeClass(dir); 
        

      } , 2000)
  */   
     
     
     
  });

  
  /**
   * End the game on any err event. 
   */
  socket.on('remove', function (data) {
      console.log('remove');
     console.log(data);
  });

  socket.on('yourWin', function (data) {
    alert('you Win!!!');
  
});
socket.on('status', function (data) {
  console.log(data);
    $('#p1-name').text(data.p1.name);
    $('#p1-blue').text(data.p1.blue);
    $('#p1-red').text(data.p1.red);

    $('#p2-name').text(data.p2.name);
    $('#p2-blue').text(data.p2.blue);
    $('#p2-red').text(data.p2.red);
  

});



socket.on('yourLoose', function (data) {
  alert('Looooser!!!');

});



socket.on('gameStop', function (data) {
  alert('Partner Left Room');
  location.reload();

});



 



  /**
   *  Drag n Drop 
   */
  window.addEventListener('boardReady', function (e) {

        console.log('boardReady');
    $(".ghost.my").draggable({
      start: function (event, ui) {},
      drag: function (event, ui) {

      },
      stop: function (event, ui) {},
      containment: '#game',
      stack: '#board .place',
      cursor: 'move',
      revert: true

    });

    $(".place").droppable({
      accept: '.ghost.my',
      hoverClass: 'hovered',
      drop: handleDrop
    });
  }, false);

  function handleDrop(event, ui) {
    if (window.board.getStage() === 'order') {
      handleOrderDrop(event, ui, this);
    } else if (window.board.turn) {
      handleTurnDrop(event, ui, this);
    } else {
      return false;
    }
  }

  function handleOrderDrop(event, ui, place) {
    console.log();
    if ($(place).hasClass('home')) {
      $(place).find('.ghost').appendTo(ui.draggable.parent());

      $(ui.draggable[0]).appendTo($(place));

      $(ui.draggable[0]).removeAttr("style")
      console.log(place);
    }



  }

  function handleTurnDrop(event, ui, place) {
    console.log(ui);
    console.log(place);
    let source_row = ui.draggable.parent().attr('row');
    let source_col = ui.draggable.parent().attr('col')
    let target_row = $(place).attr('row');
    let target_col = $(place).attr('col');

    if ($(place).hasClass('corner') && !$(place).hasClass('goal')) {
      return false;
    }
    if ($(place).hasClass('goal') && ui.draggable.attr('color') === 'red') {
      return false;
    }
    if (Math.abs(source_row - target_row) + Math.abs(source_col - target_col) > 1) {
      return false;
    }
    if ($(place).children().length > 0) {
      if ($(place).children()[0].getAttribute('player') === 'me') {
        return;
      } else {
        $(place).children()[0].remove();
      }

    }
    window.board.turn = false;
    $('body').removeClass('my-turn');
    $('.last-move').removeClass('last-move')
     $('#ghost-walk')[0].play();
    socket.emit('move', {
      fromX: source_row,
      fromY: source_col,
      toX: target_row,
      toY: target_col
    });


    $(ui.draggable[0]).removeAttr("style")
    $(ui.draggable[0]).appendTo($(place));

    console.log('s');
  }










})();
