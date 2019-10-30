pragma solidity ^0.5.10;

import "./lib/Ownable.sol";
import "./lib/SafeMath.sol";

contract VoucherToken is Ownable {

    using SafeMath for uint256;

    /////
    // Constants
    /////

    uint8 public constant decimals = 18;

    /////
    // Storage
    /////

    uint256 public totalSupply;
    string public name;
    string public symbol;

    // user => balance
    mapping (address => uint) public balances;

    /////
    // Events
    /////

    event Mint(address indexed src, address indexed dst, bytes32 indexed tag, uint256 amt);
    event Burn(address indexed src, uint256 amt);

    /////
    // Constructor
    /////

    /**
     * @dev Constructor
     * @param _name Token name.
     * @param _symbol Token symbol.
    */
    constructor(string memory _name, string memory _symbol)
        public
    {
        name = _name;
        symbol = _symbol;
    }

    /////
    // External functions
    /////

    /**
     * @dev Generates `_amt` new tokens in `_dst`'s balance
     * @param _dst Address to mint new tokens to.
     * @param _amt Amount of tokens to mint.
    */
    function mint(address _dst, uint256 _amt, bytes32 _tag) external onlyOwner {
        balances[_dst] = balances[_dst].add(_amt);
        totalSupply = totalSupply.add(_amt);
        emit Mint(msg.sender, _dst, _tag, _amt);
    }

    /**
     * @dev Removes `_amt` of tokens from `_dst`
     * @param _amt Amount of tokens to burn
    */
    function burn(uint256 _amt) external {
        balances[msg.sender] = balances[msg.sender].sub(_amt);
        totalSupply = totalSupply.sub(_amt);
        emit Burn(msg.sender, _amt);
    }

}
