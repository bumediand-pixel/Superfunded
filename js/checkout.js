'use strict';

/* =========================================================
   checkout.js — SuperFunded Checkout Logic
   ========================================================= */

/* ── Plan Data ───────────────────────────────────────────── */
const PLANS = {
    '10k':  {
        label: '$10,000 Account',
        price: '$99',
        profit: '80%',
        features: [
            '10% Profit Target',
            '5% Daily Loss Limit',
            '10% Max Drawdown',
            'No Time Limit'
        ]
    },
    '25k':  {
        label: '$25,000 Account',
        price: '$199',
        profit: '85%',
        features: [
            '10% Profit Target',
            '5% Daily Loss Limit',
            '10% Max Drawdown',
            'No Time Limit'
        ]
    },
    '50k':  {
        label: '$50,000 Account',
        price: '$299',
        profit: '90%',
        features: [
            '10% Profit Target',
            '5% Daily Loss Limit',
            '10% Max Drawdown',
            'No Time Limit',
            'Scale to $2M'
        ]
    },
    '100k': {
        label: '$100,000 Account',
        price: '$499',
        profit: '90%',
        features: [
            '10% Profit Target',
            '5% Daily Loss Limit',
            '10% Max Drawdown',
            'No Time Limit',
            'Scale to $2M'
        ]
    },
    '200k': {
        label: '$200,000 Account',
        price: '$799',
        profit: '90%',
        features: [
            '10% Profit Target',
            '5% Daily Loss Limit',
            '10% Max Drawdown',
            'No Time Limit',
            'Scale to $2M'
        ]
    }
};

/* ── Stripe Config ───────────────────────────────────────── */
const STRIPE_KEY = 'pk_test_YOUR_KEY_HERE';

/* ── State ───────────────────────────────────────────────── */
let currentStep = 1;
let selectedPlan = '50k';
let stripeInstance = null;
let stripeElements = null;
let stripePaymentElement = null;
let isStripeActive = false;
let isPaymentProcessing = false;

/* ── DOM Helpers ─────────────────────────────────────────── */
function $(id) {
    return document.getElementById(id);
}

function setVisible(el, visible) {
    if (!el) return;
    if (visible) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

/* ── URL Params ──────────────────────────────────────────── */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        plan:     params.get('plan'),
        success:  params.get('success'),
        canceled: params.get('canceled')
    };
}

