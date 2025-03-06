// Chart.js global defaults for black and white theme
Chart.defaults.color = '#aaaaaa';
Chart.defaults.font.family = 'Roboto Mono';
Chart.defaults.font.size = 9;
Chart.defaults.elements.line.borderWidth = 1;
Chart.defaults.elements.point.radius = 2;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
Chart.defaults.plugins.tooltip.bodyColor = '#ffffff';
Chart.defaults.plugins.tooltip.borderColor = '#ffffff';
Chart.defaults.plugins.tooltip.borderWidth = 1;

// Theme colors
const themeColors = {
  white: '#ffffff',
  lightGray: '#aaaaaa',
  success: '#00ff66',
  warning: '#ff3333',
  grid: 'rgba(255, 255, 255, 0.1)',
  background: 'rgba(0, 0, 0, 0.3)',
  backgroundGradientStart: 'rgba(255, 255, 255, 0.1)',
  backgroundGradientEnd: 'rgba(255, 255, 255, 0)'
};

// Function to create chart gradient
function createChartGradient(ctx, startColor, endColor) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
}

// Initialize the dashboard
function initDashboard() {
  // Clear existing content
  document.querySelector('.left-box').innerHTML = '<h2>Systems Overview</h2>';
  document.querySelector('.right-box').innerHTML = '<h2>Performance Metrics</h2>';
  
  // Add panel headers
  enhanceLayout();
  
  // Create left side components
  createLeftPanel();
  
  // Create right side components
  createRightPanel();
}

// Create all left panel components
function createLeftPanel() {
  const leftBox = document.querySelector('.left-box');
  
  // Add main chart container
  const mainChartContainer = document.createElement('div');
  mainChartContainer.className = 'chart-container';
  mainChartContainer.innerHTML = '<canvas id="mainChart"></canvas>';
  leftBox.appendChild(mainChartContainer);
  
  // Create polar area chart - more modern visualization
  createPolarAreaChart();
  
  // Create row for small charts
  const chartsRow = document.createElement('div');
  chartsRow.className = 'charts-row';
  leftBox.appendChild(chartsRow);
  
  // Create small chart containers
  const smallChart1Container = document.createElement('div');
  smallChart1Container.className = 'small-chart-container';
  smallChart1Container.innerHTML = '<canvas id="smallChart1"></canvas>';
  chartsRow.appendChild(smallChart1Container);
  
  const smallChart2Container = document.createElement('div');
  smallChart2Container.className = 'small-chart-container';
  smallChart2Container.innerHTML = '<canvas id="smallChart2"></canvas>';
  chartsRow.appendChild(smallChart2Container);
  
  // Create bubble chart and gauge chart for small panels
  createBubbleChart();
  createGaugeChart();
  
  // Add system status table
  createSystemStatusTable(leftBox);
  
  // Add holographic line chart below the table (like in the right panel)
  const hologram = document.createElement('div');
  hologram.className = 'hologram';
  hologram.innerHTML = `
    <div class="chart-container">
      <canvas id="leftLineChart"></canvas>
    </div>
  `;
  leftBox.appendChild(hologram);
  
  // Create line chart in hologram
  createLeftLineChart();
  
  // Add key metrics
  const keyMetrics = document.createElement('div');
  keyMetrics.className = 'key-metric';
  keyMetrics.innerHTML = `
    <div class="value">98.7%</div>
    <div class="label">System Efficiency</div>
    <div class="progress-container">
      <div class="progress-bar" style="width: 98.7%"></div>
    </div>
  `;
  leftBox.appendChild(keyMetrics);
}

// Create all right panel components
function createRightPanel() {
  const rightBox = document.querySelector('.right-box');
  
  // Add data cards
  const dataCards = [
    { label: 'Core Temperature', value: '75.3°C' },
    { label: 'Power Output', value: '45.2 MW' },
    { label: 'Shield Integrity', value: '87%' }
  ];
  
  dataCards.forEach(card => {
    const dataCard = document.createElement('div');
    dataCard.className = 'data-card';
    dataCard.innerHTML = `${card.label} <span>${card.value}</span>`;
    rightBox.appendChild(dataCard);
  });
  
  // Add a holographic 3D stats visualization
  const hologram = document.createElement('div');
  hologram.className = 'hologram';
  hologram.innerHTML = `
    <div class="chart-container">
      <canvas id="lineChart"></canvas>
    </div>
  `;
  rightBox.appendChild(hologram);
  
  // Create line chart in hologram
  createLineChart();
  
  // Add stats table
  createStatsTable(rightBox);
  
  // Add additional data cards
  const additionalCards = [
    { label: 'Propulsion', value: '92.1%' },
    { label: 'Altitude', value: '12,453 ft' },
    { label: 'Heading', value: '276°' }
  ];
  
  additionalCards.forEach(card => {
    const dataCard = document.createElement('div');
    dataCard.className = 'data-card';
    dataCard.innerHTML = `${card.label} <span>${card.value}</span>`;
    rightBox.appendChild(dataCard);
  });
}

