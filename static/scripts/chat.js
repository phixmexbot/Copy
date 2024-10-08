var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 100);
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
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
  
  let charLimit = 50; // Character limit per line
  let splitMessage = splitIntoLines(msg, charLimit);
  
  // Insert each chunk into a new line
  splitMessage.forEach(function(line) {
    $('<div class="message message-personal">' + line + '</div>').appendTo($('.mCSB_container')).addClass('new');
  });
  
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  
  setTimeout(function() {
    fakeMessage();
  }, 1000 + (Math.random() * 20) * 100);
}

// Helper function to split message into chunks based on the character limit
function splitIntoLines(message, charLimit) {
  let lines = [];
  while (message.length > charLimit) {
    lines.push(message.substring(0, charLimit)); // Push the first 50 characters
    message = message.substring(charLimit); // Remove the first 50 characters from the message
  }
  if (message.length > 0) {
    lines.push(message); // Add the remaining part of the message
  }
  return lines;
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

var Fake = [
  'Hi there, I\'m Komiljon and you?',
  'Nice to meet you',
  'How are you?',
  'Not too bad, thanks',
  'What do you do?',
  'That\'s awesome',
  'I think you\'re a nice person',
  'Why do you think that?',
  'Can you explain?',
  'Anyway I\'ve gotta go now',
  'It was a pleasure chat with you',
  'Time to make a new project',
  'Bye',
  ':)'
]

function fakeMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="static/assets/profile.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();

  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="static/assets/profile.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
    i++;
  }, 1000 + (Math.random() * 20) * 100);
}
