import React from 'react'

class Canvas extends React.Component {

    constructor(props) {
        super(props)
        var triangle;
        for(triangle of this.props.triangles) {
            console.log(triangle);
        }
    }

    componentDidMount() {
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        let canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "red";
        var triangles = this.props.triangles;
        var i, t;
	  	for (i = 0; i < triangles.length; i++) {
			t = triangles[i];
			ctx.beginPath();
			ctx.moveTo(t.p1.x, t.p1.y);
			ctx.lineTo(t.p2.x, t.p2.y);
			ctx.lineTo(t.p3.x, t.p3.y);
			ctx.lineTo(t.p1.x, t.p1.y);
			ctx.stroke();
		}
    }

    render() {
        const {width, height} = this.props;

        return (
          <div id="canvas">
            <canvas ref="canvas" width={width} height={height} />
          </div>
        )
    }
}
export default Canvas
