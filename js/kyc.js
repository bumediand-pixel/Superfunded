'use strict';

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  currentStep: 1,
  docType: null,
  uploads: { front: null, back: null, selfie: null },
  personal: {},
};

// ── Helpers ───────────────────────────────────────────────────────────────
function showStep(n) {
  document.querySelectorAll('.kyc-step').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(n === 'success' ? 'step-success' : `step-${n}`);
  if (target) target.classList.remove('hidden');
  state.currentStep = n;
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(step) {
  [1, 2, 3, 4].forEach(i => {
    const el = document.getElementById(`kp-${i}`);
    const line = document.getElementById(`kp-line-${i}`);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (i < step) el.classList.add('done');
    else if (i === step) el.classList.add('active');
    if (line) line.classList.toggle('filled', i < step);
  });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function fmtBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Step 1: Personal Info ─────────────────────────────────────────────────
document.getElementById('form-1').addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'first-name',   errId: 'err-first-name',   label: 'First name' },
    { id: 'last-name',    errId: 'err-last-name',    label: 'Last name' },
    { id: 'dob',          errId: 'err-dob',          label: 'Date of birth' },
    { id: 'nationality',  errId: 'err-nationality',  label: 'Nationality' },
    { id: 'email-kyc',    errId: 'err-email-kyc',    label: 'Email' },
    { id: 'phone',        errId: 'err-phone',        label: 'Phone number' },
    { id: 'address1',     errId: 'err-address1',     label: 'Address' },
    { id: 'city',         errId: 'err-city',         label: 'City' },
    { id: 'postal',       errId: 'err-postal',       label: 'Postal code' },
    { id: 'country-kyc',  errId: 'err-country-kyc',  label: 'Country' },
  ];

  fields.forEach(f => {
    const val = document.getElementById(f.id)?.value.trim();
    clearError(f.errId);
    if (!val) {
      showError(f.errId, `${f.label} is required`);
      valid = false;
    }
  });

  const email = document.getElementById('email-kyc')?.value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('err-email-kyc', 'Enter a valid email address');
    valid = false;
  }

  if (!valid) return;

  state.personal = {
    firstName:   document.getElementById('first-name').value.trim(),
    lastName:    document.getElementById('last-name').value.trim(),
    dob:         document.getElementById('dob').value,
    nationality: document.getElementById('nationality').value,
    email:       email,
    phone:       document.getElementById('phone').value.trim(),
    address1:    document.getElementById('address1').value.trim(),
    address2:    document.getElementById('address2').value.trim(),
    city:        document.getElementById('city').value.trim(),
    postal:      document.getElementById('postal').value.trim(),
    country:     document.getElementById('country-kyc').value,
  };

  showStep(2);
});

// ── Step 2: Document Type ─────────────────────────────────────────────────
document.querySelectorAll('.doc-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.doc-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.docType = card.dataset.doc;

    const backZone = document.getElementById('zone-back');
    if (state.docType === 'passport') {
      backZone.style.display = 'none';
      state.uploads.back = 'N/A';
    } else {
      backZone.style.display = '';
      if (state.uploads.back === 'N/A') state.uploads.back = null;
    }

    document.getElementById('next-2').disabled = false;
    checkStep3Readiness();
  });
});

document.getElementById('back-2').addEventListener('click', () => showStep(1));

document.getElementById('next-2').addEventListener('click', () => showStep(3));

