import React, { useEffect, useState } from "react";
import axios from "axios";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [newItems, setNewItems] = useState({}); // { categoryPk: "item name", ... }

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(
        "https://wqv9qqun1j.execute-api.us-east-1.amazonaws.com/getAll"
      );
      setInventory(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  // Add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const category = newCategory.trim();
    if (!category) return;

    try {
      // You need a backend endpoint to create a category
      await axios.post(
        "https://wqv9qqun1j.execute-api.us-east-1.amazonaws.com/createCategory",
        { category }
      );
      fetchInventory()
      setNewCategory("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // Add a new item inside a category
  const handleAddItem = async (category) => {
    const itemName = (newItems[category] || "").trim();
    if (!itemName) return;

    try {
      const res = await axios.post(
        `https://wqv9qqun1j.execute-api.us-east-1.amazonaws.com/createItem?category=${encodeURIComponent(category)}`,
        { itemName }
      );
      console.log("response from handle add item", res.data)
      fetchInventory()
      setNewItems((prev) => ({ ...prev, [category]: "" }));
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (category) => {
    console.log(category)
    if (!window.confirm(`Are you sure you want to delete category "${category}"?`))
      return;

    try {
      // You need a backend endpoint to delete a category
      await axios.delete(
        `https://wqv9qqun1j.execute-api.us-east-1.amazonaws.com/deleteCategory?category=${encodeURIComponent(category)}`
      );
      fetchInventory()
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Edit item name
  // const handleUpdate = async (category, index) => {
  //   const currentItem = inventory.find((entry) => entry.pk === category).list[index];
  //   const updatedName = prompt("New name:", currentItem);
  //   if (updatedName === null) return;

  //   try {
  //     const res = await axios.put(
  //       "https://wqv9qqun1j.execute-api.us-east-1.amazonaws.com/update",
  //       {
  //         category,
  //         index,
  //         name: updatedName.trim(),
  //       }
  //     );
  //     setInventory(res.data);
  //   } catch (err) {
  //     console.error("Error updating item:", err);
  //   }
  // };

  // Delete item
  const handleDeleteItem = async (category, item) => {
    console.log(category)
    console.log(item)
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(
        `https://wqv9qqun1j.execute-api.us-east-1.amazonaws.com/deleteItem?category=${encodeURIComponent(category)}`,
        {
          item
        }
      );
      fetchInventory()
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <div className="container pb-3">
      <h2>Current Inventory</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        inventory.map((entry) => (
          <div key={entry.pk} className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="text-primary border-bottom pb-1">{entry.pk}</h4>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteCategory(entry.pk)}
              >
                Delete Category
              </button>
            </div>

            <div className="row">
              {(entry.list || []).map((item, idx) => (
                <div className="col-md-4 mb-3" key={idx}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{item}</h5>
                      {/* <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleUpdate(entry.pk, idx)}
                      >
                        Edit
                      </button> */}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteItem(entry.pk, item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new item input */}
            <div className="input-group mb-4">
              <input
                type="text"
                className="form-control"
                placeholder={`Add new item to ${entry.pk}`}
                value={newItems[entry.pk] || ""}
                onChange={(e) =>
                  setNewItems((prev) => ({ ...prev, [entry.pk]: e.target.value }))
                }
              />
              <button
                className="btn btn-primary"
                onClick={() => handleAddItem(entry.pk)}
              >
                Add Item
              </button>
            </div>
          </div>
        ))
      )}

      <hr className="my-5" />

      <h3>Add New Category</h3>
      <form onSubmit={handleAddCategory} className="row g-3">
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default Inventory;