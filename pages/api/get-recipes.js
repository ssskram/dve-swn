const azure = require("azure-storage");
const dt = require("node-json-transform").DataTransform;

const recipeModel = {
  list: "entries",
  item: {
    id: "RowKey._",
    title: "title._",
    ingredients: "ingredients._",
  },
};

const getRecipes = (req, res) => {
  const tableService = azure.createTableService();
  const query = new azure.TableQuery()
    .top(1000)
    .where("PartitionKey eq ?", "allRecipes");
  tableService.queryEntities("dveswn", query, null, function (error, result) {
    if (!error) {
      res.status(200).send(dt(result, recipeModel).transform());
    } else {
      console.error(error);
      res.status(500).send(result);
    }
  });
};

export default getRecipes;
