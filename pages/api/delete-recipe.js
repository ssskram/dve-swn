const azure = require("azure-storage");

const deleteRecipe = (req, res) => {
  const recipeId = req.body.id;
  if (!recipeId) {
    res.status(500).send({ error: "Missing recipe id in body of request" });
    return;
  }

  const tableService = azure.createTableService();
  const entGen = azure.TableUtilities.entityGenerator;
  const entity = {
    PartitionKey: entGen.String("allRecipes"),
    RowKey: entGen.String(recipeId),
  };

  tableService.deleteEntity("dveswn", entity, null, function (error, result) {
    if (!error) {
      res.status(200).end();
    } else {
      console.error(error);
      res.status(500).end();
    }
  });
};

export default deleteRecipe;
