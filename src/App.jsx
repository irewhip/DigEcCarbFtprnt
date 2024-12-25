import {createMemo, createSignal} from "solid-js";

export default function App() {
	const powerSupplyCoofs = new Map([
		["PC", 5.7],
		["Laptop", 2.85],
		["Smartphone", 0.46],
		["TV 50\" 4K", 17.81],
	]);
	const energySupplyCoofs = new Map([
		["Netflix / YouTube (HD videos)", 36],
		["Netflix / YouTube (4K videos)", 84],
		["Netflix / YouTube (SD videos)", 8.4],
		["TikTok", 157.8],
		["Reddit", 148.8],
		["Pinterest", 78],
		["Instagram", 78],
		["Facebook", 47.4],
		["Twitter", 36],
		["Twitch", 33],
		["Snapchat", 52.2],
	]);
	const regionCoofs = new Map([
		["World", 0.719],
		["Ukraine", 0.8730],
		["Japan", 0.789],
		["United Kingdom", 0.596],
		["Germany", 0.44],
		["New Zealand", 0.186],
		["USA", 0.797],
		["Poland", 0.825],
		["Canada", 0.325],
	]);

	const [spentTime, setSpentTime] = createSignal("0");
	const [powerSupply, setPowerSupply] = createSignal(powerSupplyCoofs.values().next().value + '');
	const [energySupply, setEnergySupply] = createSignal(energySupplyCoofs.values().next().value + '');
	const [region, setRegion] = createSignal(regionCoofs.values().next().value + '');

	let calc = createMemo(() => {
		const hours = Number.parseInt(spentTime());
		const wasteDevicePerHour = Number.parseFloat(powerSupply());
		const wastePlatformPerHour = Number.parseFloat(energySupply());
		const shareRegionRES = Number.parseFloat(region());

		const grams = hours * (wasteDevicePerHour + wastePlatformPerHour) * shareRegionRES;
		if (isNaN(grams)) {
			return "0 Grams";
		}

		const kilograms = grams / 1000;
		const tons = kilograms / 1000;

		if (Math.floor(tons) > 0) {
			return Math.round(tons * 10) / 10 + " Tons";
		} else if (Math.floor(kilograms) > 0) {
			return Math.round(kilograms * 10) / 10 + " Kilograms";
		} else {
			return Math.round(grams * 10) / 10 + " Grams";
		}

	});

	const currentYear = new Date(Date.now()).getFullYear();

	return (<>
		<div>
			<h1 className="center">CO<sub>2</sub> Calculator</h1>
			<p>Find out how much <b>carbon dioxide</b> was emitted when you used your favorite online platform</p>
		</div>
		<div className="form">
			<div>
				<label for="spent_time">Time spent on the platform:</label>
				<input name="spent_time" value={spentTime()} min={0} max={999} inputMode="numberic" pattern="[0-9]*" maxLength={3} className="hide" onInput={(e) => {
					const parsed = Math.abs(Number.parseInt(e.target.value));
					setSpentTime(isNaN(parsed)?"":parsed);
					e.target.value = spentTime();
				}} />
				<span> hours</span>
			</div>
			<div>
				<label for="device_type">Type of device:</label>
				<select name="device_type" onChange={(e) => setPowerSupply(e.target.value)}>
					<For each={Array.from(powerSupplyCoofs.keys())}>
						{(coof, _) => <option value={powerSupplyCoofs.get(coof)} select>{coof}</option>}
					</For>
				</select>
			</div>
			<div>
				<label for="platform">Online platform:</label>
				<select name="platform" onChange={(e) => setEnergySupply(e.target.value)}>
					<For each={Array.from(energySupplyCoofs.keys())}>
						{(coof, _) => <option value={energySupplyCoofs.get(coof)} select>{coof}</option>}
					</For>
				</select>
			</div>
			<div>
				<label for="region">Region:</label>
				<select name="region" onChange={(e) => setRegion(e.target.value)}>
					<For each={Array.from(regionCoofs.keys())}>
						{(coof, _) => <option value={regionCoofs.get(coof)} select>{coof}</option>}
					</For>
				</select>
			</div>
		</div>
		<h1>{calc}</h1>
		<p className="copyright">© Oleksandr Yesin 2024{currentYear === 2024 ? "" : " - " + currentYear}. Rivne Regional Scientific Lyceum.<br />All rights reserved.</p>
	</>);
}
