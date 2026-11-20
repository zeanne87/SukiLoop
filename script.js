const defaultSteps = [
  {
    id: 1,
    shop: "1. Aling Nena’s Carinderia",
    deal: "Silog Lunch QR Scanned — Fiesta Suki Pass Activated!",
    distance: "Origin Shop",
    status: "completed"
  },
  {
    id: 2,
    shop: "2. Kanto Kapehan & Palamig",
    deal: "₱15 OFF Iced Barako, Milk Tea, or Halo-Halo",
    distance: "30m next door",
    status: "active"
  },
  {
    id: 3,
    shop: "3. Moss & Matcha",
    deal: "₱25 OFF Matcha Tea Latte or Ceremonial Matcha Drink",
    distance: "55m away",
    status: "locked"
  },
  {
    id: 4,
    shop: "4. Lola Puring’s Ube Halaya",
    deal: "₱30 OFF Ube Halaya Jar or Pasalubong Set",
    distance: "120m down the street",
    status: "locked"
  },
  {
    id: 5,
    shop: "5. Mang Tonyo’s Barberya",
    deal: "₱25 OFF Haircut + Hot Towel (Unlocks after Step 4)",
    distance: "85m down the street",
    status: "locked"
  }
];

let steps = JSON.parse(JSON.stringify(defaultSteps));
let referrals = 142;
let activeStepId = null;
let secondsRemaining = 7182; // 01:59:42

function renderSteps() {
  const container = document.getElementById('step-list');
  container.innerHTML = '';

  let completedCount = 0;

  steps.forEach(step => {
    if (step.status === 'completed') completedCount++;

    const card = document.createElement('div');
    card.className = `step-card ${
      step.status === 'completed' ? 'completed-step' :
      step.status === 'active' ? 'active-step' : 'locked-step'
    }`;

    const badgeClass =
      step.status === 'completed' ? 'tag-done' :
      step.status === 'active' ? 'tag-active' : 'tag-locked';

    const badgeLabel =
      step.status === 'completed' ? '✓ Verified Suki' :
      step.status === 'active' ? '★ Active Suki Reward' : '🔒 Locked';

    let actionHtml = '';
    if (step.status === 'active') {
      actionHtml = `<button class="action-btn" onclick="openVerifyModal(${step.id}, '${step.shop}')">Redeem at Counter (Vendor PIN)</button>`;
    }

    card.innerHTML = `
      <div class="step-top">
        <span class="step-tag ${badgeClass}">${badgeLabel}</span>
        <span class="step-dist">${step.distance}</span>
      </div>
      <div class="shop-name">${step.shop}</div>
      <div class="shop-deal">${step.deal}</div>
      ${actionHtml}
    `;
    container.appendChild(card);
  });

  const pct = Math.round((completedCount / steps.length) * 100);
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('progress-label').textContent = `${completedCount} of ${steps.length} Shops Completed`;
  document.getElementById('stat-referrals').textContent = referrals;
}

function openVerifyModal(stepId, shopName) {
  activeStepId = stepId;
  document.getElementById('verify-shop-title').textContent = shopName;
  document.getElementById('vendor-pin').value = '1234';
  document.getElementById('verify-modal').classList.add('open');
}

function confirmRedemption() {
  const pin = document.getElementById('vendor-pin').value;
  if (pin !== '1234') {
    showToast('Invalid PIN. Use demo PIN: 1234.');
    return;
  }

  const currentIndex = steps.findIndex(s => s.id === activeStepId);
  if (currentIndex !== -1) {
    steps[currentIndex].status = 'completed';
    referrals++;

    if (steps[currentIndex + 1]) {
      steps[currentIndex + 1].status = 'active';
      showToast('Redeemed! Next neighborhood shop reward unlocked.');
    } else {
      showToast('Full Poblacion Loop Completed!');
    }
  }

  closeModal('verify-modal');
  renderSteps();
}

function openQrModal() {
  document.getElementById('qr-modal').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function switchTab(tabName, btn) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

function resetDemo() {
  steps = JSON.parse(JSON.stringify(defaultSteps));
  referrals = 142;
  secondsRemaining = 7182;
  renderSteps();
  showToast('SukiLoop demo state reset.');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// Live Geo-Time Countdown
setInterval(() => {
  if (secondsRemaining > 0) secondsRemaining--;
  const hrs = String(Math.floor(secondsRemaining / 3600)).padStart(2, '0');
  const mins = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, '0');
  const secs = String(secondsRemaining % 60).padStart(2, '0');
  document.getElementById('countdown').textContent = `${hrs}:${mins}:${secs}`;
}, 1000);

// Initialize UI
renderSteps();