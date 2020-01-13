import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { AUTH_USER } from "../queries";
import { useHistory } from "react-router-dom";
import { Container, Fab } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

export default function AuthUser() {
  const { loading, error, data } = useQuery(AUTH_USER);
  let history = useHistory();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error!!!</p>;
  }

  const Back = () => {
    history.goBack();
  };

  const {
    authUser: { email, username }
  } = data;
  return (
    <Container>
      <Fab color="secondary" onClick={Back}>
        <ChevronLeftIcon />
      </Fab>
      <p>Authenticated user</p>
      <ul>
        <li>{email}</li>
        <li>{username}</li>
      </ul>
    </Container>
  );
}
