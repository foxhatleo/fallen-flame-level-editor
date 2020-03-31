import React from "react";

class Canvas extends React.Component {
    render() {
        return <div className={"container"}>
            <style jsx>{`
            .container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgb(99,148,237);
            }
            `}</style>
        </div>;
    }
}

export default Canvas;
