import './styles/matcher.css';
import './styles/image-dots.css';
import './styles/geoCoordSelector.css';
import React from 'react';
import {Button} from 'react-bootstrap';
import FileForm from './fileForm.js';
import ReactImageDot from './image-dots/ReactImageDot';
import DotsInfo from './image-dots/DotsInfo';

class Matcher extends React.Component {
    
    constructor(props) {
        super(props);
        this.initialDots = [];
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            x: 0,
            y: 0,
            dots: this.initialDots,
            parents: [],
            parentTypes: ['Piste', 'Lift', 'Restaurant', 'Other'],
            windowWidth: window.innerWidth*0.98,
        }
        this.addParent = this.addParent.bind(this);
        this.addParentType = this.addParentType.bind(this);
    }
    // Translate from rendered coordinates to real piste map coordinates
    renderedToRealCoord(coord, renderedLength, realLength) {
        return (coord/renderedLength)*realLength;
    }

    realToRenderedCoord(coord, renderedLength, realLength) {
        return (coord/realLength)*renderedLength;
    }

    addDot = (dot) => {
        let {dots} = this.state; 
        
        this.setState({
            dots: [...dots, dot],
        });
        if(!this.state.parents.includes(dot.parent)) {
            this.setState({parents: [...this.state.parents, dot.parent]});
        }
    }

    saveDot = (dot) => {
        let {dots} = this.state; 
        this.deleteDot(dots.length-1);
        this.addDot(dot);
    }
    
    deleteDot = (index) => {
        this.setState({
            dots: this.state.dots.filter((e, i) => {
                return i !== index;
            }),
        });
    }
    
    resetDots = () => {
        this.setState({
            dots: this.initialDots,
        });
    }

    addParent(parentName) {
        if(!this.state.parents.includes(parentName)) {
            this.setState({parents: [...this.state.parents, parentName]});
        }
    }

    addParentType(type) {
        if(!this.state.parentTypes.includes(type)) {
            this.setState({parentTypes: [...this.state.parentTypes, type]});
        }
    }

    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth*0.98 });
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }
      
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    } 

    loadFileData(data) {
        this.initialDots = data;
        this.setState({dots: data});
    }

    render() {
        const { dots } = this.state;

        return (
            <div id="matcher">
                <ReactImageDot
                backgroundImageUrl={this.state.src}
                onLoadMap={this.onLoadPisteMap}
                dots={dots}
                parents={this.state.parents}
                parentTypes={this.state.parentTypes}
                deleteDot={this.deleteDot}
                saveDot={this.saveDot}
                addDot={this.addDot}
                addParent={this.addParent}
                addParentType={this.addParentType}
                dotRadius={6}
                dotStyles={{
                    //backgroundColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    boxShadow: '0 2px 4px gray',
                }} 
                />
                <FileForm imgSrc={this.state.src} data={this.state.dots} loadData={(data) => this.loadFileData(data)}></FileForm>
                <DotsInfo dots={this.state.dots} deleteDot={this.deleteDot}></DotsInfo>
                <Button variant='success' onClick={this.resetDots}>Reset</Button>

            </div>);
    }
}

export default Matcher; 