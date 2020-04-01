import React from "react";
import App from "components/App";
import {Provider} from "react-redux";
import levelStore from "redux/LevelStore";

/**
 * Homepage.
 */
const Home: React.FunctionComponent = () => {
    return (
        <Provider store={levelStore}>
            <App />
        </Provider>
    );
};

export default Home;
