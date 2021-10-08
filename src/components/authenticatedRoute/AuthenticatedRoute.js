import { Route, Redirect } from "react-router-dom";

const AuthenticatedRoute = ({ path, user, render, component: Component }) => {
  if (user && render) {
    return <Route path={path} render={render} />
  }
  if (user && Component) {
    return <Route path={path} render={() => {
     return Component
    }} />
  }
  else {
    return <Redirect to="/" />
  }
}


export default AuthenticatedRoute
