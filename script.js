// document.addEventListener("DOMContentLoaded",
(() => {
  const container = document.getElementById("job-search-widget-container");
  const previousButton = document.getElementById(
    "job-search-widget-previous-button"
  );
  const nextButton = document.getElementById("job-search-widget-next-button");
  const paginationText = document.getElementById(
    "job-search-widget-pagination"
  );
  const search = container.dataset.search;
  const query = search ? search : "snickare";
  let page = 1;
  let d;
  let c;

  const populateTable = (data) => {
    const tableBody = document.getElementById(
      "job-search-widget-container-table-body"
    );

    tableBody.innerHTML = "";

    data.slice(page * 5 - 5, page * 5).forEach((item) => {
      const row = document.createElement("tr");

      if (data.indexOf(item) % 2 !== 0) {
        row.style.backgroundColor = "#f2f2f2";
      }

      row.innerHTML = `
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;"><a>${item.headline}</a></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${item.duration.label}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${item.number_of_vacancies}</td>
      `;
      tableBody.appendChild(row);
    });

    const anchors = Array.from(tableBody.getElementsByTagName("a"));

    anchors.forEach((i) => {
      i.href = data[anchors.indexOf(i)].webpage_url;
    });

    paginationText.textContent = `Showing ${page * 5 - 4} to ${
      c ? (data.length < 5 ? data.length : page * 5) : data.length
    } of ${data.length} results`;
  };

  fetch(
    "https://jobsearch.api.jobtechdev.se/search?q=" +
      query +
      "&qfields=location&qfields=occupation&offset=0&limit=100&sort=relevance&municipality=uYRx_AdM_r4A&municipality=yR8g_7Jz_HBZ&municipality=v5y4_YPe_TMZ&municipality=zBmE_n6s_MnQ",
    {
      headers: {
        accept: "application/json",
        "x-feature-freetext-bool-method": "or",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      setInterval(() => {
        d = data.length / 5;
        c = Number.isInteger(d)
          ? page !== Math.floor(d)
          : page !== Math.floor(d) + 1;

        populateTable(data.hits);
      }, 1000);

      previousButton.addEventListener("click", () => {
        if (page !== 1) {
          page -= 1;
        }
      });
      nextButton.addEventListener("click", () => {
        if (c) {
          page += 1;
        }
      });
    })
    .catch((e) => {
      console.error(e);
      alert("An error occured while fetching data.");
    });
})();
// );
