import React, { useState } from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { createMuiTheme } from "@material-ui/core/styles";

import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Cookie from "js-cookie";
import "./App.css";
import Home from "./components/Home";
import About from "./components/About";
import AuthUser from "./components/AuthUser";
import Layout from "./components/Layout";
import themeConfig from "./theme";

const httpLink = createHttpLink({
  uri: "/graphql"
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem("token");
  const token = Cookie.get("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const linkErr = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink, linkErr),
  cache: new InMemoryCache()
});

const useDarkMode = () => {
  const [theme, setTheme] = useState(themeConfig);

  const {
    palette: { type }
  } = theme;

  const toggleDarkMode = () => {
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: type === "light" ? "dark" : "light"
      }
    };
    setTheme(updatedTheme);
  };

  return [theme, toggleDarkMode];
};

function App() {
  const [state, setState] = useState(true);
  const [theme, toggleDarkMode] = useDarkMode();
  const themeConfig = createMuiTheme(theme);

  const toggleMode = () => {
    setState(!state);
  };

  return (
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={themeConfig}>
        <CssBaseline />
        <Router>
          <Switch>
            <Layout
              toggleMode={toggleMode}
              state={state}
              toggleDarkMode={toggleDarkMode}
            >
              <Route exact path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/user" component={AuthUser} />
            </Layout>
          </Switch>
        </Router>
      </MuiThemeProvider>
    </ApolloProvider>
  );
}

export default App;
