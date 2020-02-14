import React from 'react'
import WebCam from 'react-webcam'
import * as poseEstimation from '@tensorflow-models/posenet'
import ear1 from '../images/kp.png'

//optimal inputres for mobivnet is 230 and slight change in orintatiotn is need when using phone 
//resolution is optimal for now

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
		this.lx=0;
		this.ly=0;
		this.ry=0;
		this.rx=0;
		console.log('heigth',window.innerHeight)
		if(window.innerWidth>=640){
			this.height=640
			this.width=640	
		} else{
			this.height=480
			this.width=window.innerWidth
		}
		
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
		.getUserMedia({video: {
    facingMode:"user" }
  })
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
		  inputResolution: { width: 230, height: 230 },
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
		this.rx=pose.keypoints[4].position.x - 10
		this.ry =pose.keypoints[4].position.y
		this.lx=pose.keypoints[3].position.x - 10 
		this.ly=pose.keypoints[3].position.y 
	
		let prevx=this.lx
		let prevy=this.ly
		let prevrx=this.rx
		let prevry= this.ry


		// this.rx=pose.keypoints[4].position.x - 15
		// this.ry =pose.keypoints[4].position.y + 5

		this.rx=(this.rx-prevrx)*0.70 + prevrx 
		this.ry = (this.ry-prevry)*0.70 + prevry

		// this.lx=pose.keypoints[3].position.x - 10
		// this.ly=pose.keypoints[3].position.y + 16	

		this.lx=(this.lx-prevx)*0.70 + prevx 
		this.ly = (this.ly-prevy)*0.70 + prevy

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
		this.canvasRef.current.getContext('2d').drawImage(this.imgRef.current,this.lx,this.ly,50,80)
		this.canvasRef.current.getContext('2d').drawImage(this.imgRef.current,this.rx,this.ry,50,80)
		requestAnimationFrame(this.drawObject)
	}
	render(){
		return(
			<div>
				<video ref={this.webCamRef} autoPlay className="video"></video>
				<div className="canvas-wrapper">
				<canvas ref={this.canvasRef} height={this.height} width={this.width} className="canvas"></canvas>
				</div>
				<button onClick={this.tryOn}>Start Try On</button>
				<img ref={this.imgRef} src={ear1} height="80px" width="40px"/>
				
			</div>
			)
	}
}