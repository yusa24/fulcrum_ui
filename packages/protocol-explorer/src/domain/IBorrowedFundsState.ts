import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export interface IBorrowedFundsState {
  loanId: string;
  loanAsset: Asset;
  collateralAsset: Asset;
  amount: BigNumber;
  amountOwed: BigNumber;
  amountOwedUsd: BigNumber;
  collateralAmount: BigNumber;
  interestRate: BigNumber;
  interestOwedPerDay: BigNumber;
  collateralizedPercent: BigNumber;
  hasManagementContract: boolean;
  isInProgress: boolean;
  maxLiquidatable: BigNumber;
  maxSeizable: BigNumber;
  loanData?: {
    loanId: string;
    loanToken: string;
    collateralToken: string;
    principal: BigNumber;
    collateral: BigNumber;
    interestOwedPerDay: BigNumber;
    interestDepositRemaining: BigNumber;
    startRate: BigNumber;
    startMargin: BigNumber;
    maintenanceMargin: BigNumber;
    currentMargin: BigNumber;
    maxLoanTerm: BigNumber;
    loanEndTimestamp: BigNumber;
    maxLiquidatable: BigNumber;
    maxSeizable: BigNumber;
  };
}