// Modal logic for Skills Visualization
const skillsModal = document.getElementById('skills-modal');
const skillsModalTitle = document.querySelector('.skills-modal-title');
const skillsModalChart = document.getElementById('skillsModalChart');
const skillsModalClose = document.querySelector('.skills-modal-close');
const skillsModalBackdrop = document.querySelector('.skills-modal-backdrop');
let modalChartInstance = null;

function openSkillsModal(category) {
  skillsModal.style.display = 'flex';
  skillsModal.setAttribute('aria-modal', 'true');
  skillsModal.removeAttribute('aria-hidden');
  skillsModalTitle.textContent = category + ' Details';
  if (modalChartInstance) {
    modalChartInstance.destroy();
  }
  const skills = skillsByCategory[category];
  modalChartInstance = new Chart(skillsModalChart, {
    type: 'bar',
    data: {
      labels: skills.map(s => s.name),
      datasets: [{
        data: skills.map(s => s.percent),
        backgroundColor: palette.slice(0, skills.length),
        borderRadius: 10,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed.x}%`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: Math.max(...skills.map(s => s.percent)) > 40 ? 100 : 30,
          ticks: {
            color: '#cbd5e1',
            font: { size: 14 }
          },
          grid: { color: '#334155' }
        },
        y: {
          ticks: {
            color: '#f1f5f9',
            font: { size: 16 }
          },
          grid: { display: false }
        }
      }
    }
  });
  skillsModal.focus();
}

function closeSkillsModal() {
  skillsModal.style.display = 'none';
  skillsModal.setAttribute('aria-hidden', 'true');
  skillsModal.setAttribute('aria-modal', 'false');
  if (modalChartInstance) {
    modalChartInstance.destroy();
    modalChartInstance = null;
  }
}

document.querySelectorAll('.view-details-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const category = btn.getAttribute('data-category');
    openSkillsModal(category);
  });
});
skillsModalClose.addEventListener('click', closeSkillsModal);
skillsModalBackdrop.addEventListener('click', closeSkillsModal);
document.addEventListener('keydown', e => {
  if (skillsModal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
    closeSkillsModal();
  }
  // Focus trap: keep focus inside modal
  if (skillsModal.style.display === 'flex' && e.key === 'Tab') {
    const focusable = skillsModal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
});
