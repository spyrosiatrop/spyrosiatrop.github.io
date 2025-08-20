document.getElementById('newsletter-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email-input').value;
  const submitBtn = document.querySelector('.submit-btn');
  const successMsg = document.getElementById('success-message');
  const errorMsg = document.getElementById('error-message');
  
  // Hide previous messages
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';
  
  // Show loading state
  submitBtn.textContent = 'Adding you...';
  submitBtn.disabled = true;
  
  try {
    // Submit to Substack API
    const response = await fetch('https://spyrosiatrop.substack.com/api/v1/free', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        domain: 'spyrosiatrop.substack.com'
      })
    });
    
    if (response.ok) {
      successMsg.style.display = 'block';
      document.getElementById('email-input').value = '';
    } else {
      throw new Error('Subscription failed');
    }
  } catch (error) {
    errorMsg.style.display = 'block';
    console.error('Subscription error:', error);
  } finally {
    // Reset button
    submitBtn.textContent = 'Count me in';
    submitBtn.disabled = false;
  }
});