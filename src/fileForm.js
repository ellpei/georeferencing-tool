import './styles/fileForm.css';
import React from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
/**
 * Cred: https://jsfiddle.net/larrykluger/eo4dzptr/
 */
class FileForm extends React.Component {

    constructor(props) {
        super(props);
        const defaultFileType = "json";
        let imgSrc = this.props.imgSrc;
        let filename = imgSrc.substr(imgSrc.lastIndexOf('/')+1, imgSrc.length);
        filename = filename.substr(0, filename.lastIndexOf('.'));

        this.fileNames = {
            json: String(filename) + ".json",
            csv: String(filename) + ".csv",
            text: String(filename) + ".txt"
        }

        this.state = {
            fileType: defaultFileType,
            fileDownloadUrl: null,
            resort: filename,
            currentError: this.props.currentError,
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.currentError !== this.props.currentError) {
            this.setState({currentError: this.props.currentError});
        }
    }

    changeFileType = (event) => {
        const value = event.target.value;
        this.setState({fileType: value});
    }

    download = (event) => {
        event.preventDefault();
        let output;
        let data = this.props.points;
        if (this.state.fileType === "json") {
            //output = JSON.stringify({pistePoints: data}, null, 4);
            output = JSON.stringify({triangles: this.props.triangles}, null, 4);
        } else if (this.state.fileType === "csv") {
            let contents = [];
            contents.push (["x", "y", "long", "lat", "parent", "parentType", "note"]);
            data.map(point => contents.push([point.x, point.y, point.lng, point.lat, point.parent, point.parentType, point.note]));
            output = this.makeCSV(contents);
        } else if (this.state.fileType === "text") {
            output = '';
            data.map(point => {
                output += "x:" + point.x + ",y:" + point.y;
                output += ",long:" + point.long + ",lat:" + point.lat;
                output += ",parent:[" + point.parent + "],parentType:"+point.parentType;
                output += ",note:" + point.note + "\n";
                return output;
            });
        }
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState ({fileDownloadUrl: fileDownloadUrl},
          () => {
            this.dofileDownload.click();
            URL.revokeObjectURL(fileDownloadUrl);
            this.setState({fileDownloadUrl: ""})
        })
    }

    upload = (event) => {
        event.preventDefault();
        this.dofileUpload.click();
    }

    makeCSV = (content) => {
        let csv = '';
        content.forEach(value => {
            value.forEach((item, i) => {
                let innerValue = item === undefined ? '' : item.toString();
                let result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0) {
                    result = '"' + result + '"'
                }
                if (i > 0) {csv += ','}
                    csv += result;
            })
            csv += '\n';
        });
        return csv;
    }

    openFile = (evt) => {
        const fileObj = evt.target.files[0];
        const reader = new FileReader();

        if(!(fileObj instanceof Blob)) return

        let fileloaded = e => {
            const fileContents = e.target.result;
            try {
                let json = JSON.parse(fileContents);
                if(json.hasOwnProperty('pistePoints')) {
                    this.props.loadPointData(json['pistePoints']);
                } else if(json.hasOwnProperty('triangles')) {
                    this.props.loadTriangleData(json['triangles']);
                }
            } catch(e) {
                alert(e);
            }
        }
        fileloaded = fileloaded.bind(this);
        reader.onload = fileloaded;
        reader.readAsText(fileObj);
    }

    downloadTestReport = (event) => {
        console.log("download test report");
        event.preventDefault();
        let results = this.props.generateTestReport();
        console.log("test report: " + JSON.stringify())
        let output = JSON.stringify({testReport: results}, null, 4);

        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState ({fileDownloadUrl: URL.createObjectURL(blob)},
          () => {
            this.doTestReportDownload.click();
            URL.revokeObjectURL(fileDownloadUrl);
            this.setState({fileDownloadUrl: ""})
        })
    }

    render() {
        return (
            <div id="fileForm">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto" className="">
                            <Row className="justify-content-md-center">Root Mean Squared Error: { this.state.currentError ?  (this.state.currentError.error/Math.sqrt( this.state.currentError.numClassified)).toFixed(2) : '0'} </Row>
                            <Row className="justify-content-md-center"># of classified ref points: { this.state.currentError ?  this.state.currentError.numClassified : '0'}</Row>
                        </Col>
                        <Col md="auto">
                        <Button className="" variant='primary' onClick={this.downloadTestReport}>
                            Generate Test Report
                        </Button>
                        <a className="hidden"
                            download={'testReport.json'}
                            href={this.state.fileDownloadUrl}
                            ref={e=>this.doTestReportDownload = e}>download it</a>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Form.Control as="select" name="fileType" className="fileForm-child"
                                onChange={this.changeFileType}
                                value={this.state.fileType}>
                                <option value="csv">CSV</option>
                                <option value="json">JSON</option>
                                <option value="text">Text</option>
                            </Form.Control>
                        </Col>
                        <Col md="auto">
                            <Button onClick={this.download} className="fileForm-child">
                                Download
                            </Button>
                            <a className="hidden"
                                download={this.fileNames[this.state.fileType]}
                                href={this.state.fileDownloadUrl}
                                ref={e=>this.dofileDownload = e}>download it</a>
                        </Col>
                        <Col md="auto">
                            <Button onClick={this.upload} className="fileForm-child">Upload</Button>
                            <input type="file" className="hidden"
                                multiple={false}
                                accept=".json,application/json"
                                onChange={evt => this.openFile(evt)}
                                ref={e=>this.dofileUpload = e}/>
                        </Col>
                    </Row>
                </Container>

            </div>);
    }
}

export default FileForm;
