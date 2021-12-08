import React, {Component} from 'react';
import factory from '../ethereum/factory';
import {Card, Button} from "semantic-ui-react";
import Layout from "../components/layout";
import {Link} from '../routes'
const async = require('async');
import web3 from "../ethereum/web3";

class Home extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return {campaigns}
    }

    constructor(props){
        super(props);
        this.state = {campaignList:[]}
    }

    renderCampaigns = async ()=> {
        const items = await Promise.all(this.props.campaigns.map(async (address)=>{
            const name = await factory.methods.nameCampaigns(address).call();

            return {

                header: `${name}  (${address})`,
                description:(
                    <Link route = {`/campaign/${address}`}>
                        <a target="_blank">View Campaign</a>
                     </Link> ),
                fluid: true
            };
        }));

        this.setState({campaignList: <Card.Group items={items}/>});
        return <Card.Group items = {items} />;
    }
    componentDidMount (){
        this.renderCampaigns();
    }

    render() {
            return (<Layout>

                            <h2>Open Campaigns</h2>
                            <Link route="/campaign/new">
                                <a>
                                    <Button
                                    content='Create Campaign' icon = 'add'
                                    labelPosition= 'left' primary floated = "right"
                                    />
                                </a>

                            </Link>


                            {this.state.campaignList}


                    </Layout>

        );
    };
}
export default Home;