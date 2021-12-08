import React, {Component} from "react";
import Layout from "../../components/layout";
import campaign from "../../ethereum/campaign"
import web3 from "../../ethereum/web3";

import factory from "../../ethereum/factory";
import {Button, CardGroup, Form, Input, Message, Grid} from "semantic-ui-react";
import {Router} from "../../routes";

class CampaignShow extends Component{

    constructor(props){
        super(props);
        this.state = {errorMessage: "", contribution:0, loading: false, successMessage: "", statusMessage: ""}
    }

    static async getInitialProps(props) {
        const query = props.query.address;
        const summary = await campaign(query).methods.getSummary().call();
    console.log(summary);
        return {query: query,
            summary: {
                minimumContribution: summary[0],
                name: summary[1],
                balance: summary[2],
                numRequest: summary[3],
                totalContribution: summary[4],
                contributorCount: summary[5],
                manager: summary[6]
            }};
    }

    renderSummary (){
        return (
            <CardGroup centered = {false} style = {{"overflowWrap" : "break-word"}}
                items ={[
                    {
                        description: "Minimum Contribution",
                        header: this.props.summary.minimumContribution,
                        style: {"background-color": "beige"},
                        meta: 'Minimum amount required to become a contributor',

                    },
                    {
                        description: "Name",
                        header: this.props.summary.name,
                        style: {"background-color": "beige"},
                        meta: 'Name of project'
                    },
                    {
                        description: "Balance",
                        header: this.props.summary.balance + " wei",
                        style: {"background-color": "beige"},
                        meta: 'Total amount left in contract'
                    },
                    {
                        description: "Total Contribution",
                        header: this.props.summary.totalContribution + " wei",
                        style: {"background-color": "beige"},
                        meta: 'Total amount contributed till date'
                    },
                    {
                        description: "Number Of Requests",
                        header: this.props.summary.numRequest,
                        style: {"background-color": "beige"},
                        meta: 'Number of requests for payment'
                    },
                    {
                        description: "No. of contributors",
                        header: this.props.summary.contributorCount,
                        style: {"background-color": "beige"},
                        meta: 'Number of contributors currently backing this campaign'
                    },
                    {
                        description: "Manager",
                        header: this.props.summary.manager,
                        style: {"background-color": "beige"},
                        meta: 'Address of manager of this project'
                    },
                ]} />
        )
    }

    onInputChange = (e)=>{
        this.setState({contribution: e.target.value})
    }

    onSubmit = async (e)=>{
        e.preventDefault();
        this.setState({loading:true});
        this.setState({errorMessage: ""});
        this.setState({successMessage: ""});
        this.setState({statusMessage: "Processing Transaction..."})
        try{
            const accounts = await web3.eth.getAccounts();
            console.log(e.target.value);
            await campaign(this.props.query).methods.contribute().send(
                {
                    from: accounts[0],
                    value: this.state.contribution,
                    // gas: '1000000'
                });
            this.setState({successMessage: "Congratulations! You are now a contributor of this project"})
        }catch (error){
            this.setState({errorMessage: error.message})
        }
        this.setState({statusMessage: ""})
        this.setState({loading: false});
    }
    render() {
        return (
            <Layout>
                <h2>{this.props.summary.name}</h2>
                <Grid divided = "vertically" columns = "2">
                    <Grid.Column width = {10}>
                        {this.renderSummary()}

                    </Grid.Column>
                    <Grid.Column width = {5}>
                        <h3>Contribute to this project</h3>
                        <Form onSubmit = {this.onSubmit} error = {this.state.errorMessage!==""}>

                            <Form.Field>
                                <label>Amount</label>
                                <Input
                                    onChange={this.onInputChange}
                                    value = {this.state.contribution}
                                    label = 'wei' labelPosition='right'/>
                            </Form.Field>
                            <Button loading={this.state.loading} disabled={this.state.loading} primary>Contribute !</Button>
                            <Message error header = "Error!" content = {this.state.errorMessage} />
                        </Form>
                        <Message hidden = {this.state.successMessage===""} success header = "Success!" content = {this.state.successMessage} />
                        <Message hidden = {this.state.statusMessage===""} header = "Please Wait!" content = {this.state.statusMessage} />
                    </Grid.Column>
                    <Grid.Row>
                        <Button primary onClick={()=>{Router.pushRoute(`/campaign/${this.props.query}/requests`)}}>View Requests</Button>
                    </Grid.Row>
                </Grid>

            </Layout>

        )
    }
}
export default CampaignShow;