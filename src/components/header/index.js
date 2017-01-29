import { h, Component } from 'preact';
import { Link } from 'preact-router';


export default function Header(props) {
  let back = ""
  if(props.header) {
    back = (
      <div className="back" onclick={props.back}>
        <img src="assets/arrow.svg" alt="Left arrow" />
      </div>
    )
  }

  return (
    <header>
      <h1>Tracks</h1>
      {back}
    </header>
  );
}


