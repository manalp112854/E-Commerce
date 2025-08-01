import React from "react";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import {
  AppstoreOutlined,
  ArrowUpOutlined,
  BarsOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { SearchContext } from "./SearchContext";
import PageWrapper from "./PageWrapper";

const categories = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];

const PAGE_SIZE = 20;

export default function Products() {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [sort, setSort] = useState("");
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minInput, setMinInput] = useState(0.79);
  const [maxInput, setMaxInput] = useState(14000);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const { searchQuery, selectedCategories, setSelectedCategories } =
    useContext(SearchContext);

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  // Track previous filter state to detect filter clear
  const prevFilterRef = useRef({
    searchQuery: "",
    selectedCategories: [],
    minPrice: null,
    maxPrice: null,
    sort: "",
  });

  // Infinite query with filter state in key
  const queryClient = useQueryClient();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    refetch,
    remove,
  } = useInfiniteQuery({
    queryKey: [
      "products",
      searchQuery,
      selectedCategories,
      minPrice,
      maxPrice,
      sort,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${pageParam}`
      );
      const data = await res.json();
      return {
        products: data.products,
        nextSkip: pageParam + PAGE_SIZE,
        hasMore: data.products.length === PAGE_SIZE,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextSkip : undefined,
  });

  // Filter and sort client-side
  const [filteredProducts, setFilteredProducts] = useState([]);

  function applyFiltersAndSort(products) {
    let filtered = [...products];
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategories.length > 0 && selectedCategories[0] !== "") {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }
    if (minPrice !== null && maxPrice !== null) {
      filtered = filtered.filter(
        (p) => p.price >= minPrice && p.price <= maxPrice
      );
    }
    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "rating-asc") {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sort === "rating-desc") {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    return filtered;
  }

  // Update filteredProducts whenever data or filters change
  useEffect(() => {
    if (data) {
      const combined = data.pages.flatMap((page) => page.products);
      setFilteredProducts(applyFiltersAndSort(combined));
    }
    // eslint-disable-next-line
  }, [data, selectedCategories, sort, searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    // Check if any filter is applied
    const isFilterActive =
      searchQuery.trim() !== "" ||
      (selectedCategories &&
        selectedCategories.length > 0 &&
        selectedCategories[0] !== "") ||
      (minPrice !== null && maxPrice !== null) ||
      !!sort;

    // Detect if filters were just cleared
    const prev = prevFilterRef.current;
    const wasFilterActive =
      prev.searchQuery.trim() !== "" ||
      (prev.selectedCategories &&
        prev.selectedCategories.length > 0 &&
        prev.selectedCategories[0] !== "") ||
      (prev.minPrice !== null && prev.maxPrice !== null) ||
      !!prev.sort;

    // If filters were just cleared, remove query cache to reset to first page
    if (!isFilterActive && wasFilterActive) {
      queryClient.removeQueries([
        "products",
        searchQuery,
        selectedCategories,
        minPrice,
        maxPrice,
        sort,
      ]);
    }

    prevFilterRef.current = {
      searchQuery,
      selectedCategories,
      minPrice,
      maxPrice,
      sort,
    };

    // If filter is active and not enough products, fetch more (if available)
    if (
      isFilterActive &&
      filteredProducts.length < PAGE_SIZE &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
    // eslint-disable-next-line
  }, [
    searchQuery,
    selectedCategories,
    minPrice,
    maxPrice,
    sort,
    filteredProducts,
    hasNextPage,
    isFetchingNextPage,
  ]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Price filter handler
  const applyPriceFilter = () => {
    if (minInput <= maxInput) {
      setMinPrice(minInput);
      setMaxPrice(maxInput);
    }
  };

  // Category checkbox handler
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  function renderFilterSection() {
    return (
      <aside className="sticky top-16 h-[calc(100vh-5rem)] overflow-auto w-64 p-4 border-r border-base-300 bg-base-200 hidden lg:block">
        <h2 className="text-lg font-medium mb-4 text-base-content">
          Filter by Category
        </h2>
        <div className="space-y-2 text-sm text-base-content">
          {displayedCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="checkbox checkbox-xs checkbox-primary"
              />
              <span className="capitalize">{cat.replace("-", " ")}</span>
            </label>
          ))}
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="text-primary text-sm font-medium mt-2 hover:underline cursor-pointer"
          >
            {showAllCategories ? "Show less" : "See all"}
          </button>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-error text-sm font-medium hover:underline cursor-pointer ml-3"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className="mt-6 border-t pt-4 border-base-300">
          <h2 className="text-sm font-medium text-base-content mb-4">
            Price range
          </h2>

          <div className="relative mb-4 flex flex-col">
            <label className="text-sm mb-1 text-base-content">Min</label>
            <input
              type="range"
              min={0.79}
              max={14000}
              value={minInput}
              onChange={(e) => setMinInput(Number(e.target.value))}
              className="range range-primary h-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 mb-2"
            />
            <label className="text-sm mb-1 text-base-content">Max</label>
            <input
              type="range"
              min={0.79}
              max={14000}
              value={maxInput}
              onChange={(e) => setMaxInput(Number(e.target.value))}
              className="range range-primary h-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4"
            />
          </div>

          <div className="flex justify-between mb-3">
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-base-content">Min</label>
              <input
                type="number"
                value={minInput}
                onChange={(e) => setMinInput(Number(e.target.value))}
                className="input input-sm input-bordered w-24"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-base-content">Max</label>
              <input
                type="number"
                value={maxInput}
                onChange={(e) => setMaxInput(Number(e.target.value))}
                className="input input-sm input-bordered w-24"
              />
            </div>
          </div>

          <button
            className="btn btn-sm btn-outline btn-primary w-full"
            onClick={applyPriceFilter}
          >
            Apply
          </button>
        </div>
      </aside>
    );
  }

  function renderFilterHamburger() {
    return (
      <PageWrapper>
        <>
          <div className="lg:hidden p-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-sm bg-base-200 p-2 text-base-content border border-base-300 transition hover:text-primary"
            >
              <FilterOutlined />
              Filter
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-16 left-2 right-2 w-[calc(100%-1rem)] h-[calc(102vh-5rem)] overflow-auto bg-base-100 rounded-lg shadow-xl p-4 z-[40] space-y-4 animate-slide-down">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="absolute right-5 rounded-sm p-2 text-base-content transition hover:text-error"
              >
                <CloseCircleOutlined />
              </button>

              <h2 className="text-lg font-medium mb-4 text-base-content">
                Filter by Category
              </h2>

              <div className="space-y-2 text-sm text-base-content">
                {displayedCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={cat}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="checkbox checkbox-xs checkbox-primary"
                    />
                    <span className="capitalize">{cat.replace("-", " ")}</span>
                  </label>
                ))}

                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-primary text-sm font-medium mt-2 hover:underline cursor-pointer"
                >
                  {showAllCategories ? "Show less" : "See all"}
                </button>

                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-error text-sm font-medium hover:underline cursor-pointer ml-3"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mt-6 border-t border-base-300 pt-4">
                <h2 className="text-sm font-medium text-base-content mb-4">
                  Price range
                </h2>

                <div className="relative mb-4 flex flex-col">
                  <label className="text-sm mb-1 text-base-content">Min</label>
                  <input
                    type="range"
                    min={0.79}
                    max={14000}
                    value={minInput}
                    onChange={(e) => setMinInput(Number(e.target.value))}
                    className="range range-primary h-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 mb-2"
                  />
                  <label className="text-sm mb-1 text-base-content">Max</label>
                  <input
                    type="range"
                    min={0.79}
                    max={14000}
                    value={maxInput}
                    onChange={(e) => setMaxInput(Number(e.target.value))}
                    className="range range-primary h-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4"
                  />
                </div>

                <div className="flex justify-start gap-5 mb-3 ">
                  <div className="flex flex-col">
                    <label className="text-sm mb-1 text-base-content">
                      Min
                    </label>
                    <input
                      type="number"
                      value={minInput}
                      onChange={(e) => setMinInput(Number(e.target.value))}
                      className="input input-sm input-bordered w-24"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm mb-1 text-base-content">
                      Max
                    </label>
                    <input
                      type="number"
                      value={maxInput}
                      onChange={(e) => setMaxInput(Number(e.target.value))}
                      className="input input-sm input-bordered w-24"
                    />
                  </div>
                </div>

                <button
                  onClick={applyPriceFilter}
                  className="btn btn-sm btn-outline btn-primary w-full"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </>
      </PageWrapper>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-base-100">
        <NavBar />
        {renderFilterHamburger()}
        <div className="flex">
          {renderFilterSection()}
          <section className="flex-1">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <header>
                <h2 className="text-xl font-bold text-base-content sm:text-3xl">
                  Product Collection
                </h2>
                <p className="mt-4 max-w-md text-base-content/70">
                  Explore our collection of curated products. Filter by category
                  and sort by price or rating.
                </p>
              </header>

              <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-pulse text-lg font-medium text-primary px-6 py-3 rounded-xl text-center">
                  Loading products...
                  <div className="flex items-center justify-center mt-3">
                    <img
                      src="/Animation - 1751348437533.gif"
                      alt="Loading..."
                      className="w-20 h-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-base-200">
      <NavBar />
      {renderFilterHamburger()}
      <div className="flex">
        {renderFilterSection()}
        <section className="flex-1">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <header>
              <h2 className="text-xl font-bold text-base-content sm:text-3xl">
                Product Collection
              </h2>
              <p className="mt-4 max-w-md text-base-content/70">
                Explore our collection of curated products. Filter by category
                and sort by price or rating.
              </p>
            </header>

            {/* Filter and Sort Controls */}
            <div className="w-full mt-8 flex flex-wrap gap-4 items-center justify-between">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="select select-bordered select-sm w-40 text-base-content bg-base-100"
              >
                <option value="">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>

              <div className="flex border border-base-300 rounded overflow-hidden">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 border-r border-base-300 ${
                    view === "grid" ? "bg-base-300" : "bg-base-100"
                  } text-base-content`}
                >
                  <AppstoreOutlined />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 ${
                    view === "list" ? "bg-base-300" : "bg-base-100"
                  } text-base-content`}
                >
                  <BarsOutlined />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 && !isFetchingNextPage ? (
              <div className="text-center mt-12 text-base-content/60">
                No products found.
              </div>
            ) : view === "grid" ? (
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className="group block overflow-hidden rounded-md bg-base-100 shadow cursor-pointer hover:shadow-md transition"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-[250px] w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                    <div className="relative p-3 border-t border-base-300">
                      <div className="flex items-center gap-2 mt-1">
                        <h2 className="text-sm font-semibold text-base-content">
                          $
                          {(
                            product.price *
                            (1 - product.discountPercentage / 100)
                          ).toFixed(2)}
                        </h2>
                        <p className="text-sm line-through text-base-content/50">
                          ${product.price}
                        </p>
                      </div>
                      <div className="text-sm text-yellow-500 flex items-center gap-1 mt-2 mb-2 ">
                        {Array.from({ length: 5 }, (_, index) =>
                          index < Math.round(product.rating) ? (
                            <StarFilled
                              key={index}
                              className="text-yellow-500 text-[16px] "
                            />
                          ) : (
                            <StarOutlined
                              key={index}
                              className="text-yellow-500 text-[16px] "
                            />
                          )
                        )}
                        <span className="text-base-content/60 ml-1">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                      <p className="text-sm text-base-content/80 truncate">
                        {product.title}
                      </p>
                    </div>
                  </li>
                ))}
                {isFetchingNextPage &&
                  [...Array(3)].map((_, i) => (
                    <li
                      key={`skeleton-${i}`}
                      className="group block overflow-hidden rounded-md bg-base-100 shadow cursor-pointer hover:shadow-md transition"
                    >
                      <img
                        src="/Animation - 1750684274271.gif"
                        alt="Loading..."
                        className="h-[150px] w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                      <div className="relative p-3 border-t border-base-300">
                        <Box sx={{ width: "100%" }}>
                          <Skeleton height={24} />
                          <Skeleton height={20} animation="wave" />
                          <Skeleton height={20} animation="wave" width="80%" />
                          <Skeleton height={20} animation={false} width="60%" />
                        </Box>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <ul className="w-full mt-8 grid gap-6 sm:grid-cols-1">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className="group flex items-start gap-4 bg-base-100 border border-base-300 p-3 rounded-md shadow hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-24 w-24 object-contain rounded-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-base-content mb-1">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-base-content">
                          $
                          {(
                            product.price *
                            (1 - product.discountPercentage / 100)
                          ).toFixed(2)}
                        </span>
                        <span className="text-sm line-through text-base-content/50">
                          ${product.price}
                        </span>
                        <span className="text-sm text-success">
                          • {product.discountPercentage}% off
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                        {Array.from({ length: 5 }, (_, index) =>
                          index < Math.round(product.rating) ? (
                            <StarFilled
                              key={index}
                              className="text-yellow-500 text-[16px]"
                            />
                          ) : (
                            <StarOutlined
                              key={index}
                              className="text-yellow-500 text-[16px]"
                            />
                          )
                        )}
                        <span className="text-base-content/60 ml-1">
                          {product.rating.toFixed(1)} • {product.stock} orders
                        </span>
                        <span className="text-success ml-2">
                          • Free Shipping
                        </span>
                      </div>
                      <p className="w-[80%] text-sm text-base-content mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <span className="text-primary text-sm font-medium mt-1 inline-block hover:underline">
                        View details
                      </span>
                    </div>
                  </li>
                ))}
                {isFetchingNextPage &&
                  [...Array(3)].map((_, i) => (
                    <li
                      key={`skeleton-${i}`}
                      className="group flex items-start gap-4 bg-base-100 border border-base-300 p-3 rounded-md shadow hover:shadow-md transition cursor-pointer"
                    >
                      <img
                        src="/Animation - 1750684274271.gif"
                        alt="Loading..."
                        className="h-24 w-24 object-contain rounded-sm"
                      />
                      <div className="flex-1">
                        <Box sx={{ width: "100%" }}>
                          <Skeleton height={24} />
                          <Skeleton height={20} animation="wave" />
                          <Skeleton height={20} animation="wave" width="80%" />
                          <Skeleton height={20} animation={false} width="60%" />
                        </Box>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
            {!hasNextPage && filteredProducts.length > 0 && (
              <div className="text-center mt-6 text-base-content/60">
                No more products to load.
              </div>
            )}
          </div>

          {showTopBtn && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-focus transition cursor-pointer"
              title="Back to Top"
            >
              <ArrowUpOutlined />
            </button>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
