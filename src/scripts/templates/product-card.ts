import { type Food } from '../types/food.type'

export const productTemplate = (
  deleteIcon: string,
  editIcon: string,
  food: Food
): string => {
  return ` <img
  src="${deleteIcon}"
  alt="Cross Icon"
  class="secondary-icon delete-btn"
  data-id="${food.id}"
/>
<div class="d-flex-col product-wrapper">
  <img
    src="${food.imageUrl}"
    alt="${food.name}"
    class="primary-product"
  />
  <div class="d-flex-col product-content-wrapper">
    <p class="product-name">${food.name}</p>
    <div class="d-flex-center product-detail">
      $ ${food.price}
      <div class="separate"></div>
      ${food.quantity} Bowls
    </div>
  </div>
</div>

<button class="d-flex-center product-mutation mutation" data-id="${food.id}">
  <img
    src="${editIcon}"
    alt="Edit Icon"
    class="primary-icon mutation"
    data-id="${food.id}"
  />
  <p class="mutation-content mutation" data-id="${food.id}">Edit dish</p>
</button>`
}
