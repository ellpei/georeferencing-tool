import './styles/fileForm.css';
import React from 'react';
import {Form, Button} from 'react-bootstrap';

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
        }

        this.changeFileType = this.changeFileType.bind(this);
        this.download = this.download.bind(this);
        this.upload = this.upload.bind(this);
        this.openFile = this.openFile.bind(this);
    }

    changeFileType (event) {
        const value = event.target.value;
        this.setState({fileType: value});
    }

    download (event) {
        event.preventDefault();
        let output;
        let data = this.props.data; 
        if (this.state.fileType === "json") {
            output = JSON.stringify({pistePoints: data}, null, 4);
        } else if (this.state.fileType === "csv") {
            let contents = [];
            contents.push (["x", "y", "long", "lat", "parent", "parentType", "note"]);
            data.map(point => contents.push([point.x, point.y, point.long, point.lat, point.parent, point.parentType, point.note]));
            output = this.makeCSV(contents);
        } else if (this.state.fileType === "text") {
            output = '';
            data.map(point => {
                output += "x:" + point.x + ",y:" + point.y;
                output += ",long:" + point.long + ",lat:" + point.lat;
                output += ",parent:" + point.parent + ",parentType:"+point.parentType;
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

    upload(event) {
        event.preventDefault();
        this.dofileUpload.click();
    }

    makeCSV (content) {
        let csv = '';
        content.forEach(value => {
            value.forEach((item, i) => {
                let innerValue = item === null ? '' : item.toString();
                let result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0) {
                    result = '"' + result + '"'
                }
                if (i > 0) {csv += ','}
                    csv += result;
            })
            csv += '\n';
        })
        return csv;
    }
    
    openFile(evt) {
        const fileObj = evt.target.files[0];
        const reader = new FileReader();
            
        let fileloaded = e => {
            // e.target.result is the file's content as text
            const fileContents = e.target.result;
            let json = JSON.parse(fileContents);
            this.props.loadData(json["pistePoints"]);
        }
        
        // Mainline of the method
        fileloaded = fileloaded.bind(this);
        reader.onload = fileloaded;
        reader.readAsText(fileObj);  
    }

    render() {
        return (
            <div id="fileForm">
                <Form>
                <span className="mr">File type:</span>
                <select name="fileType"
                    onChange={this.changeFileType}
                    value={this.state.fileType}
                    className="mr"
                >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="text">Text</option>
                </select>
                
                <Button onClick={this.download}>
                    Download
                </Button>
                
                <a className="hidden"
                    download={this.fileNames[this.state.fileType]}
                    href={this.state.fileDownloadUrl}
                    ref={e=>this.dofileDownload = e}
                >download it</a>
                
                <p><Button onClick={this.upload}>
                    Upload
                </Button><br/>
                Accepted file types: .json</p>

                <input type="file" className="hidden"
                    multiple={false}
                    accept=".json,application/json"
                    onChange={evt => this.openFile(evt)}
                    ref={e=>this.dofileUpload = e}
                />
                </Form>
            </div>);
    }
}

export default FileForm; 