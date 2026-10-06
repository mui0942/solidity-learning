import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const mintingAMmount = 100n;
const decimals = 18n;

describe("Mytoken", () => {
  let myTokenC: MyToken;
  let signers: HardhatEthersSigner[];
  beforeEach("should deploy", async () => {
    signers = await hre.ethers.getSigners();
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      18,
      100,
    ]);

    //console.log(await myTokenC.name());
  });
  describe("Basic state value check", () => {
    it("should return name", async () => {
      expect(await myTokenC.name()).equal("MyToken");
    });
    it("should return symbol", async () => {
      expect(await myTokenC.symbol()).equal("MT");
    });
    it("should return decimals", async () => {
      expect(await myTokenC.decimals()).equal(decimals);
    });
    it("should return 100 total supply", async () => {
      expect(await myTokenC.totalSupply()).equal(
        mintingAMmount * 10n ** decimals,
      );
    });
  });

  describe("Mint", () => {
    it("should return 1MT balance for signer0", async () => {
      const signer0 = signers[0];
      expect(await myTokenC.balanceof(signer0)).equal(
        mintingAMmount * 10n ** decimals,
      );
    });
  });
  describe("Transfer", () => {
    it("should have 0.5MT ", async () => {
      const signer0 = signers[0];
      const signer1 = signers[1];
      await expect(
        myTokenC.transfer(
          hre.ethers.parseUnits("0.5", decimals),
          signer1.address,
        ),
      )
        .to.emit(myTokenC, "Transfer")
        .withArgs(
          signer0.address,
          signer1.address,
          hre.ethers.parseUnits("0.5", decimals),
        );
      expect(await myTokenC.balanceof(signer1.address)).equal(
        hre.ethers.parseUnits("0.5", decimals),
      );
    });
    it("should be reverted with insufficient balance error  ", async () => {
      const signer1 = signers[1];
      await expect(
        myTokenC.transfer(
          hre.ethers.parseUnits((mintingAMmount + 1n).toString(), decimals),
          signer1.address,
        ),
      ).to.be.revertedWith("insufficient balance");
    });
  });
  describe("TransferFrom", () => {
    it("should emit Approval event", async () => {
      const signer1 = signers[1];
      await expect(
        myTokenC.approve(signer1, hre.ethers.parseUnits("10", decimals)),
      )
        .to.emit(myTokenC, "Approval")
        .withArgs(signer1.address, hre.ethers.parseUnits("10", decimals));
    });
    it("should be reverted with insufficient allowance error", async () => {
      const signer0 = signers[0];
      const signer1 = signers[1];
      await expect(
        myTokenC
          .connect(signer1)
          .transferFrom(
            signer0.address,
            signer1.address,
            hre.ethers.parseUnits("1", decimals),
          ),
      ).to.be.revertedWith("insufficient allowance");
    });
    it("transfer approved from signer0 to signer1", async () => {
      const signer0 = signers[0];
      const signer1 = signers[1];

      //signer 1 에게 권한 부여
      await myTokenC.approve(
        signer1.address,
        hre.ethers.parseUnits("10", decimals),
      );
      //signer 1 이 signer 0으로 부터 토큰을 가져온다
      await myTokenC
        .connect(signer1)
        .transferFrom(
          signer0.address,
          signer1.address,
          hre.ethers.parseUnits("10", decimals),
        );
      //signer 1이 입금 받은지 확인
      expect(await myTokenC.balanceof(signer1.address)).equal(
        hre.ethers.parseUnits("10", decimals),
      );
      //signer 0의 잔고 확인
      expect(await myTokenC.balanceof(signer0.address)).equal(
        mintingAMmount * 10n ** decimals -
          hre.ethers.parseUnits("10", decimals),
      );
    });
  });
});
