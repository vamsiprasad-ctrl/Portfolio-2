console.log("section-edit.js loaded");
// Section Add, Edit, Delete Functionality for All Sections (Backend Version, Separated)

document.addEventListener('DOMContentLoaded', function() {
  // Modal elements (shared)
  const modal = document.getElementById('about-modal');
  const modalTitle = document.getElementById('about-modal-title');
  const modalText = document.getElementById('about-modal-text');
  const modalSave = document.getElementById('about-modal-save');
  const modalCancel = document.getElementById('about-modal-cancel');
  if (!modal || !modalTitle || !modalText || !modalSave || !modalCancel) {
    console.error('Modal elements missing');
    return;
  }
  let currentSection = null;
  let currentContentCol = null;
  let currentSectionId = null;
  let currentEditElem = null;
  let modalMode = null;

  // --- Backend helpers ---
  const API_BASE = 'http://localhost:3001/api/sections/';
  async function fetchSection(sectionId) {
    const res = await fetch(API_BASE + encodeURIComponent(sectionId));
    if (!res.ok) return '';
    const data = await res.json();
    return data.content || '';
  }
  async function saveSection(sectionId, sectionElem) {
    await fetch(API_BASE + encodeURIComponent(sectionId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: sectionElem.innerHTML })
    });
  }
  async function deleteSection(sectionId) {
    await fetch(API_BASE + encodeURIComponent(sectionId), { method: 'DELETE' });
  }

  // For each section with .section-edit-bar
  document.querySelectorAll('.section-edit-bar').forEach(async function(editBar) {
    const section = editBar.closest('section');
    if (!section) return;
    const sectionId = section.id;
    // Restore from backend (replace section's innerHTML)
    const html = await fetchSection(sectionId);
    if (html) section.innerHTML = html;
    // After possible replacement, re-select editBar, contentCol, etc.
    const newSection = document.getElementById(sectionId);
    if (!newSection) return;
    const newEditBar = newSection.querySelector('.section-edit-bar');
    let contentCol = newSection.querySelector(
      '.about-text-col, .stats-grid, .skills-grid, .projects-grid, .timeline, .certifications-timeline, .hackathons-grid, .contact-grid'
    );
    if (!contentCol) {
      contentCol = newSection.querySelector('div');
    }
    if (!contentCol) return;
    // Add
    const addBtn = newEditBar.querySelector('.add-section-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        currentSection = newSection;
        currentContentCol = contentCol;
        currentSectionId = sectionId;
        // Find the last content block to clone its tag/class
        let last = null;
        for (let i = contentCol.children.length - 1; i >= 0; i--) {
          if (contentCol.children[i].nodeType === 1) {
            last = contentCol.children[i];
            break;
          }
        }
        let tag = 'p', className = '';
        if (last) {
          tag = last.tagName.toLowerCase();
          className = last.className;
        }
        modalTitle.textContent = 'Add Content';
        modalText.value = '';
        modalMode = 'add';
        modal.style.display = 'flex';
        setTimeout(() => modalText.focus(), 100);
        modalSave.onclick = async function() {
          const value = modalText.value.trim();
          if (!value) return;
          const elem = document.createElement(tag);
          elem.textContent = value;
          if (className) elem.className = className;
          contentCol.appendChild(elem);
          await saveSection(sectionId, newSection);
          modal.style.display = 'none';
          modalText.value = '';
        };
      });
    }
    // Edit (show inline edit/delete for each block)
    const editBtn = newEditBar.querySelector('.edit-section-btn');
    if (editBtn) {
      editBtn.addEventListener('click', function() {
        contentCol.querySelectorAll('.edit-inline-btn, .delete-inline-btn').forEach(btn => btn.remove());
        Array.from(contentCol.children).forEach(function(child) {
          if (['P','DIV','BLOCKQUOTE','SPAN','LI','H3','H4','H5'].includes(child.tagName)) {
            // Edit icon
            const editIcon = document.createElement('button');
            editIcon.type = 'button';
            editIcon.className = 'edit-inline-btn btn secondary-btn';
            editIcon.style.marginLeft = '8px';
            editIcon.innerHTML = '<i class="fa fa-edit"></i>';
            editIcon.title = 'Edit this content';
            editIcon.addEventListener('click', function(e) {
              e.stopPropagation();
              currentEditElem = child;
              modalTitle.textContent = 'Edit Content';
              modalText.value = child.textContent;
              modalMode = 'edit-inline';
              modal.style.display = 'flex';
              setTimeout(() => modalText.focus(), 100);
              modalSave.onclick = async function() {
                const value = modalText.value.trim();
                if (!value) return;
                child.textContent = value;
                await saveSection(sectionId, newSection);
                modal.style.display = 'none';
                modalText.value = '';
                contentCol.querySelectorAll('.edit-inline-btn, .delete-inline-btn').forEach(btn => btn.remove());
              };
            });
            child.appendChild(editIcon);
            // Delete icon
            const deleteIcon = document.createElement('button');
            deleteIcon.type = 'button';
            deleteIcon.className = 'delete-inline-btn btn secondary-btn';
            deleteIcon.style.marginLeft = '4px';
            deleteIcon.innerHTML = '<i class="fa fa-trash"></i>';
            deleteIcon.title = 'Delete this content';
            deleteIcon.addEventListener('click', async function(e) {
              e.stopPropagation();
              if (confirm('Delete this content?')) {
                child.remove();
                await saveSection(sectionId, newSection);
              }
            });
            child.appendChild(deleteIcon);
          }
        });
      });
    }
    // Delete entire section
    const deleteBtn = newEditBar.querySelector('.delete-section-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async function() {
        if (confirm('Are you sure you want to delete this section?')) {
          newSection.remove();
          await deleteSection(sectionId);
        }
      });
    }
  });

  if (modalCancel) {
    modalCancel.addEventListener('click', function() {
      modal.style.display = 'none';
      modalText.value = '';
    });
  }
});
