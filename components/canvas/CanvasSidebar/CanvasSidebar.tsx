import React from "react";
import LevelModel from "models/LevelModel";
import "./CanvasSidebar.css"

class CanvasSidebar extends React.Component {
    render() {
        return <div className = {"sidebar"}>
            <div className = {"content"}>
                <div className = {"box"}>
                    <h3>Characters</h3>
                    <hr/>
                    <div className = {"imageContainer"}>
                        <img className = {"image"} src = ".../images/player.png" alt = "player"></img>
                    </div>
                </div>
                <div className = {"box"}>
                    <h3>Environment Tiles</h3>
                    <hr/>
                    <div className = {"imageContainer"}>
                        <img className = {"image"} src = ".../images/earthtile.png" alt = "player"></img>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default CanvasSidebar;