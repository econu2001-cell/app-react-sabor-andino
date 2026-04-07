import React from "react";

const CompRecetaCard = React.memo(({ meal }) => {
  if (!meal) return null;

  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100">
        <img
          src={meal.strMealThumb}
          className="card-img-top"
          alt={meal.strMeal}
        />
        <div className="card-body">
          <h6>{meal.strMeal}</h6>
          <p><b>Categoría:</b> {meal.strCategory}</p>
          <p><b>País:</b> {meal.strArea}</p>
        </div>
      </div>
    </div>
  );
});

export default CompRecetaCard;