
const roster = document.querySelector('#roster');

if (roster) {
  fetch('content/members.json')
    .then(r => r.json())
    .then(data => {
      const members = data.members;

      roster.innerHTML = members.map(m => `
        <article class="person">
          <div class="portrait">
            ${m.photo
              ? `<img src="${m.photo}" alt="${m.name}">`
              : 'PHOTO TO COME'}
          </div>
          <h2>${m.name}</h2>
          <p>${m.bio || 'Bio to come.'}</p>
        </article>
      `).join('');
    })
    .catch(() => {
      roster.innerHTML =
        '<p>Member profiles will be added soon.</p>';
    });
}

const form = document.querySelector('#contact-form');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('#form-status').textContent =
      'This preview does not send messages yet. We will connect the form before launch.';
  });
}

const homeHeading = document.querySelector('#home-heading');
const homeIntroduction = document.querySelector('#home-introduction');

if (homeHeading && homeIntroduction) {
  fetch('content/home.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not load homepage content');
      }
      return response.json();
    })
    .then(data => {
      homeHeading.textContent = data.heading || 'About Us';
      homeIntroduction.textContent = data.introduction || '';
    })
    .catch(error => {
      console.error('Homepage content error:', error);
    });
}
