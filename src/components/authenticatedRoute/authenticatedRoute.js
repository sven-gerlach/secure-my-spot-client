function AuthenticatedRoute(props) {
  console.log(props.user)
  return props.user ? <p>Welcome, {props.user.email}</p> : <p>Welcome anonymous user</p>
}

export default AuthenticatedRoute
