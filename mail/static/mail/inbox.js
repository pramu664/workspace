
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector ('#compose-form').onsubmit = () => {

    const recipients = document.querySelector ('#compose-recipients').value;
    const subject = document.querySelector ('#compose-subject').value;
    const body = document.querySelector ('#compose-body').value; 
    console.log (typeof recipients, subject, body);

    if (recipients === '') {
      alert ('Recipient must include! ');
      return false;
    }
     fetch ('/emails', {
      method: 'POST',
      body : JSON.stringify ({
         recipients: recipients,
         subject: subject,
         body: body
       })
     })
     .then (response => response.json ())
     .then (result => {
        if (result.error) {
          alert (result.error);
        } else {
          alert (`Email sent to ${/\w+/.exec (recipients)}`);
        }

     })
  }

  //By default, load the inbox
  load_mailbox('inbox');

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector ('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Frist Show the mailbox view and hide the other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector ('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Then show the mailbox name on top of the window,
  document.querySelector('#emails-view').innerHTML = `<h3 id="mailbox-header">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // And next get all the emails from the server
  fetch (`emails/${mailbox}`)
  .then (response => response.json ())
  .then (emails => {
    emails.forEach (email => {

      // For each email create a div 
      if (email.subject === '') {
        return;
      }
      const email_div = document.createElement ('div');
      email_div.setAttribute ('draggable', 'true');
      email_div.className = 'email';

      // get that email's unique id and add that to the  div's dataset. 
      email_div.dataset.id = email.id;

      // and if the users are in the sent-box do the following,
      if (mailbox === 'sent') {

        const recipient_name = /\w+/.exec (email.recipients);
        const day = /\w\w\w \d\d/i.exec  (email.timestamp);
        email_div.innerHTML = `<span data-id="${email.id}" class="recipient">${recipient_name}</span><span data-id="${email.id}" class="subject">${email.subject}</span> <span data-id="${email.id}" class="time"> ${day}</span>`;

      } else {

        // and if users are in other boxes (inbox and archive), 
        // read emails should get lightgray for their background color.
        const sender_name = /\w+/.exec (email.sender);
        const day = /\w\w\w \d\d/i.exec  (email.timestamp);
        if (email.read == true) email_div.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        email_div.innerHTML = `<span data-id="${email.id}" class="sender">${sender_name}</span><span data-id="${email.id}" class="subject">${email.subject}</span> <span data-id="${email.id}" class="time"> ${day}</span>`;

      }

      //-> Finally add the email to the view
      document.querySelector ('#emails-view').appendChild (email_div);

      // Now to that email add a mouse over event and handle that event using arrow funtion.
      email_div.onmouseover = (event) => {
        event.target.style.cursor = 'pointer';
      }

      // And also add click event to the email and handle that event in show_email function.
      email_div.onclick = show_email;


    // DRAGGING AND DROPPING
      email_div.ondragstart = dragstart;
      email_div.ondragend = dragend;


    });

  })

    // DRAGGING AND DROPPING
    const container = document.querySelector ('#emails-view');

    container.ondragover = (event) => {

      event.preventDefault ();

      const draggable = document.querySelector ('.dragging');
      const afterElement = getDragAfterElement (container ,event.clientY);

      if (afterElement == null) {

        container.appendChild (draggable);

      } else {

        container.insertBefore (draggable, afterElement);

      }

    }

  function getDragAfterElement (container ,y) {

      const draggableElements = [...container.querySelectorAll ('.email:not(.dragging)')];
      console.log (draggableElements)

      return draggableElements.reduce ((closest, child) => {

        const box = child.getBoundingClientRect ();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {

          return {offset: offset, element: child}

        } else {

          return closest;

        }

      }, {offset: Number.NEGATIVE_INFINITY}).element

	}	
  
}

function dragstart (event) {

  event.target.classList.add ('dragging');

}

function dragend (event) {

  event.target.classList.remove ('dragging'); 

}

function show_email (event) {

  // Hide the archive button from the sent box 
  if (document.querySelector ("#mailbox-header").innerHTML === 'Sent') {

    document.querySelector ('#archive-button').style.display = 'none';

  } else {

    document.querySelector ('#archive-button').style.display = 'block';
    document.querySelector ('#archive-button').classList.add ('btn','btn-sm', 'btn-outline-primary');
    document.querySelector ('#archive-button').style.margin = "1rem 0 1rem 0";
    document.querySelector ('#archive-button').style.float = "right";

  }

  // do style the replay button
  document.querySelector ('#reply-button').classList.add ('btn', 'btn-sm', 'btn-outline-primary');
  document.querySelector ('#reply-button').style.margin = "1rem 0 1rem 0";

  // SHOW THE EMAIL DETAILS TO THE USER
  // First Get the unique id from the div's dataset
  const id = parseInt (event.target.dataset.id);

  // Next using that id send a request to the server to put this email in to read.
  fetch (`emails/${parseInt (id)}`, {
    method: 'PUT',
    body: JSON.stringify ({
      read: true,
    })
  })

  // Next again send a request to the server using unique id to get email details
   fetch (`emails/${parseInt (id)}`)
  .then (response => response.json ())
  .then (email => {

    // show email view and hide other views
    document.querySelector ('#emails-view').style.display = 'none';
    document.querySelector ('#email-view').style.display = 'block';

    // Get the email details
    const subject = email.subject;
    const sender = email.sender;
    const timestamp = email.timestamp;
    const content = email.body;

    // Add the email details to the view 
    document.querySelector ('#subject-view').innerHTML = `<h2>${subject}</h2>`;
    const sender_name = /(\w+)/.exec (sender)[0];
    document.querySelector ('#detail-view').innerHTML = `<b>${sender_name}</b>-${sender}-${timestamp} <hr>`;
    document.querySelector ('#content-view').innerHTML = `<p>${content}</p>`;

    //  ALLOW USERS TO ARCHIVE and UNARCHIVE AN EMAIL
    // Get the archive button
    const archive_button = document.querySelector ('#archive-button');

    // get the mailbox name and do the following
    const box = document.querySelector ('#mailbox-header').innerHTML.toLowerCase (); 

    if (box == 'archive') {

      archive_button.innerHTML = 'unarchive';

    }else {

      archive_button.innerHTML = 'archive';

    }

    // add a event listener to the archive button
    archive_button.onclick = (event) => {

      // get the mailbox name after clicked 
      const mailbox = document.querySelector ('#mailbox-header').innerHTML.toLowerCase ();

      //  when the user is in the archive box do the following,
      if (mailbox === 'archive') {
        event.target.innerHTML = 'unarchive';
        
      // give a call to the server for putting this email to unarchive
      fetch (`emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify ({
          archived: false
        })
      })

      // after that send the user to the inbox
      //alert('Email unarchived');
      load_mailbox ('inbox');

      // If the user is in the sendbox
    } else if(mailbox === 'sent') {

      // do not display archive button on sentbox
      archive_button.style.display = 'none';
      // If the user is in inbox

    } else {

      event.target.innerHTML = 'archive';

      // give a call to the server and say put this email to archive
      fetch (`emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify ({
          archived: true
        })
      })

      alert('Email archived');
      load_mailbox ('inbox');

    }

   }
   
  // ALLOW USERS TO REPLY TO AN EMAIL
  // Get the reply button that attch to that email
  const reply_button = document.querySelector ('#reply-button');

  // add that email's unique id to that reply button
  reply_button.dataset.email_id = email.id;

  // add a event click event listener to reply button and handle that in reply email function
  reply_button.onclick = reply_email;


  });

}

function reply_email (event) {

  // Load the compose form
  compose_email ();

  // Get the email id
  const email_id = event.target.dataset.email_id

  // Get the email details form the server
  fetch (`emails/${parseInt(email_id)}`)
  .then (response => response.json ())
  .then (email => {

    // User email detals to populated the recipients field and subject field    
    document.querySelector ('#compose-recipients').value = email.sender;

    if (/Re:/.exec(email.subject) == null) {
      document.querySelector ('#compose-subject').value = `Re: ${email.subject}`;
    } else {
      document.querySelector ('#compose-subject').value = `${email.subject}`;
    }


    document.querySelector ('#compose-body').value = `On ${email.timestamp} ${email.recipients} wrote:`

  });

}

