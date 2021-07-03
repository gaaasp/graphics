import { getUpdates } from "../utils";

module.exports = async (_req, res) => {
	const { added, removed } = await getUpdates();
	res.json({ added, removed });
};