/* ── Plan UI Update ──────────────────────────────────────── */
function applyPlan(planKey) {
    const plan = PLANS[planKey];
    if (!plan) return;

    selectedPlan = planKey;

    // Step 1 displays
    const planNameEl = $('plan-name-display');
    const profitEl   = $('profit-split-display');
    const priceEl    = $('price-display');
    const totalEl    = $('total-amount-display');
    const featuresList = $('features-list');

    if (planNameEl) planNameEl.textContent = plan.label;
    if (priceEl)   priceEl.textContent   = plan.price;
    if (totalEl)   totalEl.textContent   = plan.price;

    if (profitEl) {
        const valEl = profitEl.querySelector('.profit-value');
        if (valEl) valEl.textContent = plan.profit;
    }

    // Rebuild features list
    if (featuresList) {
        featuresList.innerHTML = plan.features.map(function (feature) {
            return '<li class="feature-item">' +
                '<svg class="feature-icon" viewBox="0 0 16 16" fill="none">' +
                '<path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
                '</svg>' +
                '<span>' + escapeHtml(feature) + '</span>' +
                '</li>';
        }).join('');
    }

    // Payment step summary
    const summaryPlan  = $('summary-plan-name');
    const summaryPrice = $('summary-price');
    const summaryTotal = $('summary-total');
    const payBtnPrice  = $('pay-btn-price');

    if (summaryPlan)  summaryPlan.textContent  = plan.label + ' Challenge';
    if (summaryPrice) summaryPrice.textContent = plan.price;
    if (summaryTotal) summaryTotal.textContent = plan.price;
    if (payBtnPrice)  payBtnPrice.textContent  = plan.price;

    // Success screen
    const successPlan   = $('success-plan-name');
    const successAmount = $('success-amount');
    if (successPlan)   successPlan.textContent   = plan.label + ' Challenge';
    if (successAmount) successAmount.textContent = plan.price;

    // Sync the dropdown
    const planSelect = $('plan-select');
    if (planSelect && planSelect.value !== planKey) {
        planSelect.value = planKey;
    }
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ── Step Navigation ─────────────────────────────────────── */
function updateStepIndicator(step) {
    [1, 2, 3].forEach(function (n) {
        const dotEl  = $('step-dot-' + n);
        const lineEl = $('step-line-' + n);

        if (!dotEl) return;

        dotEl.classList.remove('active', 'complete');

        if (n < step) {
            dotEl.classList.add('complete');
        } else if (n === step) {
            dotEl.classList.add('active');
        }

        if (lineEl) {
            if (n < step) {
                lineEl.classList.add('complete');
            } else {
                lineEl.classList.remove('complete');
            }
        }
    });
}

function showStep(targetStep) {
    // Hide current step with exit animation
    var currentEl = getCurrentStepEl();
    if (currentEl) {
        currentEl.classList.add('step-exit');
        setTimeout(function () {
            currentEl.classList.add('hidden');
            currentEl.classList.remove('step-exit');
            revealStep(targetStep);
        }, 200);
    } else {
        revealStep(targetStep);
    }
}

function getCurrentStepEl() {
    var steps = ['step-1', 'step-2', 'step-3', 'step-success'];
    for (var i = 0; i < steps.length; i++) {
        var el = $(steps[i]);
        if (el && !el.classList.contains('hidden')) return el;
    }
    return null;
}

function revealStep(targetStep) {
    currentStep = targetStep;

    // Hide all step content
    ['step-1', 'step-2', 'step-3', 'step-success'].forEach(function (id) {
        var el = $(id);
        if (el) el.classList.add('hidden');
    });

    var targetId = targetStep === 'success' ? 'step-success' : 'step-' + targetStep;
    var targetEl = $(targetId);
    if (targetEl) {
        targetEl.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update indicator (success maps to step 3 complete)
    if (targetStep === 'success') {
        updateStepIndicator(4); // beyond step 3
    } else {
        updateStepIndicator(targetStep);
    }

    // Hide step indicator on success
    var indicator = $('step-indicator');
    if (indicator) {
        if (targetStep === 'success') {
            indicator.style.display = 'none';
        } else {
            indicator.style.display = '';
        }
    }
}

/* ── Form Validation (Step 2) ────────────────────────────── */
function clearError(fieldId, errorId) {
    var input = $(fieldId);
    var error = $(errorId);
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
}

function showError(fieldId, errorId, message) {
    var input = $(fieldId);
    var error = $(errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateStep2() {
    var isValid = true;

    // Clear previous errors
    clearError('full-name', 'full-name-error');
    clearError('email', 'email-error');
    clearError('country', 'country-error');
    clearError('experience', 'experience-error');
    var termsError = $('terms-error');
    if (termsError) termsError.textContent = '';

    var fullName   = $('full-name');
    var email      = $('email');
    var country    = $('country');
    var experience = $('experience');
    var terms      = $('accept-terms');

    if (!fullName || !fullName.value.trim()) {
        showError('full-name', 'full-name-error', 'Full name is required.');
        isValid = false;
    }

    if (!email || !email.value.trim()) {
        showError('email', 'email-error', 'Email address is required.');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showError('email', 'email-error', 'Please enter a valid email address.');
        isValid = false;
    }

    if (!country || !country.value) {
        showError('country', 'country-error', 'Please select your country.');
        isValid = false;
    }

    if (!experience || !experience.value) {
        showError('experience', 'experience-error', 'Please select your experience level.');
        isValid = false;
    }

    if (!terms || !terms.checked) {
        if (termsError) termsError.textContent = 'You must accept the terms to continue.';
        isValid = false;
    }

    return isValid;
}

/* ── Card Number Formatting ──────────────────────────────── */
function setupCardInputFormatting() {
    var cardNumber = $('card-number');
    var cardExpiry = $('card-expiry');

    if (cardNumber) {
        cardNumber.addEventListener('input', function () {
            var val = this.value.replace(/\D/g, '').substring(0, 16);
            this.value = val.match(/.{1,4}/g) ? val.match(/.{1,4}/g).join(' ') : val;
        });
    }

    if (cardExpiry) {
        cardExpiry.addEventListener('input', function () {
            var val = this.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 2) {
                this.value = val.substring(0, 2) + ' / ' + val.substring(2);
            } else {
                this.value = val;
            }
        });
    }
}

/* ── Stripe Initialization ───────────────────────────────── */
function initStripe() {
    if (typeof Stripe === 'undefined') {
        hideStripeLoading();
        return;
    }

    if (STRIPE_KEY === 'pk_test_YOUR_KEY_HERE') {
        hideStripeLoading();
        return;
    }

    try {
        stripeInstance = Stripe(STRIPE_KEY);
        stripeElements = stripeInstance.elements({
            appearance: {
                theme: 'night',
                variables: {
                    colorPrimary:         '#E63946',
                    colorBackground:      '#0f0f0f',
                    colorText:            '#ffffff',
                    colorDanger:          '#E63946',
                    fontFamily:           'Inter, sans-serif',
                    borderRadius:         '8px',
                    colorTextPlaceholder: '#555555'
                }
            }
        });

        stripePaymentElement = stripeElements.create('payment');

        var mountEl = $('stripe-elements-mount');
        var placeholderForm = $('placeholder-form');

        if (mountEl) {
            stripePaymentElement.mount('#stripe-elements-mount');
            setVisible(mountEl, true);
        }

        if (placeholderForm) {
            setVisible(placeholderForm, false);
        }

        isStripeActive = true;
        hideStripeLoading();

    } catch (err) {
        console.warn('Stripe init failed:', err);
        hideStripeLoading();
    }
}

function hideStripeLoading() {
    var loading = $('stripe-loading');
    if (loading) loading.classList.add('hidden');
}

/* ── Payment Submit ──────────────────────────────────────── */
function handlePayment() {
    if (isPaymentProcessing) return;

    var plan = PLANS[selectedPlan];
    if (!plan) return;

    isPaymentProcessing = true;
    var payBtn = $('pay-btn');
    var errorEl = $('payment-error');

    if (payBtn) {
        payBtn.disabled = true;
        payBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;margin:0 auto;"></div>';
    }

    if (errorEl) errorEl.classList.add('hidden');

    if (isStripeActive && stripeElements && stripeInstance) {
        handleStripePayment();
    } else {
        handleDemoPayment();
    }
}

function handleStripePayment() {
    var plan = PLANS[selectedPlan];

    fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            plan:  selectedPlan,
            label: plan.label,
            price: plan.price
        })
    })
    .then(function (res) {
        if (!res.ok) throw new Error('Server error: ' + res.status);
        return res.json();
    })
    .then(function (data) {
        if (data && data.url) {
            window.location.href = data.url;
        } else if (data && data.clientSecret) {
            return stripeInstance.confirmPayment({
                elements: stripeElements,
                confirmParams: {
                    return_url: window.location.origin + '/checkout.html?success=true&plan=' + selectedPlan
                }
            }).then(function (result) {
                if (result.error) {
                    showPaymentError(result.error.message);
                }
            });
        } else {
            throw new Error('Invalid server response.');
        }
    })
    .catch(function (err) {
        showPaymentError(err.message || 'Payment failed. Please try again.');
    });
}

