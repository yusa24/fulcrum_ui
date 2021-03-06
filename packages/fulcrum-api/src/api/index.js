import { Router } from 'express';
import Fulcrum from "../fulcrum";
import Torque from "../torque";
import Web3 from 'web3';

import { query, oneOf, validationResult } from 'express-validator';
import { iTokens } from '../config/iTokens';

import QueuedStorage from "../QueuedStorage";

export default ({ config, logger }) => {

	const api = Router();

	const storage = new QueuedStorage();

	(async () => {
		await storage.init({
			dir: 'persist-storage'
		});
	})()
	const web3 = new Web3(new Web3.providers.HttpProvider(config.web3_provider_url));


	const fulcrum = new Fulcrum(web3, storage, logger);
	const torque = new Torque(web3, storage, logger);

	api.get('/total-asset-supply', async (req, res) => {
		const totalAssetSupply = await fulcrum.getTotalAssetSupply();
		res.json({data: totalAssetSupply, success: true});
	});

	api.get('/total-asset-borrow', async (req, res) => {
		const totalAssetBorrow = await fulcrum.getTotalAssetBorrow();
		res.json({data: totalAssetBorrow, success: true});
	});

	api.get('/supply-rate-apr', async (req, res) => {
		const apr = await fulcrum.getSupplyRateAPR();
		res.json({data: apr, success: true});
	});

	api.get('/borrow-rate-apr', async (req, res) => {
		const apr = await fulcrum.getBorrowRateAPR();
		res.json({data: apr, success: true});
	});

	api.get('/torque-borrow-rate-apr', async (req, res) => {
		const torqueBorrowRates = await fulcrum.getTorqueBorrowRateAPR();
		res.json({data: torqueBorrowRates, success: true});
	});

	api.get('/vault-balance', async (req, res) => {
		const vaultBalance = await fulcrum.getVaultBalance();
		res.json({data: vaultBalance, success: true});
	});

	api.get('/liquidity', async (req, res) => {
		const liquidity = await fulcrum.getFreeLiquidity();
		res.json({data: liquidity, success: true});
	});

	api.get('/vault-balance-usd', async (req, res) => {
		const tvl = await fulcrum.getTVL();
		res.json({data: tvl, success: true});
	});

	api.get('/oracle-rates-usd', async (req, res) => {
		const usdRates = await fulcrum.getUsdRates();
		res.json({ data: usdRates, success: true});
	});

	api.get('/itoken-prices', async (req, res) => {
		const usdRates = await fulcrum.getITokensPrices();
		res.json({ data: usdRates, success: true});
	});
	api.get('/ptoken-prices', async (req, res) => {
		const usdRates = await fulcrum.getPTokensPrices();
		res.json({ data: usdRates, success: true});
	});

	api.get('/borrow-deposit-estimate', [
		query('borrow_asset').isIn(iTokens.map(token => token.name)),
		query('borrow_asset').isIn(iTokens.map(token => token.name)),
		query('amount').isFloat({ gt: 0 })
	], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let borrowAsset = req.query.borrow_asset;
		let collateralAsset = req.query.collateral_asset;
		let amount = req.query.amount;
		const borrowDepositEstimate = await torque.getBorrowDepositEstimate(borrowAsset, collateralAsset, amount);
		if (parseFloat(borrowDepositEstimate.depositAmount) === 0 && amount > 0) {

			res.json({ message: "You entered too large amount", success: false, });
		}
		else {
			res.json({ data: borrowDepositEstimate, success: true });
		}
	});

	api.get('*', function(req, res){
		res.status(404).send("Endpoint not found. Go to <a href='https://api.bzx.network'>bZx API docs page</a>");
	  });

	return api;
}
