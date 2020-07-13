import React, { Component } from 'react';

class Loader extends Component{
    constructor(props) 
    {
        super(props)
        this.state={
        }
    }
    
    render(){
        return(
            <div className="loader-cont">
                <div className="access">
                    <div id="wifi">
                        <div className="band band-4">
                            <div className="band band-3">
                                <div className="band band-2">
                                    <div className="band band-1">
                                        <div className="center"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        )
    }
}
export default Loader;