const calculationsProductionNotes = {
  1: 'On the big screen, show one of Aakash’s entries open with an engaging visualization. Check with Aakash whether he has a suitable example.'
};

const calculationsDefaultProductionNote = 'Use this panel during planning and editing to verify the shot against each spoken sentence.';
const calculationsProductionNoteElement = document.getElementById('production-note-text');
const calculationsSceneCounter = document.getElementById('scene-counter');

function syncCalculationsProductionNote() {
  calculationsProductionNoteElement.textContent = calculationsProductionNotes[scenes[active]?.id] || calculationsDefaultProductionNote;
}

new MutationObserver(syncCalculationsProductionNote).observe(calculationsSceneCounter, { childList: true, subtree: true });
syncCalculationsProductionNote();
