import {createMemo, createSignal} from "solid-js";

export default function App() {
	const powerSupplyCoofs = new Map([
		["PC", 0.15],
		["Laptop", 0.06],
		["Smartphone", 0.01],
		["TV", 0.05],
	]);
	const energySupplyCoofs = new Map([
		["Netflix / YouTube (HD videos)", 0.15],
		["Netflix / YouTube (4K videos)", 0.6],
		["TikTok", 0.1]
	]);
	const regionCoofs = new Map([
		["Europe", 300],
		["USA", 400],
		["Country using renewable energy sources", 50],
	]);

	const [spentTime, setSpentTime] = createSignal("0");
	const [powerSupply, setPowerSupply] = createSignal(powerSupplyCoofs.values().next().value + '');
	const [energySupply, setEnergySupply] = createSignal(energySupplyCoofs.values().next().value + '');
	const [region, setRegion] = createSignal(regionCoofs.values().next().value + '');

	let calc = createMemo(() => {
		const grams = Number.parseInt(spentTime()) * Number.parseFloat(powerSupply()) * Number.parseFloat(energySupply()) * Number.parseInt(region());
		if (isNaN(grams)) {
			return "0 Grams";
		}

		const kilograms = grams / 1000;

		if (Math.floor(kilograms) > 0) {
			return Math.round(kilograms * 10) / 10 + " Kilograms";
		} else {
			return Math.round(grams * 10) / 10 + " Grams";
		}
	});

	return (<>
		<div>
			<h1>CO<sub>2</sub> Calculator</h1>
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
	</>);
}
