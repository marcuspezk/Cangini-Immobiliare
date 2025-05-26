// Funzione "Read More"

document.addEventListener('DOMContentLoaded', function() {
    // Funzione che si attiva solo se la larghezza dello schermo è <= 600px
    function setupReadMore() {
        const introText = document.querySelector('.intro.text');
        if (!introText) return; // Esce se l'elemento non esiste
        
        // Verifica se lo schermo è di dimensioni da smartphone
        if (window.innerWidth <= 600) {
            // Ottiene il contenuto originale se non è stato già salvato
            if (!introText.getAttribute('data-original-text')) {
                introText.setAttribute('data-original-text', introText.innerHTML);
            }
            
            const originalText = introText.getAttribute('data-original-text');
            const shortenedText = originalText.substring(0, 180) + '...'; // Mostra solo i primi 180 caratteri
            
            // Aggiunge il pulsante "Leggi di più" se non è già presente
            if (!document.getElementById('read-more-btn')) {
                introText.innerHTML = shortenedText;
                
                // Crea il pulsante
                const readMoreBtn = document.createElement('button');
                readMoreBtn.id = 'read-more-btn';
                readMoreBtn.className = 'read-more-btn';
                readMoreBtn.innerHTML = 'Leggi di più';
                
                // Aggiunge l'evento di click al pulsante
                readMoreBtn.addEventListener('click', function() {
                    if (this.innerHTML === 'Leggi di più') {
                        introText.innerHTML = originalText;
                        introText.appendChild(readMoreBtn);
                        this.innerHTML = 'Mostra meno';
                    } else {
                        introText.innerHTML = shortenedText;
                        introText.appendChild(readMoreBtn);
                        this.innerHTML = 'Leggi di più';
                    }
                });
                
                // Aggiunge il pulsante al DOM
                introText.appendChild(readMoreBtn);
            }
        } else {
            // Se lo schermo non è di dimensioni da smartphone, ripristina il testo originale
            if (introText.getAttribute('data-original-text')) {
                introText.innerHTML = introText.getAttribute('data-original-text');
            }
        }
    }
    
    // Esegue la funzione al caricamento della pagina
    setupReadMore();
    
    // Esegue la funzione anche quando si ridimensiona la finestra
    window.addEventListener('resize', setupReadMore);
});