// Update createPolarAreaChart
function createPolarAreaChart() {
  const ctx = document.getElementById('mainChart').getContext('2d');
  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: ['Defense', 'Propulsion', 'Energy', 'Weapons', 'Navigation', 'Life Support'],
      datasets: [{
        data: [42, 85, 72, 56, 91, 84],
        backgroundColor: [
          'rgba(255, 255, 255, 0.6)',
          'rgba(0, 255, 102, 0.6)',
          'rgba(255, 51, 51, 0.6)',
          'rgba(255, 204, 0, 0.6)',
          'rgba(153, 153, 153, 0.6)',
          'rgba(255, 255, 255, 0.3)'
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
          'rgba(0, 255, 102, 1)',
          'rgba(255, 51, 51, 1)',
          'rgba(255, 204, 0, 1)',
          'rgba(153, 153, 153, 1)',
          'rgba(255, 255, 255, 0.8)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          angleLines: {
            color: themeColors.grid
          },
          grid: {
            color: themeColors.grid
          },
          ticks: {
            backdropColor: 'transparent',
            showLabelBackdrop: false,
            color: themeColors.lightGray
          }
        }
      },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 10,
            padding: 10,
            color: themeColors.white
          }
        },
        title: {
          display: true,
          text: 'SYSTEMS ANALYSIS',
          font: {
            family: 'Orbitron',
            size: 12
          },
          color: themeColors.white
        }
      }
    }
  });
}

// Update createBubbleChart
function createBubbleChart() {
  const ctx = document.getElementById('smallChart1').getContext('2d');
  new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Power Nodes',
        data: [
          { x: 1, y: 8, r: 8 },
          { x: 2, y: 4, r: 10 },
          { x: 3, y: 7, r: 6 },
          { x: 4, y: 3, r: 8 },
          { x: 5, y: 6, r: 5 }
        ],
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: themeColors.white,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: themeColors.grid
          },
          ticks: {
            display: false
          }
        },
        y: {
          grid: {
            color: themeColors.grid
          },
          ticks: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Update createGaugeChart
function createGaugeChart() {
  const ctx = document.getElementById('smallChart2').getContext('2d');
  
  // Value between 0-100
  const value = 67;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [value, 100-value],
        backgroundColor: [
          themeColors.success,
          'rgba(255, 255, 255, 0.1)'
        ],
        borderColor: [
          themeColors.white,
          'rgba(0, 0, 0, 0)'
        ],
        borderWidth: 1,
        circumference: 180,
        rotation: 270
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
      },
    },
    plugins: [{
      id: 'gaugeText',
      afterDraw: (chart) => {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;
        
        ctx.restore();
        ctx.font = '18px Orbitron';
        ctx.fillStyle = themeColors.success;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(`${value}%`, width / 2, height / 1.5);
        
        ctx.font = '9px Roboto Mono';
        ctx.fillStyle = themeColors.white;
        ctx.fillText('CAPACITY', width / 2, height / 1.15);
        ctx.save();
      }
    }]
  });
}

// Update createLineChart
function createLineChart() {
  const ctx = document.getElementById('lineChart').getContext('2d');
  
  // Create gradient
  const gradient = createChartGradient(ctx, 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)');
  
  // Generate some sample data
  const generateData = () => {
    const labels = [];
    const data = [];
    for (let i = 0; i < 24; i++) {
      labels.push(`${i}h`);
      data.push(Math.floor(Math.random() * 40) + 50);
    }
    return { labels, data };
  };
  
  const { labels, data } = generateData();
  
  const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'System Performance',
        data: data,
        borderColor: themeColors.white,
        tension: 0.4,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        backgroundColor: gradient
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: themeColors.grid
          },
          ticks: {
            color: themeColors.lightGray
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 6,
            color: themeColors.lightGray
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
  
  // Update line chart with random data
  setInterval(() => {
    const newData = lineChart.data.datasets[0].data;
    newData.shift();
    newData.push(Math.floor(Math.random() * 40) + 50);
    lineChart.update();
  }, 2000);
}

