import React from 'react'
import WebCam from 'react-webcam'
import * as poseEstimation from '@tensorflow-models/posenet'
import ear1 from '../images/kp.png'
import nose1 from '../images/nose1.png'
import {BsChevronUp,BsChevronDown,BsCamera} from 'react-icons/bs'



//optimize view for ipad 

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
		this.imageCLick=this.imageCLick.bind(this)
		this.nathiyaClick=this.nathiyaClick.bind(this)
		this.drawNathiya= this.drawNathiya.bind(this)
		this.clearFrames=this.clearFrames.bind(this)
		this.imgRef=React.createRef()
		this.canvas2Ref=React.createRef()
		this.nathiya= React.createRef()
		this.canvasRef=React.createRef()
		this.state={
			showSelecter:false,
			cameraAccess:true
		}
		this.lx=0;
		this.ly=0;
		this.ry=0;
		this.rx=0;
		this.nosex=0;
		this.nosey=0;
		this.r=0
		this.n=0
		this.e=0
		if(window.innerWidth>=640){
			this.height=640
			this.width=640	
		} else{
			this.height=window.innerWidth+ 100
			this.width=window.innerWidth
		}
		
	}

	componentDidMount(){ 
		navigator.mediaDevices
		.getUserMedia({video: {
  		  facingMode:"user" , width: 500 , height: 500}
		  })
		.then((stream)=>{
			this.webCamRef.current.srcObject=stream 
			const draw = () =>{
			this.canvasRef.current.getContext("2d").drawImage(this.webCamRef.current,0,0,this.canvasRef.current.height,this.canvasRef.current.height)
			this.canvas2Ref.current.getContext("2d").drawImage(this.webCamRef.current,0,0,this.canvasRef.current.height,this.canvasRef.current.height)
			
			requestAnimationFrame(draw)
			}
			requestAnimationFrame(draw)
			//console.log('media object',this.webCamRef)
			this.tryOn()
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
	
		//this.repeatTryon()
		
	}
	async repeatTryon(){
		const pose = await this.posenet.estimateSinglePose(this.canvasRef.current, {
  		  flipHorizontal: false
		})
		
		let prevx=this.lx
		let prevy=this.ly
		let prevrx=this.rx
		let prevry= this.ry
		let prevnx=this.nosex
		let prevny=this.nosey
		this.nosex=pose.keypoints[0].position.x + 20
		this.nosey=pose.keypoints[0].position.y -18

		this.nosex=(this.nosex-prevnx)*0.60 + prevnx
		this.nosey=(this.nosey-prevny)*0.60 + prevny	

		this.rx=pose.keypoints[4].position.x - 17
		this.ry =pose.keypoints[4].position.y
		this.lx=pose.keypoints[3].position.x - 13 
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


		setTimeout(()=>{
			this.r=requestAnimationFrame(this.repeatTryon)	
		},1000/90)	
		
	
	}

	drawObject(){
		this.canvasRef.current.getContext('2d').drawImage(this.imgRef.current,this.lx,this.ly,50,80)
		this.canvasRef.current.getContext('2d').drawImage(this.imgRef.current,this.rx,this.ry,50,80)
		this.e = requestAnimationFrame(this.drawObject)
	}
	imageCLick(){
		this.toggleSection()
		this.repeatTryon()
		requestAnimationFrame(this.drawObject)
		
	}
	nathiyaClick(){
		this.toggleSection()
		
		this.repeatTryon()
		 requestAnimationFrame(this.drawNathiya)		
	}
	toggleSection(){
		this.setState({
			showSelecter: !this.state.showSelecter
		})
	}
	drawNathiya(){
		console.log('inside nathiya')
		this.canvasRef.current.getContext('2d').drawImage(this.nathiya.current,this.nosex,this.nosey,45,60)
		this.n=requestAnimationFrame(this.drawNathiya)
	}
	clearFrames(){
		cancelAnimationFrame(this.e)
		cancelAnimationFrame(this.n)
		cancelAnimationFrame(this.r)
		this.toggleSection()
	}
	render(){
		return(
			<div>
			{this.state.cameraAccess ? 
			<div>
				<img ref={this.imgRef} src={ear1} height="0px" width="0px"/>
				<img ref={this.nathiya} src={nose1} height="0px" width="0px"/>			
				<video ref={this.webCamRef} autoPlay className="video"></video>
				<div className="canvas-wrapper">
				<canvas ref={this.canvasRef} height={this.height} width={this.width} className="canvas"></canvas>
				</div>
				<div className="selector">
					<div className="selector-line">
					{!this.state.showSelecter ? 
					<div className=" m-auto" onClick={this.toggleSection}>
						<button className=" btn earring-button " >&bull; Ear-rings  </button>
						<span className="bigdot ml-1 mr-1">&bull;</span>
						<button className="btn earring-button">Nose Rings &bull;</button>
						<button className=" earring-uparrow" onClick={this.toggleSection}><BsChevronUp/> </button>
					</div>
					:
					<div className="earring-selector">
						<div className=" m-auto" onClick={this.toggleSection}>
							<button className=" earring-button " >&bull; Ear-rings  </button>	
							<span className="bigdot ml-1 mr-1">&bull;</span>
							<button className="btn earring-button">Nose Rings &bull;</button>
							<button className="earring-uparrow" onClick={this.toggleSection}><BsChevronDown/> </button>
						</div>
						<div className="image-section">
							<img  src={ear1} height="190px" width="160px" className=" ml-3 img-fluid" onClick={this.imageCLick}/>
							<img src={nose1} height="100px" width="80px" className="mr-2 ml-4 " onClick={this.nathiyaClick}/>
						</div>
						<div className="text-center mt-0 mb-2">
							<button className="btn clear" onClick={this.clearFrames}>Clear View</button>
						</div>
					</div>
					}
					</div>
					
				</div>

				<div className="canvas-wrapper">
				<canvas ref={this.canvas2Ref} height={this.height} width={this.width} className="canvas second-canvas"></canvas>
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