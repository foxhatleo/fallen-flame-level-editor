import React from "react";
import App from "components/App";
import {Provider} from "react-redux";
import levelStore from "redux/LevelStore";

/**
 * Homepage.
 */
const Home: React.FunctionComponent = () => {
    if (typeof window !== "undefined" && window.location.href.includes("now.sh")) {
        window.location.replace("https://ffle.leoliang.com/");
        return <>Redirecting... If you are not redirected within 5 seconds, click <a href={"https://ffle.leoliang.com/"}>here</a></>;
    }
    return (
        <Provider store={levelStore}>
            <App />
        </Provider>
    );
};

export default Home;
