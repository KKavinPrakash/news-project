document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const newsContainer = document.getElementById('news-container');
    const loading = document.getElementById('loading');

    async function fetchNews(category = '') {
        loading.style.display = 'block';
        newsContainer.innerHTML = '';
        try {
            const apiKey = "Jy49q0kaluuDnEOsLrbFdVoI_GAtdffZsVI5wO-JO15Z_bpM";
            let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;
            if (category) url += `&category=${category}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            displayNews(data.news);
        } catch (error) {
            console.error('Fetch error:', error);
            newsContainer.innerHTML = '<p>Failed to load news. Please try again later.</p>';
        } finally {
            loading.style.display = 'none';
        }
    }

    function displayNews(articles) {
        newsContainer.innerHTML = articles.map(article => `
            <div class="news-card">
                <img src="${article.image || 'default-thumbnail.jpg'}" alt="News thumbnail">
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        `).join('');
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-value');
            fetchNews(category);
        });
    });

    // Fetch default news
    fetchNews();
});
