import React from 'react'
import WebCam from 'react-webcam'
import * as poseEstimation from '@tensorflow-models/posenet'
import ear1 from '../images/sa.png'

//just render it for the ears and the minor change in position for that.

export default class MediaComponent extends React.Component{
	constructor(props){
		super(props)
		this.webCamRef=React.createRef()
		this.tryOn=this.tryOn.bind(this)
		this.drawCircle= this.drawCircle.bind(this)
		this.drawObject = this.drawObject.bind(this)
		this.repeatTryon = this.repeatTryon.bind(this)
		this.imgRef=React.createRef()
		this.posenet=[]
		this.canvasRef=React.createRef()
		this.x=-90;
		this.y=-90;
	}
	drawCircle(){
		let ctx=this.canvasRef.current.getContext('2d')
		ctx.arc(200, 300, 10,0, 2* Math.PI);
		ctx.fillStyle = "black";
		ctx.fill();
		requestAnimationFrame(this.drawCircle)
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
		console.log('posenet Loaded')
		this.repeatTryon()
		
	}
	async repeatTryon(){
		const pose = await this.posenet.estimateSinglePose(this.canvasRef.current, {
  		  flipHorizontal: false
		})
		let prevx=this.x
		let prevy=this.y
		this.x=pose.keypoints[0].position.x
		this.y=pose.keypoints[0].position.y	

		this.x=(this.x-prevx)*0.80 + prevx 
		this.y = (this.y-prevy)*0.80 + prevy

		//console.log('point',pose.keypoints[4].position.x)
		//console.log('pose',pose)
		
// 		var drawObjectNow= ()=>{
		
// 		//this.canvasRef.current.getContext('2d').clearReact(pose.keypoints[3].position.x,pose.keypoints[3].position.y,50,80)	
// //		this.canvasRef.current.getContext('2d').arc(pose.keypoints[0].position.x, pose.keypoints[0].position.y, 10,0, 2* Math.PI);
// 		this.canvasRef.current.getContext('2d').drawImage(this.imgRef.current,pose.keypoints[0].position.x,pose.keypoints[0].position.y,50,80)
// 		//requestAnimationFrame(drawObject)
// 		}		
		requestAnimationFrame(this.drawObject)
		
		requestAnimationFrame(this.repeatTryon)
	}
	drawObject(){
		this.canvasRef.current.getContext('2d').drawImage(this.imgRef.current,this.x,this.y,50,80)
		requestAnimationFrame(this.drawObject)
	}
	render(){
		return(
			<div>
				<img ref={this.imgRef} src={ear1} height="80px" width="40px"/>
				<video ref={this.webCamRef} autoPlay className="video"></video>
				<canvas ref={this.canvasRef} height="640" width="480"></canvas>
				<button onClick={this.tryOn}>Start Try On</button>
			</div>
			)
	}
}