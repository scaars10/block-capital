import React, {Component} from "react";
import Header from "./Header";
import {Container} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
class Layout extends Component{
    render() {
        return (

                <Container >
                    <Header />
                    {this.props.children}

                </Container>


        )
    }
}

export default Layout;