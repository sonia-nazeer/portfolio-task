document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // Form Handling & Captcha
  // ============================
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage"); // optional div for errors
  const captchaCanvas = document.getElementById("captchaCanvas");
  const captchaInput = document.getElementById("captchaInput");
  const refreshCaptchaBtn = document.getElementById("refreshCaptcha");

  let captchaCode;
  let captchaFails = parseInt(localStorage.getItem("captchaFails") || "0", 10);

  // Generate Distortion Captcha
  const generateCaptcha = () => {
    if (!captchaCanvas) return;
    const ctx = captchaCanvas.getContext("2d");
    ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);

    // Background
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

    // Random characters
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    captchaCode = "";
    for (let i = 0; i < 6; i++) {
      captchaCode += chars[Math.floor(Math.random() * chars.length)];
    }

    // Draw distorted text
    for (let i = 0; i < captchaCode.length; i++) {
      ctx.font = `${20 + Math.floor(Math.random() * 10)}px Arial`;
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 150)},${Math.floor(
        Math.random() * 150
      )},${Math.floor(Math.random() * 150)})`;
      const x = 15 + i * 20;
      const y = 25 + Math.random() * 15;
      const angle = Math.random() * 0.5 - 0.25;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(captchaCode[i], 0, 0);
      ctx.restore();
    }

    // Random lines for distortion
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgb(${Math.floor(Math.random() * 150)},${Math.floor(
        Math.random() * 150
      )},${Math.floor(Math.random() * 150)})`;
      ctx.beginPath();
      ctx.moveTo(
        Math.random() * captchaCanvas.width,
        Math.random() * captchaCanvas.height
      );
      ctx.lineTo(
        Math.random() * captchaCanvas.width,
        Math.random() * captchaCanvas.height
      );
      ctx.stroke();
    }
  };

  generateCaptcha();
  if (refreshCaptchaBtn)
    refreshCaptchaBtn.addEventListener("click", generateCaptcha);

  // ============================
  // Form submit handler
  // ============================
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const captcha = captchaInput ? captchaInput.value.trim().toUpperCase() : "";

    // HTML5 Validation
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Name Validation (alphabets + space only)
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    if (!nameRegex.test(name)) {
      alert("Name should only contain letters (min 3, max 50).");
      return;
    }

    // Message Validation
    if (message.length < 10) {
      alert("Message should be at least 10 characters long.");
      return;
    }
    if (message.length > 600) {
      alert("Message should not exceed 1000 characters.");
      return;
    }

    // Captcha Validation
    if (!captcha) {
      alert("Please solve the captcha first!");
      captchaInput.focus();
      return;
    }

    if (captcha !== captchaCode) {
      captchaFails++;
      localStorage.setItem("captchaFails", captchaFails);

      if (captchaFails >= 5) {
        alert("Too many wrong captcha attempts. Please wait 1 minute.");
        setTimeout(() => {
          localStorage.setItem("captchaFails", "0");
          captchaFails = 0;
        }, 60000);
        return;
      }

      if (errorMessage) {
        errorMessage.textContent = "Captcha is incorrect. Try again.";
        errorMessage.classList.remove("d-none");
      } else {
        alert("Captcha is incorrect. Try again.");
      }
      generateCaptcha();
      return;
    }

    // Submission Limit
    let count = parseInt(localStorage.getItem(email) || "0", 10);
    if (count >= 2) {
      const msg = "Maximum 2 messages allowed from this email.";
      if (errorMessage) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove("d-none");
      } else {
        alert(msg);
      }
      return;
    }

    // Send email via EmailJS
    emailjs
      .send("service_43dri8v", "template_76cj0jo", {
        name: name,
        email: email,
        message: message,
      })
      .then(
        () => {
          if (successMessage) {
            successMessage.classList.remove("d-none");
            setTimeout(() => successMessage.classList.add("d-none"), 3000);
          } else {
            alert("Message sent successfully!");
          }

          localStorage.setItem(email, count + 1);
          form.reset();
          form.classList.remove("was-validated");
          if (errorMessage) errorMessage.classList.add("d-none");
          generateCaptcha(); // refresh captcha after success
        },
        (error) => {
          alert("Failed to send message. Try again later.");
          console.log(error);
          generateCaptcha();
        }
      );
  });

  // ============================
  // Back to Top Button
  // ============================
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============================
  // AOS Animation Initialization
  // ============================
  AOS.init({
    duration: 1000,
    once: true,
  });

  // ============================
  // Swiper Initialization
  // ============================
  var swiper = new Swiper(".myCertificates", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 3,
    spaceBetween: 0,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: true,
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // Responsive breakpoints
    breakpoints: {
      0: { slidesPerView: 1 }, // Mobile
      576: { slidesPerView: 2 }, // Small devices
      992: { slidesPerView: 3 }, // Desktop
    },
  });

  // ============================
  // Dark / Light Theme Toggle
  // ============================
  const themeToggleBtn = document.getElementById("themeToggle");
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggleBtn) themeToggleBtn.textContent = "🌞 Light Mode";
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "🌞 Light Mode";
        localStorage.setItem("theme", "dark");
      } else {
        themeToggleBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
      }
    });
  }
});
