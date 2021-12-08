import React, {Component} from "react";
import {Menu} from 'semantic-ui-react';
import {Link} from '../routes';
class Header extends Component{
    render(){
        return(
            <Menu style = {{marginTop: '10px'}}>
                <Link route="/">
                    <a className="item">Block Capital</a>
                </Link>

                <Menu.Menu position = "right">
                    <Link route="/">
                        <a className="item">Campaigns</a>
                    </Link>
                    <Link route="/campaign/new">
                        <a className="item">+</a>
                    </Link>
                </Menu.Menu>

            </Menu>
        )
    }
}

export default Header;