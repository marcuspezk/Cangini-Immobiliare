// gallery-slider.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementi principali
    const slides = document.querySelectorAll('.slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    const thumbnailsWrapper = document.querySelector('.thumbnails-wrapper');

    // Aggiungi frecce di navigazione allo slideshow principale
    const mainSlideshow = document.querySelector('.main-slideshow');
    const slidePrevArrow = document.createElement('button');
    slidePrevArrow.className = 'slide-nav-arrow slide-nav-prev';
    slidePrevArrow.innerHTML = '&lt;';
    slidePrevArrow.setAttribute('aria-label', 'Immagine precedente');

    const slideNextArrow = document.createElement('button');
    slideNextArrow.className = 'slide-nav-arrow slide-nav-next';
    slideNextArrow.innerHTML = '&gt;';
    slideNextArrow.setAttribute('aria-label', 'Immagine successiva');

    mainSlideshow.appendChild(slidePrevArrow);
    mainSlideshow.appendChild(slideNextArrow);

    // Variabili per touch events
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let thumbsTouchStartX = 0;
    let thumbsTouchEndX = 0;

    // Variabili di stato
    let currentIndex = 0;
    let thumbnailWidth = thumbnails[0].offsetWidth + 10; // Larghezza + margin
    let visibleThumbnails = Math.floor(document.querySelector('.thumbnails-wrapper').offsetWidth / thumbnailWidth);
    let scrollPosition = 0;

    // Funzione per gestire lo swipe dello slideshow principale
    function handleMainSlideshowSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Assicurati che il gesto sia più orizzontale che verticale
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Definisci una soglia minima per considerare il gesto come swipe
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe da sinistra a destra -> immagine precedente
                    navigateSlide('prev');
                } else {
                    // Swipe da destra a sinistra -> immagine successiva
                    navigateSlide('next');
                }
            }
        }
    }

    // Funzione per gestire lo swipe delle anteprime
    function handleThumbnailsSwipe() {
        const diffX = thumbsTouchEndX - thumbsTouchStartX;
        
        // Definisci una soglia minima per considerare il gesto come swipe
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe da sinistra a destra -> anteprime precedenti
                scrollThumbnails('prev');
            } else {
                // Swipe da destra a sinistra -> anteprime successive
                scrollThumbnails('next');
            }
        }
    }

    // Inizializzazione
    updateSlide(0);

    // Aggiunta eventi touch per lo slideshow principale
    mainSlideshow.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    mainSlideshow.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleMainSlideshowSwipe();
    }, { passive: true });

    // Aggiunta eventi touch per le anteprime
    thumbnailsWrapper.addEventListener('touchstart', function(e) {
        thumbsTouchStartX = e.changedTouches[0].screenX;
        // Previeni lo scroll verticale durante lo swipe orizzontale
        e.preventDefault();
    }, { passive: false });

    thumbnailsWrapper.addEventListener('touchend', function(e) {
        thumbsTouchEndX = e.changedTouches[0].screenX;
        handleThumbnailsSwipe();
    }, { passive: true });

    // Event listeners per click
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateSlide(index);
        });
    });

    // Navigazione frecce per le anteprime
    prevArrow.addEventListener('click', function() {
        scrollThumbnails('prev');
    });

    nextArrow.addEventListener('click', function() {
        scrollThumbnails('next');
    });

    // Navigazione frecce per lo slideshow principale
    slidePrevArrow.addEventListener('click', function() {
        navigateSlide('prev');
    });

    slideNextArrow.addEventListener('click', function() {
        navigateSlide('next');
    });

    // Funzione per aggiornare lo slide attivo
    function updateSlide(index) {
        // Rimuovi classe active da tutti gli slide e thumbnails
        slides.forEach(slide => slide.classList.remove('active'));
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Aggiungi classe active allo slide e thumbnail corrente
        slides[index].classList.add('active');
        thumbnails[index].classList.add('active');
        
        // Assicurati che la thumbnail sia visibile
        ensureThumbnailIsVisible(index);
        
        // Aggiorna l'indice corrente
        currentIndex = index;
    }

    // Funzione per assicurarsi che la thumbnail attiva sia visibile
    function ensureThumbnailIsVisible(index) {
        const thumbPosition = index * thumbnailWidth;
        const containerWidth = document.querySelector('.thumbnails-wrapper').offsetWidth;
        const totalWidth = thumbnails.length * thumbnailWidth;
        
        // Se la thumbnail è fuori dalla visualizzazione a sinistra
        if (thumbPosition < scrollPosition) {
            scrollPosition = Math.max(0, thumbPosition - (thumbnailWidth / 2));
            updateThumbnailsPosition();
        }
        
        // Se la thumbnail è fuori dalla visualizzazione a destra
        else if (thumbPosition + thumbnailWidth > scrollPosition + containerWidth) {
            // Calcola la nuova posizione mantenendo la thumbnail selezionata centrata se possibile
            const newPosition = thumbPosition - containerWidth + thumbnailWidth + (thumbnailWidth / 2);
            scrollPosition = Math.min(totalWidth - containerWidth, Math.max(0, newPosition));
            updateThumbnailsPosition();
        }
    }

    // Funzione per scorrere le thumbnails
    function scrollThumbnails(direction) {
        const containerWidth = document.querySelector('.thumbnails-wrapper').offsetWidth;
        const maxScrollPosition = Math.max(0, thumbnails.length * thumbnailWidth - containerWidth);
        
        if (direction === 'prev') {
            scrollPosition = Math.max(0, scrollPosition - thumbnailWidth);
        } else {
            scrollPosition = Math.min(maxScrollPosition, scrollPosition + thumbnailWidth);
        }
        
        updateThumbnailsPosition();
    }

    // Funzione per navigare tra le slide
    function navigateSlide(direction) {
        let newIndex;
        
        if (direction === 'prev') {
            newIndex = (currentIndex - 1 + slides.length) % slides.length;
        } else {
            newIndex = (currentIndex + 1) % slides.length;
        }
        
        updateSlide(newIndex);
    }

    // Funzione per aggiornare la posizione delle thumbnails
    function updateThumbnailsPosition() {
        thumbnailsContainer.style.transform = `translateX(-${scrollPosition}px)`;
    }

    // Gestione resize della finestra
    window.addEventListener('resize', function() {
        // Ricalcola le dimensioni
        thumbnailWidth = thumbnails[0].offsetWidth + 10;
        visibleThumbnails = Math.floor(document.querySelector('.thumbnails-wrapper').offsetWidth / thumbnailWidth);
        
        // Assicurati che la thumbnail attiva sia ancora visibile
        ensureThumbnailIsVisible(currentIndex);
        
        // Verifica che la posizione di scorrimento sia ancora valida dopo il ridimensionamento
        const containerWidth = document.querySelector('.thumbnails-wrapper').offsetWidth;
        const maxScrollPosition = Math.max(0, thumbnails.length * thumbnailWidth - containerWidth);
        scrollPosition = Math.min(scrollPosition, maxScrollPosition);
        updateThumbnailsPosition();
    });

    // Aggiunta navigazione con tastiera
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            navigateSlide('prev');
        } else if (e.key === 'ArrowRight') {
            navigateSlide('next');
        }
    });

    // Precarica le immagini per una transizione più fluida
    function preloadImages() {
        slides.forEach(slide => {
            const bgImg = getComputedStyle(slide.querySelector('.slide-image')).backgroundImage;
            const imgUrl = bgImg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            
            if (imgUrl !== 'none') {
                const img = new Image();
                img.src = imgUrl;
            }
        });
    }

    // Avvia il precaricamento delle immagini
    preloadImages();
});