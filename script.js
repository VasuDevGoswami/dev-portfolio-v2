// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const bodyElement = document.body;

// Set copyright year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Analytics Functions
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href
        });
    }
}

function trackResumeDownload() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'resume_download', {
            'event_category': 'engagement',
            'event_label': 'Resume Download'
        });
    }
}

function trackContactFormSubmission() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submission', {
            'event_category': 'engagement',
            'event_label': 'Contact Form Submission'
        });
    }
}

// Initialize EmailJS
(function() {
    emailjs.init("j7Z2IkIKgcRhHU6FS"); // Replace with your EmailJS public key
})();

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Get form data
        const formData = {
            name: this.querySelector('[name="name"]').value,
            email: this.querySelector('[name="email"]').value,
            title: this.querySelector('[name="title"]').value,
            message: this.querySelector('[name="message"]').value
        };

        // Send email using EmailJS
        emailjs.send('service_5f8gg9t', 'template_rivsf5i', formData)
            .then(function() {
                // Track successful form submission
                trackContactFormSubmission();
                
                // Show success message
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            }, function(error) {
                // Show error message
                alert('Sorry, there was an error sending your message. Please try again later.');
                console.error('EmailJS Error:', error);
            })
            .finally(function() {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    });
}

// Track page view when the page loads
document.addEventListener('DOMContentLoaded', function() {
    trackPageView();
});

// Track page view when navigating between sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function() {
        const section = this.getAttribute('href').substring(1);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'section_view', {
                'event_category': 'navigation',
                'event_label': section
            });
        }
    });
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.classList.add(savedTheme);
bodyElement.classList.add(savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Remove old theme
  htmlElement.classList.remove(currentTheme);
  bodyElement.classList.remove(currentTheme);
  
  // Add new theme
  htmlElement.classList.add(newTheme);
  bodyElement.classList.add(newTheme);
  
  // Update icon
  updateThemeIcon(newTheme);
  
  // Save preference
  localStorage.setItem('theme', newTheme);
});

// Google Apps-like Menu
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const appsMenu = document.querySelector('.apps-menu');
  const appsMenuClose = document.querySelector('.apps-menu-close');

  function toggleAppsMenu() {
    if (appsMenu) {
      appsMenu.classList.toggle('active');
      document.body.style.overflow = appsMenu.classList.contains('active') ? 'hidden' : '';
    }
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleAppsMenu);
  }

  if (appsMenuClose) {
    appsMenuClose.addEventListener('click', toggleAppsMenu);
  }

  // Close menu when clicking outside
  if (appsMenu) {
    appsMenu.addEventListener('click', (e) => {
      if (e.target === appsMenu) {
        toggleAppsMenu();
      }
    });
  }

  // Close menu when clicking a link
  const appItems = document.querySelectorAll('.app-item');
  if (appItems.length > 0) {
    appItems.forEach(item => {
      item.addEventListener('click', () => {
        toggleAppsMenu();
      });
    });
  }
});

// Scroll Animation
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up').forEach(el => {
  observer.observe(el);
});

// 3D Hero Animation
const heroCanvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 5000;
const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.005,
  color: 0x6366f1
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 2;

// Add mouse interaction to particles
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Combined animation function
const animate = () => {
  requestAnimationFrame(animate);
  
  // Base rotation
  particlesMesh.rotation.x += 0.0005;
  particlesMesh.rotation.y += 0.0005;
  
  // Mouse interaction
  particlesMesh.rotation.x += mouseY * 0.0005;
  particlesMesh.rotation.y += mouseX * 0.0005;
  
  renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Enhanced Scroll Animation with Reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// 3D Card Tilt Effect
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xRotation = ((y - rect.height / 2) / rect.height) * 20;
    const yRotation = ((x - rect.width / 2) / rect.width) * 20;
    
    card.style.transform = `perspective(1000px) rotateX(${-xRotation}deg) rotateY(${yRotation}deg) scale3d(1.05, 1.05, 1.05)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

// Parallax Tilt Effect
document.querySelectorAll('.tilt').forEach(element => {
  element.addEventListener('mousemove', e => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
});

// Enhanced Particle Animation
const updateParticleColor = () => {
  const isDark = document.documentElement.classList.contains('dark');
  particlesMaterial.color.setHex(isDark ? 0x6366f1 : 0x4f46e5);
};

themeToggle.addEventListener('click', updateParticleColor);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Magnetic Button Effect
document.querySelectorAll('.magnetic-button').forEach(button => {
  button.addEventListener('mousemove', e => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) * 0.1;
    const deltaY = (y - centerY) * 0.1;
    
    button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    button.querySelector('span').style.transform = `translate(${deltaX * 0.3}px, ${deltaY * 0.3}px)`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
    button.querySelector('span').style.transform = 'translate(0, 0)';
  });
});

// Text Scramble Effect
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += char;
      } else {
        output += from;
      }
    }
    this.el.innerText = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Initialize Text Scramble
document.querySelectorAll('.scramble').forEach(el => {
  const fx = new TextScramble(el);
  const originalText = el.innerText;
  
  el.addEventListener('mouseenter', () => {
    fx.setText(originalText);
  });
});

// Spotlight Effect
document.querySelectorAll('.spotlight').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    el.style.setProperty('--x', `${x}%`);
    el.style.setProperty('--y', `${y}%`);
  });
});

// Kinetic Loading Animation
function startKineticLoading(element) {
  element.classList.add('kinetic');
  return () => element.classList.remove('kinetic');
}

// Enhanced Particle System
const updateParticleSystem = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const baseColor = isDark ? 0x6366f1 : 0x4f46e5;
  
  particlesMaterial.color.setHex(baseColor);
  particlesMaterial.size = window.innerWidth < 768 ? 0.003 : 0.005;
  
  // Add some randomness to particle movement
  particlesMesh.rotation.z += (Math.random() - 0.5) * 0.0001;
};

// Update particle system on theme change and resize
themeToggle.addEventListener('click', updateParticleSystem);
window.addEventListener('resize', updateParticleSystem);

// Glitch Text Effect
document.querySelectorAll('.glitch').forEach(el => {
  const text = el.innerText;
  el.setAttribute('data-text', text);
});

// Active Menu Item on Scroll
function updateActiveMenuItem() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const scrollPosition = window.scrollY;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      const sectionId = section.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('bg-gray-700', 'text-white');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('bg-gray-700', 'text-white');
        }
      });
    }
  });
}

// Add scroll event listener
window.addEventListener('scroll', updateActiveMenuItem);
// Call once on page load
document.addEventListener('DOMContentLoaded', updateActiveMenuItem); 