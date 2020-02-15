import React from 'react'
import WebCam from 'react-webcam'
import * as poseEstimation from '@tensorflow-models/posenet'
import ear1 from '../images/kp.png'
import {BsChevronUp,BsChevronDown,BsCamera} from 'react-icons/bs'

//optimal inputres for mobilevnet is 230 and slight change in orintatiotn is need when using phone 
//resolution is optimal for now
//OPTIMAL configuration for KP image on  desktop as well as mobile NOW just copy the ui to the same extend. 
export default class MediaComponent extends React.Component{
	constructor(props){
		super(props)
		this.webCamRef=React.createRef()
		this.tryOn=this.tryOn.bind(this)
		this.drawObject = this.drawObject.bind(this)
		this.toggleSection = this.toggleSection.bind(this)
		this.repeatTryon = this.repeatTryon.bind(this)
		this.imgRef=React.createRef()
		this.canvasRef=React.createRef()
		this.state={
			showSelecter:false,
			cameraAccess:true
		}
		this.lx=0;
		this.ly=0;
		this.ry=0;
		this.rx=0;
		if(window.innerWidth>=640){
			this.height=640
			this.width=640	
		} else{
			this.height=540
			this.width=window.innerWidth
		}
		
	}

	componentDidMount(){
		console.log('canvasref',this.canvasRef.current.height)
		navigator.mediaDevices
		.getUserMedia({video: {
  		  facingMode:"user" , width: 500 , height: 500}
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
		.catch((err)=>{
			this.setState({
				cameraAccess:false
			})
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
		
		let prevx=this.lx
		let prevy=this.ly
		let prevrx=this.rx
		let prevry= this.ry


		this.rx=pose.keypoints[4].position.x - 13
		this.ry =pose.keypoints[4].position.y
		this.lx=pose.keypoints[3].position.x - 8 
		this.ly=pose.keypoints[3].position.y 
	

		// this.rx=pose.keypoints[4].position.x - 15
		// this.ry =pose.keypoints[4].position.y + 5

		this.rx=(this.rx-prevrx)*0.60 + prevrx 
		this.ry = (this.ry-prevry)*0.60 + prevry

		// this.lx=pose.keypoints[3].position.x - 10
		// this.ly=pose.keypoints[3].position.y + 16	

		this.lx=(this.lx-prevx)*0.60 + prevx 
		this.ly = (this.ly-prevy)*0.60 + prevy

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
	toggleSection(){
		this.setState({
			showSelecter: !this.state.showSelecter
		})
	}
	render(){
		return(
			<div>
			{this.state.cameraAccess ? 
			<div>
				<video ref={this.webCamRef} autoPlay className="video"></video>
				<div className="canvas-wrapper">
				<canvas ref={this.canvasRef} height={this.height} width={this.width} className="canvas"></canvas>
				</div>
				<div className="selector">
					<div className="selector-line">
					{!this.state.showSelecter ? 
					<div>
						<button className="earring-button" onClick={this.toggleSection}>&bull; Ear-rings &bull; </button>
						<button className="earring-uparrow" onClick={this.toggleSection}><BsChevronUp/> </button>
					</div>
					:
					<div className="earring-selector">
						<button className="earring-button" onClick={this.toggleSection}>&bull; Ear-rings &bull; </button>	
						<button className="earring-uparrow" onClick={this.toggleSection}><BsChevronDown/> </button>
						<div className="image-section row">
							<div className="col-md-6 col-sm-6 col-lg-6 pl-3">
							<img ref={this.imgRef} src={ear1} height="140px" width="110px" className=" mr-1 img-fluid"/>
							<img ref={this.imgRef} src={ear1} height="140px" width="110px" className=" mr-1 img-fluid"/>
							</div>
							
						</div>
					</div>
					}
					</div>
					
				</div>
			</div>
			: 
			<div>
				<span className="camera-icon">
					<BsCamera/>
				</span>
				<p className="text mt-5">We need Camera access for the Try On . Please reload the page to continue .</p>
			</div>
			}
			</div>
			)
	}
}
// <button onClick={this.tryOn}>Start Try On</button>
		//		<img ref={this.imgRef} src={ear1} height="80px" width="40px"/>