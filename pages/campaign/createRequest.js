import React, {Component} from "react";
import Layout from "../../components/layout";
import {Button, Form, Input, Message} from "semantic-ui-react";
import Campaign from "../../ethereum/campaign"
import web3 from "../../ethereum/web3";
import {error} from "next/dist/build/output/log";
class CreateRequest extends Component{
    constructor(props) {
        super(props);
        this.state = {description:"", amount: "",  recipient: "", loading: false, error: "", status: "", success: ""}
    }

    static async getInitialProps(props){
        const query = props.query.address;
        return {query: query}
    }
    onSubmit = async (e)=>{
        e.preventDefault();
        this.setState({loading: true})
        this.setState({status: "Processing Request!"})
        this.setState({success: ""})
        this.setState({error: ""})
        try{
            const accounts = await web3.eth.getAccounts()
            await Campaign(this.props.query).methods.createRequest(this.state.description, this.state.amount, this.state.recipient).send({
                from: accounts[0]
            })
        }catch(e){

            this.setState({error: e.message, loading: false, status: ''})
            return
        }
        this.setState({loading: false, status: "", success: "Congratulations! Request Created"})

    }
    render(){
        return (
            <Layout>
                <h3>Create New Request</h3>
                <Form onSubmit = {this.onSubmit} style = {{"overflowWrap" : "break-word"}}>
                    <Form.Field>
                        <label>What is the purpose of this request for transaction</label>
                        <Input onChange={(e)=>{this.setState({description: e.target.value})}}
                            value = {this.state.description}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Amount required for this transaction</label>
                        <Input onChange={(e)=> {this.setState({amount: e.target.value})}}
                         value = {this.state.amount} label = 'wei' labelPosition='right' />
                    </Form.Field>

                    <Form.Field>
                        <label>Address of recipient of transaction</label>
                        <Input onChange={(e)=>{this.setState({recipient: e.target.value})}}
                               value = {this.state.recipient}
                        />
                    </Form.Field>
                    <Button loading={this.state.loading} disabled={this.state.loading} primary>Create Request!</Button>

                </Form>
                <Message hidden = {this.state.error===""} error header = "Error!" content = {this.state.error} />
                <Message hidden = {this.state.success===""} success header = "Success!" content = {this.state.success} />
                <Message hidden = {this.state.status===""} header = "Please Wait!" content = {this.state.status} />

            </Layout>

        )
    }
}
export default CreateRequest