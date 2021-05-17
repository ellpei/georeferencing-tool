import React from 'react'

class Canvas extends React.Component {

    componentDidMount() {
        this.updateCanvas();
    }

    getSnapshotBeforeUpdate(prevProps) {
        return {
            triangleUpdateRequired: prevProps.triangles !== this.props.triangles,
            landmarkUpdateRequired: prevProps.landmarkTestData !== this.props.landmarkTestData,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(snapshot.triangleUpdateRequired) {
            this.updateCanvas();
        }
        if(snapshot.landmarkUpdateRequired) {
            this.drawLandmarkTestData();
        }
    }

    updateCanvas = () => {
        let canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "white";
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

    drawLandmarkTestData = () => {
        let canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "lime";
        ctx.fillStyle = "magenta";
        var landmarkData = this.props.landmarkTestData;
        var i, p;
	  	for (i = 0; i < landmarkData.length; i++) {
			p = landmarkData[i];
			ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI, true);
            ctx.fill()
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(p.x_prim, p.y_prim);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(p.x_prim, p.y_prim, 4, 0, 2 * Math.PI, true);
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
