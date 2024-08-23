# Sample Hardhat Project

This project a part of CCIP bootcamp, especially day 3.

To find out the use of gas by `ccipReceive` function i use Tenderly Dashboard
https://dashboard.tenderly.co/tx/sepolia/0x45d7eb015f1805e476a344c881f188a8fce01a4da7ec47d9510e93884d5cabb0/debugger?trace=0.0.0.7.0.0.2

After looking I found that ccip message used 162300 gas amount, so i increase gasLimit in 10% to 178000

After that I try to send message with updated gasLimit and receive success
https://ccip.chain.link/msg/0x0cca0f94ed069be0c5b198a62c8f157c7013f04073f7a1c3c4351b40df6b392a
