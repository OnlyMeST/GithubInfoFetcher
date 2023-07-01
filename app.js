const username = prompt('Enter GitHub username:');

fetch(`https://api.github.com/users/${username}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user profile.');
    }
    return response.json();
  })
  .then(data => {
    const profileContainer = document.getElementById('profile');
    const profileTemplate = `
      <h2>${data.name}</h2>
      <img src="${data.avatar_url}" alt="Profile Picture" />
      <p>${data.bio}</p>
      <p>Followers: ${data.followers}</p>
      <p>Following: ${data.following}</p>
      <p>Public Repositories: ${data.public_repos}</p>
    `;
    profileContainer.innerHTML = profileTemplate;
  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch(`https://api.github.com/users/${username}/repos`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user repositories.');
    }
    return response.json();
  })
  .then(data => {
    const repositoriesContainer = document.getElementById('repositories');
    const repositoriesTemplate = `
      <h2>Repositories</h2>
      <ul>
        ${data.map(repo => `<li>${repo.name}</li>`).join('')}
      </ul>
    `;
    repositoriesContainer.innerHTML = repositoriesTemplate;

    fetch(`https://api.github.com/users/${username}/events`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user contributions.');
        }
        return response.json();
      })
      .then(events => {
        const pushEvents = events.filter(event => event.type === 'PushEvent');
        const totalContributions = pushEvents.length;
        const averageContributionsPerWeek = totalContributions / 52;

        const contributionsContainer = document.getElementById('contributions');
        const contributionsTemplate = `
          <h2>Contributions</h2>
          <p>Total Contributions last year: ${totalContributions}</p>
          <p>Average Contributions per Week: ${averageContributionsPerWeek.toFixed(2)}</p>
        `;
        contributionsContainer.innerHTML = contributionsTemplate;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  })
  .catch(error => {
    console.error('Error:', error);
  });