// ── Step 3: Upload ────────────────────────────────────────────────────────
function initUploadZone(zone, fileInputId, previewId, imgId, nameId, sizeId) {
  const input    = document.getElementById(fileInputId);
  const preview  = document.getElementById(previewId);
  const img      = document.getElementById(imgId);
  const nameEl   = document.getElementById(nameId);
  const sizeEl   = document.getElementById(sizeId);
  const placeholder = zone.querySelector('.upload-placeholder');

  function handleFile(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds 10 MB limit.');
      return;
    }
    state.uploads[zone.dataset.zone] = file;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => { img.src = e.target.result; };
      reader.readAsDataURL(file);
    } else {
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="%23555" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    }

    nameEl.textContent = file.name;
    sizeEl.textContent = fmtBytes(file.size);
    placeholder.classList.add('hidden');
    preview.classList.remove('hidden');
    zone.classList.add('uploaded');
    checkStep3Readiness();
  }

  input.addEventListener('change', () => handleFile(input.files[0]));

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  // Remove button
  const removeBtn = zone.querySelector('.preview-remove');
  if (removeBtn) {
    removeBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      state.uploads[zone.dataset.zone] = null;
      input.value = '';
      img.src = '';
      nameEl.textContent = '';
      sizeEl.textContent = '';
      preview.classList.add('hidden');
      placeholder.classList.remove('hidden');
      zone.classList.remove('uploaded');
      checkStep3Readiness();
    });
  }
}

initUploadZone(
  document.getElementById('zone-front'), 'file-front',
  'preview-front', 'img-front', 'name-front', 'size-front'
);
initUploadZone(
  document.getElementById('zone-back'), 'file-back',
  'preview-back', 'img-back', 'name-back', 'size-back'
);
initUploadZone(
  document.getElementById('zone-selfie'), 'file-selfie',
  'preview-selfie', 'img-selfie', 'name-selfie', 'size-selfie'
);

function checkStep3Readiness() {
  const needBack  = state.docType !== 'passport';
  const frontOk   = !!state.uploads.front;
  const backOk    = !needBack || !!state.uploads.back;
  const selfieOk  = !!state.uploads.selfie;
  document.getElementById('next-3').disabled = !(frontOk && backOk && selfieOk);
}

document.getElementById('back-3').addEventListener('click', () => showStep(2));

document.getElementById('next-3').addEventListener('click', () => {
  populateReview();
  showStep(4);
});

// ── Step 4: Review ────────────────────────────────────────────────────────
function populateReview() {
  const p = state.personal;
  const rows = [
    { label: 'Full Name',    val: `${p.firstName} ${p.lastName}` },
    { label: 'Date of Birth', val: p.dob },
    { label: 'Nationality',  val: p.nationality },
    { label: 'Email',        val: p.email },
    { label: 'Phone',        val: `+1 ${p.phone}` },
    { label: 'Address',      val: [p.address1, p.address2, p.city, p.postal, p.country].filter(Boolean).join(', ') },
  ];

  const personalEl = document.getElementById('review-personal');
  personalEl.innerHTML = rows.map(r => `
    <div class="review-row">
      <span class="review-label">${r.label}</span>
      <span class="review-val">${r.val || '—'}</span>
    </div>`).join('');

  const docLabels = { passport: 'Passport', license: "Driver's License", 'national-id': 'National ID' };
  document.getElementById('review-doc-type').innerHTML = `
    <div class="review-row" style="grid-column:1/-1">
      <span class="review-label">Document Type</span>
      <span class="review-val">${docLabels[state.docType] || state.docType}</span>
    </div>`;

  const thumbsEl = document.getElementById('review-thumbs');
  thumbsEl.innerHTML = '';
  ['front', 'back', 'selfie'].forEach(zone => {
    const file = state.uploads[zone];
    if (!file || file === 'N/A') return;
    if (file.type && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'review-thumb';
        img.alt = zone;
        thumbsEl.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
}

// Edit buttons jump back to the relevant step
document.querySelectorAll('.review-edit').forEach(btn => {
  btn.addEventListener('click', () => showStep(parseInt(btn.dataset.step, 10)));
});

document.getElementById('back-4').addEventListener('click', () => showStep(3));

// ── Submit ────────────────────────────────────────────────────────────────
document.getElementById('submit-btn').addEventListener('click', () => {
  const btn = document.getElementById('submit-btn');
  btn.classList.add('loading');
  btn.textContent = 'Submitting…';

  setTimeout(() => {
    showStep('success');
  }, 2000);
});

// ── Init ──────────────────────────────────────────────────────────────────
showStep(1);
