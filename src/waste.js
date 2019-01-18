// David Voicu, 2019
// This is the main file in charge of handling all of the logic and processes for the app.

import React, { Component } from "react";
import "./waste.css";

//import Font Awesome so that we can get the search icon and the favourites icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSearch } from "@fortawesome/free-solid-svg-icons";

//add them to the library so that we can call them later
library.add(faStar);
library.add(faSearch);

class Waste extends Component {
  //start by defining some variables in the constructor for the component
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);

    this.state = {
      keyword: "",
      apiData: [],
      results: [],
      fav: []
    };
  }

  //componentDidMount() is invoked once the component is initialized, but before its rendered, so we should make our API call here
  //the function takes the data from the API and converts it to a JSON object to be put into the array we created
  componentDidMount() {
    fetch(
      "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000"
    )
      .then(res => res.json())
      .then(apiData => this.setState({ apiData }));
  }

  updateKeyword(e) {
    this.setState({ keyword: e.target.value });
  }

  submit() {
    if (this.state.keyword !== "") {
      let filteredResults = [];
      let key = this.state.keyword;
      this.state.apiData.forEach(function(item) {
        if (item.keywords.includes(key.toLowerCase())) {
          filteredResults.push(item);
        }
      });
      this.setState({ results: filteredResults });
    } else this.setState({ results: [] });
  }

  render() {
    const { results } = this.state;
    const resultsMarkup = results.map((result, index) => (
      <div key={index} className="resultTile">
        <div className="favStar">
          <FontAwesomeIcon size="1x" icon="star" color="#000000" />
        </div>
      </div>
    ));

    return (
      <div className="wasteApp">
        <div className="header">
          <h1>Toronto Waste Lookup</h1>
        </div>

        <div className="searchDiv">
          <form
            onSubmit={e => {
              this.submit();
              e.preventDefault();
            }}
          >
            <input
              type="text"
              className="searchBar"
              placeholder="Test"
              onChange={e => this.updateKeyword(e)}
              // onKeyDown={event => {
              //   if (event.key === "Enter") {
              //     this.submit();
              //   }
              // }}
            />
            <button
              type="submit"
              className="searchBtn"
              id="searchBtn"
              onClick={this.submit}
            >
              <i className="fa fa-search fa-3x" />
            </button>
          </form>
        </div>
        {resultsMarkup}
      </div>
    );
  }
}

export default Waste;
