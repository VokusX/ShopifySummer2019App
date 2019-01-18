// David Voicu, 2019
// This is the main file in charge of handling all of the logic and processes for the app.

import React, { Component } from "react";
import "./waste.css";

//import Font Awesome so that we can get the search icon and the favourites icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

//add them to the library so that we can call them later
library.add(faStar);
library.add(faSearch);

class Waste extends Component {
  //start by defining some variables in the constructor for the component
  constructor(props) {
    super(props);

    this.state = {
      //keyword will store the user's input from the search bar
      //one thing to keep in mind is that the DOM renders everytime we update a state,
      //which means that when the user types in the input bar it will re-render the DOM and
      //make an API call with whatever they just typed, which we dont want, so we need another variable
      //to track when they submit, and use that for searching
      searchText: "",
      keyword: "",

      //the raw JSON from the API
      apiData: [],
      //favourites that the user chooses
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

  updateSearchText = event => {
    this.setState({ searchText: event.target.value });
  };

  submit = event => {
    this.setState({ keyword: this.state.searchText });
  };

  //this function will get the results for us
  results = event => {
    //make sure we have a keyword to search by
    if (this.state.keyword !== "") {
      let results = [];
      let key = this.state.keyword;
      this.state.apiData.forEach(function(item) {
        if (item.keywords.includes(key.toLowerCase())) {
          results.push(item);
        }
      });
      console.log(this.state.keyword);
    } else return <div />;
  };

  render() {
    return (
      <div className="wasteApp">
        <div className="header">
          <h1>Toronto Waste Lookup</h1>
        </div>

        <div className="searchDiv">
          <input
            type="text"
            className="searchBar"
            placeholder="Test"
            onChange={event => this.updateSearchText(event)}
            onKeyDown={event => {
              if (event.key === "Enter") {
                this.submit();
              }
            }}
          />
          <button
            type="button"
            className="searchBtn"
            id="searchBtn"
            onClick={this.submit}
          >
            <i className="fa fa-search fa-3x" />
          </button>
        </div>

        <div className="resultsDiv">{this.results()}</div>
      </div>
    );
  }
}

export default Waste;
