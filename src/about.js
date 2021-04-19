import React from 'react';

function About(props) {
    return (<div id="about" >
                <div className="page-content">
                    <h1>
                        About
                    </h1>
                    <p>
                        This georeferencing tool comes with two different collection modes.
                        <br/><br/>
                        The standard mode matches geographic coordinates (lat, lng) with map coordinates (x, y).
                        When enough points have been collected, it will make suggestions on where to place the geographic marker for each piste map coordinate.
                        The exported file structure is in triangle format.
                        <br/><br/>
                        The other mode collects only piste map coordinates (x, y).
                        For each collected coordinate, you may also specify id, name, shortName, and area id.
                    </p>
                </div>
            </div>
    );
}

export default About;
