
/*
 * Display CMS text with paragraph breaks.
 * Supports plain text and basic Markdown paragraphs.
 */
function displayParagraphs(element, value) {
  if (!element) return;

  element.replaceChildren();

  if (typeof value !== 'string' || !value.trim()) {
    return;
  }

  const text = value
    .replace(/\r\n/g, '\n')
    .replace(/\\\n/g, '\n')
    .trim();

  // Split paragraphs at blank lines.
  const paragraphs = text.split(/\n\s*\n/);

  paragraphs.forEach(paragraph => {
    const p = document.createElement('p');

    // Preserve single line breaks within paragraphs.
    p.style.whiteSpace = 'pre-line';

    // Remove simple Markdown paragraph formatting.
    p.textContent = paragraph.trim();

    element.appendChild(p);
  });
}

/*
 * Roster
 */
const roster = document.querySelector('#roster');

if (roster) {
  fetch('content/members.json')
    .then(response => {
      if (!response.ok) throw new Error('Could not load roster');
      return response.json();
    })
    .then(data => {
      roster.replaceChildren();

      (data.members || []).forEach(member => {
        const card = document.createElement('article');
        card.className = 'person';

        const portrait = document.createElement('div');
        portrait.className = 'portrait';

        if (member.photo) {
          const img = document.createElement('img');
          img.src = member.photo;
          img.alt = member.name || '';
          portrait.appendChild(img);
        } else {
          portrait.textContent = 'PHOTO TO COME';
        }

        const name = document.createElement('h2');
        name.textContent = member.name || '';

        const bio = document.createElement('div');
        bio.className = 'member-bio';

        displayParagraphs(bio, member.bio || 'Bio to come.');

        card.append(portrait, name, bio);
        roster.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Roster error:', error);
      roster.textContent = 'Member profiles will be added soon.';
    });
}

/*
 * Homepage
 */
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

      displayParagraphs(
        homeIntroduction,
        data.introduction || ''
      );
    })
    .catch(error => {
      console.error('Homepage content error:', error);
    });
}

/*
 * About Us
 */
const aboutHeading = document.querySelector('#about-heading');

if (aboutHeading) {
  fetch('content/about.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not load About Us content');
      }
      return response.json();
    })
    .then(data => {
      aboutHeading.textContent = data.heading || 'About Us';

      displayParagraphs(
        document.querySelector('#about-introduction'),
        data.introduction || ''
      );

      displayParagraphs(
        document.querySelector('#about-description'),
        data.description || ''
      );

      const leadership = document.querySelector('#leadership');
      leadership.replaceChildren();

      (data.leadership || []).forEach(person => {
        const card = document.createElement('div');
        card.className = 'leader';

        const name = document.createElement('strong');
        name.textContent = person.name || '';

        const position = document.createElement('span');
        position.textContent = person.position || '';

        const bio = document.createElement('div');
        bio.className = 'leader-bio';

        displayParagraphs(bio, person.bio || '');

        card.append(name, position, bio);
        leadership.appendChild(card);
      });
    })
    .catch(error => {
      console.error('About Us content error:', error);
    });
}
