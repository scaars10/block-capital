import React, {Component} from "react";
import Layout from "../../components/layout";
import {Form, Button, Input, Message} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

import {Router} from '../../routes'
class CampaignNew extends Component{

    constructor(props) {
        super(props);
        this.state = {
            minContribution: '',
            name: '',
            errorMessage: '',
            loading: false
        }
    }
    render() {
        return (
            <Layout>
                <h3>Create a New Campaign</h3>
                <Form onSubmit = {this.onSubmit} error = {this.state.errorMessage!==""}>
                    <Form.Field>
                        <label>Give a name to your project</label>
                        <Input
                            onChange={this.onNameChange}
                            value = {this.state.name}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            onChange={this.onInputChange}
                            value = {this.state.minContribution}
                            label = 'wei' labelPosition='right'/>
                    </Form.Field>
                    <Button loading={this.state.loading} disabled={this.state.loading} primary>Create !</Button>
                    <Message error header = "Error!" content = {this.state.errorMessage} />
                </Form>
            </Layout>
        )
    }
    onInputChange = (event)=>{
        this.setState({minContribution: event.target.value})
    }

    onNameChange = (event)=>{
        this.setState({name: event.target.value})
    }

    onSubmit = async (event)=>{
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''})
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minContribution, this.state.name).send(
                {from: accounts[0]}
            )
            Router.pushRoute('/');
        }catch(error){
            this.setState({errorMessage: error.message})
        }
        this.setState({loading: false})
    }
}
export default CampaignNew;