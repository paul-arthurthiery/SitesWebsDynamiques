let firstname = localStorage.getItem('firstname')
let lastname = localStorage.getItem('lastname')
let ordernum = localStorage.getItem('ordernum')

const confBuilder = () => {
    $('main').empty();

    $('main').append(` <article>
      <h1 id="name">Votre commande est confirmée ${firstname} ${lastname}!</h1>
      <p id="confirmation-number">Votre numéro de confirmation est le <strong>${ordernum}</strong>.</p>
    </article>`);

    };

confBuilder()