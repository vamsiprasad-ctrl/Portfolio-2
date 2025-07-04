tsParticles.load('skills-particles-bg', {
  background: { color: 'transparent' },
  fpsLimit: 60,
  particles: {
    number: { value: 38, density: { enable: true, value_area: 800 } },
    color: { value: ['#7dd3fc', '#c084fc', '#fca5a5', '#facc15', '#4ade80', '#60a5fa', '#f472b6', '#a5b4fc'] },
    shape: { type: 'circle' },
    opacity: { value: 0.18, random: true },
    size: { value: 3.5, random: true },
    move: {
      enable: true,
      speed: 0.7,
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'out' }
    },
    links: {
      enable: true,
      distance: 120,
      color: '#7dd3fc',
      opacity: 0.10,
      width: 1
    }
  },
  detectRetina: true
});
