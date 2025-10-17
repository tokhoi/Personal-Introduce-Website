document.addEventListener("DOMContentLoaded", () => {
  const greetingElement = document.getElementById("greeting");
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    greetingElement.textContent = "Chào buổi sáng!";
  } else if (currentHour < 18) {
    greetingElement.textContent = "Chào buổi chiều!";
  } else {
    greetingElement.textContent = "Chào buổi tối!";
  }

  // --- 2. Xử lý Timeline & Scroll ---
  const chapters = document.querySelectorAll(".chapter");
  const progressBar = document.querySelector(".timeline-progress");
  const markersContainer = document.querySelector(".timeline-markers");
  const introScreen = document.querySelector(".intro-screen");
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  chapters.forEach((chapter) => {
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.textContent = chapter.dataset.year;
    const markerPos = (chapter.offsetTop / docHeight) * 100;
    marker.style.left = `${markerPos}%`;
    marker.addEventListener("click", () => {
      window.scrollTo({ top: chapter.offsetTop, behavior: "smooth" });
    });
    markersContainer.appendChild(marker);
  });

  const handleScroll = () => {
    if (window.scrollY > 100) {
      introScreen.style.opacity = "0";
      introScreen.style.pointerEvents = "none";
    } else {
      introScreen.style.opacity = "1";
      introScreen.style.pointerEvents = "auto";
    }
    const scrollPercent = (window.scrollY / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
    chapters.forEach((chapter) => {
      const chapterRect = chapter.getBoundingClientRect();
      if (
        chapterRect.top < window.innerHeight / 2 &&
        chapterRect.bottom > window.innerHeight / 2
      ) {
        document.documentElement.style.setProperty(
          "--background-color",
          chapter.dataset.bgColor
        );
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );
  chapters.forEach((chapter) => observer.observe(chapter));
  window.addEventListener("scroll", handleScroll);

  // --- 3. Xử lý Modal Case Study ---
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const openModalButtons = document.querySelectorAll(".open-modal");
  const closeModalButton = document.querySelector(".close-modal");

  const openModal = (title, content) => {
    modalTitle.textContent = title;
    modalBody.textContent = content;
    modalOverlay.classList.add("active");
  };

  const closeModal = () => {
    modalOverlay.classList.remove("active");
  };

  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.dataset.title;
      const content = button.dataset.content;
      openModal(title, content);
    });
  });

  closeModalButton.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
});
