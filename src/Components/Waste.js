// David Voicu, 2019
// This is the main file in charge of handling all of the logic and processes for the app.

import React, { Component } from "react";
import "./Waste.css";
import Result from "./Result.js";
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

  isFavourite(item) {
    const { favourites } = this.state;

    if (favourites.includes(item)) {
      return true;
    } else return false;
  }

  updateFavourite(item) {
    const { favourites } = this.state;

    let favouritedResults = favourites;

    if (favourites.includes(item)) {
      favouritedResults = favourites.filter(result => {
        return item !== result;
      });
    } else favouritedResults.push(item);

    this.setState({ favourites: favouritedResults });
  }

  renderFavouriteBar() {
    const { favourites } = this.state;

    if (favourites.length > 0) {
      return (
        <div className="bottomStickyContainer">
          <h2>Favourites</h2>
          {favourites.map(result => (
            <Result
              isFavourited={this.isFavourite(result)}
              onClick={() => {
                this.updateFavourite(result);
              }}
              title={result.title}
              body={result.body}
            />
          ))}
        </div>
      );
    } else return <div />;
  }

  render() {
    const { results, loading } = this.state;

    const resultsMarkup = results.map(result => (
      <Result
        isFavourited={this.isFavourite(result)}
        onClick={() => {
          this.updateFavourite(result);
        }}
        title={result.title}
        body={result.body}
      />
    ));

    const headerMarkup = (
      <div className="header">
        <h1>Toronto Waste Lookup</h1>
      </div>
    );

    if (loading)
      return (
        <div>
          {headerMarkup}
          <div className="loading">
            <h3>Loading...</h3>
          </div>
        </div>
      );

    return (
      <div>
        {headerMarkup}
        <form
          className="searchDiv"
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

        {resultsMarkup}
        {this.renderFavouriteBar()}
      </div>
    );
  }
}

export default Waste;
