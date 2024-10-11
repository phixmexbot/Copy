var $messages = $('.messages-content'),
    d, h, m,
    session_id = generateSessionId();  // Generate session_id when page loads

$(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    firstMessage();  // Display first message after session_id is generated
  }, 100);
});

function generateSessionId() {
  // Generate a unique session ID (for example, a random string or UUID)
  return 'sess_' + Math.random().toString(36).substr(2, 9);
}

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate() {
  d = new Date();
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  let msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();

  // Send the message to the server
  sendMessageToServer(msg);
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
});

function sendMessageToServer(message) {
  $.ajax({
    url: '/process',  // Your server endpoint
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ "message": message, "session_id": session_id }),
    success: function(response) {
      // Handle the response from the server and display it
      receiveMessage(response.response);  // Assuming server returns {response: "message"}
    },
    error: function() {
      console.error('Error in sending message.');
    }
  });
}

function receiveMessage(message) {
  $('<div class="message new"><figure class="avatar"><img src="static/assets/profile.png" /></figure>' + message + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  updateScrollbar();
}

function firstMessage() {
  // Display the first message "Hi there, I'm Komiljon and you?" after generating the session ID
  let firstMsg = "Hi there, I'm Komiljon and you?";
  $('<div class="message new"><figure class="avatar"><img src="static/assets/profile.png" /></figure>' + firstMsg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  updateScrollbar();

  // Note: The first message is displayed only and not sent to the server
}
