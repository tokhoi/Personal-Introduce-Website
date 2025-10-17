document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.querySelector(".loading-screen");
  const introScreen = document.querySelector(".intro-screen");
  const chapters = document.querySelectorAll(".chapter");
  const progressBar = document.querySelector(".timeline-progress");
  const markersContainer = document.querySelector(".timeline-markers");
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const cursorTrail = document.querySelector(".cursor-trail");
  const interactiveElements = document.querySelectorAll(".interactive-element");

  // --- 0. Loading Screen ---
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      // Trigger first chapter visibility if already scrolled past intro
      const firstChapter = document.querySelector(".chapter");
      if (firstChapter) {
        const chapterRect = firstChapter.getBoundingClientRect();
        if (
          chapterRect.top < window.innerHeight / 2 &&
          chapterRect.bottom > window.innerHeight / 2
        ) {
          firstChapter.classList.add("visible");
        }
      }
    }, 1000); // 1 giây chờ để hiệu ứng đẹp hơn
  });

  // --- 1. Lời chào cá nhân hóa ---
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
  // Tạo các marker năm trên thanh timeline
  chapters.forEach((chapter, index) => {
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.innerHTML = `<span>${chapter.dataset.year}</span>`;

    // Tính toán vị trí % của marker dựa trên vị trí của chapter
    const chapterTop = chapter.offsetTop;
    // Đảm bảo marker không đi quá 100% nếu docHeight = 0 hoặc chapter ở cuối
    let markerPos = (chapterTop / docHeight) * 100;
    markerPos = Math.min(100, Math.max(0, markerPos)); // Giới hạn từ 0 đến 100
    marker.style.left = `${markerPos}%`;

    marker.addEventListener("click", () => {
      window.scrollTo({ top: chapter.offsetTop, behavior: "smooth" });
      // Haptic Feedback
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Rung 50ms
      }
    });
    markersContainer.appendChild(marker);
  });

  const handleScroll = () => {
    // Ẩn màn hình giới thiệu khi bắt đầu cuộn
    if (window.scrollY > 50) {
      // Giảm ngưỡng cuộn
      introScreen.style.opacity = "0";
      introScreen.style.pointerEvents = "none";
    } else {
      introScreen.style.opacity = "1";
      introScreen.style.pointerEvents = "auto";
    }

    // Cập nhật thanh tiến trình
    const scrollPercent = (window.scrollY / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;

    // Đổi màu nền, hiển thị chapter và active marker
    const markers = document.querySelectorAll(".marker");
    chapters.forEach((chapter, index) => {
      const chapterRect = chapter.getBoundingClientRect();
      if (
        chapterRect.top < window.innerHeight / 2 &&
        chapterRect.bottom > window.innerHeight / 2
      ) {
        document.documentElement.style.setProperty(
          "--background-color",
          chapter.dataset.bgColor
        );
        // Active marker
        markers.forEach((m) => m.classList.remove("active"));
        if (markers[index]) {
          // Đảm bảo marker tồn tại
          markers[index].classList.add("active");
        }
      }
    });

    // Parallax cho hình ảnh
    const parallaxImages = document.querySelectorAll(".parallax-image");
    parallaxImages.forEach((img) => {
      const container = img.closest(".image-parallax-container");
      if (!container) return; // Kiểm tra xem có container không
      const imgRect = container.getBoundingClientRect();
      const scrollFactor = 0.2; // Độ mạnh của hiệu ứng parallax

      // Chỉ áp dụng khi ảnh nằm trong viewport hoặc gần đó
      if (imgRect.top < window.innerHeight && imgRect.bottom > 0) {
        const scrolledAmount = window.innerHeight - imgRect.top;
        const offset = scrolledAmount * scrollFactor;
        img.style.transform = `translateY(-${offset}px)`;
      }
    });
  };

  // IntersectionObserver để hiển thị chapter khi cuộn tới
  const chapterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  ); // Kích hoạt khi 10% của chapter hiện ra

  chapters.forEach((chapter) => chapterObserver.observe(chapter));
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Gọi một lần khi tải trang để thiết lập trạng thái ban đầu

  // --- 3. Xử lý Modal Case Study ---
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalBody = document.getElementById("modal-body");
  const openModalButtons = document.querySelectorAll(".open-modal");
  const closeModalButton = document.querySelector(".close-modal");

  const openModal = (title, imageSrc, contentHtml) => {
    modalTitle.textContent = title;
    if (imageSrc) {
      modalImage.src = imageSrc;
      modalImage.style.display = "block";
    } else {
      modalImage.style.display = "none"; // Ẩn nếu không có ảnh
    }
    modalBody.innerHTML = contentHtml; // Dùng innerHTML để hỗ trợ thẻ HTML
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Ngăn cuộn trang chính
  };

  const closeModal = () => {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Cho phép cuộn lại
  };

  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.dataset.title;
      const image = button.dataset.image;
      const content = button.dataset.content;
      openModal(title, image, content);
      // Haptic Feedback
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    });
  });

  closeModalButton.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
      // Haptic Feedback
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
  });

  // --- 4. Cursor Trail ---
  document.addEventListener("mousemove", (e) => {
    cursorTrail.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  // Add hover effect for interactive elements (defined in CSS)
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursorTrail.classList.add("grow"));
    el.addEventListener("mouseleave", () =>
      cursorTrail.classList.remove("grow")
    );
  });
});
