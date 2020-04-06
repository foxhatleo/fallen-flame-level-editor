import React from "react";
import styles from './CanvasSidebar.module.css';
import {FunctionComponent} from "react";
import {connect} from "react-redux";
import {updateSelected} from "../../redux/Actions";
import {bindActionCreators} from "redux";

type CanvasSidebarProps = {
    selected: string
}
const CanvasSidebar: FunctionComponent<CanvasSidebarProps> = (p) => {


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
        </div>
};

function mapStateToProps(state) {
    return { selected: state.selected }
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateSelected }, dispatch)
  }

export default connect(mapStateToProps, mapDispatchToProps)(CanvasSidebar)