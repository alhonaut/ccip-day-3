import { ethers, run, network } from "hardhat";
import { SupportedNetworks, getCCIPConfig } from "../ccip.config";
import { createOrUpdateConfigFile } from "./helper";

/**
 * Deploys and verifies the Receiver contract on a specified network.
 * @param network The network where the Receiver contract will be deployed.
 */
async function deployAndVerifyReceiver(network: SupportedNetworks) {
    // Retrieve router address for the specified network from the CCIP configuration.
    const { router, comet, usdcToken, fauceteer } = getCCIPConfig(network);

    console.log(`Deploying Receiver contract on ${network}...`);

    const SwapFactory = await ethers.getContractFactory("SwapTestnetUSDC");
    const swap = await SwapFactory.deploy(usdcToken, usdcToken, fauceteer) // Compound use the same USDC for Lending (so put second paramenert of Compound TOken to USDC)
    await swap.waitForDeployment();


    const ReceiverFactory = await ethers.getContractFactory("CrossChainReceiver");
    const receiver = await ReceiverFactory.deploy(router, comet, swap.target);

    await receiver.waitForDeployment();

    const tx = receiver.deploymentTransaction();
    if (tx) {
        console.log("wait for 5 blocks");

        // Wait for 5 confirmations to ensure the transaction is well-confirmed on the network.
        await tx.wait(5);

        const receiverAddress = await receiver.getAddress();
        console.log("Receiver contract deployed at:", receiverAddress);

        console.log(`Verifying Receiver contract on ${network}...`);
        try {
            await run("verify:verify", {
                address: receiverAddress,
                constructorArguments: [router],
            });
            console.log(`Receiver contract verified on ${network}!`);
        } catch (error) {
            console.error("Error verifying Receiver contract:", error);
        }

        await createOrUpdateConfigFile(network, { receiverAddress });
    }
}

deployAndVerifyReceiver(network.name as SupportedNetworks).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
