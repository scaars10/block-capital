import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const instance= new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x54D23FaE01006e7f164cD531B66CEF433886bB06'
)

export default instance;