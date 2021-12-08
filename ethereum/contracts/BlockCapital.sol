pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    mapping(address => string) public nameCampaigns;
    function createCampaign(uint minimum, string name) public {
        address newCampaign = new Campaign(minimum, name, msg.sender);
        nameCampaigns[newCampaign] = name;
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => uint) approvals;
    }

    Request[] public requests;
    address public manager;
    string public name;
    uint public minimumContribution;
    uint public totalContribution;
    mapping(address => uint) public contributors;

    uint public contributorCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, string nameContract, address creator) public {
        manager = creator;
        name = nameContract;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        totalContribution += msg.value;
        contributors[msg.sender] += msg.value;
        contributorCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
        description: description,
        value: value,
        recipient: recipient,
        complete: false,
        approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(contributors[msg.sender]>0);
        // require(!request.approvals[msg.sender]);
        uint prevContribution = request.approvals[msg.sender];
        request.approvals[msg.sender] = contributors[msg.sender];

        request.approvalCount+= contributors[msg.sender] - prevContribution;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (totalContribution / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint, string, uint, uint, uint, uint, address){
        return (
        minimumContribution,
        name,
        this.balance,
        requests.length,
        totalContribution,
        contributorCount,
        manager
        );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }
}