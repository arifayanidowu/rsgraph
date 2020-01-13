import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_USERS } from "../queries";
import Login from "./Login";
import { makeStyles } from "@material-ui/styles";
import { Container } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%"
  },
  link: {
    color: theme.palette.type === "light" ? "black" : "white"
  }
}));

export default function Home() {
  const { loading, error, data } = useQuery(GET_USERS);
  const classes = useStyles();

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error!!!</p>;
  }

  return (
    <Container>
      <h1>Welcome to Home route</h1>

      <div>
        <Link to="/about" className={classes.link}>
          About
        </Link>
      </div>
      <div>
        <Link to="/user" className={classes.link}>
          User
        </Link>
      </div>
      <ul>
        {data.getUsers.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <Login />
    </Container>
  );
}
