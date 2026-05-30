/* ============================================================
   РОМАНТИЧЕСКИЙ САЙТ-ПРИГЛАШЕНИЕ
   script.js
   ============================================================ */

/* ──────────────────────────────────────────────
   🔧 НАСТРОЙКИ — ВСТАВЬ СВОИ ДАННЫЕ ЗДЕСЬ
   ────────────────────────────────────────────── */
const BOT_TOKEN = 'ВСТАВЬ_СЮДА_ТОКЕН_БОТА';   // например: 7891234567:AAFabc...
const CHAT_ID   = 'ВСТАВЬ_СЮДА_СВОЙ_CHAT_ID'; // например: 123456789
/* ──────────────────────────────────────────────── */


/* ── Генерация плавающих сердечек ── */
const HEARTS = ['❤️','💕','💗','💓','💖','💝','🌹','✨','💞','🌸'];

function createHeart() {
  const el = document.createElement('span');
  el.className = 'heart-particle';
  el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  el.style.left      = Math.random() * 100 + 'vw';
  el.style.fontSize  = (0.9 + Math.random() * 1.4) + 'rem';
  const dur = 7 + Math.random() * 8;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay    = (Math.random() * 5) + 's';
  document.getElementById('heartsContainer').appendChild(el);
  setTimeout(() => el.remove(), (dur + 6) * 1000);
}

// запускаем сердечки
(function initHearts() {
  for (let i = 0; i < 18; i++) setTimeout(createHeart, i * 350);
  setInterval(createHeart, 900);
})();


/* ── Переключение экранов ── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  // небольшая задержка для анимации
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('active'));
  });
}


/* ── Кнопка «Да» ── */
function handleYes() {
  // устанавливаем минимальную дату = сегодня
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inputDate').min = today;

  showScreen('screen-form');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ── Убегающая кнопка «Нет» ── */
const noHints = [
  'Кнопка против!',
  'Куда ты тянешься? 😅',
  'Нет — это не вариант 😈',
  'Попробуй поймай! 🏃',
  'Эта кнопка стесняется...',
  'Нееет, только не это 😂',
  'Ещё раз? Она снова убежит!',
  '«Нет» — не существует 💫',
];
let noHintIdx = 0;

function runAway(e) {
  e.preventDefault();

  const btn    = document.getElementById('btnNo');
  const hint   = document.getElementById('noHint');

  // переводим в fixed, если ещё не
  if (!btn.classList.contains('running')) {
    const rect = btn.getBoundingClientRect();
    btn.classList.add('running');
    btn.style.left = rect.left + 'px';
    btn.style.top  = rect.top  + 'px';
    btn.style.transform = 'none';
    btn.style.margin = '0';
  }

  // безопасная зона — отступ от краёв экрана
  const margin = 20;
  const bW = btn.offsetWidth  || 130;
  const bH = btn.offsetHeight || 48;
  const maxX = window.innerWidth  - bW - margin;
  const maxY = window.innerHeight - bH - margin;

  const newX = margin + Math.random() * maxX;
  const newY = margin + Math.random() * maxY;

  btn.style.left = newX + 'px';
  btn.style.top  = newY + 'px';

  // подсказка
  hint.textContent = noHints[noHintIdx % noHints.length];
  noHintIdx++;

  // лёгкий вибро-эффект на мобилке
  if (navigator.vibrate) navigator.vibrate(30);
}


/* ── Выбор чипсов еды (мульти) ── */
function toggleChip(el) {
  el.classList.toggle('selected');
}

/* ── Выбор чипсов времени (один) ── */
function toggleTimeChip(el) {
  const parent = document.getElementById('timeChips');
  parent.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  // сбрасываем поле ввода, если выбран чип
  document.getElementById('inputTime').value = '';
}


/* ── Сбор данных формы ── */
function collectFormData() {
  const name = document.getElementById('inputName').value.trim();
  const date = document.getElementById('inputDate').value;
  const timeInput = document.getElementById('inputTime').value;

  // еда: чипсы + свой вариант
  const selectedChips = [...document.querySelectorAll('#foodChips .chip.selected')]
    .map(c => c.textContent.trim());
  const customFood = document.getElementById('inputFoodCustom').value.trim();
  const foodParts  = [...selectedChips];
  if (customFood) foodParts.push(customFood);
  const food = foodParts.join(', ') || '';

  // время: чип или поле
  const timeChip = document.querySelector('#timeChips .chip.selected');
  const time = timeChip
    ? timeChip.textContent.trim()
    : (timeInput || '');

  return { name, food, date, time };
}


/* ── Валидация ── */
function validate(data) {
  if (!data.name)  return 'Пожалуйста, напиши своё имя 🌸';
  if (!data.food)  return 'Выбери или напиши любимую еду 🍽️';
  if (!data.date)  return 'Выбери дату свидания 📅';
  if (!data.time)  return 'Укажи удобное время ⏰';
  return null;
}


/* ── Отображение ошибки ── */
function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  setTimeout(() => { el.textContent = ''; }, 4000);
}


/* ── Оверлей «Отправляем...» ── */
function showSending() {
  const ov = document.createElement('div');
  ov.className = 'sending-overlay';
  ov.id = 'sendingOverlay';
  ov.innerHTML = `<div class="spinner"></div><span>Отправляем... 💌</span>`;
  document.body.appendChild(ov);
}

function hideSending() {
  const ov = document.getElementById('sendingOverlay');
  if (ov) ov.remove();
}


/* ── Отправка в Telegram ── */
async function sendToTelegram(data) {
  const dateFormatted = data.date
    ? new Date(data.date + 'T00:00:00').toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : data.date;

  const text =
`💌 *Новое приглашение на свидание!*

👤 Имя: ${data.name}
🍽️ Любимая еда: ${data.food}
📅 Дата: ${dateFormatted}
⏰ Время: ${data.time}

_Сообщение отправлено с сайта-приглашения_ ❤️`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:    CHAT_ID,
      text:       text,
      parse_mode: 'Markdown',
    }),
  });

  const json = await resp.json();
  if (!json.ok) throw new Error(json.description || 'Ошибка Telegram API');
  return json;
}


/* ── Отображение страницы успеха ── */
function showSuccess(data) {
  const dateFormatted = data.date
    ? new Date(data.date + 'T00:00:00').toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : data.date;

  const detail = document.getElementById('successDetail');
  detail.innerHTML = `
    <strong>Имя:</strong> ${escHtml(data.name)}<br/>
    <strong>Еда:</strong> ${escHtml(data.food)}<br/>
    <strong>Дата:</strong> ${escHtml(dateFormatted)}<br/>
    <strong>Время:</strong> ${escHtml(data.time)}
  `;
  detail.classList.add('visible');
  showScreen('screen-success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ── Экранирование HTML ── */
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


/* ── Отправка формы ── */
async function submitForm() {
  const data = collectFormData();
  const err  = validate(data);
  if (err) { showError(err); return; }

  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.disabled = true;
  showSending();

  try {
    await sendToTelegram(data);
    hideSending();
    showSuccess(data);
  } catch (e) {
    hideSending();
    submitBtn.disabled = false;
    showError('Не удалось отправить. Проверь BOT_TOKEN и CHAT_ID в script.js 🔧');
    console.error('Telegram error:', e);
  }
}
