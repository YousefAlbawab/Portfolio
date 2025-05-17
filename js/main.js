// Navigation functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Add active class to nav items on scroll
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Fetch GitHub projects
async function fetchGitHubProjects() {
    try {
        const username = 'YousefAlbawab';
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub repositories');
        }
        
        const data = await response.json();
        displayProjects(data);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        displayFallbackProjects();
    }
}

// Display GitHub projects
function displayProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = '';

    // Filter out forked projects and sort by last updated
    const filteredProjects = projects
        .filter(project => !project.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Display up to 6 projects
    const projectsToDisplay = filteredProjects.slice(0, 6);

    if (projectsToDisplay.length === 0) {
        displayFallbackProjects();
        return;
    }

    projectsToDisplay.forEach(project => {
        const projectCard = createProjectCard(
            project.name,
            project.description || `A ${project.language || 'coding'} project.`,
            project.language,
            project.html_url,
            project.homepage
        );
        projectsGrid.appendChild(projectCard);
    });
}

// Display fallback projects if GitHub API fails
function displayFallbackProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = '';

    // Example projects based on common CS student projects
    const fallbackProjects = [
        {
            name: 'Personal Portfolio',
            description: 'A responsive portfolio website showcasing my skills and projects.',
            languages: ['HTML', 'CSS', 'JavaScript'],
            repoUrl: 'https://github.com/YousefAlbawab'
        },
        {
            name: 'Data Analysis Tool',
            description: 'A Python application for analyzing and visualizing datasets using Pandas and NumPy.',
            languages: ['Python', 'Pandas', 'NumPy'],
            repoUrl: 'https://github.com/YousefAlbawab'
        },
        {
            name: 'Task Manager API',
            description: 'A RESTful API for managing tasks built with Django REST framework.',
            languages: ['Python', 'Django', 'SQL'],
            repoUrl: 'https://github.com/YousefAlbawab'
        }
    ];

    fallbackProjects.forEach(project => {
        const projectCard = createProjectCard(
            project.name,
            project.description,
            project.languages.join(', '),
            project.repoUrl
        );
        projectsGrid.appendChild(projectCard);
    });
}

// Create project card element
function createProjectCard(name, description, language, repoUrl, demoUrl = null) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';

    // Format project name for display (remove dashes and capitalize)
    const formattedName = name
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Create language tags
    let languageTags = '';
    if (language) {
        const languages = Array.isArray(language) ? language : [language];
        languageTags = languages.map(lang => {
            if (lang) {
                return `<span class="project-tag">${lang}</span>`;
            }
            return '';
        }).join('');
    }

    // Create links
    let linksHtml = `<a href="${repoUrl}" target="_blank"><i class="fab fa-github"></i> View Code</a>`;
    if (demoUrl) {
        linksHtml += `<a href="${demoUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
    }

    // Create card content
    projectCard.innerHTML = `
        <div class="project-image">
            <i class="fas fa-code"></i>
        </div>
        <div class="project-content">
            <h3 class="project-title">${formattedName}</h3>
            <p class="project-description">${description}</p>
            <div class="project-tags">
                ${languageTags}
            </div>
            <div class="project-links">
                ${linksHtml}
            </div>
        </div>
    `;

    return projectCard;
}

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would normally send the form data to a server
        // For now, we'll just show an alert
        alert(`Thank you ${name} for your message! I will get back to you at ${email} as soon as possible.`);
        
        // Reset the form
        contactForm.reset();
    });
}

// Add scroll animation for smooth section transitions
const scrollOffset = 70; // Height of the fixed navbar

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - scrollOffset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Fetch GitHub projects
    fetchGitHubProjects();
    
    // Set active nav link on page load
    const currentSection = window.location.hash || '#home';
    document.querySelector(`a[href="${currentSection}"]`)?.classList.add('active');
});

// Add scroll to top button functionality
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

// Style the button
scrollTopBtn.style.position = 'fixed';
scrollTopBtn.style.bottom = '20px';
scrollTopBtn.style.right = '20px';
scrollTopBtn.style.zIndex = '99';
scrollTopBtn.style.border = 'none';
scrollTopBtn.style.outline = 'none';
scrollTopBtn.style.backgroundColor = 'var(--primary-color)';
scrollTopBtn.style.color = 'white';
scrollTopBtn.style.cursor = 'pointer';
scrollTopBtn.style.padding = '15px';
scrollTopBtn.style.borderRadius = '50%';
scrollTopBtn.style.fontSize = '18px';
scrollTopBtn.style.display = 'none';
scrollTopBtn.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
scrollTopBtn.style.transition = 'all 0.3s ease';

// Show/hide the button based on scroll position
window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

// Scroll to top when button is clicked
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});