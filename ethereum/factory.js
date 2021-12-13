import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const instance= new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x217618a144BDAB9a0b4d312914DD7e36Ae9819B8'
)

export default instance;