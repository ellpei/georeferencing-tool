import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

function Docs(props) {
    return (<div id="docs" >
                <div className="page-content">
                    <h1>
                        Documentation
                    </h1>
                    <h2>Mode 1: Georeferencing Tool</h2>
                    <p>
                        Match piste map coordinates (x, y) with geographic coordinates (lat, lng). You can either upload anchor point data in a flat list structure or as a list of triangles as seen in the snippets below. You may also include additional fields such as:
                        <ul>
                            <li>"parent" (list of strings)</li>
                            <li>"parentType" - holding one of the following values:
                                <ul>
                                    <li>"Piste"</li>
                                    <li>"Terrain"</li>
                                    <li>"Lift"</li>
                                    <li>"Restaurant"</li>
                                </ul>
                            </li>
                            <li>"note"</li>
                        </ul>
                    </p>

                    <Container>
                      <Row>
                        <Col>
                            <Row>
                                <b>Flat list structure:</b>
                            </Row>
                            <Row>
                            <div className="json-snippet">
                                <pre>{JSON.stringify({
                                "pistePoints": [
                                    {
                                        "x": 61,
                                        "y": 607,
                                        "lat": 63.43041227213233,
                                        "lng": 13.01626234486621,
                                    },
                                    {
                                        "x": 267,
                                        "y": 533,
                                        "lat": 63.4299305329716,
                                        "lng": 13.034080668125355,
                                    }
                                ]

                            }, null, 2)}</pre>
                            </div>
                            </Row>
                        </Col>
                        <Col>
                            <Row><b>Triangle list structure:</b></Row>
                            <Row>
                            <div className="json-snippet">
                                <pre>{JSON.stringify({
                                    "triangles": [
                                        [
                                            {
                                                "x": 1131,
                                                "y": 416,
                                                "lat": 63.42330305619766,
                                                "lng": 13.07236033239243
                                            },
                                            {
                                                "x": 1326,
                                                "y": 507,
                                                "lat": 63.42085720586304,
                                                "lng": 13.078540399463403
                                            },
                                            {
                                                "x": 1293,
                                                "y": 402,
                                                "lat": 63.423555184990285,
                                                "lng": 13.078864772230249
                                            }
                                        ]
                            ]}, null, 2)}</pre>
                            </div>
                            </Row>
                        </Col>
                      </Row>
                    </Container>
                    <br/>
                    <p>
                    When three or more anchor points have been collected, the tool will start triangulating and building transformation matrices. The triangle edges will be drawn both on the piste map and the Google Map. You will also notice that the marker in Google Maps will be placed at the location where the tool estimates the geographic coordinates should be. This is to improve the ease of use as well as giving you a sense of how accurate your positioning mesh is at each step in the construction process.

                    <br/><br/>
                    <b>DO NOT</b> forget to download the triangle data when you're done!
                    </p>
                    <h2>Mode 2: Only Piste Map Coordinates</h2>
                    <p>
                        In the second mode, you can create, upload, and download piste map coordinate data as lists of points.
                        When uploading a JSON file, the tool will look load all the items in a list with one of the following names:
                        <ul>
                            <li>"points" (seen in example below)</li>
                            <li>"restaurants"</li>
                            <li>"slopes"</li>
                            <li>"lifts"</li>
                        </ul>
                        Note: The tool will load all the points in the uploaded file regardless of the destination id of each point. Therefore, it is better to sort the points into files specific to each resort.
                    </p>
                    <b>Point structure:</b>
                    <div className="json-snippet">
                        <pre>{JSON.stringify({
                            "points": [
                                {
                                    "id": "193",
                                    "name": "Adam",
                                    "shortName": "1",
                                    "areaId": "lindvallen",
                                    "pisteMapCoordinates": {
                                        "x": 145,
                                        "y": 537
                                    }
                                },
                                {
                                    "id": "194",
                                    "name": "Pernilla",
                                    "shortName": "2",
                                    "areaId": "lindvallen",
                                    "pisteMapCoordinates": {
                                        "x": 281,
                                        "y": 535
                                    }
                                },
                            ]}, null, 2)}</pre>
                    </div>
                </div>
            </div>
    );
}

export default Docs;
