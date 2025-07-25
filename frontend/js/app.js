// Sidebar hamburger open/close logic
document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('sidebarHamburger');
  let isCollapsed = false;

  // Collapse sidebar by default on small screens
  function autoCollapseSidebar() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add('collapsed');
      isCollapsed = true;
    } else {
      sidebar.classList.remove('collapsed');
      isCollapsed = false;
    }
    updateHamburgerVisibility();
  }
  function updateHamburgerVisibility() {
    if (sidebar.classList.contains('collapsed')) {
      hamburger.style.display = 'flex';
    } else {
      hamburger.style.display = 'none';
    }
  }
  autoCollapseSidebar();
  window.addEventListener('resize', autoCollapseSidebar);

  // Expand sidebar on mouse enter, collapse on mouse leave
  sidebar.addEventListener('mouseenter', function () {
    sidebar.classList.remove('collapsed');
    updateHamburgerVisibility();
  });
  sidebar.addEventListener('mouseleave', function () {
    if (window.innerWidth > 768) {
      sidebar.classList.add('collapsed');
      updateHamburgerVisibility();
    }
  });

  // Hamburger click to open sidebar
  hamburger.addEventListener('click', function (e) {
    sidebar.classList.remove('collapsed');
    updateHamburgerVisibility();
  });

  // Start collapsed on desktop for modern look
  if (window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
    isCollapsed = true;
    updateHamburgerVisibility();
  }
});
// Sidebar auto-collapse and expand on mouse hover
document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  let isCollapsed = false;

  // Collapse sidebar by default on small screens
  function autoCollapseSidebar() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add('collapsed');
      isCollapsed = true;
    } else {
      sidebar.classList.remove('collapsed');
      isCollapsed = false;
    }
  }
  autoCollapseSidebar();
  window.addEventListener('resize', autoCollapseSidebar);

  // Expand sidebar on mouse enter, collapse on mouse leave
  sidebar.addEventListener('mouseenter', function () {
    sidebar.classList.remove('collapsed');
  });
  sidebar.addEventListener('mouseleave', function () {
    if (window.innerWidth > 768) {
      sidebar.classList.add('collapsed');
    }
  });

  // Start collapsed on desktop for modern look
  if (window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
    isCollapsed = true;
  }
});
// Sidebar collapse/expand logic
document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('sidebar-collapsed');
    });
  }
  // Optional: Collapse sidebar by default on small screens
  if (window.innerWidth < 768) {
    sidebar.classList.add('sidebar-collapsed');
  }
});
// JS for Trading Journal app

const trades = [];
const tradesPerPage = 7;
let showAll = false;

