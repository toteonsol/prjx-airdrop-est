const START_DATE = new Date('2025-07-14');
const TOTAL_SUPPLY = 1000000000;
const DAILY_POINTS = 1000000;

let state = {
  userPoints: 0,
  daysFromNow: 180,
  airdropPercent: 10,
  fdv: 100000000,
  customAirdrop: false,
  customFdv: false
};

function formatNumber(num) {
  if (isNaN(num) || !isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US').format(Math.floor(num));
}

function formatDecimal(num, decimals = 2) {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

function formatPercent(num) {
  if (isNaN(num) || !isFinite(num)) return '0.000000';
  return (num * 100).toFixed(6);
}

function formatFdv(value) {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
  return `$${formatNumber(value)}`;
}

function calculateResults() {
  const today = new Date('2025-11-25');
  const tgeDate = new Date(today);
  tgeDate.setDate(tgeDate.getDate() + state.daysFromNow);

  if (tgeDate < START_DATE) {
    document.getElementById('error').textContent = 'TGE date must be after July 14, 2025';
    document.getElementById('error').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    return null;
  }

  document.getElementById('error').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'block';

  const totalDays = Math.floor((tgeDate - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
  const totalPoints = totalDays * DAILY_POINTS;
  const userShare = state.userPoints > 0 ? state.userPoints / totalPoints : 0;
  const airdropTokens = (state.airdropPercent / 100) * TOTAL_SUPPLY;
  const userTokens = userShare * airdropTokens;
  const tokenPrice = state.fdv / TOTAL_SUPPLY;
  const estimatedValue = userTokens * tokenPrice;

  return {
    tgeDate,
    totalDays,
    totalPoints,
    userShare,
    airdropTokens,
    userTokens,
    tokenPrice,
    estimatedValue
  };
}

function updateTgeDate() {
  const today = new Date('2025-11-25');
  const tgeDate = new Date(today);
  tgeDate.setDate(tgeDate.getDate() + state.daysFromNow);
  
  document.getElementById('tgeDate').textContent = tgeDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  document.getElementById('daysLabel').textContent = state.daysFromNow;
}

function renderResults() {
  const results = calculateResults();
  if (!results) return;

  const resultsGrid = document.getElementById('resultsGrid');
  resultsGrid.innerHTML = `
    <div class="result-card highlight">
      <div class="result-icon">💵</div>
      <div class="result-label">Estimated Value</div>
      <div class="result-value big">$${formatDecimal(results.estimatedValue, 2)}</div>
    </div>

    <div class="result-card highlight">
      <div class="result-icon">🪙</div>
      <div class="result-label">Your Tokens</div>
      <div class="result-value big">${formatNumber(results.userTokens)}</div>
    </div>

    <div class="result-card">
      <div class="result-label">Token Price</div>
      <div class="result-value">$${formatDecimal(results.tokenPrice, 6)}</div>
    </div>

    <div class="result-card">
      <div class="result-label">Your Share</div>
      <div class="result-value">${formatPercent(results.userShare)}%</div>
    </div>

    <div class="result-card">
      <div class="result-label">Total Days</div>
      <div class="result-value">${formatNumber(results.totalDays)}</div>
    </div>

    <div class="result-card">
      <div class="result-label">Total Points at TGE</div>
      <div class="result-value">${formatNumber(results.totalPoints)}</div>
    </div>

    <div class="result-card">
      <div class="result-label">Total Airdrop Tokens</div>
      <div class="result-value">${formatNumber(results.airdropTokens)}</div>
    </div>

    <div class="result-card">
      <div class="result-label">TGE Date</div>
      <div class="result-value" style="font-size: 1.2rem;">
        ${results.tgeDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
    </div>
  `;

  renderScenarios();
}

function renderScenarios() {
  const scenarios = [
    { airdrop: 5, fdv: 50000000 },
    { airdrop: 5, fdv: 100000000 },
    { airdrop: 10, fdv: 100000000 },
    { airdrop: 10, fdv: 500000000 },
    { airdrop: 15, fdv: 500000000 },
    { airdrop: 15, fdv: 1000000000 },
    { airdrop: 20, fdv: 1000000000 },
    { airdrop: 20, fdv: 2000000000 }
  ];

  const today = new Date('2025-11-25');
  const tgeDate = new Date(today);
  tgeDate.setDate(tgeDate.getDate() + state.daysFromNow);
  
  const totalDays = Math.floor((tgeDate - START_DATE) / (1000 * 60 * 60 * 24)) + 1;
  const totalPoints = totalDays * DAILY_POINTS;
  const userShare = state.userPoints > 0 ? state.userPoints / totalPoints : 0;

  const tableBody = document.getElementById('scenarioTable');
  tableBody.innerHTML = scenarios.map(scenario => {
    const airdropTokens = (scenario.airdrop / 100) * TOTAL_SUPPLY;
    const userTokens = userShare * airdropTokens;
    const tokenPrice = scenario.fdv / TOTAL_SUPPLY;
    const estimatedValue = userTokens * tokenPrice;

    return `
      <tr>
        <td class="highlight-cell">${scenario.airdrop}%</td>
        <td class="highlight-cell">${formatFdv(scenario.fdv)}</td>
        <td>${formatNumber(userTokens)}</td>
        <td>$${formatDecimal(tokenPrice, 6)}</td>
        <td class="value-cell">$${formatDecimal(estimatedValue, 2)}</td>
      </tr>
    `;
  }).join('');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Referral code copied to clipboard! 🎉');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('Referral code copied to clipboard! 🎉');
  } catch (err) {
    showToast('Failed to copy. Please copy manually: web3wikis');
  }
  document.body.removeChild(textArea);
}

// Event Listeners
document.getElementById('userPoints').addEventListener('input', (e) => {
  state.userPoints = Math.max(0, Number(e.target.value) || 0);
  renderResults();
});

document.getElementById('daysSlider').addEventListener('input', (e) => {
  state.daysFromNow = Number(e.target.value);
  updateTgeDate();
  renderResults();
});

// Airdrop preset buttons
document.getElementById('airdropButtons').addEventListener('click', (e) => {
  if (e.target.classList.contains('preset-btn')) {
    const buttons = document.querySelectorAll('#airdropButtons .preset-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    if (e.target.id === 'customAirdropBtn') {
      state.customAirdrop = true;
      document.getElementById('customAirdropSlider').style.display = 'block';
    } else {
      state.customAirdrop = false;
      document.getElementById('customAirdropSlider').style.display = 'none';
      state.airdropPercent = Number(e.target.dataset.value);
      renderResults();  // ENSURE THIS LINE EXISTS
    }
  }
});

document.getElementById('airdropSlider').addEventListener('input', (e) => {
  state.airdropPercent = Number(e.target.value);
  document.getElementById('airdropLabel').textContent = state.airdropPercent;
  renderResults();
});

// FDV preset buttons
document.getElementById('fdvButtons').addEventListener('click', (e) => {
  if (e.target.classList.contains('preset-btn')) {
    const buttons = document.querySelectorAll('#fdvButtons .preset-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    if (e.target.id === 'customFdvBtn') {
      state.customFdv = true;
      document.getElementById('customFdvSlider').style.display = 'block';
    } else {
      state.customFdv = false;
      document.getElementById('customFdvSlider').style.display = 'none';
      state.fdv = Number(e.target.dataset.value);
      renderResults();  // ADD THIS LINE - it was missing!
    }
  }
});

document.getElementById('fdvSlider').addEventListener('input', (e) => {
  state.fdv = Number(e.target.value);
  document.getElementById('fdvLabel').textContent = formatFdv(state.fdv);
  renderResults();
});

// Referral code copy
document.getElementById('refCode').addEventListener('click', () => {
  copyToClipboard('web3wikis');
});

// Modal controls
const modal = document.getElementById('followModal');
const closeModalBtn = document.getElementById('closeModal');

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  localStorage.setItem('modalShown', 'true');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    localStorage.setItem('modalShown', 'true');
  }
});

// Show modal after 3 seconds if not shown before
window.addEventListener('load', () => {
  const modalShown = localStorage.getItem('modalShown');
  if (!modalShown) {
    setTimeout(() => {
      modal.classList.remove('hidden');
    }, 3000);
  }
});

// Initial render
updateTgeDate();
renderResults();
