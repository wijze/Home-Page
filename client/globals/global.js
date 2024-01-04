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
      <div ${page == 'email' ? 'id="active"' : ''}>
        <a href="/email">
          <div>Email</div>
        </a>
      </div>
    </nav>
  `;
}

function includeCssFile(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = path;
  document.head.appendChild(link);
}

function create_navbar(page, container=document.body) {
  includeCssFile('/globals/navbar.css');
  navbar_element = document.createElement('div');
  navbar_element.innerHTML = navbar(page);
  container.insertBefore(navbar_element, container.firstChild);
}

function addFavicon() {
  const link = document.createElement('link');
  link.rel = 'shortcut icon';
  link.href = '#';
  document.head.appendChild(link);
}

addFavicon()
includeCssFile('/globals/global.css');