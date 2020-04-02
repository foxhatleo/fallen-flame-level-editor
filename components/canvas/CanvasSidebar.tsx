import React from "react";

class CanvasSidebar extends React.Component {
    render() {
        return <div className = {"sidebar"}>
            <div className = {"content"}>
                <div className = {"box"}>
                    <h3>Characters</h3>
                    <hr/>
                    <div className = {"imageContainer"}>
                       <img className = {"image"} src = '/../../player.png' alt = "Player image"/> 
                    </div>
                </div>
                <div className = {"box"}>
                    <h3>Environment Tiles</h3>
                    <hr/>
                    <div className = {"imageContainer"}>
                        <img className = {"image"} src = '/../../earthtile.png' alt = "Earth"/>
                    </div>
                </div>
            </div>
            <style jsx>
                {
                    `.sidebar{
                        display:fixed; 
                        width:15%; 
                        margin-top:10%;
                        top:0; 
                        bottom:0;
                        overflow-y: scroll;
                        background-color:red;
                    
                    }
                    .content{
                        display:flex; 
                        width: 100%; 
                        height:100%; 
                        flex-direction:column; 
                        flex-wrap:wrap; 
                    }
                    .box{
                        width:100%; 
                        flex-grow:1; 
                    }
                    
                `}
            </style>
        </div>;
    }
}

export default CanvasSidebar;