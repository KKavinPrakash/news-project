document.addEventListener('DOMContentLoaded', () => {
    const regionOptions = document.getElementById('region-options');
    const categoryOptions = document.getElementById('category-options');
    const newsContainer = document.getElementById('news-container');
    const loading = document.getElementById('loading');
    const header = document.querySelector('header');

    let selectedRegion = 'world';
    let selectedCategory = '';

    async function fetchNews(region = 'world', category = '') {
        loading.style.display = 'block';
        newsContainer.innerHTML = '';
        try {
            const apiKey = "Jy49q0kaluuDnEOsLrbFdVoI_GAtdffZsVI5wO-JO15Z_bpM";
            let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;
            if (region !== 'world') url += `&country=${region}`;
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

    // Handle region selection
    regionOptions.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (event) => {
            selectedRegion = event.target.value;
            fetchNews(selectedRegion, selectedCategory);
            animateDropdown(event.target.closest('.dropdown'));
        });
    });

    // Handle category selection
    categoryOptions.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (event) => {
            selectedCategory = event.target.value;
            fetchNews(selectedRegion, selectedCategory);
            animateDropdown(event.target.closest('.dropdown'));
        });
    });

    // Animation function for dropdowns
    function animateDropdown(dropdown) {
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        dropdownContent.classList.add('animate');
        setTimeout(() => {
            dropdownContent.classList.remove('animate');
        }, 500); // Duration of animation
    }

    // Add scroll event listener to hide header on scroll down and show on scroll up
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop) {
            header.style.transform = 'translateY(-100%)'; // Hide header on scroll down
        } else {
            header.style.transform = 'translateY(0)'; // Show header on scroll up
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Add click event listener for dropdowns to trigger animations
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const button = dropdown.querySelector('.dropbtn');
        button.addEventListener('click', () => {
            dropdown.querySelector('.dropdown-content').classList.toggle('show');
            animateDropdown(dropdown);
        });
    });

    // Initial fetch
    fetchNews();
});
