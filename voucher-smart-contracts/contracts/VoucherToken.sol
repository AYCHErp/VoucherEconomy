pragma solidity ^0.5.10;

import "./lib/Ownable.sol";
import "./lib/SafeMath.sol";
import "./lib/SigLib.sol";

contract VoucherToken is Ownable {

    using SafeMath for uint256;

    /////
    // Constants
    /////

    uint8 public constant decimals = 18;
    bytes4 public constant metaBurnSig = bytes4(keccak256(abi.encodePacked("metaBurn(bytes32,uint256,uint256)")));

    /////
    // Storage
    /////

    uint256 public totalSupply;
    string public name;
    string public symbol;

    // user => balance
    mapping (address => uint256) public balances;

    // user => nonce
    mapping (address => uint256) public burnNonces;

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
    function burn(uint256 _amt) external returns (bool) {
        return _burn(msg.sender, _amt);
    }

    // Meta transaction to burn tokens with no reward
    // TODO: consider implementing EIP712 signatures, but balance with
    // added complexity of signing implementation
    function metaBurn(
        bytes memory _sig,
        uint256 _nonce,
        uint256 _amt
    )
        public
        returns (bool)
    {
        // signatures must be 65 bytes
        require(_sig.length == 65);

        // get the hash that was signed
        bytes32 hash = getBurnHash(_nonce, _amt);

        address signer = SigLib.recoverSig(_sig, hash);
        require(_nonce == burnNonces[signer]);
        burnNonces[signer]++;

        _burn(signer, _amt);
    }

    /////
    // View / pure functions
    /////

    function getBurnHash(uint256 _nonce, uint256 _amt)
        public
        view
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(address(this), metaBurnSig, _nonce, _amt));
    }

    /////
    // Internal functions
    /////

    function _burn(address _src, uint256 _amt) internal returns (bool) {
        // this also checks that balances[_src] > _amt
        balances[_src] = balances[_src].sub(_amt);
        totalSupply = totalSupply.sub(_amt);
        emit Burn(_src, _amt);
    }
}
