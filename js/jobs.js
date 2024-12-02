// Fetch jobs once the page is loaded
document.addEventListener("DOMContentLoaded", fetchJobs);

// Track active filters
let activeFilters = new Set();
let jobs = [];

// Fetch job data from a JSON file
async function fetchJobs() {
  try {
    const response = await fetch("/data.json");
    // `await` pauses execution until the fetch is done and data is returned.
    if (!response.ok) throw new Error("Failed to load jobs");
    jobs = await response.json();
    renderJobs();
  } catch (error) {
    // `console.error` logs errors to the browser console.
    console.error("Error fetching jobs:", error);
  }
}

// Create job card HTML structure
function createJobCard(job) {
 
  const tags = [job.role, job.level, ...job.languages, ...job.tools];

  const tagsHtml = tags
    .map(
      (tag) => `
        <span class="badge tag filter-tag" data-tag="${tag}">${tag}</span>
    `
    )
    // `join('')` combines the array into a single string without commas.
    .join("");

  // Template literals (``) allow embedding variables (`${...}`) directly into strings.
  return `
        <div class="card mb-4 job-card">
            <div class="card-body">
                <div class="d-flex align-items-center head mb-3">
                    <img src="${job.logo}" alt="${
    job.company
  } logo" class="me-3" width="50" height="50">
                    <h5 class="card-title">${job.company}</h5>
                    ${
                      job.new ? '<span class="badge new mx-2">New!</span>' : ""
                    } 
                    ${
                      job.featured
                        ? '<span class="badge featured">Featured</span>'
                        : ""
                    }
                </div>
                <div class="d-flex jobs">
                <h4 class="heads">${job.position}</h4> 
                <div class="tools">${tagsHtml}</div>
                </div>
                <p class="text-muted mute">${job.postedAt} · ${
    job.contract
  } · ${job.location}</p>
            </div>
                <div class="bottom">
                <hr>
                <div>${tagsHtml}</div>
                </div>
        </div>
    `;
}

// Show job listings based on active filters
function renderJobs() {
  // Get the HTML element where job cards will be displayed.
  const jobListings = document.getElementById("job-listings");

  const filteredJobs = jobs.filter((job) => {
    // If no filters are selected, show all jobs.
    if (activeFilters.size === 0) return true;
    const jobTags = new Set([
      job.role,
      job.level,
      ...job.languages,
      ...job.tools,
    ]);
    // `every` checks if all active filters exist in the job's tags.
    return Array.from(activeFilters).every((filter) => jobTags.has(filter));
  });

  // Update the inner HTML of the container with the filtered jobs
  jobListings.innerHTML = filteredJobs.map(createJobCard).join("");
}

// Add a filter to the active filters set
function addFilter(filter) {
  activeFilters.add(filter);
  updateFilterBar();
  // Re-render the jobs with the new filters.
  renderJobs();
}

// Remove a filter from the active filters set
function removeFilter(filter) {
  activeFilters.delete(filter);
  updateFilterBar();
  // Re-render the jobs after removing the filter.
  renderJobs();
}

// Update the filter bar UI
function updateFilterBar() {
  const filterBar = document.getElementById("filter-bar");
  const filterTags = document.getElementById("filter-tags");

  if (activeFilters.size > 0) {
    // If there are active filters
    filterBar.style.display = "block"; // Show the filter bar
    filterTags.innerHTML = Array.from(activeFilters)
      .map(
        (filter) => `
            <span class="badge btn2">
                ${filter}
                <button type="button" class="btn-close close btn-close-white" aria-label="Close" data-filter="${filter}"></button> 
            </span>
        `
      )
      .join("");
  } else {
    // Hide the filter bar if there are no filters
    filterBar.style.display = "none";
  }
}

// Clear all active filters
document.getElementById("clear-filters").addEventListener("click", () => {
  activeFilters.clear();
  updateFilterBar();
  renderJobs();
});

// adding/removing filters when tags or close buttons are clicked
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("filter-tag")) {
    const filter = event.target.dataset.tag;
    addFilter(filter);
  }

  if (event.target.classList.contains("btn-close")) {
    const filter = event.target.dataset.filter;
    removeFilter(filter);
  }
});

