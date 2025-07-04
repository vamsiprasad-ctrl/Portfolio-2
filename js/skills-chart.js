// Modern accent gradient palette for bars
const palette = [
  'linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)',
  '#38bdf8', '#6366f1', '#38bdf8', '#6366f1', '#38bdf8', '#6366f1', '#38bdf8', '#6366f1',
  '#38bdf8', '#6366f1', '#38bdf8', '#6366f1', '#38bdf8', '#6366f1', '#38bdf8', '#6366f1',
  '#38bdf8', '#6366f1', '#38bdf8', '#6366f1', '#38bdf8'
];

const skillsByCategory = {
  Languages: [
    { name: 'Python', percent: 25 },
    { name: 'SQL', percent: 20 },
    { name: 'Java', percent: 15 },
    { name: 'HTML', percent: 15 },
    { name: 'CSS', percent: 10 },
    { name: 'JavaScript', percent: 15 }
  ],
  Frameworks: [
    { name: 'Node.js', percent: 60 },
    { name: 'Express.js', percent: 40 }
  ],
  Libraries: [
    { name: 'React.js', percent: 20 },
    { name: 'Node.js', percent: 10 },
    { name: 'Bootstrap', percent: 10 },
    { name: 'Pandas', percent: 15 },
    { name: 'NumPy', percent: 15 },
    { name: 'Scikit-Learn', percent: 10 },
    { name: 'Matplotlib', percent: 10 },
    { name: 'Seaborn', percent: 10 }
  ],
  Tools: [
    { name: 'Power BI', percent: 30 },
    { name: 'Figma', percent: 25 },
    { name: 'Excel', percent: 25 },
    { name: 'Canva', percent: 20 }
  ],
  Platforms: [
    { name: 'VS Code', percent: 35 },
    { name: 'Jupyter Notebook', percent: 25 },
    { name: 'PyCharm', percent: 20 },
    { name: 'MongoDB', percent: 20 }
  ]
};

const valueLabelPlugin = {
  id: 'valueLabel',
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;
    ctx.save();
    ctx.font = 'bold 13px Segoe UI';
    ctx.fillStyle = '#e2e8f0';
    data.datasets.forEach((dataset, i) => {
      chart.getDatasetMeta(i).data.forEach((bar, j) => {
        const value = dataset.data[j];
        const x = bar.x + 8;
        const y = bar.y + 4;
        ctx.fillText(value + '%', x, y);
      });
    });
    ctx.restore();
  }
};

document.addEventListener('DOMContentLoaded', function () {
  function renderBarChart(canvasId, skills, maxValue) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: skills.map(s => s.name),
        datasets: [{
          data: skills.map(s => s.percent),
          backgroundColor: palette.slice(0, skills.length),
          borderRadius: 8,
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
          },
          valueLabel: true
        },
        scales: {
          x: {
            beginAtZero: true,
            max: maxValue,
            ticks: {
              color: '#cbd5e1',
              font: { size: 12 }
            },
            grid: { color: '#334155' }
          },
          y: {
            ticks: {
              color: '#f1f5f9',
              font: { size: 14 }
            },
            grid: { display: false }
          }
        }
      },
      plugins: [valueLabelPlugin]
    });
  }

  renderBarChart('skillsBarChartLanguages', skillsByCategory.Languages, 30);
  renderBarChart('skillsBarChartFrameworks', skillsByCategory.Frameworks, 100);
  renderBarChart('skillsBarChartLibraries', skillsByCategory.Libraries, 30);
  renderBarChart('skillsBarChartTools', skillsByCategory.Tools, 40);
  renderBarChart('skillsBarChartPlatforms', skillsByCategory.Platforms, 40);

  document.querySelectorAll('.download-chart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const canvas = document.getElementById(btn.dataset.canvas);
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = btn.dataset.canvas + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });

  // Filtering logic
  const filterType = document.getElementById('skills-filter-type');
  const filterMin = document.getElementById('skills-filter-min');
  const cardMap = {
    Languages: document.querySelector('.skill-card-pro .icon-bg-languages').closest('.skill-card-pro'),
    Frameworks: document.querySelector('.skill-card-pro .icon-bg-frameworks').closest('.skill-card-pro'),
    Libraries: document.querySelector('.skill-card-pro .icon-bg-libraries').closest('.skill-card-pro'),
    Tools: document.querySelector('.skill-card-pro .icon-bg-tools').closest('.skill-card-pro'),
    Platforms: document.querySelector('.skill-card-pro .icon-bg-platforms').closest('.skill-card-pro')
  };

  function applySkillFilters() {
    const selectedType = filterType.value;
    const minPercent = parseInt(filterMin.value, 10) || 0;
    Object.keys(cardMap).forEach(category => {
      const card = cardMap[category];
      if (
        (selectedType === 'all' || selectedType === category) &&
        skillsByCategory[category].some(skill => skill.percent >= minPercent)
      ) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterType.addEventListener('change', applySkillFilters);
  filterMin.addEventListener('input', applySkillFilters);
  applySkillFilters();
});
