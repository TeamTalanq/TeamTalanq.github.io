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
  let region1 = container.dataset.region;
  let region = region1 ? "&region=" + region1 : ""
  // console.log(region)
  let search = container.dataset.search;
  let query = search ? search : "blablabla";
  let page = 1;
  let d;
  let c;
  var intervalId = null;

  function clickNext(event) {
    if (c) {
      page += 1;
    }
  }

  function clickPrevious(event) {
    if (page !== 1) {
      page -= 1;
    }
  }

  const searchField = document.getElementById( "dataSearch" );
  if (searchField !== null ) {
    searchField.addEventListener("change", (e) => {
      if ( search !== e.target.value ) {
        search = e.target.value;
        query = search ? search : "blablabla";
        clearInterval(intervalId);
        previousButton.removeEventListener("click", clickPrevious);
        nextButton.removeEventListener("click", clickNext);
        page = 1;
        getData(query);
      }
    });
  }
  
  const populateTable = (data, value) => {
    const tableBody = document.getElementById(
      "job-search-widget-container-table-body"
    );
    if (tableBody == null ) return;
    tableBody.innerHTML = "";

    data.slice(page * 10 - 10, page * 10).forEach((item) => {
      const row = document.createElement("tr");

      if (data.indexOf(item) % 2 === 1) {
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
      c ? (value < 10 ? value : page * 10) : value
    } of ${value} results`;
  };
  
  getData = (query) => {
    let qq = ""
    if ( query != "blablabla" ) { qq = "q=" + query + "&"; }
    let q = ""
    if (region == "")
      q = "https://jobsearch.api.jobtechdev.se/search?municipality=zBmE_n6s_MnQ&municipality=v5y4_YPe_TMZ&municipality=yR8g_7Jz_HBZ&municipality=uYRx_AdM_r4A&" + qq 
            + "offset=0&limit=100&sort=relevance";
    else
      q = "https://jobsearch.api.jobtechdev.se/search?" + qq + "offset=0&limit=100&sort=relevance" + region;
    // console.log(q)
    fetch(
    q,
    {
      headers: {
        accept: "application/json",
        "x-feature-freetext-bool-method": "or",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      intervalId = setInterval(() => {
        d = data.total.value / 10;
        c = Number.isInteger(d)
          ? page !== Math.floor(d)
          : page !== Math.floor(d) + 1;
        populateTable(data.hits, data.total.value);
      }, 1000);

      previousButton.addEventListener("click", clickPrevious);
      nextButton.addEventListener("click", clickNext);
    })
    .catch((e) => {
      console.error(e);
      alert("An error occured while fetching data.");
    });
  };

  getData(query);

})();
// );


// https://jobsearch.api.jobtechdev.se/search?q=cnc&qfields=location&qfields=occupation&offset=0&limit=100&sort=relevance&municipality=uYRx_AdM_r4A&municipality=yR8g_7Jz_HBZ&municipality=v5y4_YPe_TMZ&municipality=zBmE_n6s_MnQ"