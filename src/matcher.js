import './styles/matcher.css';
import './styles/image-dots.css';
import './styles/geoCoordSelector.css';
import React from 'react';

import FileForm from './fileForm.js';
import ReactImageDot from './image-dots/ReactImageDot';

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

    saveDot = (index) => {
        console.log('in save dot');
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
        this.setState({dots: data});
    }

    printPistePoints() {
        var res = "";
        this.state.dots.map(d => res += JSON.stringify(d));
        return res; 
    }

    render() {
        const { dots } = this.state;

        return (
            <div id="matcher">
                <ReactImageDot
                backgroundImageUrl={this.state.src}
                onLoadMap={this.onLoadPisteMap}
                width={this.state.windowWidth}
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
                    backgroundColor: 'red',
                    boxShadow: '0 2px 4px gray',
                }} 
                />
                <FileForm imgSrc={this.state.src} data={this.state.dots} loadData={(data) => this.loadFileData(data)}></FileForm>

                <button onClick={this.resetDots}>Reset</button>
                
                <p>Piste points</p>
                {this.printPistePoints()}
            </div>);
    }
}

export default Matcher; 