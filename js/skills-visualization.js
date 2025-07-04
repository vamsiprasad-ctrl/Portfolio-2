// --- Skills Visualization Section JS (Pie Chart Version) ---
const skillsData = {
  Languages: {
    labels: ["Python", "SQL", "Java", "HTML", "CSS", "JavaScript"],
    values: [95, 90, 85, 80, 80, 75],
    colors: ["#38bdf8", "#7f5af0", "#fbbf24", "#e34c26", "#2965f1", "#f7df1e"],
    icons: ["fab fa-python", "fas fa-database", "fab fa-java", "fab fa-html5", "fab fa-css3-alt", "fab fa-js"]
  },
  Frameworks: {
    labels: ["Node.js", "Express.js"],
    values: [85, 80],
    colors: ["#3c873a", "#444"],
    icons: ["fab fa-node-js", "fas fa-server"]
  },
  Libraries: {
    labels: ["React.js", "Bootstrap", "Pandas", "NumPy", "Scikit-Learn", "Matplotlib"],
    values: [80, 75, 90, 88, 85, 80],
    colors: ["#61dafb", "#7952b3", "#150458", "#013243", "#f7931e", "#e1575b"],
    icons: ["fab fa-react", "fab fa-bootstrap", "fas fa-cube", "fas fa-cubes", "fas fa-brain", "fas fa-chart-bar"]
  },
  Tools: {
    labels: ["Power BI", "Figma", "Excel", "Canva"],
    values: [85, 80, 90, 75],
    colors: ["#f2c811", "#a259ff", "#217346", "#00c4cc"],
    icons: ["fab fa-microsoft", "fab fa-figma", "fa fa-table", "fab fa-canadian-maple-leaf"]
  },
  Platforms: {
    labels: ["VS Code", "Jupyter Notebook", "PyCharm", "MongoDB"],
    values: [95, 90, 85, 80],
    colors: ["#007acc", "#f37626", "#21d789", "#47a248"],
    icons: ["fab fa-vuejs", "fab fa-python", "fab fa-python", "fas fa-database"]
  }
};

function createPieChart(ctx, value, color) {
  // Start at 0, animate to value
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Proficiency", "Remaining"],
      datasets: [{
        data: [0, 100],
        backgroundColor: [color, "#23243a"],
        borderWidth: 0,
        hoverOffset: 2,
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#23243a',
          titleColor: '#fff',
          bodyColor: color,
          borderColor: color,
          borderWidth: 1,
          callbacks: {
            label: ctx => ctx.label + ': ' + ctx.parsed + '%'
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1800,
        easing: 'easeOutQuart',
        onProgress: function(animation) {
          // Animate the arc from 0 to value
          const current = Math.round(value * animation.currentStep / animation.numSteps);
          chart.data.datasets[0].data[0] = current;
          chart.data.datasets[0].data[1] = 100 - current;
          chart.update('none');
        },
        onComplete: function() {
          chart.data.datasets[0].data[0] = value;
          chart.data.datasets[0].data[1] = 100 - value;
          chart.update();
        }
      }
    }
  });
  return chart;
}

function renderPieCharts(category) {
  const grid = document.getElementById('skills-viz-pie-grid');
  grid.innerHTML = '';
  const cat = skillsData[category];
  if (!cat) return;
  cat.labels.forEach((label, i) => {
    const card = document.createElement('div');
    card.className = 'skills-viz-pie-card';
    card.setAttribute('data-aos', 'zoom-in');
    card.innerHTML = `
      <div class="skills-viz-pie-header">
        <i class="${cat.icons[i]}"></i> ${label}
        <span class="skills-viz-pie-value">${cat.values[i]}%</span>
      </div>
      <canvas id="pieChart_${category}_${i}" width="120" height="120"></canvas>
    `;
    grid.appendChild(card);
    setTimeout(() => {
      createPieChart(
        card.querySelector('canvas').getContext('2d'),
        cat.values[i],
        cat.colors[i]
      );
    }, 10);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Filter interactivity
  const filterBtns = document.querySelectorAll('.skills-viz-filter');
  let currentCategory = 'Languages';
  let chartsRendered = false;

  function showCategory(cat) {
    currentCategory = cat;
    if (chartsRendered) renderPieCharts(cat);
    filterBtns.forEach(b => b.classList.remove('active'));
    filterBtns.forEach(b => {
      if (b.dataset.category === cat) b.classList.add('active');
    });
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      showCategory(btn.dataset.category);
    });
  });

  // IntersectionObserver to trigger animation only when in view
  const section = document.getElementById('skills-visualization');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chartsRendered) {
        chartsRendered = true;
        renderPieCharts(currentCategory);
      }
    });
  }, { threshold: 0.2 });
  if (section) observer.observe(section);
});
