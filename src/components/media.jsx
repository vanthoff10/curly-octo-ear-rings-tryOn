import React from 'react'
import WebCam from 'react-webcam'
import * as poseEstimation from '@tensorflow-models/posenet'
import img from '../image.jpg'



//Video is drawn to canvas . So just remove video and make canvas full time and then render earrings and its done.



export default class MediaComponent extends React.Component{
	constructor(props){
		super(props)
		this.webCamRef=React.createRef()
		this.tryOn=this.tryOn.bind(this)
		this.repeatTryon = this.repeatTryon.bind(this)
		this.posenet=[]
		this.canvasRef=React.createRef()
	}
	componentDidMount(){
		console.log('canvasref',this.canvasRef.current.height)
		navigator.mediaDevices
		.getUserMedia({video:true})
		.then((stream)=>{
			this.webCamRef.current.srcObject=stream 
			const draw = () =>{
			this.canvasRef.current.getContext("2d").drawImage(this.webCamRef.current,0,0,this.canvasRef.current.height,this.canvasRef.current.height)
			requestAnimationFrame(draw)
			}
			requestAnimationFrame(draw)
			console.log('media object',this.webCamRef)
		
		})
	}



	async tryOn(){
		console.log('posenet loading..')
		let posenetgot = await poseEstimation.load({
			 architecture: 'MobileNetV1',
		  outputStride: 16,
		  inputResolution: { width: 640, height: 480 },
		  multiplier: 0.75
		})
		this.posenet=posenetgot
		this.repeatTryon()
		
	}
	async repeatTryon(){
		const pose = await this.posenet.estimateSinglePose(this.canvasRef.current, {
  		  flipHorizontal: true
  			})
		console.log('pose',pose)
		//requestAnimationFrame(this.repeatTryon)
	}
	render(){
		return(
			<div>
				<video ref={this.webCamRef} autoPlay className="video"></video>
				<canvas ref={this.canvasRef} height="600" width="600"></canvas>
				<button onClick={this.tryOn}>Start Try On</button>
			</div>
			)
	}
}