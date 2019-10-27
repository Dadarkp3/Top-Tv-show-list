import api from "./api";

class Api {
  constructor() {
    this.getTvShows("");
    this.formEl = document.getElementById("tvshow-form");
    this.listEl = document.getElementById("tvshow-list");
    this.inputEl = document.querySelector("input");
    this.errorEl = document.getElementById("error");
    this.registerHandlers();
  }

  registerHandlers() {
    this.formEl.onsubmit = (event) => this.searchTvShows(event);
  }

  searchTvShows(event) {
    event.preventDefault();
    this.getTvShows(this.inputEl.value);
    this.render();
  }

  async getTvShows(query) {
    this.loading(true);
    try {
      let url = `/search/shows?q=${query.toLowerCase()}`;
      if (query.length === 0) url = "shows";
      let response = await api.get(url);
      this.tvShows = response.data;
      if (this.tvShows.length === 0) {
        this.error();
      } else {
        this.render();
      }
    } catch (err) {
      console.warn("Error na Api:" + err);
    }
    this.loading(false);
  }

  error() {
    this.listEl.innerHTML = "";
    let errorEl = document.createElement("li");
    errorEl.appendChild(
      document.createTextNode(
        "Ops! Couldn't find a awesome show for your query..."
      )
    );
    this.errorEl.appendChild(errorEl);
  }

  render() {
    this.errorEl.innerHTML = "";
    this.listEl.innerHTML = "";
    this.tvShows.forEach((tvshow) => {
      let {
        name,
        status,
        url,
        image: { medium }
      } = tvshow.show !== undefined ? tvshow.show : tvshow;
      let itemEl = document.createElement("li");

      let imgEl = document.createElement("img");
      imgEl.setAttribute("src", medium);

      let informationEl = document.createElement("div");
      informationEl.classList.add("information");

      let nameEl = document.createElement("h2");
      nameEl.appendChild(document.createTextNode(name));

      let statusEl = document.createElement("p");
      statusEl.appendChild(document.createTextNode(`Status: ${status}`));

      informationEl.appendChild(nameEl);
      informationEl.appendChild(statusEl);

      let linkEl = document.createElement("a");
      linkEl.href = url;
      linkEl.appendChild(informationEl);
      itemEl.appendChild(imgEl);
      itemEl.appendChild(linkEl);
      this.listEl.appendChild(itemEl);
    });
  }

  loading(loading) {
    let loadDivEl = document.getElementById("loading");
    if (loading) {
      let loadingEl = document.createElement("img");
      loadingEl.setAttribute("src", "assets/loading.svg");
      loadDivEl.appendChild(loadingEl);
    } else {
      loadDivEl.innerHTML = "";
    }
  }
}
new Api();
