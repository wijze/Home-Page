const id = () =>
  new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

const sendData = (endpoint, body) => {
  fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
}

function includeCssFile(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = path;
  document.head.appendChild(link);
}

function addFavicon() {
  const link = document.createElement('link');
  link.rel = 'shortcut icon';
  link.href = '#';
  document.head.appendChild(link);
}

function navbar(page) {
  return `
    <nav>
      <div ${page == 'home' ? 'id="active"' : ''}>
        <a href="/">
          <div>Home</div>
        </a>
      </div>
      <div ${page == 'notes' ? 'id="active"' : ''}>
        <a href="/notes">
          <div>Notes</div>
        </a>
      </div>
      <div ${page == 'todo' ? 'id="active"' : ''}>
        <a href="/todo">
          <div>Todo</div>
        </a>
      </div>
    </nav>
  `;
}

function create_navbar(page, container=document.body) {
  includeCssFile('/globals/navbar.css');
  navbar_element = document.createElement('div');
  navbar_element.innerHTML = navbar(page);
  container.insertBefore(navbar_element, container.firstChild);
}

addFavicon()
includeCssFile('/globals/global.css');