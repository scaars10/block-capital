import React, {Component} from "react";
import Campaign from "../../ethereum/campaign"
import {Link} from "../../routes";
import {Button, Card, Message, Progress} from "semantic-ui-react";
import Layout from "../../components/layout";
import web3 from "../../ethereum/web3";
import campaign from "../../ethereum/campaign";
class Requests extends Component{

    constructor(props){
        super(props);
        this.state = {requestButton:"", requestList: "", account: "", error: ""}
    }

    static async getInitialProps(props){
        const query = props.query.address;
        const campaign = Campaign(query);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const manager = await campaign.methods.manager().call();
        const totalContribution = await campaign.methods.totalContribution().call()

        // console.log(manager)
        // console.log(`Address ${props.query.address}`)
        // console.log(`Request Count ${requestCount}`)
        const requests = []
        for(let index = 0; index< requestCount; index++){
           // await Promise.all(Array(requestCount).map( async (_, index)=>{
           //  console.log(`Request Count ${requestCount}`)
           //  console.log(index)
            const request = await campaign.methods.requests(index).call()
            // console.log(request)
            requests.push(request);

        }
        // console.log(requestCount)
        return{
            query: query,
            requests: requests,
            requestCount: requestCount,
            totalContribution: totalContribution,
            manager: manager
        };
    }
    onApprove = async (e)=>{
        const id = parseInt(e.target.getAttribute('id'))
        this.setState({error: ""})
        // console.log(id)
        // console.log(this.props.query)
        // console.log(Campaign)
        try{
            const account = (await web3.eth.getAccounts())[0];

            // console.log(num)
            await Campaign(this.props.query).methods.approveRequest(id).send({
                from: account
            });
        }catch(err){
            this.setState({error:err.message})
        }

    }

    onFinalize = async(e) =>{
        const id = parseInt(e.target.getAttribute('id'))
        this.setState({error: ""})
        try{
            const account = (await web3.eth.getAccounts())[0];
            await Campaign(this.props.query).methods.finalizeRequest(id).send({
                from: account
            });
        }catch(err){
            this.setState({error: err.message})
        }

    }
    renderNewRequestButton = async ()=>{
        const accounts = await web3.eth.getAccounts();
        if(accounts[0]===this.props.manager){
            this.setState(
                {requestButton: (<Link route={`/campaign/${this.props.query}/requests/new`}>
                    <a>
                        <Button
                            content='Create New Request' icon = 'add'
                            labelPosition= 'left' primary floated = "right"
                        />
                    </a>

                </Link>)
                }
            )
        }

    }
    renderRequests = async ()=>{
        const account = (await web3.eth.getAccounts())[0];
        const items = this.props.requests.map((req, id)=>{
            return (<Card key = {id} id = {id}>

                <Card.Content>
                    <Card.Header>
                        {req.description}
                    </Card.Header>
                    <Card.Description>Purpose of request for transaction</Card.Description>
                </Card.Content>
                <Card.Content>
                    <Card.Header>
                        {req.value + " wei"}
                    </Card.Header>
                    <Card.Description>Amount required for transaction</Card.Description>
                </Card.Content>
               <Card.Content>
                   <Card.Header>Approvals from contributors</Card.Header>

                   <Card.Description>
                       <Progress indicating percent={req.approvalCount * 100 / this.props.totalContribution}>
                           {req.approvalCount * 100 / this.props.totalContribution}%
                       </Progress>
                   </Card.Description>

               </Card.Content>
                <Card.Content>
                    <Card.Header>{req.approvalCount + " / "+ this.props.totalContribution}</Card.Header>
                    <Card.Description>Total share approved</Card.Description>
                </Card.Content>
                <Card.Content>
                    <Card.Header>{req.recipient}</Card.Header>
                    <Card.Description>Recipient of the transaction once it is approved</Card.Description>
                </Card.Content>
                {
                    req.complete && <Card.Content>
                        <Message hidden = {this.state.success===""} success header = "Approved" content = "This request has already been approved" />
                    </Card.Content>
                }
                <Card.Content>
                    <Button disabled={req.complete} id = {id} onClick={this.onApprove} content = "Approve this request" primary />
                </Card.Content>
                <Card.Content>
                    {this.props.manager === account && <Button disabled={req.complete} id = {id} onClick={this.onFinalize} content = "Finalize this request" positive />}
                </Card.Content>

                {/*meta: 'What is the purpose of transaction',*/}

            </Card>);
        });
        this.setState({requestList: <Card.Group style = {{"overflowWrap" : "break-word"}} >{items}</Card.Group>})
    }

    componentDidMount() {
        this.renderNewRequestButton();
        this.renderRequests();
    }

    render(){
        return (
            <Layout >

                <h2>Requests for payment</h2>
                <Message style = {{"overflowWrap" : "break-word"}} hidden = {this.state.error===""} error header = "Error!" content = {this.state.error} />
                {this.state.requestButton}

                {this.state.requestList}


            </Layout>
        )
    }
}

export default Requests;