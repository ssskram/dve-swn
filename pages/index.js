import Head from "next/head";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [allRecipes, setAllRecipes] = useState(null);

  // when compopnent mounts, fetch the recipes from db
  useEffect(() => {
    fetch(`/api/get-recipes`)
      .then((res) => res.json())
      .then((data) => setAllRecipes(data))
      .catch((err) => console.error(err));
  }, []);

  const saveRecipe = async (event) => {
    event.preventDefault();
    const { recipeTitle, recipeIngredients } = event.currentTarget.elements;
    const recipeObj = {
      id: uuidv4(),
      title: recipeTitle.value,
      ingredients: recipeIngredients.value,
    };
    return await fetch(`/api/post-recipe`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(recipeObj),
    })
      .then(() => {
        // reset the form
        document.getElementById("recipeForm").reset();
        // once recipe is persisted in db, add it to local state
        const newArray = [...allRecipes, recipeObj];
        setAllRecipes(newArray);
      })
      .catch((err) => console.error(err));
  };

  const deleteRecipe = async (recipeId) => {
    event.preventDefault();
    return await fetch(`/api/delete-recipe`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: recipeId,
      }),
    })
      .then(() => {
        // once recipe is removed from db, delete it from local state
        const existingStateArray = [...allRecipes];
        const filteredStateArray = existingStateArray.filter(
          (i) => i.id !== recipeId
        );
        setAllRecipes(filteredStateArray);
      })
      .catch((err) => console.error(err));
  };

  if (!allRecipes) {
    return <div>...loading recipes</div>;
  } else {
    return (
      <div>
        <Head>
          <title>Recipe Shits</title>
        </Head>

        <div>
          <form id="recipeForm" onSubmit={saveRecipe}>
            <label htmlFor="recipeTitle">Recipe title</label>
            <br />
            <input
              type="text"
              id="recipeTitle"
              name="recipeTitle"
              placeholder="Enter recipe title"
            />
            <br />
            <label htmlFor="recipeIngredients">Recipe ingredients</label>
            <br />
            <input
              type="text"
              id="recipeIngredients"
              name="recipeIngredients"
              placeholder="List ingredients"
            />
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>

        <div style={{ marginBottom: "100px" }}>
          <h2>All recipes</h2>
          {allRecipes.map((recipe) => (
            <div key={recipe.id} style={{ padding: "5px" }}>
              <div>Recipe id: {recipe.id}</div>
              <div>Recipe title: {recipe.title}</div>
              <div>Recipe ingredients: {recipe.ingredients}</div>
              <button onClick={() => deleteRecipe(recipe.id)}>
                Delete recipe
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
