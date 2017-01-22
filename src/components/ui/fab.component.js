

import {h, Component} from 'preact';


export default function Fab(props) {
  return (
		<app-fab>
			<button onclick={props.click}>
      	<img src="assets/plus.svg" width="20" />
    	</button>
		</app-fab>
  )

}


