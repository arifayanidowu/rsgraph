import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_USER } from "../queries";
import { useHistory } from "react-router-dom";
import Cookie from "js-cookie";
import { Button } from "@material-ui/core";

const INIT_STATE = {
  email: "",
  password: ""
};

export default function Login({ props }) {
  const [state, setState] = useState(INIT_STATE);
  const [login] = useMutation(LOGIN_USER);
  let history = useHistory();
  const token = Cookie.get("token");

  const [tokenize, setTokenize] = useState(false);

  useEffect(() => {
    setState({
      email: "john@gmail.com",
      password: "john123"
    });
  }, []);

  useEffect(() => {
    setTokenize(token ? true : false);
  }, [token]);

  const onLogin = e => {
    e.preventDefault();

    login({
      variables: {
        email: state.email,
        password: state.password
      }
    })
      .then(doc => {
        const token = doc.data.login.token;
        Cookie.set("token", token, { expires: 1 });
        history.push("/user");
      })
      .catch(err => console.error(err));
  };

  const onLogout = e => {
    e.preventDefault();

    Cookie.remove("token");
  };

  return (
    <div>
      {tokenize ? (
        <Button color="secondary" variant="contained" onClick={onLogout}>
          Logout
        </Button>
      ) : (
        <Button color="primary" variant="contained" onClick={onLogin}>
          Login
        </Button>
      )}
    </div>
  );
}
