const chatBox =
document.getElementById("chatBox");

const input =
document.getElementById("userInput");

const sendBtn =
document.getElementById("sendBtn");

// MEMORY
let messages = [];

// SEND BUTTON
sendBtn.addEventListener(
  "click",
  sendMessage
);

// ENTER KEY
input.addEventListener(
  "keydown",
  function(e){

    if(
      e.key === "Enter" &&
      !e.shiftKey
    ){

      e.preventDefault();

      sendMessage();
    }

  }
);

// AUTO RESIZE
input.addEventListener(
  "input",
  () => {

    input.style.height =
    "auto";

    input.style.height =
    input.scrollHeight + "px";

  }
);

// ADD MESSAGE
function addMessage(text, type){

  const div =
  document.createElement("div");

  div.className =
  "msg " + type;

  div.innerText = text;

  chatBox.appendChild(div);

  chatBox.scrollTop =
  chatBox.scrollHeight;

  return div;
}

// SEND MESSAGE
async function sendMessage(){

  const text =
  input.value.trim();

  if(!text) return;

  // REMOVE WELCOME
  document.querySelector(".welcome")
  ?.remove();

  // USER MESSAGE
  addMessage(text, "user");

  input.value = "";

  input.style.height =
  "auto";

  // SAVE USER MESSAGE
  messages.push({
    role:"user",
    content:text
  });

  // MEMORY LIMIT
  if(messages.length > 20){

    messages =
    messages.slice(-20);

  }

  // BOT THINKING
  const botDiv =
  addMessage(
    "Thinking...",
    "bot"
  );

  try{

    const response =
    await fetch("/api/chat", {

      method:"POST",

      headers:{
        "Content-Type":
        "application/json"
      },

      body: JSON.stringify({
        messages
      })

    });

    const data =
    await response.json();

    const reply =
      data.reply ||
      data.error ||
      "No response";

    botDiv.innerText =
    reply;

    // SAVE BOT RESPONSE
    messages.push({
      role:"assistant",
      content:reply
    });

  }

  catch(error){

    console.log(error);

    botDiv.innerText =
    "Server error";

  }

}
