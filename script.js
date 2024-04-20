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
  const query = search ? search : "blablabla";
  let page = 1;
  let d;
  let c;
  let _offset = 10;

  const populateTable = (data) => {
    const tableBody = document.getElementById(
      "job-search-widget-container-table-body"
    );

    tableBody.innerHTML = "";

    data.slice(page * 10 - 10, page * 10).forEach((item) => {
      const row = document.createElement("tr");

      if (data.indexOf(item) % 2 === 0) {
        row.style.backgroundColor = "#f2f2f2";
      }

      row.innerHTML = `
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;"><a target="_blank">${item.headline}</a></td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${item.duration.label}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${item.number_of_vacancies}</td>
      `;
      tableBody.appendChild(row);
    });

    const anchors = Array.from(tableBody.getElementsByTagName("a"));

    anchors.forEach((i) => {
      i.href = data[anchors.indexOf(i)].webpage_url;
    });

    paginationText.textContent = `Showing ${page * 10 - 9} to ${
      c ? (data.length < 10 ? data.length : page * 10) : data.length
    } of ${data.total.value} results`;
  };
  let qq = ""
  if ( query != "blablabla" ) { qq = "q=" + query + "&"; }

  fetch(
    "https://jobsearch.api.jobtechdev.se/search?" +
      qq +
      "qfields=location&qfields=occupation&offset=" + _offset + "&limit=10&sort=relevance&municipality=uYRx_AdM_r4A&municipality=yR8g_7Jz_HBZ&municipality=v5y4_YPe_TMZ&municipality=zBmE_n6s_MnQ",
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
        d = data.total.value / 10;
        c = Number.isInteger(d)
          ? page !== Math.floor(d)
          : page !== Math.floor(d) + 1;

        populateTable(data.hits);
      }, 1000);

      previousButton.addEventListener("click", () => {
        if (page !== 1) {
          page -= 1;
          _offset -= 10;
        }
      });
      nextButton.addEventListener("click", () => {
        if (c) {
          page += 1;
          _offset += 10;
        }
      });
    })
    .catch((e) => {
      console.error(e);
      alert("An error occured while fetching data.");
    });
})();
// );
