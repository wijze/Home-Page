const searchForm = document.getElementById("search_notes_form");

const searchFormSubmit = (e) => {
    e.preventDefault();
    const searchQuery = searchForm.search.value;
    if (searchQuery == "") {
      displayNotes();
      return;
    }
    searchForm.search.value = "";
  
    let ranking = [];
    let parsedQuery = { title: "", tags: [] };
    for (const part of searchQuery.split("+")) {
      if (part.startsWith("#")) {
        parsedQuery.tags.push(part.slice(1));
      } else {
        parsedQuery.title = part;
      }
    }
    for (const note of Object.values(notes)) {
      let score = 0;
      if (note.title.toLowerCase().includes(parsedQuery.title.toLowerCase())) {
        score += 1000;
        score -= note.title.length;
      }
      for (const tag of parsedQuery.tags) {
        lowercase_tags = note.tags.map((tag) => {
          tag.toLowerCase();
        });
        if (lowercase_tags.includes(tag.toLowerCase())) {
          score += 10;
        }
      }
      ranking.push([note.id, score]);
    }
    ranking.sort((a, b) => b[1] - a[1]);
    ranking.slice(0, currentMaxNotesVisible);
    let final_notes = {};
    for (const note of ranking) {
      final_notes[note[0]] = notes[note[0]];
    }
    notes = final_notes;
    displayNotes();
  };