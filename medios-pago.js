// Payment Method Selection
document.addEventListener('DOMContentLoaded', function() {
  const paymentCards = document.querySelectorAll('.payment-card');
  const paymentFormSection = document.getElementById('payment-form-section');
  const paymentForms = document.querySelectorAll('.payment-form');
  const backButton = document.getElementById('back-button');
  const payButtons = document.querySelectorAll('.btn-pay');
  const successModal = document.getElementById('success-modal');
  
  // Select Payment Method
  paymentCards.forEach(card => {
    const selectButton = card.querySelector('.btn-select-payment');
    
    selectButton.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const paymentType = card.getAttribute('data-payment');
      
      // Add click animation
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = '';
        showPaymentForm(paymentType);
      }, 200);
    });
  });
  
  // Show Payment Form
  function showPaymentForm(paymentType) {
    paymentFormSection.classList.add('active');
    
    // Hide all forms
    paymentForms.forEach(form => form.classList.remove('active'));
    
    // Show selected form
    const selectedForm = document.getElementById(`${paymentType}-form`);
    if (selectedForm) {
      selectedForm.classList.add('active');
    }
    
    // Update payment name for QR forms
    if (paymentType === 'yape' || paymentType === 'plin') {
      const paymentName = selectedForm.querySelector('.payment-name');
      if (paymentName) {
        paymentName.textContent = paymentType.charAt(0).toUpperCase() + paymentType.slice(1);
      }
    }
    
    // Smooth scroll to form
    setTimeout(() => {
      paymentFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  
  // Back Button
  backButton.addEventListener('click', function() {
    paymentFormSection.classList.remove('active');
    document.querySelector('.payment-methods-section').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Copy to Clipboard
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const textToCopy = this.previousElementSibling.textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Change button text temporarily
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.style.background = 'var(--gradient-success)';
        
        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.style.background = '';
        }, 2000);
      });
    });
  });
  
  // Card Number Formatting
  const cardNumberInput = document.querySelector('.card-number-input');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
      
      // Detect card type
      const cardTypeIcon = document.querySelector('.card-type-icon');
      if (value.startsWith('4')) {
        cardTypeIcon.style.backgroundImage = 'url("https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg")';
      } else if (value.startsWith('5')) {
        cardTypeIcon.style.backgroundImage = 'url("https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg")';
      } else {
        cardTypeIcon.style.backgroundImage = '';
      }
    });
  }
  
  // Payment Submission
  payButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Add loading state
      this.classList.add('loading');
      
      // Simulate payment processing
      setTimeout(() => {
        this.classList.remove('loading');
        showSuccessModal();
      }, 2000);
    });
  });
  
  // Show Success Modal
  function showSuccessModal() {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Create confetti effect
    createConfetti();
  }
  
  // Confetti Animation
  function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    const colors = ['#3f7dbf', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = confetti.style.width;
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.setProperty('--x', (Math.random() - 0.5) * 400 + 'px');
      confetti.style.animation = `confettiFall ${Math.random() * 0.5 + 0.5}s ease-out`;
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      
      confettiContainer.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 1500);
    }
  }
  
  // Particles Background
  createParticles();
  
  function createParticles() {
    const particlesBg = document.getElementById('particles-bg');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 4 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = 'rgba(63, 125, 191, 0.3)';
      particle.style.borderRadius = '50%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animation = `particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite`;
      particle.style.animationDelay = Math.random() * 5 + 's';
      
      particlesBg.appendChild(particle);
    }
  }
  
  // Input Animation
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = '';
    });
  });
});
