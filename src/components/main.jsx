import React from 'react'
import MediaComponent from './media'


export default class Main extends React.Component{
	constructor(props){
		super(props)

	}
	render(){
		return(
			<div className=" main-container">
			
				<MediaComponent />		
			
			</div>
		)
	}
}