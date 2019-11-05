pragma solidity ^0.5.10;

library SigLib {

    function parseSig(bytes memory _sig)
        internal
        pure
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        // The signature format is a compact form of:
        // {bytes32 r}{bytes32 s}{uint8 v}  (uint8 is not padded)
        assembly {
            // first 32 bytes are the sig length
            let sigPtr := add(_sig, 0x20)

            // r is the first 32 bytes of the data part of the sig
            r := mload(sigPtr)

            // s is bytes [32, 63] of the data part of the sig
            s := mload(add(sigPtr, 0x20))

            // byte(n, x) => nth byte of x, where 0th byte is most significant
            // v is the last byte of the sig - 65th byte, or the 0th byte of
            // bytes [64, 95]
            v := byte(0, mload(add(sigPtr, 0x40)))
        }
    }

    function recoverSig(bytes memory _sig, bytes32 _hash)
        internal
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = parseSig(_sig);
        return ecrecover(_hash, v, r, s);
    }
}
