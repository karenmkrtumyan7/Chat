let sentState = 'me';
document.querySelector('.chat[data-chat=person2]').classList.add('active-chat');
document.querySelector('.person[data-chat=person2]').classList.add('active');

const messageInput = document.forms.chatForm.newMessage;
const toggleButton = document.getElementsByClassName('toggle')[0];
messageInput.addEventListener('keydown', sendMessage);
toggleButton.addEventListener('click', ({ target }) => {
  console.log(target.innerHTML === 'me')
  if (target.innerHTML === 'me') {
    target.innerHTML = 'you';
    sentState = 'you';
  } else {
    target.innerHTML = 'me';
    sentState = 'me';
  }
})

let friends = {
  list: document.querySelector('ul.people'),
  all: document.querySelectorAll('.left .person'),
  name: '' },

chat = {
  container: document.querySelector('.container .right'),
  current: null,
  person: null,
  name: document.querySelector('.container .right .top .name') };


friends.all.forEach(f => {
  f.addEventListener('mousedown', () => {
    f.classList.contains('active') || setAciveChat(f);
  });
});

function setAciveChat(f) {
  friends.list.querySelector('.active').classList.remove('active');
  f.classList.add('active');
  chat.current = chat.container.querySelector('.active-chat');
  chat.person = f.getAttribute('data-chat');
  chat.current.classList.remove('active-chat');
  chat.container.querySelector('[data-chat="' + chat.person + '"]').classList.add('active-chat');
  friends.name = f.querySelector('.name').innerText;
  chat.name.innerHTML = friends.name;
  const id = chat.person;
  setCurrentUser(id);
  renderChat(getUserMessages(id))
}

function getChat() {
  return JSON.parse(localStorage.getItem('chat')) || {};
}

function getUserMessages(id) {
  return getChat()?.[id] || [];
}

function setUserMessage(id, message) {
  const chat = getChat();
  const userMessages = getUserMessages(id);
  userMessages.push(message);
  chat[id] = userMessages;
  
  localStorage.setItem('chat', JSON.stringify(chat));
  return getUserMessages(id);
}

function setCurrentUser(id) {
  localStorage.setItem('currentUser', id);
}

function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

function createSingleBubble(message) {
  const item = document.createElement('div');
  item.innerText = message.text;
  item.classList.add('bubble');
  item.classList.add(message.type);
  item.classList.add('single');
  return item;
}

function createDoubleBubble(messages) {
  const item1 = document.createElement('div');
  item1.innerText = messages[0].text;
  item1.classList.add('bubble');
  item1.classList.add(messages[0].type);
  item1.classList.add('first');
  const item2 = document.createElement('div');
  item2.innerText = messages[1].text;
  item2.classList.add('bubble');
  item2.classList.add(messages[1].type);
  item2.classList.add('last');
  return [item1, item2];
}

function createMore2Bubble(messages) {
  const uiMessages = messages.map(message => createSingleBubble(message));
  uiMessages[0].classList.add('first');
  uiMessages[uiMessages.length - 1].classList.add('last');
  return uiMessages;
}

function renderChat(messages) {
  let itemsArray = [];
  let itemArray = [];

  for (let i = 0; i < messages.length; i ++) {
    if (i === messages.length - 1) {
      itemArray.push(messages[i]);
      itemsArray.push(itemArray);
      break;      
    }

    if (messages[i].type === messages[i + 1].type) {
      itemArray.push(messages[i]);
    } else {
      itemArray.push(messages[i]);
      itemsArray.push(itemArray);
      itemArray = [];
    }
  }


  const paintArray = [];
  itemsArray.forEach(arr => {
    switch (arr.length) {
      case 0: 
        break;
      case 1:
        paintArray.push(createSingleBubble(...arr));
        break;
      case 2:
        paintArray.push(...createDoubleBubble(arr));
        break;
      default:
        paintArray.push(...createMore2Bubble(arr));
    }
  });

  const activeChat = document.getElementsByClassName('active-chat')[0];
  Array.from(activeChat.children).forEach(message => message.remove());
  activeChat.append(...paintArray);
}

function sendMessage(event) {
  if (event.keyCode === 13) {
    const { target } = event;  
    const id = getCurrentUser();
    const message = { type: sentState, text: target.value };
    const userMessages = setUserMessage(id, message);

    target.value = "";
    renderChat(userMessages);
  }
}

renderChat(getUserMessages(getCurrentUser()));
