import React from "react";

const categories = [
  {
    name: "Electronic",
    value: "electronic",
  },
  {
    name: "Home",
    value: "home",
  },
  {
    name: "Fashion",
    value: "fashion",
  },
  {
    name: "Sport",
    value: "sport",
  },
  {
    name: "Book",
    value: "book",
  },
  {
    name: "Toy",
    value: "toy",
  },
];

const ages = [
  {
    name: "0-2 years old",
    value: "0-2",
  },
  {
    name: "3-5 years old",
    value: "3-5",
  },
  {
    name: "6-8 years old",
    value: "6-8",
  },
  {
    name: "9-12 years old",
    value: "9-12",
  },
  {
    name: "13+ years old",
    value: "12-20",
  },
];

function Filters({ showFilters, setShowFilters, filters, setFilters }) {
  return (
    <div className="w-72 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-orange-900  text-xl">Filters</h1>
        <i
          className="ri-close-line  text-xl cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
        ></i>
      </div>

      <div className="flex flex-col gap-1 mt-5">
        <h1 className="text-gray-600">Categories</h1>

        <div className="flex flex-col">
          {categories.map((category) => {
            const categoryId = `category-${category.value}`;
            return (
              <div className="flex items-center gap-2" key={categoryId}>
                <input
                  type="checkbox"
                  id={categoryId}
                  name="category"
                  className="max-width"
                  checked={filters.category.includes(category.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        category: [...filters.category, category.value],
                      });
                    } else {
                      setFilters({
                        ...filters,
                        category: filters.category.filter(
                          (item) => item !== category.value
                        ),
                      });
                    }
                    console.log('Updated Filters:', filters);
                  }}
                />
                <label htmlFor={categoryId}>{category.name}</label>
              </div>
            );
          })}
        </div>

        <h1 className="text-gray-600 mt-5">Ages</h1>

        <div className="flex flex-col">
          {ages.map((age) => {
            const ageId = `age-${age.value}`;
            return (
              <div className="flex gap-2 items-center" key={ageId}>
                <input
                  type="checkbox"
                  id={ageId}
                  name="age"
                  className="max-width"
                  checked={filters.age.includes(age.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        age: [...filters.age, age.value],
                      });
                    } else {
                      setFilters({
                        ...filters,
                        age: filters.age.filter((item) => item !== age.value),
                      });
                    }
                    console.log('Updated Filters:', filters);
                  }}
                />
                <label htmlFor={ageId}>{age.name}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Filters;
