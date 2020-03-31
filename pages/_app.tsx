import React, {FunctionComponent} from "react";
import {AppProps} from "next/app";

const MyApp: FunctionComponent<AppProps> = ({Component, pageProps}) => {
    return <React.Fragment>
        <Component {...pageProps} />
        <link
            rel="stylesheet"
            href="//maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
            crossOrigin="anonymous"
        />
    </React.Fragment>;
};

export default MyApp;
