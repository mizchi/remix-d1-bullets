import { Link } from "@remix-run/react";
export function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <h1>RemixTestApp</h1>
        <nav>
          <Link to="/">Home</Link>
          |
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <hr />
      <main>
        {props.children}
      </main>
    </>
  );
}