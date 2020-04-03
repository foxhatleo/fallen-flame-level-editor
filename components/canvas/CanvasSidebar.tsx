import React from "react";
import styles from './CanvasSidebar.module.css';

class CanvasSidebar extends React.Component {
    render() {
        return <div className = {styles.sidebar}>
            <div className = {styles.content}>
                <div className = {styles.box}>
                    <h3>Characters</h3>
                    <hr/>
                    <div className = {styles.imageContainer}>
                       <img className = {styles.image} src = '/../../player.png' alt = "Player image"/> 
                    </div>
                </div>
                <div className = {styles.box}>
                    <h3>Walls</h3>
                    <hr/>
                    <div className = {styles.imageContainer}>
                        <img className = {styles.image} src = '/../../double-brick.png' alt = "Double Brick"/>
                        <img className = {styles.image} src = '/../../single-brick.png' alt = "Single Brick"/>
                    </div>
                </div>
                <div className = {styles.box}>
                    <h3>Floors</h3>
                    <hr/>
                    <div className = {styles.imageContainer}>
                        <img className = {styles.image} src = '/../../floor-tile.png' alt = "Tile"/>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default CanvasSidebar;