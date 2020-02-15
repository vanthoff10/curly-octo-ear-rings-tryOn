import React from 'react'
import MediaComponent from './media'


export default class Main extends React.Component{
	constructor(props){
		super(props)
		this.loadedCallback = this.loadedCallback.bind(this)
	}
	loadedCallback(value){
		console.log('inside loaded loadedCallback',value)
	}
	render(){
		return(
			<div className=" main-container">
			
				<MediaComponent/>		
			
			</div>
		)
	}
}