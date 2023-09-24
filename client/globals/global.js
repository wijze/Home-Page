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

includeCssFile('/globals/global.css');

function create_navbar(page) {
  includeCssFile('/globals/navbar.css');
  navbar_element = document.createElement('div');
  navbar_element.innerHTML = navbar(page);
  document.body.insertBefore(navbar_element, document.body.firstChild);
}