document.addEventListener("DOMContentLoaded", () => {
  const postsTableBody = document.querySelector("#postsTable tbody");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const pageIndicator = document.getElementById("pageIndicator");
  const searchInput = document.getElementById("searchInput");

  let currentPage = 1;
  const itemsPerPage = 20;
  let totalPages = 1;
  let allPosts = [];

  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => {
      console.log("Fetch response status:", response.status);
      return response.json();
    })
    .then((data) => {
      allPosts = data;
      console.log("Fetched data:", allPosts);
      totalPages = Math.ceil(allPosts.length / itemsPerPage);
      displayPage(currentPage);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      postsTableBody.innerHTML = `<tr><td colspan="3">Unable to fetch data</td></tr>`;
    });

  function displayPage(pageNumber) {
    console.log("Displaying page:", pageNumber);
    postsTableBody.innerHTML = "";
    let filteredPosts = filterPosts(searchInput.value);
    totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const postsForCurrentPage = filteredPosts.slice(startIndex, endIndex);

    postsForCurrentPage.forEach((post) => {
      const row = document.createElement("tr");
      const idCell = document.createElement("td");
      idCell.textContent = post.id;
      const titleCell = document.createElement("td");
      titleCell.textContent = post.title;
      const bodyCell = document.createElement("td");
      bodyCell.textContent = post.body;
      row.appendChild(idCell);
      row.appendChild(titleCell);
      row.appendChild(bodyCell);
      postsTableBody.appendChild(row);
    });

    pageIndicator.textContent = `Page ${pageNumber} of ${totalPages}`;
    prevButton.disabled = pageNumber === 1;
    nextButton.disabled = pageNumber === totalPages;
  }

  function filterPosts(searchTerm) {
    const lowerCaseTerm = searchTerm.toLowerCase().trim();
    if (!lowerCaseTerm) return allPosts;
    return allPosts.filter((post) => {
      const idStr = post.id.toString();
      const titleStr = post.title.toLowerCase();
      const bodyStr = post.body.toLowerCase();
      return (
        idStr.includes(lowerCaseTerm) ||
        titleStr.includes(lowerCaseTerm) ||
        bodyStr.includes(lowerCaseTerm)
      );
    });
  }

  prevButton.addEventListener("click", () => {
    console.log("Clicked Previous button. Current page before decrement:", currentPage);
    if (currentPage > 1) {
      currentPage--;
      displayPage(currentPage);
    }
  });

  nextButton.addEventListener("click", () => {
    console.log("Clicked Next button. Current page before increment:", currentPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayPage(currentPage);
    }
  });

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    displayPage(currentPage);
  });
});