// Update createLeftLineChart
function createLeftLineChart() {
  const ctx = document.getElementById('leftLineChart').getContext('2d');
  
  // Create gradient
  const gradient = createChartGradient(ctx, 'rgba(0, 255, 102, 0.2)', 'rgba(0, 255, 102, 0)');
  
  // Generate some sample data
  const generateData = () => {
    const labels = [];
    const data = [];
    for (let i = 0; i < 24; i++) {
      labels.push(`${i}h`);
      data.push(Math.floor(Math.random() * 30) + 60);
    }
    return { labels, data };
  };
  
  const { labels, data } = generateData();
  
  const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Reactor Output',
        data: data,
        borderColor: themeColors.success,
        tension: 0.4,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        backgroundColor: gradient
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: themeColors.grid
          },
          ticks: {
            color: themeColors.lightGray
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 6,
            color: themeColors.lightGray
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'REACTOR EFFICIENCY',
          font: {
            family: 'Orbitron',
            size: 10
          },
          color: themeColors.white
        }
      }
    }
  });
  
  // Update line chart with random data
  setInterval(() => {
    const newData = lineChart.data.datasets[0].data;
    newData.shift();
    newData.push(Math.floor(Math.random() * 30) + 60);
    lineChart.update();
  }, 2500);
}

// Create system status table for left panel
function createSystemStatusTable(container) {
  const statsTable = document.createElement('div');
  statsTable.className = 'stats-table';
  statsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>SYSTEM</th>
          <th>STATUS</th>
          <th>LOAD</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Targeting</td>
          <td><span class="status active"></span></td>
          <td>42.7%</td>
        </tr>
        <tr>
          <td>Navigation</td>
          <td><span class="status active"></span></td>
          <td>68.2%</td>
        </tr>
        <tr>
          <td>Sensors</td>
          <td><span class="status warning"></span></td>
          <td>82.5%</td>
        </tr>
      </tbody>
    </table>
  `;
  container.appendChild(statsTable);
}

// Create stats table for right panel
function createStatsTable(container) {
  const statsTable = document.createElement('div');
  statsTable.className = 'stats-table';
  statsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>SYSTEM</th>
          <th>STATUS</th>
          <th>OUTPUT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Arc Reactor</td>
          <td><span class="status active"></span></td>
          <td>98.2%</td>
        </tr>
        <tr>
          <td>Flight Systems</td>
          <td><span class="status active"></span></td>
          <td>100%</td>
        </tr>
        <tr>
          <td>Weapons</td>
          <td><span class="status warning"></span></td>
          <td>78.5%</td>
        </tr>
        <tr>
          <td>Communications</td>
          <td><span class="status critical"></span></td>
          <td>52.1%</td>
        </tr>
      </tbody>
    </table>
  `;
  container.appendChild(statsTable);
}

// Enhance layout with panel headers
function enhanceLayout() {
  // Add panel header to left box
  const leftBox = document.querySelector('.left-box');
  const leftHeader = document.querySelector('.left-box h2');
  const panelHeaderLeft = document.createElement('div');
  panelHeaderLeft.className = 'panel-header';
  leftHeader.parentNode.insertBefore(panelHeaderLeft, leftHeader);
  panelHeaderLeft.appendChild(leftHeader);
  
  const statusIndicator = document.createElement('div');
  statusIndicator.className = 'status-indicator';
  statusIndicator.innerText = 'SYSTEMS ONLINE';
  panelHeaderLeft.appendChild(statusIndicator);
  
  // Add panel header to right box
  const rightBox = document.querySelector('.right-box');
  const rightHeader = document.querySelector('.right-box h2');
  const panelHeaderRight = document.createElement('div');
  panelHeaderRight.className = 'panel-header';
  rightHeader.parentNode.insertBefore(panelHeaderRight, rightHeader);
  panelHeaderRight.appendChild(rightHeader);
  
  const statusIndicator2 = document.createElement('div');
  statusIndicator2.className = 'status-indicator';
  statusIndicator2.innerText = 'REAL-TIME DATA';
  panelHeaderRight.appendChild(statusIndicator2);
}

// Initialize all components when DOM is loaded

// old update