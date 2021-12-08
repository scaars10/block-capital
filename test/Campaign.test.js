const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const should = require('should')
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('1000', 'indie game with true true to life ai').send({
        from: accounts[0],
        gas: '1000000'
    });
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface), campaignAddress);
    
});

describe('Campaigns', ()=>{
    it('deploys a factory and a campaign', async ()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
        
    });


    it('marks creator as manager', async ()=>{
        const manager = await campaign.methods.manager().call();
        assert(manager == accounts[0]);
    
    })
    it('only manager can create request', async ()=>{

        await campaign.methods.createRequest("Battery Packs", '1000', accounts[1]).send({
            from: accounts[0],
            gas: 1000000
        })
        const request = await campaign.methods.requests(0).call()
        assert.equal("Battery Packs", request.description);

        try{
            await campaign.methods.createRequest("Battery Packs", '1000', accounts[1]).send({
                from: accounts[1],
                gas: 1000000
            })
            
        }
        catch(error){
            assert(error);
            return;
        }
        assert(false);
        
        // console.log("result is "+JSON.stringify(res));
    });

    it('allows users to contribute to a campaign', async ()=>{
        const value = 2000
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: value
        })

        const verifyContributor = parseInt(await campaign.methods.contributors(accounts[2]).call());
        // console.log(`Returned Contribution ${typeof(verifyContributor)}  ${typeof(value)}`)
        // console.log(parseInt(verifyContributor) === value);
        assert(verifyContributor === value);

    });

    it('requires a minimum contribution', async ()=>{
        try{
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: 999
            });
        }
        catch(error){
            assert(error);
            return;
        }
        assert(false)
    })

    it('funds get transferred after request is accepted', async ()=>{
        const value = 5
        await campaign.methods.createRequest("Battery Packs", web3.utils.toWei(`${value}`, 'ether'), accounts[3]).send({
            from: accounts[0],
            gas: 1000000
        })
        let initialBalance = await web3.eth.getBalance(accounts[3]);
        initialBalance = web3.utils.fromWei(initialBalance, 'ether')

        // add a contributor
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: web3.utils.toWei(`${value}`, 'ether')
        })

        await campaign.methods.approveRequest(0).send({
            from: accounts[2]
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0]
        })

        let finalBalance = await web3.eth.getBalance(accounts[3]);
        finalBalance = web3.utils.fromWei(finalBalance, 'ether')
        console.log(finalBalance - initialBalance)
        // console.log(`Initial Balance:- ${initialBalance} \nDifference in balance:- ${finalBalance - initialBalance}`);
        assert(finalBalance - initialBalance === value);
        // console.log(await campaign.methods.getSummary().call())
    })
    
})