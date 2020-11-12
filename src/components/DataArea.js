import React, { Component } from "react";
import DataTable from "./DataTable";
import Nav from "./Nav";
import API from "../utils/API";
import "../styles/DataArea.css";

export default class DataArea extends Component {
  state = {
    users: [{}],
    order: "descend",
    filteredUsers: [{}]
  }

  headings = [
    { name: "Image", width: "10%" },
    { name: "Name", width: "10%" },
    { name: "Phone", width: "20%" },
    { name: "Email", width: "20%" },
    { name: "DOB", width: "10%" }
  ]

  handleSorting = heading => {
    if (this.state.order === "descend") {
      this.setState({
        order: "ascend"
      })
    } else {
      this.setState({
        order: "descend"
      })
    }

    const compareFunction = (val1, val2) => {
      if (this.state.order === "ascend") {
        // account for missing values
        if (val1[heading] === undefined) {
          return 1;
        } else if (val2[heading] === undefined) {
          return -1;
        }
        // compare numerically
        else if (heading === "name") {
          return val1[heading].first.localeCompare(val2[heading].first);
        } else {
          return val1[heading] - val2[heading];
        }
      } else {
        // account for missing values
        if (val1[heading] === undefined) {
          return 1;
        } else if (val2[heading] === undefined) {
          return -1;
        }
        // compare numerically
        else if (heading === "name") {
          return val2[heading].first.localeCompare(val1[heading].first);
        } else {
          return val2[heading] - val1[heading];
        }
      }

    }
    const sortedUsers = this.state.filteredUsers.sort(compareFunction);
    this.setState({ filteredUsers: sortedUsers });
  }

  handleSearchChange = event => {
    console.log(event.target.value);
    const filter = event.target.value;
    const filteredList = this.state.users.filter(item => {
      // merge data together, then see if user input is anywhere inside
      let values = Object.values(item)
        .join("")
        .toLowerCase();
      return values.indexOf(filter.toLowerCase()) !== -1;
    });
    this.setState({ filteredUsers: filteredList });
  }

  componentDidMount() {
    API.getUsers().then(results => {
      this.setState({
        users: results.data.results,
        filteredUsers: results.data.results
      });
    });
  }

  render() {
    return (
      <>
        <Nav handleSearchChange={this.handleSearchChange} />
        <div className="data-area">
          <DataTable
            headings={this.headings}
            users={this.state.filteredUsers}
            handleSort={this.handleSorting}
          />
        </div>
      </>
    );
  }
}
