const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const installBtn = document.getElementById('installBtn');
let deferredPrompt;

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('etsy-toolkit-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
};

const savedTheme = localStorage.getItem('etsy-toolkit-theme') || 'light';
setTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(currentTheme);
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});

installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    installBtn.textContent = 'Installed';
  }
  deferredPrompt = null;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      console.info('Service worker registration skipped in this environment.');
    });
  });
}

const currency = (value) => `$${value.toFixed(2)}`;
const parseValue = (value, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const feeForm = document.getElementById('feeForm');
const feeResult = document.getElementById('feeResult');
const heroFee = document.getElementById('heroFee');

feeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(feeForm);
  const listingPrice = parseValue(data.get('price'));
  const shipping = parseValue(data.get('shipping'));
  const quantity = Math.max(parseInt(data.get('quantity'), 10) || 1, 1);
  const transactionFeePercent = parseValue(data.get('transactionFee')) / 100;
  const processingFeePercent = parseValue(data.get('processingFee')) / 100;
  const processingFixed = parseValue(data.get('processingFixed'));

  const subtotal = listingPrice + shipping;
  const transactionFee = subtotal * transactionFeePercent;
  const processingFee = subtotal * processingFeePercent + processingFixed;
  const listingFee = 0.2 * quantity;
  const totalFees = transactionFee + processingFee + listingFee;
  const netReceived = subtotal - totalFees;

  const markup = `
    <strong>Estimated fees:</strong> ${currency(totalFees)}<br />
    <strong>Net received:</strong> ${currency(netReceived)}<br />
    Breakdown: transaction ${currency(transactionFee)}, processing ${currency(processingFee)}, listing ${currency(listingFee)}.
  `;
  feeResult.innerHTML = markup;
  heroFee.textContent = currency(totalFees);
});

const profitForm = document.getElementById('profitForm');
const profitResult = document.getElementById('profitResult');

profitForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(profitForm);
  const itemCost = parseValue(data.get('cost'));
  const listingPrice = parseValue(data.get('price'));
  const shipping = parseValue(data.get('shipping'));
  const transactionFeePercent = parseValue(data.get('transactionFee')) / 100;
  const processingFeePercent = parseValue(data.get('processingFee')) / 100;
  const processingFixed = parseValue(data.get('processingFixed'));

  const salesValue = listingPrice + shipping;
  const fees = salesValue * transactionFeePercent + salesValue * processingFeePercent + processingFixed;
  const grossProfit = salesValue - itemCost - fees;
  const margin = salesValue > 0 ? (grossProfit / salesValue) * 100 : 0;
  const roi = itemCost > 0 ? (grossProfit / itemCost) * 100 : 0;

  profitResult.innerHTML = `
    <strong>Estimated profit:</strong> ${currency(grossProfit)}<br />
    <strong>Margin:</strong> ${margin.toFixed(1)}%<br />
    <strong>ROI:</strong> ${roi.toFixed(1)}%
  `;
});

const titleForm = document.getElementById('titleForm');
const titleResult = document.getElementById('titleResult');

titleForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(titleForm);
  const keywords = (data.get('keywords') || '')
    .split(',')
    .map((word) => word.trim())
    .filter(Boolean);
  const category = data.get('category') || 'Home Decor';

  const seed = keywords.length ? keywords : ['handmade', 'gift', 'decor'];
  const [first, second, third] = seed;
  const suggestions = [
    `${capitalize(first)} ${capitalize(second)} ${capitalize(third)} | ${category}`,
    `${capitalize(first)} ${capitalize(second)} for ${third} | ${category}`,
    `${capitalize(second)} ${capitalize(first)} Gift Set | ${category}`
  ];

  titleResult.innerHTML = `
    <strong>Suggested titles</strong>
    <div class="chip-list">
      ${suggestions.map((text) => `<span class="chip">${text}</span>`).join('')}
    </div>
  `;
});

const tagForm = document.getElementById('tagForm');
const tagResult = document.getElementById('tagResult');

tagForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(tagForm);
  const keywords = (data.get('keywords') || '')
    .split(',')
    .map((word) => word.trim())
    .filter(Boolean);
  const category = (data.get('category') || 'home decor').trim().toLowerCase();

  const tags = new Set();
  const addTag = (word) => {
    const clean = normalizeTag(word);
    if (clean) tags.add(clean);
  };

  keywords.forEach((word) => {
    addTag(word);
    addTag(`${word} gift`);
    addTag(`${word} handmade`);
    addTag(word.replace(/\s+/g, ''));
  });

  if (category) {
    addTag(category);
    addTag(`${category} gift`);
  }

  const finalTags = Array.from(tags).slice(0, 13);
  tagResult.innerHTML = `
    <strong>Suggested tags</strong>
    <div class="chip-list">
      ${finalTags.map((tag) => `<span class="chip">${tag}</span>`).join('')}
    </div>
  `;
});

function capitalize(value) {
  return String(value).trim().charAt(0).toUpperCase() + String(value).trim().slice(1);
}

function normalizeTag(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '');
}

feeForm?.dispatchEvent(new Event('submit'));