function handleDemoPayment() {
    setTimeout(function () {
        showSuccess();
    }, 1500);
}

function showPaymentError(message) {
    isPaymentProcessing = false;
    var plan = PLANS[selectedPlan];
    var payBtn = $('pay-btn');
    var errorEl = $('payment-error');

    if (payBtn) {
        payBtn.disabled = false;
        payBtn.innerHTML =
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
            '<rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/>' +
            '<path d="M2 8H16" stroke="currentColor" stroke-width="1.6"/>' +
            '<path d="M5 12H7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
            '</svg>' +
            '<span>Pay Now — <span id="pay-btn-price">' + (plan ? plan.price : '') + '</span></span>';
    }

    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
}

/* ── Success Screen ──────────────────────────────────────── */
function showSuccess() {
    isPaymentProcessing = false;
    revealStep('success');
}

/* ── Event Listeners ─────────────────────────────────────── */
function bindEvents() {
    // Plan dropdown
    var planSelect = $('plan-select');
    if (planSelect) {
        planSelect.addEventListener('change', function () {
            applyPlan(this.value);
        });
    }

    // Step 1 continue
    var step1Btn = $('step1-continue');
    if (step1Btn) {
        step1Btn.addEventListener('click', function () {
            showStep(2);
        });
    }

    // Step 2 form submit
    var detailsForm = $('details-form');
    if (detailsForm) {
        detailsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateStep2()) {
                showStep(3);
                // Init Stripe when entering payment step
                setTimeout(initStripe, 100);
            }
        });
    }

    // Step 2 back
    var step2Back = $('step2-back');
    if (step2Back) {
        step2Back.addEventListener('click', function () {
            showStep(1);
        });
    }

    // Step 3 back
    var step3Back = $('step3-back');
    if (step3Back) {
        step3Back.addEventListener('click', function () {
            showStep(2);
        });
    }

    // Pay button
    var payBtn = $('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', handlePayment);
    }

    // Live clear errors on input
    ['full-name', 'email', 'country', 'experience'].forEach(function (fieldId) {
        var el = $(fieldId);
        if (el) {
            el.addEventListener('input', function () {
                clearError(fieldId, fieldId + '-error');
            });
            el.addEventListener('change', function () {
                clearError(fieldId, fieldId + '-error');
            });
        }
    });

    var terms = $('accept-terms');
    if (terms) {
        terms.addEventListener('change', function () {
            var termsError = $('terms-error');
            if (this.checked && termsError) termsError.textContent = '';
        });
    }
}

/* ── Init ────────────────────────────────────────────────── */
function init() {
    var params = getUrlParams();

    // Handle success redirect
    if (params.success === 'true') {
        var planFromUrl = params.plan;
        if (planFromUrl && PLANS[planFromUrl]) {
            applyPlan(planFromUrl);
        } else {
            applyPlan(selectedPlan);
        }
        revealStep('success');
        return;
    }

    // Handle canceled redirect
    if (params.canceled === 'true') {
        // Return to step 3 with an error message
        var planFromUrl = params.plan;
        if (planFromUrl && PLANS[planFromUrl]) {
            applyPlan(planFromUrl);
        }
        revealStep(3);
        setTimeout(function () {
            var errorEl = $('payment-error');
            if (errorEl) {
                errorEl.textContent = 'Your payment was canceled. Please try again.';
                errorEl.classList.remove('hidden');
            }
        }, 300);
        return;
    }

    // Set initial plan from URL param or default to 50k
    var planParam = params.plan;
    if (planParam && PLANS[planParam]) {
        applyPlan(planParam);
    } else {
        applyPlan('50k');
    }

    bindEvents();
    setupCardInputFormatting();
    revealStep(1);
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
