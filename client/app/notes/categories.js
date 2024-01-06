const newCategoryButton = document.getElementById('create_new_category')
const newCategoryForm = document.getElementById('new_category_form')

const categoriesWrapper = document.getElementById('categories')

const submitNewCategory = () => {
  let name = newCategoryForm.name.value;
  name = name ? name : "New Category";
  addCategory(new Category(name))
  newCategoryForm.name.value = "";
};

const createNewCategoryMenu = () => addNewMenu(newCategoryButton, newCategoryForm, submitNewCategory)

const setActiveCategory = (id) => {
  currenCategoryId = id
  displayNotes()
  displayCategories()
}

const displayCategories = () => {
  categoriesWrapper.innerHTML = ''

  const create_el = (n, id, contextMenu) => {
    // creat element
    const el = document.createElement("div")
    el.classList.add("category")
    const elName = document.createElement("p")
    elName.innerText = n
    el.appendChild(elName)

    // apply event handlers
    if (contextMenu){
      el.oncontextmenu = (e) => openCategoryContextMenu(e, id)
    }
    if (id == currenCategoryId){
      el.id = "active_category"
    } else {
      el.onclick = () => setActiveCategory(id)
    }
    el.ondragover = (e) => e.preventDefault()
    el.ondrop = (e) => {
      updateNote(e.dataTransfer.getData("source"), {category:id})
    }

    categoriesWrapper.appendChild(el)
  }

  create_el("All", "all", false)
  Object.values(categories).forEach( c => {
    create_el(c.name, c.id, true)
  })
}