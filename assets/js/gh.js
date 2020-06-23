(() => {
  const repos = [...document.getElementsByClassName("item-repo")].map((e) => ({
    id: e.id,
    forks: e.getElementsByClassName("forks")[0],
    license: e.getElementsByClassName("license")[0],
    stars: e.getElementsByClassName("stars")[0],
    repo: e.getElementsByClassName("repo")[0].getElementsByTagName('a')[0],  
    e
  }));
  repos.map((e) =>
    fetch(`https://api.github.com/repos/${e.id}`)
      .then((data) => data.json())
      .then((data) => {
        if (data) {
          const { forks_count, stargazers_count, license, full_name, html_url } = data;
          const forksElement = document.createElement("p");
          const starsElement = document.createElement("p");
          const licenseElement = document.createElement("p");
          const repoElement = document.createElement("p")

          forksElement.innerText = forks_count;
          starsElement.innerText = stargazers_count;
          licenseElement.innerText = license.name;
          repoElement.innerText = full_name;

          e.license.appendChild(licenseElement);
          e.stars.appendChild(starsElement);
          e.forks.appendChild(forksElement);
          e.repo.appendChild(repoElement);
          e.repo.href = html_url;

          e.e.removeAttribute("style");
        }
      })
  );
})();
