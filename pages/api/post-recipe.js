const azure = require("azure-storage");

const postRecipe = async (req, res) => {
  const { id, title, ingredients } = req.body;
  if (!id || !title || !ingredients) {
    res.status(500).send({ error: "Missing data in body of request" });
    return;
  }

  const tableService = azure.createTableService();
  const entGen = azure.TableUtilities.entityGenerator;
  const entity = {
    PartitionKey: entGen.String("allRecipes"),
    RowKey: entGen.String(id),
    title,
    ingredients,
  };

  try {
    await tableService.insertOrReplaceEntity("dveswn", entity, () => {});
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

export default postRecipe;
