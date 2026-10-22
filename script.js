
async function start() {
    const p = await fetch('portfolio.json').then(r => r.json());

    // Set page title and branding
    document.title = p.siteTitle;

    document.querySelector('#initials').textContent = p.initials;
    document.querySelector('#brand').textContent =
        p.name.split(' ')[0].toUpperCase() + '.DEV';

    // Set introduction and about section
    document.querySelector('#role').textContent = p.role;
    document.querySelector('#intro').textContent = p.intro;
    document.querySelector('#about-copy').textContent = p.about;

    // Set GitHub and email links
    document.querySelector('#github').href = p.github;

    document.querySelector('#email').textContent = p.email;
    document.querySelector('#email').href = 'mailto:' + p.email;

    // Set footer copyright
    document.querySelector('#footer').textContent =
        '© ' + new Date().getFullYear() + ' ' + p.name;

    // Render statistics
    document.querySelector('#stats').innerHTML = p.stats
        .map(s => `
            <div class="stat">
                <strong>${s[0]}</strong>
                <small>${s[1]}</small>
            </div>
        `)
        .join('');

    // Render skills
    document.querySelector('#skills').innerHTML = p.skills
        .map(s => `
            <div class="skill">
                <i>${s[0]}</i>
                <b>${s[1]}</b>
                <small>${s[2]}</small>
            </div>
        `)
        .join('');

    // Render projects
    document.querySelector('#projects').innerHTML = p.projects
        .map(x => `
            <article class="project">
                <div>
                    <small>${x.type}</small>
                    <h3>${x.name}</h3>
                    <p>${x.description}</p>
                </div>

                <div>
                    <p class="impact">↗ ${x.impact}</p>

                    ${x.tags
                        .map(t => `<span class="tag">${t}</span>`)
                        .join('')}
                </div>
            </article>
        `)
        .join('');
}

// Run the function and handle errors
start().catch(error => {
    console.error('Error loading portfolio:', error);
});
