// David Voicu, 2019
// This is the main file in charge of handling all of the logic and processes for the app.

import React, { Component } from "react";
import "./waste.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSearch } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";

library.add(faStar);
library.add(faSearch);

class Waste extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitAction = this.handleSubmitAction.bind(this);

    this.state = {
      loading: true,
      keyword: "",
      apiData: [],
      results: [],
      favourites: []
    };
  }

  // componentDidMount() is invoked once the component is initialized, but before its rendered, so we should make our API call here
  // The function takes the data from the API and converts it to a JSON object to be put into the array we created
  componentDidMount() {
    fetch(
      "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000"
    )
      .then(res => res.json())
      .then(apiData => this.setState({ apiData, loading: false }));
  }

  updateKeyword(e) {
    this.setState({ keyword: e.target.value });
  }

  handleSubmitAction() {
    const { keyword, apiData } = this.state;

    if (keyword === "") {
      this.setState({ results: [] });
      return;
    }

    const filteredResults = apiData.filter(result => {
      const lowercased = result.keywords.toLowerCase();
      return (
        lowercased.includes(keyword.toLowerCase()) ||
        result.title.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    this.setState({ results: filteredResults });
  }

  isFavourited(item) {
    const { favourites } = this.state;

    if (favourites.includes(item)) {
      return "#23975e";
    } else return "#bdbdbd";
  }

  updateFavourite(item) {
    const { favourites } = this.state;

    let filteredResults = favourites;

    if (favourites.includes(item)) {
      filteredResults = favourites.filter(result => {
        return item !== result;
      });
    } else filteredResults.push(item);

    this.setState({ favourites: filteredResults });
  }

  favouriteBar() {
    const { favourites } = this.state;

    if (favourites.length > 0) {
      return (
        <div className="bottomStickyContainer">
          <h2>Favourites</h2>
          {favourites.map((result, index) => (
            <div key={index} className="favTile">
              <div className="bottomFavStar">
                <FontAwesomeIcon
                  size="1x"
                  icon="star"
                  color={this.isFavourited(result)}
                  onClick={() => this.updateFavourite(result)}
                />
              </div>
              <div className="favResultTitle">{result.title}</div>
              <div className="favResultBody">{parse(parse(result.body))}</div>
            </div>
          ))}
        </div>
      );
    } else return <div />;
  }

  render() {
    const { results, loading } = this.state;
    const resultsMarkup = results.map((result, index) => (
      <div key={index} className="resultTile">
        <div className="favStar">
          <FontAwesomeIcon
            size="1x"
            icon="star"
            color={this.isFavourited(result)}
            onClick={() => this.updateFavourite(result)}
          />
        </div>
        <div className="resultTitle">{result.title}</div>
        <div className="resultBody">{parse(parse(result.body))}</div>
      </div>
    ));
    if (loading) {
      return (
        <div className="header">
          <h1>Toronto Waste Lookup</h1>
          <div className="loading">
            <h3>Loading...</h3>
          </div>
        </div>
      );
    } else {
      return (
        <div className="wasteApp">
          <div className="header">
            <h1>Toronto Waste Lookup</h1>
          </div>

          <div className="searchDiv">
            <form
              onSubmit={e => {
                this.handleSubmitAction();
                e.preventDefault();
              }}
            >
              <input
                type="text"
                className="searchBar"
                placeholder="Enter a search term"
                onChange={e => this.updateKeyword(e)}
              />
              <button
                type="submit"
                className="searchBtn"
                id="searchBtn"
                onClick={this.handleSubmitAction}
              >
                <i className="fa fa-search fa-3x" />
              </button>
            </form>
          </div>
          {resultsMarkup}
          {this.favouriteBar()}
        </div>
      );
    }
  }
}

export default Waste;
