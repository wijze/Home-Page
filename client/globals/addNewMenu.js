const addNewMenu = (iniateButton, form, submit) => {
  iniateButton.onclick = () => openAddNewMenu(iniateButton, form, submit)
}

const openAddNewMenu = (iniateButton, form, submit) => {
  iniateButton.style.display = "none"
  form.style.display = "block"
  form.name.focus()

  const keyHandler = (e) => {
    if (e.key == "Escape"){
      exit()
    }
  }
  const exit = () => {
    iniateButton.style.display = "block"
    form.style.display = "none"
    document.removeEventListener('keydown', keyHandler)
    document.removeEventListener("mousedown", clickHandler)
  }
  const clickHandler = (e) => {
    if (form.name.value != ""){
      submit()
    }
    exit()
  }
  document.addEventListener("keydown", keyHandler)
  document.addEventListener("mousedown", clickHandler)

  form.onsubmit = (e) => {
    e.preventDefault();
    submit()
    exit()
  }
}