function getMonday(d) {
  d = new Date(d);
  const day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function isThisWeek(date) {
  const now = new Date();
  const monday = getMonday(now);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const d = new Date(date);
  return d >= monday && d <= sunday;
}

function isThisMonth(date) {
  const now = new Date();
  const d = new Date(date);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

// Add Bootstrap Icons CDN if not present
if (!document.querySelector('link[href*="bootstrap-icons"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css';
  document.head.appendChild(link);
}

function renderWeekBar() {
  const weekBar = document.getElementById('weekBar');
  weekBar.innerHTML = '';
  const days = [
    { short: 'M', full: 'Mon' },
    { short: 'T', full: 'Tue' },
    { short: 'W', full: 'Wed' },
    { short: 'T', full: 'Thu' },
    { short: 'F', full: 'Fri' },
    { short: 'S', full: 'Sat' },
    { short: 'S', full: 'Sun' }
  ];
  const now = new Date();
  const monday = getMonday(now);
  const dayDivs = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    // Get all trades for this day
    const dayTrades = trades.filter(t => t.date === dateStr);
    const rrSum = sumRR(dayTrades);
    let circleClass = 'bg-light text-dark';
    let tooltip = 'No trades';
    let emoji = '';
    if (dayTrades.length > 0) {
      if (rrSum > 0) {
        circleClass = 'bg-success text-white';
        emoji = '😊';
      } else if (rrSum < 0) {
        circleClass = 'bg-danger text-white';
        emoji = '😞';
      } else {
        circleClass = 'bg-secondary text-white';
        emoji = '';
      }
      // Tooltip: show sum and breakdown
      const breakdown = dayTrades.map(t => `${t.instrument} (${t.result === 'profit' ? '+' : '-'}${t.rr})`).join(', ');
      tooltip = `RR Sum: ${rrSum.toFixed(2)}${breakdown ? '\n' + breakdown : ''}`;
    }
    const dayDiv = document.createElement('div');
    dayDiv.className = 'text-center flex-fill';
    dayDiv.innerHTML = `
      <div class="rounded-circle ${circleClass} p-2" data-bs-toggle="tooltip" data-bs-placement="top" title="${tooltip}">${emoji}${days[i].short}</div>
      <small>${days[i].full}</small>
    `;
    dayDivs.push(dayDiv);
  }
  const bar = document.createElement('div');
  bar.className = 'd-flex gap-2 w-100';
  dayDivs.forEach(div => bar.appendChild(div));
  weekBar.appendChild(bar);
  // Enable Bootstrap tooltips
  const tooltipTriggerList = [].slice.call(weekBar.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Call renderWeekBar in renderTrades and on page load
function renderTrades() {
  const tbody = document.querySelector('#tradesTable tbody');
  tbody.innerHTML = '';
  // Always filter to current month
  let monthTrades = trades.filter(t => isThisMonth(t.date));
  let filtered = showAll ? monthTrades : monthTrades.slice(-tradesPerPage);
  for (const trade of filtered) {
    const rrDisplay = (trade.result === 'loss' ? '-' : '+') + trade.rr.replace(/^[-+]?/, '');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${trade.date}</td>
      <td>${trade.instrument}</td>
      <td>${trade.strategy}</td>
      <td>${rrDisplay}</td>
      <td><span class="fw-bold ${trade.result === 'profit' ? 'text-success' : 'text-danger'}">${trade.result === 'profit' ? '+ Profit' : '- Loss'}</span></td>
    `;
    tbody.appendChild(tr);
  }
  document.getElementById('seeMoreBtn').style.display = monthTrades.length > tradesPerPage ? '' : 'none';
  document.getElementById('seeMoreBtn').textContent = showAll ? 'Show Less' : 'See More';
  updateDateNavColors();
  renderWeekBar();
}

document.addEventListener('DOMContentLoaded', renderWeekBar);

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar hover/collapse logic
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.addEventListener('mouseenter', () => sidebar.classList.add('sidebar-open'));
    sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('sidebar-open'));
    sidebar.addEventListener('focusin', () => sidebar.classList.add('sidebar-open'));
    sidebar.addEventListener('focusout', () => sidebar.classList.remove('sidebar-open'));
  }

  // Theme switching logic
  const themeBtns = document.querySelectorAll('.theme-btn');
  const body = document.body;
  function setTheme(theme) {
    body.classList.remove('theme-default', 'theme-ocean', 'theme-forest', 'theme-sunset', 'theme-midnight');
    if (theme && theme !== 'default') {
      body.classList.add('theme-' + theme);
    } else {
      body.classList.add('theme-default');
    }
    localStorage.setItem('theme', theme);
  }
  themeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      setTheme(this.getAttribute('data-theme'));
    });
  });
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'default';
  setTheme(savedTheme);

  // Report generation logic
  const reportBtn = document.querySelector('#report button:not([disabled])');
  if (reportBtn) {
    reportBtn.disabled = false;
    reportBtn.textContent = 'Generate Report';
    reportBtn.addEventListener('click', async function() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      let y = 40;
      doc.setFontSize(22);
      doc.text('Trading Journal Report', 40, y);
      y += 30;
      doc.setFontSize(12);
      doc.text('Date: ' + new Date().toLocaleString(), 40, y);
      y += 30;
      // Add trades table
      doc.setFontSize(16);
      doc.text('All Trades', 40, y);
      y += 18;
      const tableHeaders = ['Date', 'Instrument', 'Strategy', 'RR', 'Result'];
      const tableRows = trades.map(t => [t.date, t.instrument, t.strategy, t.rr, t.result]);
      doc.autoTable({
        head: [tableHeaders],
        body: tableRows,
        startY: y,
        margin: { left: 40, right: 40 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 140, 255] },
      });
      y = doc.lastAutoTable.finalY + 30;
      // Add analysis summary
      doc.setFontSize(16);
      doc.text('Analysis Summary', 40, y);
      y += 18;
      const totalTrades = trades.length;
      const totalProfit = trades.filter(t => t.result === 'profit').length;
      const totalLoss = trades.filter(t => t.result === 'loss').length;
      const totalRR = sumRR(trades);
      doc.setFontSize(12);
      doc.text(`Total Trades: ${totalTrades}`, 40, y); y += 16;
      doc.text(`Profitable Trades: ${totalProfit}`, 40, y); y += 16;
      doc.text(`Losing Trades: ${totalLoss}`, 40, y); y += 16;
      doc.text(`Total RR: ${totalRR.toFixed(2)}`, 40, y); y += 24;
      // Add charts as images
      async function addChartToPDF(chartId, title) {
        const chartElem = document.getElementById(chartId);
        if (!chartElem) return;
        doc.setFontSize(14);
        doc.text(title, 40, y);
        y += 10;
        const canvas = chartElem;
        const imgData = canvas.toDataURL('image/png', 1.0);
        doc.addImage(imgData, 'PNG', 40, y, 500, 180);
        y += 190;
      }
      await addChartToPDF('dailyRRChart', 'Daily RR');
      await addChartToPDF('weeklyRRChart', 'Weekly RR');
      await addChartToPDF('monthlyRRChart', 'Monthly RR');
      // Save the PDF
      doc.save('Trading_Journal_Report.pdf');
    });
  }
});

document.getElementById('addTradeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const instrument = document.getElementById('instrument').value;
  const strategy = document.getElementById('strategy').value;
  const rr = document.getElementById('rr').value;
  const date = document.getElementById('tradeDate').value;
  const result = document.querySelector('input[name="result"]:checked').value;
  if (!date) {
    alert('Please select a date.');
    return;
  }
  trades.push({ instrument, strategy, rr, date, result });
  renderTrades();
  // Only reset profit/loss radio, keep other fields as is
  document.getElementById('profit').checked = true;
});

document.getElementById('seeMoreBtn').addEventListener('click', function() {
  showAll = !showAll;
  this.textContent = showAll ? 'Show Less' : 'See More';
  renderTrades();
});

// Date navigation with color feedback
function updateDateNavColors() {
  const prevBtn = document.getElementById('prevDate');
  const nextBtn = document.getElementById('nextDate');
  const dateVal = document.getElementById('tradeDate').value;
  const trade = trades.find(t => t.date === dateVal);
  prevBtn.classList.remove('btn-success', 'btn-danger', 'btn-outline-secondary');
  nextBtn.classList.remove('btn-success', 'btn-danger', 'btn-outline-secondary');
  let colorClass = 'btn-outline-secondary';
  if (trade) {
    colorClass = trade.result === 'profit' ? 'btn-success' : 'btn-danger';
  }
  prevBtn.classList.add(colorClass);
  nextBtn.classList.add(colorClass);
}

const dateInput = document.getElementById('tradeDate');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

document.getElementById('tradeDate').addEventListener('change', updateDateNavColors);
document.getElementById('prevDate').addEventListener('click', function() {
  const d = new Date(dateInput.value);
  d.setDate(d.getDate() - 1);
  dateInput.value = d.toISOString().split('T')[0];
  updateDateNavColors();
});
document.getElementById('nextDate').addEventListener('click', function() {
  const d = new Date(dateInput.value);
  d.setDate(d.getDate() + 1);
  dateInput.value = d.toISOString().split('T')[0];
  updateDateNavColors();
});

// Handle '+ Add New' for RR
const rrSelect = document.getElementById('rr');
rrSelect.addEventListener('change', function() {
  if (this.value === 'add') {
    const newRR = prompt('Enter new RR value (e.g., 4RR):');
    if (newRR && !Array.from(this.options).some(opt => opt.value === newRR)) {
      const option = document.createElement('option');
      option.value = newRR;
      option.textContent = newRR;
      this.insertBefore(option, this.querySelector('option[value="add"]'));
      this.value = newRR;
    } else {
      this.value = this.querySelector('option:not([value="add"])').value;
    }
  }
});

// Handle '+ Add New' for Instrument
const instrumentSelect = document.getElementById('instrument');
instrumentSelect.addEventListener('change', function() {
  if (this.value === 'add') {
    const newInstrument = prompt('Enter new instrument (e.g., EURUSD):');
    if (newInstrument && !Array.from(this.options).some(opt => opt.value === newInstrument)) {
      const option = document.createElement('option');
      option.value = newInstrument;
      option.textContent = newInstrument;
      this.insertBefore(option, this.querySelector('option[value="add"]'));
      this.value = newInstrument;
    } else {
      this.value = this.querySelector('option:not([value="add"])').value;
    }
  }
});

// Handle '+ Add New' for Strategy
const strategySelect = document.getElementById('strategy');
strategySelect.addEventListener('change', function() {
  if (this.value === 'add') {
    const newStrategy = prompt('Enter new strategy (e.g., Momentum):');
    if (newStrategy && !Array.from(this.options).some(opt => opt.value === newStrategy)) {
      const option = document.createElement('option');
      option.value = newStrategy;
      option.textContent = newStrategy;
      this.insertBefore(option, this.querySelector('option[value="add"]'));
      this.value = newStrategy;
    } else {
      this.value = this.querySelector('option:not([value="add"])').value;
    }
  }
});

renderTrades();

// Move theme switcher logic to settings tab
const themeSwitcher = document.getElementById('themeSwitcher');
if (themeSwitcher) {
  themeSwitcher.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
  });
}

// --- Analysis Tab Logic ---

function getFilteredTradesForAnalysis() {
  const strategy = document.getElementById('analysisStrategy')?.value || 'all';
  if (strategy === 'all') return trades;
  return trades.filter(t => t.strategy === strategy);
}

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 4 - (d.getDay()||7));
  const yearStart = new Date(d.getFullYear(),0,1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return weekNo;
}

function groupByWeek(tradesArr) {
  const weeks = {};
  tradesArr.forEach(t => {
    const d = new Date(t.date);
    const year = d.getFullYear();
    const week = getWeekNumber(t.date);
    const key = `${year}-W${week}`;
    if (!weeks[key]) weeks[key] = [];
    weeks[key].push(t);
  });
  return weeks;
}

function groupByMonth(tradesArr) {
  const months = {};
  tradesArr.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!months[key]) months[key] = [];
    months[key].push(t);
  });
  return months;
}

function groupByDay(tradesArr) {
  const days = {};
  tradesArr.forEach(t => {
    const key = t.date; // date is already 'YYYY-MM-DD'
    if (!days[key]) days[key] = [];
    days[key].push(t);
  });
  return days;
}

function renderDailyRR() {
  const tradesArr = getFilteredTradesForAnalysis();
  const days = groupByDay(tradesArr);

  const labels = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(d.toISOString().split('T')[0]);
  }

  const data = labels.map(date => {
    return days[date] ? sumRR(days[date]) : 0;
  });

  if (window.dailyRRChartObj) window.dailyRRChartObj.destroy();
  const ctx = document.getElementById('dailyRRChart').getContext('2d');
  window.dailyRRChartObj = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.map(d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Daily RR',
        data,
        fill: true,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function sumRR(tradesArr) {
  return tradesArr.reduce((sum, t) => {
    let rr = parseFloat(t.rr.replace('RR', ''));
    if (isNaN(rr)) rr = 0;
    return sum + (t.result === 'loss' ? -rr : rr);
  }, 0);
}

function renderWeeklyRR() {
  const tradesArr = getFilteredTradesForAnalysis();
  const weeks = groupByWeek(tradesArr);
  const labels = Object.keys(weeks).sort();
  const data = labels.map(w => sumRR(weeks[w]));
  // Table
  let tableHtml = '<table class="table table-sm"><thead><tr><th>Week</th><th>Total RR</th></tr></thead><tbody>';
  labels.forEach((w, i) => {
    tableHtml += `<tr><td>${w}</td><td>${data[i].toFixed(2)}</td></tr>`;
  });
  tableHtml += '</tbody></table>';
  document.getElementById('weeklyRRTable').innerHTML = tableHtml;
  // Chart
  if (window.weeklyRRChartObj) window.weeklyRRChartObj.destroy();
  const ctx = document.getElementById('weeklyRRChart').getContext('2d');
  window.weeklyRRChartObj = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Weekly RR', data, backgroundColor: '#0d6efd' }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

function renderMonthlyRR() {
  const tradesArr = getFilteredTradesForAnalysis();
  const months = groupByMonth(tradesArr);
  const labels = Object.keys(months).sort();
  const data = labels.map(m => sumRR(months[m]));
  // Table
  let tableHtml = '<table class="table table-sm"><thead><tr><th>Month</th><th>Total RR</th></tr></thead><tbody>';
  labels.forEach((m, i) => {
    tableHtml += `<tr><td>${m}</td><td>${data[i].toFixed(2)}</td></tr>`;
  });
  tableHtml += '</tbody></table>';
  document.getElementById('monthlyRRTable').innerHTML = tableHtml;
  // Chart
  if (window.monthlyRRChartObj) window.monthlyRRChartObj.destroy();
  const ctx = document.getElementById('monthlyRRChart').getContext('2d');
  window.monthlyRRChartObj = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Monthly RR', data, borderColor: '#0d6efd', backgroundColor: 'rgba(13,110,253,0.1)', fill: true }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

function renderMaxStreak() {
  const tradesArr = getFilteredTradesForAnalysis().sort((a,b) => new Date(a.date)-new Date(b.date));
  let maxProfit = 0, maxLoss = 0, curProfit = 0, curLoss = 0;
  tradesArr.forEach(t => {
    if (t.result === 'profit') {
      curProfit++;
      curLoss = 0;
    } else {
      curLoss++;
      curProfit = 0;
    }
    if (curProfit > maxProfit) maxProfit = curProfit;
    if (curLoss > maxLoss) maxLoss = curLoss;
  });
  document.getElementById('maxStreak').innerHTML = `<b>Max Profit Streak:</b> ${maxProfit} <br><b>Max Loss Streak:</b> ${maxLoss}`;
}

function renderAnalysis() {
  renderDailyRR();
  renderWeeklyRR();
  renderMonthlyRR();
  renderMaxStreak();
}

const analysisStrategy = document.getElementById('analysisStrategy');
if (analysisStrategy) {
  analysisStrategy.addEventListener('change', renderAnalysis);
}

// Re-render analysis when trades change
const oldRenderTrades = renderTrades;
renderTrades = function() {
  oldRenderTrades.apply(this, arguments);
  renderAnalysis();
};

document.addEventListener('DOMContentLoaded', renderAnalysis); 