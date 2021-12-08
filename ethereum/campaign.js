import web3 from "./web3";
import Campaign from "./build/Campaign.json";
const campaign = (address)=> {
    const campaign = new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        address
    )
    return campaign;
}
export default campaign;