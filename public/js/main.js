
const chatFrom  = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

const urlParams = new URLSearchParams(window.location.search)

const username = urlParams.get("username")
const room = urlParams.get("room")

console.log(username, room)



chatFrom.addEventListener('submit',(e)=>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // sending to the server
    socket.emit('chatMessage',msg);
    
    // clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus();
})

const socket  = io()

// join chatroom
socket.emit('joinRoom', {username,room});
// displaying all messages
socket.on('message', msg=>{
     console.log(msg)
     outputMessage(msg);
     chatMessages.scrollTop = chatMessages.scrollHeight;
     
})











// append message to Dom
async function outputMessage(msg){
    console.log(msg);
    const chatdiv = document.querySelector('.chat-messages');
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML= `
    <p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
       ${msg.text}
    </p>
    `
    chatdiv.appendChild(div)    
}