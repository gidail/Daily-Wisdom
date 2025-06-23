
document.addEventListener('DOMContentLoaded', function() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const loading = document.getElementById('loading');
    const shareBtn = document.getElementById('share-btn');

    // Fetch a random quote from the API
    async function fetchQuote() {
        try {
            // Show loading state
            showLoading();
            
            // Disable button during fetch
            newQuoteBtn.disabled = true;
            
            const response = await fetch('https://api.quotable.io/random');
            
            if (!response.ok) {
                throw new Error('Failed to fetch quote');
            }
            
            const data = await response.json();
            
            // Small delay for better UX
            setTimeout(() => {
                displayQuote(data.content, data.author);
                newQuoteBtn.disabled = false;
            }, 500);
            
        } catch (error) {
            console.error('Error fetching quote:', error);
            
            // Show fallback quote on error
            setTimeout(() => {
                displayQuote(
                    "The only way to do great work is to love what you do.",
                    "Steve Jobs"
                );
                newQuoteBtn.disabled = false;
            }, 500);
        }
    }

    // Display the quote with animation
    function displayQuote(text, author) {
        // Hide loading
        loading.style.display = 'none';
        
        // Set the quote content
        quoteText.textContent = `"${text}"`;
        quoteAuthor.textContent = author;
        
        // Remove existing classes
        quoteText.classList.remove('show');
        quoteAuthor.classList.remove('show');
        
        // Trigger reflow to restart animation
        void quoteText.offsetWidth;
        
        // Add show classes for animation
        quoteText.classList.add('show');
        quoteAuthor.classList.add('show');
    }

    // Show loading state
    function showLoading() {
        loading.style.display = 'block';
        quoteText.classList.remove('show');
        quoteAuthor.classList.remove('show');
    }

    // Add click event listener to the button
    newQuoteBtn.addEventListener('click', fetchQuote);

    

    // Add share functionality
    shareBtn.addEventListener('click', function() {
        const quote = quoteText.textContent;
        const author = quoteAuthor.textContent;
        
        if (quote && author) {
            const shareText = `${quote} ${author} - Daily Wisdom`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Daily Wisdom',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                const textarea = document.createElement('textarea');
                textarea.value = shareText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                // Visual feedback
                const originalText = shareBtn.textContent;
                shareBtn.textContent = 'Copied!';
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                }, 1500);
            }
        }
    });

    // Load initial quote
    fetchQuote();

    // Update date and time
    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const dateTimeString = now.toLocaleDateString('en-US', options);
        document.getElementById('datetime').textContent = dateTimeString;
    }

    // Update time immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Add some interactive sticker animations
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach((sticker, index) => {
        sticker.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        sticker.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });

        // Add random rotation and position variation
        const randomDelay = Math.random() * 3;
        const randomRotation = Math.random() * 20 - 10;
        sticker.style.animationDelay = `${randomDelay}s`;
        sticker.style.transform = `rotate(${randomRotation}deg)`;
    });

    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            if (!newQuoteBtn.disabled) {
                fetchQuote();
            }
        }
    });
});
