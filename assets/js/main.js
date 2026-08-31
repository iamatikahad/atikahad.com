"use strict";


    /* =====================================================
       HERO SLIDER DATA
    ====================================================== */

    const kignatureData = [

      "Data Center Infrastructure",

      "Data Center Infrastructure",

      "NETWORK & SYSTEM ADMINISTRATION",

      "IT SUPPORT & TECHNICAL SERVICES",

      "NETWORK INFRASTRUCTURE & CONNECTIVITY",

      "STRUCTURED CABLING & NETWORK MANAGEMENT",

      "HARDWARE & ENDPOINT MANAGEMENT",

      "IT SECURITY & SYSTEM PROTECTION",

      "WIRELESS NETWORK MANAGEMENT",

      "POWER & UPS MANAGEMENT",

      "NETWORK MONITORING & TROUBLESHOOTING"

    ];


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const slides =
      document.querySelectorAll(
        ".kignature-slide"
      );


    const dots =
      document.querySelectorAll(
        ".kignature-slide-dot"
      );


    const category =
      document.getElementById(
        "kignatureCategory"
      );


    const heroTitle =
      document.getElementById(
        "kignatureHeroTitle"
      );


    const progress =
      document.getElementById(
        "kignatureProgress"
      );


    const nextButton =
      document.getElementById(
        "kignatureNext"
      );


    const prevButton =
      document.getElementById(
        "kignaturePrev"
      );


    const hero =
      document.querySelector(
        ".kignature-hero"
      );


    /* =====================================================
       SETTINGS
    ====================================================== */

    const duration = 2800;

    let index = 0;

    let timer = null;

    let progressTimer = null;

    let isPaused = false;


    /* =====================================================
       REDUCED MOTION
    ====================================================== */

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    /* =====================================================
       PRELOAD HERO IMAGES
    ====================================================== */

    slides.forEach((slide) => {

      const background =
        slide.style.backgroundImage;

      if(!background){
        return;
      }

      const url =
        background
          .replace(/^url\(["']?/, "")
          .replace(/["']?\)$/, "");

      if(url){

        const image =
          new Image();

        image.decoding = "async";

        image.src = url;

      }

    });


    /* =====================================================
       UPDATE HERO TEXT
    ====================================================== */

    function updateHeroText(){

      if(!category || !heroTitle){
        return;
      }

      const text =
        kignatureData[index];

      category.style.opacity = "0";

      heroTitle.style.opacity = "0";

      heroTitle.style.transform =
        "translateY(10px)";


      setTimeout(() => {

        category.textContent =
          text;

        heroTitle.textContent =
          text;

        category.style.opacity =
          "1";

        heroTitle.style.opacity =
          "1";

        heroTitle.style.transform =
          "translateY(0)";

      }, reducedMotion ? 0 : 120);

    }


    /* =====================================================
       UPDATE PROGRESS
    ====================================================== */

    function updateProgress(){

      if(!progress){
        return;
      }

      progress.style.transition =
        "none";

      progress.style.width =
        "0%";


      if(reducedMotion){
        progress.style.width =
          "100%";
        return;
      }


      requestAnimationFrame(() => {

        requestAnimationFrame(() => {

          progress.style.transition =
            `width ${duration}ms linear`;

          progress.style.width =
            "100%";

        });

      });

    }


    /* =====================================================
       SHOW SLIDE
    ====================================================== */

    function showSlide(newIndex){

      if(!slides.length){
        return;
      }

      const oldIndex =
        index;

      index =
        (newIndex + slides.length)
        % slides.length;


      slides.forEach((slide, i) => {

        slide.classList.remove(
          "previous"
        );


        if(
          i === oldIndex &&
          i !== index
        ){

          slide.classList.add(
            "previous"
          );

        }

      });


      slides.forEach((slide, i) => {

        slide.classList.toggle(
          "active",
          i === index
        );

      });


      dots.forEach((dot, i) => {

        const active =
          i === index;

        dot.classList.toggle(
          "active",
          active
        );

        dot.setAttribute(
          "aria-current",
          active
            ? "true"
            : "false"
        );

      });


      updateHeroText();

      updateProgress();

    }


    /* =====================================================
       NEXT
    ====================================================== */

    function nextSlide(){

      showSlide(
        index + 1
      );

    }


    /* =====================================================
       PREVIOUS
    ====================================================== */

    function previousSlide(){

      showSlide(
        index - 1
      );

    }


    /* =====================================================
       START AUTOPLAY
    ====================================================== */

    function startAutoPlay(){

      if(reducedMotion){
        return;
      }

      clearInterval(timer);

      timer =
        setInterval(() => {

          if(!isPaused){

            nextSlide();

          }

        }, duration);

    }


    /* =====================================================
       STOP AUTOPLAY
    ====================================================== */

    function stopAutoPlay(){

      clearInterval(timer);

      timer = null;

    }


    /* =====================================================
       NEXT BUTTON
    ====================================================== */

    if(nextButton){

      nextButton.addEventListener(
        "click",
        () => {

          nextSlide();

          startAutoPlay();

        }
      );

    }


    /* =====================================================
       PREVIOUS BUTTON
    ====================================================== */

    if(prevButton){

      prevButton.addEventListener(
        "click",
        () => {

          previousSlide();

          startAutoPlay();

        }
      );

    }


    /* =====================================================
       DOTS
    ====================================================== */

    dots.forEach((dot) => {

      dot.addEventListener(
        "click",
        () => {

          const target =
            Number(
              dot.dataset.slide
            );

          showSlide(target);

          startAutoPlay();

        }
      );

    });


    /* =====================================================
       KEYBOARD
    ====================================================== */

    document.addEventListener(
      "keydown",
      (event) => {

        if(
          event.key === "ArrowRight"
        ){

          nextSlide();

          startAutoPlay();

        }


        if(
          event.key === "ArrowLeft"
        ){

          previousSlide();

          startAutoPlay();

        }

      }
    );


    /* =====================================================
       TOUCH SWIPE
    ====================================================== */

    let touchStartX = 0;

    let touchEndX = 0;


    if(hero){

      hero.addEventListener(
        "touchstart",
        (event) => {

          touchStartX =
            event.changedTouches[0]
              .screenX;

        },
        {
          passive:true
        }
      );


      hero.addEventListener(
        "touchend",
        (event) => {

          touchEndX =
            event.changedTouches[0]
              .screenX;


          const distance =
            touchEndX -
            touchStartX;


          if(
            Math.abs(distance) > 45
          ){

            if(distance < 0){

              nextSlide();

            }else{

              previousSlide();

            }

            startAutoPlay();

          }

        },
        {
          passive:true
        }
      );


      /* =================================================
         PAUSE ON HOVER
      ================================================= */

      hero.addEventListener(
        "mouseenter",
        () => {

          isPaused = true;

        }
      );


      hero.addEventListener(
        "mouseleave",
        () => {

          isPaused = false;

        }
      );

    }


    /* =====================================================
       VISIBILITY API
       Pause slider when browser tab is hidden.
    ====================================================== */

    document.addEventListener(
      "visibilitychange",
      () => {

        if(document.hidden){

          stopAutoPlay();

        }else{

          startAutoPlay();

        }

      }
    );


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements =
      document.querySelectorAll(
        ".reveal"
      );


    if(
      "IntersectionObserver"
      in window
    ){

      const revealObserver =
        new IntersectionObserver(
          (entries, observer) => {

            entries.forEach(
              (entry) => {

                if(
                  entry.isIntersecting
                ){

                  entry.target.classList.add(
                    "visible"
                  );

                  observer.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold:.12,
            rootMargin:"0px 0px -40px 0px"
          }
        );


      revealElements.forEach(
        (element) => {

          revealObserver.observe(
            element
          );

        }
      );

    }else{

      revealElements.forEach(
        (element) => {

          element.classList.add(
            "visible"
          );

        }
      );

    }


    /* =====================================================
       SMOOTH NAVIGATION
    ====================================================== */

    document
      .querySelectorAll(
        ".ka-nav-inner a, .ka-footer-links a"
      )
      .forEach((link) => {

        link.addEventListener(
          "click",
          (event) => {

            const href =
              link.getAttribute(
                "href"
              );


            if(
              !href ||
              !href.startsWith("#")
            ){

              return;

            }


            const target =
              document.querySelector(
                href
              );


            if(!target){
              return;
            }


            event.preventDefault();


            target.scrollIntoView({
              behavior:
                reducedMotion
                  ? "auto"
                  : "smooth",
              block:"start"
            });


            history.replaceState(
              null,
              "",
              href
            );

          }
        );

      });


    /* =====================================================
       INITIALIZE
    ====================================================== */

    showSlide(0);

    startAutoPlay();
